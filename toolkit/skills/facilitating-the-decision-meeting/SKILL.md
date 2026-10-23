---
name: facilitating-the-decision-meeting
description: Walk the eight meeting questions and fill the claim-card fields in prose. Use when a person asks for help in a decision meeting, a review, or a request to capture what was demonstrated and what evidence comes next. Stop when the decision and the next evidence are named. Do not write claim.json, call a gate, or judge production readiness or ROI unless the user asks for a structured handoff.
---

# Facilitating the decision meeting

Walk the eight questions in order. Write the answers as prose on the claim card. This skill records a meeting. It does not evaluate a gate and it does not score a project.

## Eight questions

1. **What exactly have we demonstrated?**
2. **What did the AI know, and what did it infer?**
3. **What remains before the intended use?**
4. **What work disappeared or moved, and where does the bottleneck go next?**
5. **Which actor or combination performs this task or decision best?**
6. **Who decides, who is accountable, and who verifies, runs and supports it?**
7. **Which business outcome are we trying to change?**
8. **What evidence would justify the next decision, and when should we stop?**

Use this wording. Detail that would lengthen a question belongs in the answer, not in a rewritten question.

## Prose to leave behind

Write these fields in prose. One decision per record. If the meeting is making several decisions, write several records.

- **Decision sought**
- **Intended use**
- **Subject / scope** — artefact or system version, users, environment, workflow boundary, time period
- **Required claim** — Access, Output, Deliverable, Operating capability, Outcome, or Value, whichever is the weakest claim sufficient for this decision
- **What has been demonstrated**
- **What was supplied, and what was inferred**
- **What remains before the intended use**
- **Workflow boundary** — what disappeared, what moved, and the next bottleneck
- **Who decides, who is accountable, and who verifies, runs and supports it**
- **Outcome being changed**, including learning when that is the purpose
- **Next evidence**
- **Stop rule** — what is restricted or stopped, and when

## When to stop

When the decision sought and the next evidence are both named, stop.

Do not create, fetch, or fill `claim.json` unless the user asks for a structured handoff. Do not open the schema, the Claim Gate, or MCP in order to finish the meeting note.

Do not assign one status to the project. Do not average claims. Do not write "3 of 6" or a ladder such as "Output: strong; Deliverable: almost." Status words, if the meeting already has a gate result, are only `PASS`, `BLOCKED`, or `INSUFFICIENT EVIDENCE`, and each word belongs to one decision row.
