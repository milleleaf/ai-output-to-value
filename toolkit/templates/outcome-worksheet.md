# Outcome worksheet

Use this when the target decision is **Did the result change?** and the required claim is **05 Outcome**.

This is a fillable decision instrument, not a scorecard and not a gate generator. A completed worksheet can supply evidence to a Claim Gate record, but it does **not** mark any gate check PASS automatically.

> **Outcome = an evidenced change in a defined result for a defined workflow or population, compared with an explicit baseline or alternative, with material confounds and adverse effects named.**

## 1. Decision boundary

Fill this before interpreting the result where practical.

| Required field | Entry |
| --- | --- |
| Decision / intervention being assessed |  |
| Decision this evidence will inform |  |
| Workflow / population in scope |  |
| Important exclusions |  |
| Outcome measure |  |
| Unit and direction of improvement |  |
| Pre-agreed threshold or decision rule, if any |  |

## 2. Baseline and comparison

Keep the measurement definition and scope comparable. If the definition changed, record that explicitly rather than silently comparing unlike quantities.

| Required field | Baseline | After / comparison | Evidence / source |
| --- | --- | --- | --- |
| Period or cohort |  |  |  |
| Population / sample size |  |  |  |
| Outcome value |  |  |  |
| **Elapsed time** — when relevant |  |  |  |
| **Labour hours** — when relevant |  |  |  |

| What we predicted before the trial | What we measured |
| --- | --- |
|  |  |

**Consistent definition check:** yes / no / qualified

**If qualified or no, what changed?**

Elapsed time and labour hours are separate quantities. A process can become faster for the customer while consuming the same or more staff time, or reduce staff effort without shortening end-to-end elapsed time. Do not infer one from the other.

Record what was predicted before the trial beside what was measured. The prediction is not the outcome. METR's early-2025 trial, cited in Start Here, is the reminder: the developers expected a speed-up, and measured completion time was longer. Write both down. Use only the measurement as the outcome value.

## 3. Confounds, adverse effects, and attribution

| Required field | Entry |
| --- | --- |
| Material confounders or concurrent changes |  |
| Adverse effects / quality regressions |  |
| Distributional effects or groups that may be worse off |  |
| Attribution strength / qualification |  |
| Evidence source(s) |  |
| Result that would reverse or materially weaken the conclusion |  |

Attribution can be qualified. State what the evidence supports and what it does not. A before/after comparison may support a useful operational decision without proving that the intervention was the sole cause.

## 4. Outcome conclusion

**Observed change:**

**Conclusion for this decision:** changed / did not change / inconclusive / mixed

**Why:**

**What remains uncertain:**

**Next evidence, if needed:**

**Stop / reversal rule:**

A positive Outcome does not by itself establish **06 Value**. Cost, labour movement, risk, alternatives, opportunity cost, and option value belong in the separate Value cost ledger (`toolkit/value-cost-ledger.md`, also published as `/templates/value-cost-ledger.md`).

## Worked numeric example — Outcome without Value

**Decision / intervention:** decide whether AI-assisted first-pass pull-request triage changed review responsiveness for one internal repository.

**Scope:** ordinary pull requests to the same repository; emergency changes excluded.

| Field | Baseline | After / comparison |
| --- | ---: | ---: |
| Period | Apr–May 2026 | Jul–Aug 2026 |
| Pull requests | 240 | 258 |
| Median elapsed time to first substantive review | 12.0 h | 8.5 h |
| Reviewer labour per PR | 0.42 h | 0.45 h |
| PRs requiring a second corrective review | 13% | 14% |

**What we predicted before the trial:** median elapsed time to first substantive review would fall to 6.0 h.

**What we measured:** 8.5 h. The forecast is not the outcome.

**Consistent definition check:** yes — the same repository, review-state definition, and exclusion rule were used.

**Material confounds:** reviewer staffing was unchanged, but the after period contained a slightly higher share of small dependency-update PRs.

**Adverse effects / quality regressions:** corrective-review rate rose from 13% to 14%; the difference is small but should be watched rather than hidden.

**Attribution qualification:** the comparison supports a qualified claim that review responsiveness improved during the intervention period. It does not establish that AI caused the entire change.

**Evidence source:** repository event timestamps, review logs, and sampled reviewer-time records.

**Result that would reverse the conclusion:** if size-normalised analysis raises after-period median time to at least 10.8 h, or corrective-review rate exceeds 18%, treat the improvement claim as materially weakened.

**Outcome conclusion:** elapsed review time improved by about **29%** (12.0 h → 8.5 h), so the defined Outcome changed. Reviewer labour did **not** fall; it rose from 0.42 h to 0.45 h per PR. Tool cost, review effort, downstream rework, and alternatives have not yet been valued. Therefore this example supports an **Outcome** claim only and does **not** automatically establish **Value**.
