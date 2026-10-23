#!/usr/bin/env python3
# SPDX-License-Identifier: Apache-2.0
"""Run the experimental semantic evidence review with a local Laya model."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
    from experiments.semantic_review.core import (  # type: ignore
        QUESTIONS,
        advisory_record,
        build_state,
        load_request,
    )
else:
    from .core import QUESTIONS, advisory_record, build_state, load_request

DEFAULT_MODEL = "convaiinnovations/laya"


def _write(payload: dict[str, Any], output: Path | None) -> None:
    rendered = json.dumps(payload, indent=2, ensure_ascii=False) + "\n"
    if output is None:
        sys.stdout.write(rendered)
    else:
        output.write_text(rendered, encoding="utf-8")


def _snapshot_revision(model_dir: Path, requested_revision: str | None) -> str | None:
    # huggingface_hub cache paths conventionally end in snapshots/<commit-sha>.
    if model_dir.parent.name == "snapshots" and model_dir.name:
        return model_dir.name
    return requested_revision


def _resolve_model(
    model: str,
    revision: str | None,
    local_files_only: bool,
) -> tuple[Path, str | None, str]:
    candidate = Path(model).expanduser()
    if candidate.exists():
        return candidate.resolve(), revision, "local-path"

    try:
        from huggingface_hub import snapshot_download
    except ImportError as exc:
        raise RuntimeError(
            "huggingface_hub is unavailable; install "
            "experiments/semantic_review/requirements.txt"
        ) from exc

    try:
        model_dir = Path(
            snapshot_download(
                repo_id=model,
                revision=revision,
                local_files_only=local_files_only,
            )
        )
    except Exception as exc:
        mode = "local cache" if local_files_only else "Hugging Face"
        raise RuntimeError(
            f"could not resolve model {model!r} from {mode}: {exc}"
        ) from exc
    return model_dir, _snapshot_revision(model_dir, revision), "huggingface-snapshot"


def _require_laya():
    try:
        import laya
    except ImportError as exc:
        raise RuntimeError(
            "Laya is unavailable; install "
            "experiments/semantic_review/requirements.txt"
        ) from exc
    return laya


def _load_laya(laya, model_dir: Path, device: str | None):
    return laya.load(str(model_dir), device=device)


def _coverage(agent: Any, state: str, evidence_count: int) -> dict[str, Any]:
    state_tokens = len(agent.tok.encode(state, add_special_tokens=False))
    max_len = int(agent.cfg.get("max_len", 512))
    head_max_len = int(agent.cfg.get("head_max_len", 192))
    estimated_state_budget = max(0, max_len - head_max_len)
    return {
        "evidenceItemsSupplied": evidence_count,
        "stateCharacters": len(state),
        "stateTokensBeforeQuestionPacking": state_tokens,
        "modelMaxTokens": max_len,
        "questionHeadTokenBudget": head_max_len,
        "estimatedStateTokenBudget": estimated_state_budget,
        "truncationRisk": state_tokens > estimated_state_budget,
        "note": (
            "Laya packs each question with the state. The estimate is deliberately "
            "conservative; the experiment refuses likely truncation unless explicitly overridden."
        ),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("request", type=Path, help="Semantic-review request JSON")
    parser.add_argument("--output", type=Path, help="Write advisory JSON to this path")
    parser.add_argument("--model", default=DEFAULT_MODEL, help="Hugging Face model id or local model directory")
    parser.add_argument("--revision", help="Optional Hugging Face revision/tag/commit to resolve")
    parser.add_argument("--device", choices=("cpu", "cuda", "mps"), help="Explicit Laya device")
    parser.add_argument(
        "--local-files-only",
        action="store_true",
        help="Do not download model files; require an already-cached/local checkpoint",
    )
    parser.add_argument(
        "--allow-truncation",
        action="store_true",
        help="Run despite likely state truncation (not recommended for evidence review)",
    )
    args = parser.parse_args()

    try:
        request = load_request(args.request)
        state = build_state(request)
        laya = _require_laya()
        model_dir, resolved_revision, model_source = _resolve_model(
            args.model,
            args.revision,
            args.local_files_only,
        )
        agent = _load_laya(laya, model_dir, args.device)
        coverage = _coverage(agent, state, len(request["evidence"]))

        model_meta = {
            "package": "laya",
            "packageVersion": getattr(laya, "__version__", "unknown"),
            "requestedModel": args.model,
            "requestedRevision": args.revision,
            "resolvedRevision": resolved_revision,
            "modelSource": model_source,
            "device": str(agent.device),
            "maxLen": int(agent.cfg.get("max_len", 512)),
            "headMaxLen": int(agent.cfg.get("head_max_len", 192)),
        }

        if coverage["truncationRisk"] and not args.allow_truncation:
            _write(
                {
                    "schemaVersion": "0.1",
                    "kind": "semantic-evidence-review",
                    "runStatus": "NOT_RUN",
                    "reason": "TRUNCATION_RISK",
                    "advisoryOnly": True,
                    "reviewId": request["reviewId"],
                    "model": model_meta,
                    "inputCoverage": coverage,
                    "authorityBoundary": (
                        "No gate or publication-review state was changed."
                    ),
                },
                args.output,
            )
            return 3

        raw = agent.predict(state, QUESTIONS)
        answers = raw.get("answers", {})
        record = advisory_record(
            payload=request,
            provider="laya",
            model=model_meta,
            answers=answers,
            input_coverage={
                **coverage,
                "providerReportedInputTokens": raw.get("usage", {}).get("input_tokens"),
                "truncationOverride": bool(args.allow_truncation and coverage["truncationRisk"]),
            },
        )
        _write(record, args.output)
        return 0
    except (OSError, ValueError, RuntimeError, json.JSONDecodeError) as exc:
        sys.stderr.write(f"semantic review error: {exc}\n")
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
