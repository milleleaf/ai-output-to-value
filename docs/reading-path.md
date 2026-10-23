# Reading path

The repository contains a focused business guide plus broader analysis. A first-time reader should not have to read everything in order.

## Path 1 — first-time business reader

Read these in order:

1. [`START-HERE.md`](../START-HERE.md) — the core argument in about five minutes.
2. [`content/frame-vs-finished-work.md`](../content/frame-vs-finished-work.md) — why a strong concept, scaffold, or prototype can be valuable without proving the whole job is finished.
3. [`content/tool-access-vs-client-readiness.md`](../content/tool-access-vs-client-readiness.md) — tool capability, job substance, delivery capability, and the substance gap.
4. [`content/workflow-not-task.md`](../content/workflow-not-task.md) — why the end-to-end workflow is the unit that connects local product/task acceleration to Deliverable, Operating capability, Outcome and Value; includes the September 2026 HBR workflow-redesign source.
5. [`content/worked-cases.md`](../content/worked-cases.md) — fictional examples showing how the framework changes an actual decision, including software measurement and option value.
6. [`content/claim-card.md`](../content/claim-card.md) — a copyable decision card: claim threshold, evidence character, actors, measurement, next evidence and stop rule.

If those pages answer the reader's question, they can stop there.

For a meeting, use the printable [`content/meeting-brief.md`](../content/meeting-brief.md).

The core route is deliberately **decision-first**. The six claims are not a maturity score; the useful question is which claim is sufficient for the next decision. **Workflow is not a seventh claim:** it is the end-to-end process boundary across which the required claim must hold.

## Path 2 — working analysis by decision

The pages in this section are **working analysis / research preview** rather than part of the reviewed release guide. Each should help produce a different decision artefact instead of repeating the same warning.

| Decision | Read | Practical output |
| --- | --- | --- |
| **Where exactly does code move from Output to Deliverable and Operating capability?** | [`software-architecture-worked-cases.md`](../content/software-architecture-worked-cases.md) | **Claim-boundary record** — what exists, which acceptance evidence changes the claim, and what repeated operation adds. |
| **Which software/architecture failure mode could invalidate the next claim?** | [`software-failure-mode-catalogue.md`](../content/software-failure-mode-catalogue.md) | **Targeted verification plan** — failure mode, claim at risk, evidence pattern, fallback/recovery expectation. |
| **Is this idea worth investigating?** | [`product-ideas-vs-product-discovery.md`](../content/product-ideas-vs-product-discovery.md) | **Opportunity hypothesis** — user, problem, evidence, current workaround, desired outcome, unknowns, cheapest next test. |
| **Why should this AI capability be part of the product?** | [`model-capability-vs-product-strategy.md`](../content/model-capability-vs-product-strategy.md) | **Technology-choice comparison** — customer problem, required capability, evidence, alternatives, constraints, delivery model and economics. |
| **Which technical design makes the service viable?** | [`architecture-economics-and-product-decisions.md`](../content/architecture-economics-and-product-decisions.md) | **Architecture trade-off record** — acceptance rule, attempts, routing/escalation, all-in cost per acceptable outcome, latency and failure consequence. |
| **Who or what should analyse, decide, communicate or act?** | [`ai-business-capability-and-judgement.md`](../content/ai-business-capability-and-judgement.md) | **Authority-and-assurance map** — actor, evaluative role, authority boundary, assurance mechanism, escalation and recourse. |

These decisions are related, but they are not interchangeable:

**claim boundary → failure mode → opportunity evidence → technology fit → delivery architecture → actor/authority/assurance design**

A team may revisit them iteratively rather than follow them as a waterfall.

### What happens to technical capability when AI gets much better?

- [`content/ai-does-not-eliminate-technical-capability.md`](../content/ai-does-not-eliminate-technical-capability.md)
- [`content/source-code-open-source-and-ai.md`](../content/source-code-open-source-and-ai.md)
- [`content/assess-every-layer-of-the-company.md`](../content/assess-every-layer-of-the-company.md)

### How should a company think about attribution, humans, agents, authority, and instruments?

- [`content/human-ai-team-and-attribution.md`](../content/human-ai-team-and-attribution.md) — why human + AI can be treated as an organisational system; includes the historical path from business computing and spreadsheets to CAD and modern AI, plus the distinction between public attribution, internal provenance, and accountability.
- [`content/company-actors-vs-instruments.md`](../content/company-actors-vs-instruments.md)
- [`content/non-human-actors-and-accountability.md`](../content/non-human-actors-and-accountability.md)

### Does physical or human presence automatically create more value?

- [`content/representation-is-a-channel.md`](../content/representation-is-a-channel.md)
- [`content/ecommerce-and-physical-retail.md`](../content/ecommerce-and-physical-retail.md)

These supporting analyses and analogies should not dominate the public landing experience.

## Path 3 — provenance, evidence and review

For contributors, reviewers, researchers, and readers who want to inspect who stands behind the project and how the evidence system works:

1. [`content/provenance.md`](../content/provenance.md) — maintainer, organisational home, confidentiality boundary, evidence character and actor-neutral review principle.
2. [`docs/evidence-policy.md`](evidence-policy.md) — evidence classes, canonical registry rules, review status, preview/release gates, and corrections.
3. [`docs/public-case-corpus.md`](public-case-corpus.md) — published results coded onto the claim each source can support. A reader session remains one observation, recorded outside this corpus.
4. [`data/claims.yml`](../data/claims.yml) — the base claim registry; additional canonical topic-specific claim registries live beside it under `data/claims*.yml`.
5. [`data/sources.yml`](../data/sources.yml) — the base source registry; additional canonical topic-specific source registries live beside it under `data/sources*.yml` and other `data/*.yml` files containing a top-level `sources:` list.
6. [`content/corrections.md`](../content/corrections.md) — correction and independent-review route.

The publication build combines those canonical registries into one reader-facing evidence page with stable claim links and article backlinks.

## Editorial rule

The home page and `START-HERE.md` should remain narrow:

> **We bought or gained access to AI. What have we actually achieved, what remains, and what evidence connects the output to business value?**

Broader material belongs in working/research reading unless it is necessary to answer that question directly.
