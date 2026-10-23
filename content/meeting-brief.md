# One-page meeting brief

Use this when reviewing an AI-enabled proposal, prototype, deliverable, service, or decision process. A reader can run this discussion without software, schema documentation, MCP/WebMCP, or JSON.

## Start with the decision, not the taxonomy

Which decision are we trying to make?

Before naming a claim level, write down all three:

- **Decision sought:** what choice will be made now?
- **Intended use:** what will someone rely on, operate, measure, or scale?
- **Subject / scope:** which artefact or system version, users, environment, workflow boundary, and time period are actually being assessed?

| Decision sought | Claim that normally matters |
| --- | --- |
| **Get access to try it?** | **Access** — enough to start trying it; it says nothing about what the tool produces. |
| **Keep exploring?** | **Output** — enough to learn from a reproducible artefact or action. |
| **May someone rely on it for the named use?** | **Deliverable** — fit against explicit acceptance criteria. |
| **May we sell, operate or support it repeatedly?** | **Operating capability** — for the named repeated use and scope, the relevant owners, controls, fallback/recovery and operating process exist. Ask **“Operating capability for what?”** |
| **Did it change the result we care about?** | **Outcome** — the named measure moved versus a baseline. |
| **Should we scale, renew or stop?** | **Value** — the outcome is worth full relevant cost, risk and alternatives. |

**An Access decision only justifies trying the tool.** Having access never licenses relying on what it produces, operating it, or claiming an outcome; each of those needs its own decision and a higher claim.

The six claims are not a maturity score. Strong **Access** and **Output** do not average into partial **Deliverable**.

Do not leave a meeting with one project-wide ladder such as **“Output: strong; Deliverable: almost; Operating capability: not yet; Outcome / Value: unknown.”** Rewrite it as separate decisions, each with its own intended use, subject/scope, required claim and evidence. The same project can therefore PASS an exploration decision while a reliance decision has INSUFFICIENT EVIDENCE and a repeated-operation decision is BLOCKED.

Stars, forks, downloads, mentions, or user counts are adoption/reach signals, not readiness evidence unless adoption or reach is the decision under review.

## Eight questions

1. **What exactly have we demonstrated?**
2. **What did the AI know, and what did it infer?**
3. **What remains before the intended use?**
4. **What work disappeared or moved, and where does the bottleneck go next?**
   *Name the work that disappeared, the work that moved to someone or somewhere else, and the next bottleneck.*
5. **Which actor or combination performs this task or decision best?**
   *Compare human, AI, automated system and hybrid options rather than assuming the answer.*
6. **Who decides, who is accountable, and who verifies, runs and supports it?**
   *Name who holds authority, accountability, approval, verification, operation and support, and where recourse sits.*
7. **Which business outcome are we trying to change?**
   *Include learning or uncertainty removed when that is the purpose.*
8. **What evidence would justify the next decision, and when should we stop?**

## Workflow test

A September 2026 *Harvard Business Review* process-management article recommends treating the **workflow rather than the isolated task** as the object of AI redesign. Use that as a practical meeting test:

- **Outcome:** what customer, user, operational, learning, or business result is the workflow supposed to produce?
- **Boundary:** where does the workflow start, and what counts as complete?
- **Constraint:** if AI accelerates one task, where does the bottleneck move next?
- **Unhappy path:** what happens when information is missing, confidence is low, a dependency fails, or the action must be stopped or reversed?
- **Metric:** are we measuring the outcome, or only activity such as code generated, reports drafted, tickets closed, or handoffs avoided?

**Workflow is not a seventh claim.** It is the end-to-end process boundary across which Output must become Deliverable, Capability, Outcome, and Value.

## Management-word test

Do not let familiar business terms close the discussion before they have been defined.

| If someone says… | Ask… |
| --- | --- |
| **Workflow** | Where does it start, what counts as complete, and what happens on the unhappy path? |
| **Teamwork** | Who does what before, during and after the group session, how are decisions made, and what follow-up turns discussion into action? |
| **KPI** | What exactly is the metric, unit, data source, baseline, cadence and guardrail? |
| **Productivity** | Productive output or outcome per which input—and are quality, rework and downstream work included? |
| **Leadership** | Which decisions, coordination, authority, escalation or capability actually improved, and what evidence shows it? |

A September 2026 *Harvard Business Review* teamwork article describes AI-supported collaboration across the full arc of **before / during / after** teamwork and proposes **intentionality** and **craft** as conditions for useful team-AI collaboration. That is useful because it turns “teamwork” into a process that can be inspected rather than a virtue word.

**A slogan, title, KPI label, or boss-versus-leader meme can frame a question. It is not evidence of performance by itself.**

## Three capabilities

| Capability | Question |
| --- | --- |
| **Tool capability** | Can the AI produce the artefact or perform the task? |
| **Job substance** | Does it contain what this actual job requires? |
| **Delivery capability** | Can the organisation stand behind it? |

A useful substance-gap example:

> **A contact form can look complete while enquiries never reach the business. The interface exists; the promised workflow does not.**

## Do not bundle judgement with authority

| Question | Meaning |
| --- | --- |
| **Judgement / evaluation** | Which option appears better under the evidence, goals and trade-offs? |
| **Authority** | Who or what is permitted to act or bind the organisation? |
| **Accountability / recourse** | Who must answer for the outcome and correct failures? |

A human decision is not automatically good because a human made it. An AI decision is not automatically good because it is fast or scalable. **Human-in-the-loop is a control pattern, not a quality guarantee.**

## Count the whole job

Track the unit you actually mean: labour hours, elapsed time, external spend, review/rework, incidents, throughput, customer outcome, learning, revenue or margin.

Do not turn a reduction in one metric into a claim about another without evidence.

## Decision record

**Decision sought:** What choice is being made now?

**Intended use:** What will someone rely on, operate, measure, or scale?

**Subject / scope:** Which artefact/system version, users, environment, workflow boundary, and time period are in scope?

**Evidence character:** public measured / public documented / internal / illustrative / editorial synthesis

**Established:** What is already known or verified?

**Not established:** What remains an assumption?

**Workflow boundary:** Where does the end-to-end process start, where is it complete, and where can the bottleneck or unhappy path move?

**Management terms:** If the decision depends on teamwork, KPI, productivity, leadership or alignment, what exactly do those terms mean here?

**Actor / authority:** Who or what performs the task, who may approve or commit, and where does recourse sit?

**Decision:** Continue, restrict, rely, operate, scale, or stop?

**Next evidence:** What would change the decision?

**Stop rule:** What result, date, cost, or risk threshold would make us stop rather than generate more output?

For a fuller reusable template, use the [Claim card](claim-card.md). For the longer explanation, see [Workflow is the unit](workflow-not-task.md).

## Optional structured handoff

If the team needs a portable record after the meeting, the [interactive Claim Gate](../tools/claim-gate.html) can apply deterministic checks and import/export the decision record as `claim.json`. CLI, CI, MCP and WebMCP can use that same record, but none of them is required to begin or understand the method.

---

**AI Output to Value** — Use AI ambitiously. Keep the claims clear.
