# Claim card — decide what evidence is enough for the next decision

The six-claim model is a **claim filter**, not a maturity score and not a checklist that every project must complete.

Use this card on paper or screen before a review meeting, pilot decision, customer commitment, merge/release decision, or scale decision. No schema, MCP/WebMCP, or JSON knowledge is required.

> **What decision are we trying to make, and what is the weakest claim that would be sufficient for that decision?**

Before selecting a claim, state the **decision**, **intended use**, and **subject/scope** being assessed. A gate result applies to that combination, not to the project as a whole.

If this is the first discussion, run the [eight meeting questions](../START-HERE.md#run-the-15-minute-decision-discussion), then capture only the evidence and next action that matter for the decision. The [interactive Claim Gate](../tools/claim-gate.html) is an optional structured instrument for teams that later want deterministic checks or a portable `claim.json` record.

## Start with the decision

| Decision sought | Minimum claim that normally matters | Gate logic |
| --- | --- | --- |
| **Get access to try it?** | **01 Access** | The tool is named, the people who would try it can use it now, and its terms and your rules allow the intended trial. |
| **Keep exploring?** | **02 Output** | Reproducible/inspectable output plus important assumptions and inferences made visible. |
| **May someone rely on this for the named use?** | **03 Deliverable** | Intended use, acceptance criteria, evidence they were met, relevant failure/fallback checks, and stated limitations. |
| **May we sell, operate, support, or staff this repeatedly?** | **04 Operating capability** | Deliverable gate plus evidence for the **named repeated use and scope**: the ownership, assurance, fallback/recovery, support/maintenance, and operating-cost controls relevant to its material failure modes. Ask **“Operating capability for what?”** |
| **Did the initiative change the result we care about?** | **05 Outcome** | Defined outcome measure, comparable baseline, after measurement, consistent definitions, and material confounds named. |
| **Should we scale, renew, expand, or stop?** | **06 Value** | Outcome evidence plus full relevant cost, risk/trade-offs, alternatives, and an explicit value decision rule. |

**An Access decision only justifies trying the tool.** Having access never licenses relying on what it produces, operating it, or claiming an outcome; each of those needs its own decision and a higher claim.

The stable machine identifier for **04 Operating capability** remains `04-capability`.

These are defaults, not laws. Consequence, regulation, contract, reversibility, and uncertainty can raise or lower the assurance needed.

## Gate status is not a score

The decision gate has three states:

- **PASS** — every check required for this target decision is evidenced as passed.
- **BLOCKED** — at least one decision-critical check explicitly failed, or the record is structurally incompatible with the selected gate.
- **INSUFFICIENT EVIDENCE** — no required check is recorded as failed, but one or more required checks or decision-record fields are missing or unknown, or the asserted claim does not match the decision.

A project with excellent **Access** and **Output** but no evidence of **Deliverable** is not "one-third complete". A failed or unknown decision-critical claim cannot be cancelled out by strength somewhere else.

### Anti-pattern: six project statuses

Do **not** summarise one project as:

- Output: strong
- Deliverable: almost
- Operating capability: not yet
- Outcome / Value: unknown

That turns the six claims back into a maturity ladder. Instead write separate decision records. For the **same website prototype**, for example:

| Decision | Intended use + subject/scope | Required claim | Result |
| --- | --- | --- | --- |
| Keep exploring | Internal UX learning on the current staging build | **Output** | **PASS** |
| Permit client reliance | Receive real enquiries through the production contact workflow | **Deliverable** | **INSUFFICIENT EVIDENCE** if delivery has not been verified |
| Operate repeatedly | Public production lead intake including monitoring, recovery and support | **Operating capability** | **BLOCKED** if a decision-critical operating requirement is known to be absent |

The project did not move between three maturity states. Three different decisions were evaluated against three different scopes.

Repository stars, forks, downloads, mentions, or user counts are evidence about adoption/reach. They do not establish Deliverable or Operating capability unless the decision itself is explicitly about adoption or reach.

## Workflow is the process boundary, not another score

A product, feature, model call, report, or engineering task can be excellent while the end-to-end workflow remains incomplete.

**Workflow is not a seventh claim.** Use it to define the boundary across which the target claim must hold.

For a relied-upon or operational decision, record:

- **start / trigger** — what initiates the workflow?
- **completion boundary** — what result counts as actually delivered rather than merely generated?
- **handoffs / downstream work** — verification, integration, approval, execution, support, or other steps after the local task;
- **moved bottleneck** — if this task becomes faster, where can the constraint move next?
- **unhappy path** — what happens with missing information, ambiguity, dependency failure, refusal, timeout, rollback, escalation, or recovery?
- **outcome metric** — what end-to-end result should improve rather than merely how much activity was produced?

This makes “the product works but the workflow is incomplete” an inspectable statement rather than a vague criticism.

See [Workflow is the unit — where AI output becomes business delivery](workflow-not-task.md).

## Management language needs operational meaning

If the proposal depends on terms such as **teamwork**, **KPI**, **productivity**, **leadership**, or **alignment**, define them before using them as evidence.

- **Teamwork:** who participates, what happens before/during/after, how decisions are made, and what follow-up turns discussion into action?
- **KPI:** exact metric, unit, numerator/denominator where relevant, data source, cadence, baseline, and guardrail?
- **Productivity:** accepted output or outcome per which input, with what quality threshold and which rework/downstream work included?
- **Leadership:** which decisions, coordination, authority, escalation, capability, or outcome improved?
- **Alignment:** aligned on what decision, constraint, priority, or measurable outcome, and how would disagreement or drift become visible?

These prompts apply symmetrically to executives, managers, specialists, technical teams, AI systems, and hybrid processes.

## Evidence character

State what kind of evidence you are using before discussing conclusions.

- **Public measured evidence** — research, statistics, or measured case evidence whose method and scope can be inspected.
- **Public documented evidence** — official guidance, standards, product documentation, policies, or other inspectable records.
- **Internal evidence** — measurements or observations available inside an organisation but not suitable for public disclosure.
- **Illustrative** — a constructed example used to teach the reasoning. It is not evidence that the scenario occurred.
- **Editorial synthesis** — an interpretation or recommendation made by this project from the available evidence.

Confidentiality does not require pretending evidence does not exist. It requires keeping the public claim within what can safely be disclosed and keeping the private record inspectable by the people authorised to see it.

## Copyable claim card

### Decision

**Decision sought:** access / explore / rely / operate / measure outcome / scale-renew-stop

**Required claim:** 01 Access / 02 Output / 03 Deliverable / 04 Operating capability / 05 Outcome / 06 Value

**Claim being asserted:**

**Intended use:**

**Subject / scope:** artefact/system version, users, environment, workflow boundary, time period

**Decision date or review point:**

### Claim

**Evidence character:** public measured / public documented / internal / illustrative / editorial synthesis

**What has actually been demonstrated:**

**What was supplied to the AI or process:**

**What had to be inferred or assumed:**

**Known limitations / out of scope:**

### Workflow boundary

**Trigger / start:**

**What counts as complete:**

**Downstream handoffs / verification / integration / operation / support:**

**Where could the bottleneck move?**

**Unhappy path / escalation / stop / reversal / recovery:**

### Management terms, if used

**Teamwork / collaboration:** Who participates, before/during/after, with which decision rights and follow-up?

**KPI:** Exact metric definition, unit, source, baseline, cadence and guardrails?

**Productivity:** Accepted output/outcome per relevant input, including quality and rework boundary?

**Leadership / alignment:** Which observable decisions, coordination, authority, capability or outcome are being claimed?

### Actors, interface, and control

**Primary actor:** human / AI agent / deterministic system / specialist tool / hybrid

**Interaction channel:** human UI / WebMCP / MCP / API / CLI / IDE agent / other agent tool / hybrid

**Evaluation / assurance:**

**Authority holder / boundary:**

**Accountable owner / recourse:**

**Fallback / escalation:**

### Economics and measurement

**Outcome measure:**

**Baseline:**

**Full relevant cost boundary:**

**Option value / learning value:** What useful uncertainty was removed even if the work is not operationalised?

### Decision rule

**Decision now:** continue / restrict / rely / operate / scale / renew / stop

**Next evidence that would change the decision:**

**Stop rule:** If this evidence is not reached by the agreed review point—or if a named risk/metric crosses the limit—what do we stop or restrict?

## Optional machine-readable claim record

The same decision record can be expressed as JSON using the versioned schema:

- [`claim.schema.json`](../schemas/v1/claim.schema.json)
- [`decision-gates.json`](../schemas/v1/decision-gates.json)
- [example claim record](https://github.com/milleleaf/ai-output-to-value/blob/main/toolkit/claim.example.json)

The schema deliberately separates **actor**, **assurance**, **authority**, and **accountability**. The deterministic gate is selected by `targetDecision`, not by whether the producer was human or AI. In the current machine record, `project`, `intendedUse`, and the workflow-boundary fields together identify the assessed subject/scope; do not interpret a gate result as a status for everything sharing the same project name.

A repository or CI process can evaluate a record with:

```bash
python scripts/claim_gate.py path/to/claim.json --json
```

## Same standard does not mean the same interface

Actor-neutral evaluation does **not** require an AI agent to imitate a person clicking the same controls.

A human may use the visible interface. An agent may use a structured tool surface such as **WebMCP**, a native **MCP** server, an API, CLI, or IDE agent. A hybrid workflow may use several channels.

The interface can differ while the decision standard stays the same:

- did the intended action actually happen?
- did it meet the same acceptance criteria?
- was the actor authorised to perform it?
- are consequential actions appropriately controlled?
- can the result and failures be inspected?
- does the workflow improve the outcome at an acceptable cost and risk?

WebMCP is an **interaction channel**, not proof of Deliverable, Operating capability, Outcome, or Value.

See [`representation-is-a-channel.md`](representation-is-a-channel.md) for the wider human/agent/hybrid channel model.

## Option value is a real outcome

A prototype can be valuable because it answers a question cheaply:

- a proposed feature is not wanted;
- a workflow is technically feasible but commercially weak;
- customers understand one interaction but reject another;
- an integration is easier or harder than expected;
- a team can stop a bad idea before a larger commitment.

That is not a failure to reach **Operating capability** or **Value**. It can be a legitimate **Outcome** if the learning changes a real decision.

Measure it explicitly: decision made, uncertainty removed, time to decision, cost of the test, or larger spend avoided.

## The practical rule

> **Use the lowest claim that is sufficient for the next decision, make the end-to-end workflow boundary explicit when it matters, require management terms to have operational meaning, and stop adding process when more evidence would not change that decision.**
