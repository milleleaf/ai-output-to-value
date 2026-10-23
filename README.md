# AI Output to Value

**An open, evidence-led guide and decision method for AI-assisted work, client readiness, accountability, and business value.**

> **Access is not capability. Output is not completion. Apparent completeness is not proof of substance. Activity is not business value.**

**Live working preview:** https://milleleaf.github.io/ai-output-to-value/

**Organisation:** [Milleleaf](https://github.com/milleleaf) · **Repository:** [milleleaf/ai-output-to-value](https://github.com/milleleaf/ai-output-to-value)

## Start here

For a first-time business reader or review meeting, use the human kit first:

1. **[Run the 15-minute decision discussion](START-HERE.md#run-the-15-minute-decision-discussion)** — decision → eight questions.
2. **[Open / print the Claim Card](content/claim-card.md)** or **[one-page meeting brief](content/meeting-brief.md)**.
3. **Inspect the evidence** needed for the next decision.
4. **[Use the interactive Claim Gate](https://milleleaf.github.io/ai-output-to-value/tools/claim-gate.html)** when a structured record or handoff is useful.
5. **Export/import `claim.json`** only when portability across browser, CLI, CI, MCP, WebMCP, or another tool adds value.

No schema, MCP/WebMCP, or JSON knowledge is required to begin. Filled teaching records and worked decisions remain available under **[samples](toolkit/samples/README.md)** and **[worked decisions](content/worked-cases.md)**.

For confidential organisational use, copy the **[private workbook](toolkit/private-workbook/README.md)** instead of publishing a client case. The built site also provides `downloads/ai-output-to-value-private-workbook.zip`.

For provenance, confidentiality and review responsibility, see **[Who stands behind this guide?](content/provenance.md)**.

Deeper analyses cover product discovery, model strategy, architecture and unit economics, AI business-facing capability and judgement, open-source economics, organisational capability, agents, authority, representation, and changing interaction channels. They are deliberately separated as working/research material rather than competing with the core method. See [`docs/reading-path.md`](docs/reading-path.md).

## The practical question

Generative AI can produce remarkably complete software, reports, research, designs, automations, proposals, presentations, analyses, customer interactions, and other work at very low marginal cost.

The project asks:

> **We bought or gained access to AI. What have we actually achieved, what remains, and what evidence connects the output or action to business value?**

This project uses a decision framework:

**Access → Output → Deliverable → Operating capability → Outcome → Value**

The stable machine identifier for **Operating capability** is `04-capability`.

These are six different claims, not mandatory lifecycle stages and not a maturity score.

## Decision first

The ladder is a **claim filter**. Start with the decision and require the weakest claim sufficient for that decision:

- **get access to try it?** → Access — and no more than trying it;
- **keep exploring?** → Output may be enough;
- **may someone rely on it?** → Deliverable;
- **may we sell, operate or support it repeatedly?** → Operating capability;
- **did it change the result?** → Outcome;
- **should we scale, renew or stop?** → Value.

A strong Access/Output result does not average into partial Deliverable.

> **Gate ≠ truth.** A Claim Gate `PASS` means the **supplied record** satisfies the deterministic checks for the selected decision. It is not an audit of the underlying system, measurement, people, or evidence references.

## Four distinctions that matter

### Tool capability ≠ job substance ≠ delivery capability
A capable agent may generate most of the visible artefact or perform much of a workflow. That does not automatically establish that the result reflects the actual job or that the supplier can repeatedly evaluate, operate, support, maintain, and stand behind it.

### Workflow is a boundary, not a seventh claim
Local task or product acceleration can move the bottleneck into review, integration, deployment, support, or another downstream step. Define where the workflow starts, what counts as complete, what happens on the unhappy path, and which end-to-end outcome should change.

### Judgement ≠ authority ≠ accountability
AI systems can analyse evidence, compare options, plan, recommend, communicate, persuade, and make bounded decisions. A human decision-maker is not automatically correct because they are human or senior. An AI system is not automatically correct because it is fast or capable.

> **Apply the same standard to human, AI and hybrid work: assess the complete process and its results, not the identity of the producer.**

### Reduced labour ≠ reduced elapsed time ≠ realised financial value
AI may genuinely improve all three, but a gain in one metric should not silently become a claim about another.

## Learn from samples before starting blank

The Claim Gate ships with ten fictional `claim.json` records: three original teaching cases (four records) and a cross-domain pack of six more.

- website prototype — **Explore → PASS**;
- the same website — **Operate → BLOCKED**;
- internal tool — **Rely → PASS**;
- killed idea — **Outcome → PASS** on learning/option value;
- the cross-domain pack — six records showing false claim promotions, described in [`toolkit/samples/README.md`](toolkit/samples/README.md).

The samples are under [`toolkit/samples/`](toolkit/samples/). They are teaching records, not disguised client incidents.

## Software Outcome pack

For software-delivery initiatives, [`toolkit/templates/software-outcome-pack.json`](toolkit/templates/software-outcome-pack.json) suggests a 05 Outcome measurement plan using DORA's five current software-delivery metrics:

- change lead time;
- deployment frequency;
- failed deployment recovery time;
- change fail rate;
- deployment rework rate.

When AI-assisted delivery is the intervention, the template also suggests leading indicators such as AI-touched share, review wait on AI-touched changes, and revert/rollback rate on those changes.

The template marks **no gate check PASS automatically**. It defines what to measure; it does not establish causal attribution, customer value, AI ROI, or business profitability.

## Human, AI and hybrid interfaces

Same standard does not require the same interface.

- **Human:** visible Claim Gate form.
- **AI:** native MCP `evaluate_claim_record` or compatible browser WebMCP.
- **Hybrid:** exchange the same `claim.json`; a compatible browser agent may request a local form handoff, which the mounted Claim Gate must acknowledge before WebMCP reports it as applied.

The practical IDE/terminal integration is the local MCP package under [`packages/mcp/`](packages/mcp/). Its README includes current Claude Code, Cursor and VS Code/GitHub Copilot examples. WebMCP remains progressive enhancement when the browser exposes `document.modelContext`.

For coding agents that need a claim-language guardrail before saying **done**, **production ready**, **validated/verified**, or **ROI/Value proved**, install the canonical [`applying-ai-output-to-value` agent skill](toolkit/skills/applying-ai-output-to-value/README.md). It ships with thin Cursor, Copilot and `AGENTS.md` wrappers that point back to one `SKILL.md` rather than duplicating the framework. For a meeting, [`facilitating-the-decision-meeting`](toolkit/skills/facilitating-the-decision-meeting/README.md) walks the eight questions and stops when the decision and the next evidence are named. Neither skill is published to a host registry until a repository tag contains the Access decision. Tag `v0.1.0-rc.1` does not.

## Private evidence can stay private

Rigour does not require publishing client names, contracts, production metrics, personal data or proprietary workflows. Internal evidence can remain private while the authorised decision record stays inspectable inside the organisation.

Use [`toolkit/private-workbook/`](toolkit/private-workbook/) for real work. The public project does not need access to the organisation's evidence folder.

## Mild operating kit

[`toolkit/operating-kit.md`](toolkit/operating-kit.md) points to classes of instrument that can inspect a claim: evaluation/trace, contract/e2e testing, operational evidence, DORA-capable delivery telemetry, usage inventories, and cost/value records.

For the two upper decision claims, use the fillable [Outcome worksheet](toolkit/templates/outcome-worksheet.md) and [Value cost ledger](toolkit/value-cost-ledger.md). They keep baseline/after evidence, the prediction made before the trial beside the measurement, elapsed time, labour movement, confounds, adverse effects, attribution, full cost boundaries, and option value explicit without auto-populating Claim Gate PASS states. Open decisions sit on the [decision register](toolkit/templates/decision-register.md): one row per decision, with no average.

MCP servers, skills, repository tools, documentation connectors and log access are **context pipes**. They can improve Access, Output and evidence retrieval; they do not mint Value merely because they are connected.

## Evidence model

Canonical evidence lives under `data/`. Important factual claims can be traced as:

**Claim → source/version → exact locator → relevant finding → qualification → article location → reviewer/process → independent review status → review record → disposition**

Independent review is actor-neutral. A completed review may be performed by a human, AI system, automated method, specialist toolchain, or hybrid process if it is sufficiently separate from the originating authoring step, directly checks the evidence, applies the stated criteria, and leaves an auditable record.

> **Review completed is not the same as claim accepted.**

`rejected` is a valid review disposition. A launch-critical claim can pass release approval only with an accepting disposition: `accepted`, `accepted_with_qualification`, or `revised_and_accepted`.

Evidence character is explicit where useful: public measured evidence, public documented evidence, internal evidence, illustrative material, or editorial synthesis. See [`docs/evidence-policy.md`](docs/evidence-policy.md).

## Two release tracks

The project keeps two readiness claims separate:

- **Reviewed method/publication** — terminology, release-scope content, evidence dispositions, examples, policy, licensing/reuse terms, reader/render checks, and explicit approval of a reproducible release artefact.
- **Tooling/distribution** — packaging, versioning, host/runtime compatibility, cross-surface conformance, and maintenance expectations for the CLI, GitHub Action, native MCP/npm, browser WebMCP, web build package, and agent skill/wrappers.

A published or tagged tool does **not** mean the method has completed independent review. A reviewed method release does **not** mean every package, browser integration, runner, MCP host, or agent wrapper is operationally supported.

See [`docs/tooling-distribution.md`](docs/tooling-distribution.md) for the per-surface version, intended-use, compatibility, and support boundaries. The reviewed-method acceptance bar remains [`docs/first-reviewed-release.md`](docs/first-reviewed-release.md).

## Working preview versus reviewed release

The public GitHub Pages site currently deploys the **working preview** from `main`. It includes the core guide plus deeper and advanced working material, with publication and evidence-review states kept visible.

Normal CI separately builds and interaction/link-checks a proposed release artifact. This keeps two questions distinct:

> **Does the proposed release artifact structurally and operationally work?**
>
> **Has that artifact actually been reviewed and approved?**

Each article declares a `release_scope` of `guide`, `policy`, or `working`. Working research is physically excluded from release mode.

The public acceptance bar for the first reviewed release is now explicit in **[`docs/first-reviewed-release.md`](docs/first-reviewed-release.md)**. It covers the core instrument, worked decisions, independent evidence review, rendered usability/print checks, licences, provenance/corrections, reader testing, and explicit release approval.

Until that checklist is satisfied, **Working preview stays in the header**.

## Publication controls

Normal CI runs regression tests; exercises the reusable Claim Gate Action; tests the native MCP package; type-checks the React/Base UI layer; builds the finished preview including Tailwind, WebMCP machine surfaces and pdfcn output; validates evidence/traceability; checks interaction/link integrity; and then independently builds and checks the proposed release artifact.

GitHub Pages runs the same relevant evidence, interaction, Action, MCP, UI and artifact checks before it uploads a deployment. A release-mode deployment additionally runs the release-approval checks.

## Repository structure

```text
.
├── START-HERE.md
├── README.md
├── content/                         # Core guide + decision tools + deeper analyses
├── data/                            # Canonical source / claim / article records
├── docs/                            # Evidence, reading, release and positioning policy
├── schemas/v1/                     # claim.json and decision-gate contracts
├── toolkit/
│   ├── samples/                    # Filled teaching claim records
│   ├── templates/                  # Outcome worksheet, decision register, software pack
│   ├── private-workbook/           # Confidential-use folder template
│   ├── skills/                     # Overclaim skill, meeting skill, thin wrappers
│   ├── AGENT_RULES.md
│   ├── operating-kit.md
│   └── value-cost-ledger.md        # Fillable Value decision workbook
├── packages/mcp/                   # Native stdio MCP server
├── web/                            # shadcn/Base UI + Tailwind + pdfcn
├── scripts/                        # Build / validation / publication tooling
├── tests/
└── .github/workflows/
```

## Corrections and responsibility

The initial maintainer is **Helen Kwok**. Evidence-based corrections and counterexamples are welcome. See [`content/provenance.md`](content/provenance.md), [`content/corrections.md`](content/corrections.md) and [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Current status

- **Reviewed method/publication:** public working preview / labelled pilot. The reviewed release has not yet been approved; its remaining bar is maintained in [`docs/first-reviewed-release.md`](docs/first-reviewed-release.md), rather than being implied by a green CI build.
- **Tooling/distribution:** mixed preview/source-only status. The native MCP source package is version `0.1.0`, private, and not published to npm; the GitHub Action, WebMCP surface, web build package, and agent skill are currently identified by repository revision rather than an independent support promise. See [`docs/tooling-distribution.md`](docs/tooling-distribution.md).

These statuses are deliberately independent: package publication does not establish method review, and method review does not establish support for every tool surface.

## Licence

This repository uses two licences, split by what a path contains.

**Code and machine-readable instruments: Apache-2.0** (see [`LICENSE`](LICENSE)). This covers:

- `scripts/`, `tests/` (including `tests/fixtures/`), `tools/`, `web/`, `packages/`, `.github/` and `action.yml`;
- `schemas/`, including the claim schema and the decision-gates JSON that the claim gate reads;
- the root-level site assets (`index.html`, `*.js`, `*.css`) and `requirements-dev.txt`;
- the JSON files under `toolkit/` (`claim.example.json`, `samples/`, `templates/`, `private-workbook/claim.json`).

**Guide content: CC BY 4.0** (see [`LICENSE-CONTENT`](LICENSE-CONTENT)). This covers:

- `content/`, `docs/`, `drafts/`, `research/` and `data/` (the articles, the claim and source registers);
- the prose in `README.md`, `START-HERE.md` and `CONTRIBUTING.md`;
- the Markdown files under `toolkit/` (the operating kit, agent rules, ledger, workbook and skill text).

A path that is not listed above is licensed by what it is, in this order:

1. **Code, configuration and other machine-readable files** are Apache-2.0 wherever they sit, including at the repository root: `.py`, `.mjs`, `.js`, `.ts`, `.tsx`, `.css`, `.html`, `.json`, `.yml`, `.yaml`, `.toml`, `.txt`, lockfiles and dotfiles such as `.gitignore` (so `requirements-*.txt` is Apache-2.0).
2. **Markdown prose** is CC BY 4.0 wherever it sits, except Markdown that documents or ships with a code package (`packages/`, `web/`, `.github/`, including the issue and pull request templates), which is Apache-2.0 with that package.
3. **Generated files** take the licence of what they are generated from.

The licence of the folder a file sits in is never the deciding factor on its own, because `toolkit/` and the repository root mix both kinds.

`LICENSE` holds only the Apache-2.0 text. Copying files from a CC BY path (guide content) into another project needs [`LICENSE-CONTENT`](LICENSE-CONTENT) alongside it; copying only Apache-2.0 paths needs `LICENSE` alone. Third-party sources cited in the guide keep their own terms, and components fetched at build time rather than stored here (for example the pdf components synced by `npm run pdfcn:sync`) keep the terms of their own source; the guide's licence covers only its own text.
