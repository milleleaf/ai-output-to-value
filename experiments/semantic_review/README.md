# Laya semantic-review experiment

This directory tests one narrow proposition:

> Can a small local decision model help a reviewer detect claim/evidence mismatch
> cheaply enough to improve the review workflow?

It is **not** part of the authoritative Claim Gate. It does not change
`claim.json`, `gateChecks`, Claim Gate `PASS/BLOCKED/INSUFFICIENT_EVIDENCE`,
publication claim status, `independent_review_status`, or a review disposition.

## Why Laya first

Laya is open source, has downloadable weights, and exposes typed decision
questions without text generation. That makes it practical to inspect as a
local semantic component.

The first experiment deliberately uses the general English checkpoint
`convaiinnovations/laya`, not `laya-typed-decisions`. The specialised
checkpoint was trained for four benchmark workflows that are not this project's
publication-evidence review task. Upstream also documents that the base
checkpoints are weak zero-shot on that benchmark, so this experiment treats
Laya as a baseline to measure rather than assuming it is already suitable.

Upstream:

- https://github.com/NandhaKishorM/laya
- https://huggingface.co/convaiinnovations/laya

## Install

Keep the model dependency out of the normal project environment:

```bash
python -m venv .venv-laya
. .venv-laya/bin/activate
python -m pip install -r experiments/semantic_review/requirements.txt
```

The experiment currently pins `laya==0.3.3`.

## Run the synthetic example

The first run may download the model from Hugging Face:

```bash
python experiments/semantic_review/laya_review.py \
  experiments/semantic_review/example.request.json
```

After the model is cached, prevent any network model fetch:

```bash
python experiments/semantic_review/laya_review.py \
  experiments/semantic_review/example.request.json \
  --local-files-only
```

On Apple silicon, `--device mps` can be requested explicitly. CPU is also
supported by Laya.

To pin a remote model revision for a reproducible run:

```bash
python experiments/semantic_review/laya_review.py \
  experiments/semantic_review/example.request.json \
  --revision <hugging-face-commit-sha> \
  --output review.json
```

The runner resolves the Hugging Face snapshot before loading Laya and records
the resolved revision when the cache path exposes it.

## Request format

```json
{
  "reviewId": "stable-review-id",
  "claim": {
    "id": "optional-claim-id",
    "revision": "commit/tag/hash",
    "text": "The exact claim being reviewed."
  },
  "evidence": [
    {
      "sourceId": "registered-source-id",
      "sourceVersion": "version actually inspected",
      "locator": "page/section/table/figure",
      "excerpt": "The exact source material supplied to the model."
    }
  ]
}
```

The evidence excerpt is required because a registry paraphrase is not a direct
inspection of the source.

## Versioned questions

Question set `0.1` uses only `choice` primitives so one run does not mix
Laya's different confidence definitions across `choice`, `score`, and
`noul`.

It asks separately about:

1. support relationship — direct, qualified, contradicted, not established, or
   unclear;
2. scope alignment — aligned, claim broader, claim narrower, or unclear;
3. qualification preservation — preserved, omitted/weakened, none visible, or
   unclear.

The labels are advisory findings. They are not Claim Gate states.

## Truncation policy

Evidence review should not silently become review of a truncated excerpt.

The English checkpoint defaults to a 512-token sequence with a separate
question/options head budget. The runner estimates the remaining state budget
from the loaded model config and exits with:

```text
runStatus: NOT_RUN
reason: TRUNCATION_RISK
```

when the supplied state is likely to exceed that budget.

`--allow-truncation` exists only for deliberate experiments and is recorded in
the output. It should not be used for an evidence disposition.

## Output and privacy

A successful run emits an advisory JSON record containing:

- provider and Laya package version;
- requested model and resolved model revision when available;
- device and model token budgets;
- input-coverage and truncation information;
- Laya's raw choice, probability distribution, and confidence for each question;
- source ID, source version, locator, excerpt length, and excerpt SHA-256.

The persisted record intentionally does **not** copy the claim text or evidence
excerpt. Their hashes bind the advisory result to the reviewed material without
creating another evidence copy.

## What would count as useful

Do not judge this experiment by one plausible example.

Build a held-out set containing at least:

- directly supported claims;
- planned work worded as if completed;
- omitted qualifications;
- scope/generalisation changes;
- contradictory evidence;
- insufficient evidence;
- changed wording with the same meaning;
- long inputs that trigger the truncation boundary.

Compare Laya with a simple rules baseline, the existing review process, and a
strong general model. The important measures are missed overclaims, unnecessary
warnings, review effort, and incorrect automatic actions. There are currently
**no automatic actions** in this experiment.

Only after that evaluation should we consider fine-tuning Laya or connecting an
advisory semantic review to another project surface.
