# SPDX-License-Identifier: Apache-2.0
"""Pure helpers for the experimental semantic evidence review.

This module intentionally has no model dependency. Providers may answer the
versioned question catalogue, but their answers remain advisory and cannot
change Claim Gate or publication-review state.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

EXPERIMENT_SCHEMA_VERSION = "0.1"
QUESTION_SET_VERSION = "0.1"

QUESTIONS: dict[str, dict[str, Any]] = {
    "support_relationship": {
        "type": "choice",
        "instructions": (
            "Based only on the supplied evidence, how does it relate to the claim? "
            "Do not infer facts that are not present in the supplied evidence."
        ),
        "criteria": {
            "directly_supported": (
                "The supplied evidence directly establishes the claim within the "
                "same relevant scope and conditions."
            ),
            "qualified_support": (
                "The supplied evidence supports the core claim only if a material "
                "qualification or condition remains visible."
            ),
            "contradicted": (
                "The supplied evidence materially conflicts with the claim."
            ),
            "not_established": (
                "The supplied evidence does not establish the claim."
            ),
            "unclear": (
                "The relationship cannot be determined from the supplied evidence."
            ),
        },
    },
    "scope_alignment": {
        "type": "choice",
        "instructions": (
            "Compare the scope of the claim with the scope visible in the supplied "
            "evidence."
        ),
        "criteria": {
            "aligned": "The relevant population, task, setting, measure, and conditions are aligned.",
            "claim_broader": "The claim generalises beyond the scope visible in the evidence.",
            "claim_narrower": "The claim is materially narrower than the scope visible in the evidence.",
            "unclear": "The supplied material is insufficient to compare scope reliably.",
        },
    },
    "qualification_status": {
        "type": "choice",
        "instructions": (
            "Does the claim preserve material qualifications or limitations visible "
            "in the supplied evidence?"
        ),
        "criteria": {
            "preserved": "Material qualifications visible in the evidence are preserved in the claim.",
            "omitted_or_weakened": "A material qualification is omitted or weakened in the claim.",
            "none_visible": "No material qualification is visible in the supplied evidence.",
            "unclear": "The supplied material is insufficient to judge qualification preservation.",
        },
    },
}


def load_request(path: Path) -> dict[str, Any]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise ValueError("review request must be a JSON object")
    validate_request(payload)
    return payload


def validate_request(payload: dict[str, Any]) -> None:
    review_id = payload.get("reviewId")
    if not isinstance(review_id, str) or not review_id.strip():
        raise ValueError("reviewId must be a non-empty string")

    claim = payload.get("claim")
    if not isinstance(claim, dict):
        raise ValueError("claim must be an object")
    if not isinstance(claim.get("text"), str) or not claim["text"].strip():
        raise ValueError("claim.text must be a non-empty string")

    evidence = payload.get("evidence")
    if not isinstance(evidence, list) or not evidence:
        raise ValueError("evidence must be a non-empty array")
    for index, item in enumerate(evidence):
        if not isinstance(item, dict):
            raise ValueError(f"evidence[{index}] must be an object")
        excerpt = item.get("excerpt")
        if not isinstance(excerpt, str) or not excerpt.strip():
            raise ValueError(f"evidence[{index}].excerpt must be a non-empty string")
        for field in ("sourceId", "sourceVersion", "locator"):
            value = item.get(field)
            if not isinstance(value, str) or not value.strip():
                raise ValueError(f"evidence[{index}].{field} must be a non-empty string")


def build_state(payload: dict[str, Any]) -> str:
    claim = payload["claim"]
    lines = [f"CLAIM: {claim['text']}", "", "SUPPLIED EVIDENCE:"]
    for index, item in enumerate(payload["evidence"], start=1):
        lines.extend(
            [
                (
                    f"[{index}] source={item['sourceId']} "
                    f"version={item['sourceVersion']} locator={item['locator']}"
                ),
                item["excerpt"],
                "",
            ]
        )
    return "\n".join(lines).rstrip()


def _sha256_text(value: str) -> str:
    return "sha256:" + hashlib.sha256(value.encode("utf-8")).hexdigest()


def evidence_descriptors(payload: dict[str, Any]) -> list[dict[str, Any]]:
    return [
        {
            "sourceId": item["sourceId"],
            "sourceVersion": item["sourceVersion"],
            "locator": item["locator"],
            "excerptSha256": _sha256_text(item["excerpt"]),
            "excerptCharacters": len(item["excerpt"]),
        }
        for item in payload["evidence"]
    ]


def advisory_record(
    *,
    payload: dict[str, Any],
    provider: str,
    model: dict[str, Any],
    answers: dict[str, Any],
    input_coverage: dict[str, Any],
) -> dict[str, Any]:
    claim = payload["claim"]
    return {
        "schemaVersion": EXPERIMENT_SCHEMA_VERSION,
        "kind": "semantic-evidence-review",
        "advisoryOnly": True,
        "reviewId": payload["reviewId"],
        "questionSetVersion": QUESTION_SET_VERSION,
        "provider": provider,
        "model": model,
        "claim": {
            "id": claim.get("id"),
            "revision": claim.get("revision"),
            "textSha256": _sha256_text(claim["text"]),
        },
        "evidence": evidence_descriptors(payload),
        "inputCoverage": input_coverage,
        "answers": answers,
        "authorityBoundary": (
            "This experiment does not change claim.json gateChecks, Claim Gate "
            "status, data/claims*.yml status, independent_review_status, or review disposition."
        ),
    }
