# Start here — what did buying AI actually achieve?

Generative AI can create useful software, reports, research, designs and automations very quickly. It can also analyse information, prepare proposals and presentations, communicate with customers, and participate in live interactive workflows. The management mistake is not using AI aggressively. It is treating several different claims as though they were the same.

> **Access is not operating capability. Output is not completion. Apparent completeness is not proof of substance. Activity is not business value.**


## Run the 15-minute decision discussion

You do **not** need to read schema documentation, understand MCP/WebMCP, or create JSON before using this method in a meeting.

**Default path: Decision → eight questions → Claim Card / printable brief → evidence → optional structured record.**

Start with the decision you need to make, then ask:

1. **What exactly have we demonstrated?**
2. **What did the AI know, and what did it infer?**
3. **What remains before the intended use?**
4. **What work disappeared or moved, and where does the bottleneck go next?**
5. **Which actor or combination performs this task or decision best?**
6. **Who decides, who is accountable, and who verifies, runs and supports it?**
7. **Which business outcome are we trying to change?**
8. **What evidence would justify the next decision, and when should we stop?**

Record the discussion with either the **[Claim Card](content/claim-card.md)** or the **[one-page meeting brief](content/meeting-brief.md)**. Then inspect the evidence that matters for the decision.

If a portable machine-readable handoff is useful **after or alongside the human record**, use the [interactive Claim Gate](https://milleleaf.github.io/ai-output-to-value/tools/claim-gate.html) to import or export `claim.json`. That structured record is optional; it is not the conceptual front door.


## Six different claims, not six mandatory steps

This project uses a decision framework:

**Access → Output → Deliverable → Operating capability → Outcome → Value**

The stable machine identifier for the fourth claim remains `04-capability`; **Operating capability** is the human-facing name so it is not confused with generic tool capability or delivery capability.

The arrows are a memory aid, not a mandatory project lifecycle.

> **Do not assign one claim-level status to an entire project.** A summary such as **“Output: strong; Deliverable: almost; Operating capability: not yet; Outcome / Value: unknown”** is still a maturity-ladder reading, even without numbers. A claim result belongs to a **decision + intended use + subject/scope**.

| Claim | Question |
| --- | --- |
| **Access** | Do we have the model, agent, API, subscription or tool? |
| **Output** | Did it generate something useful-looking or functional? |
| **Deliverable** | Is the result fit for its intended use and acceptance criteria? |
| **Operating capability** | Can the organisation repeatedly verify, operate, support, maintain and improve the named use within the stated scope? |
| **Outcome** | What actually changed: time, quality, service, throughput, risk, learning or another meaningful measure? |
| **Value** | Was that outcome worth the full cost, risk and trade-offs? |

## Same project, different decisions

The same website prototype can legitimately produce different gate results because the decisions are different:

| Decision | Intended use + subject/scope | Required claim | Example result |
| --- | --- | --- | --- |
| **Keep exploring** | Internal UX learning on the current staging build | **Output** | **PASS** — the prototype is reproducible and inspectable enough to learn from. |
| **Permit client reliance** | Receive real client enquiries through the production contact workflow | **Deliverable** | **INSUFFICIENT EVIDENCE** — the page exists, but delivery of enquiries has not yet been verified. |
| **Operate repeatedly** | Public lead intake in production, including monitoring, recovery and support | **Operating capability** | **BLOCKED** — a decision-critical operating requirement such as ownership or recovery is known to be absent. |

These are **not three statuses for the project**. They are three decision records with different intended uses and scopes. Whenever **Operating capability** is discussed, ask: **Operating capability for what repeated use, in which environment and workflow boundary?** The relevant controls follow from that answer; there is no universal checklist that proves Operating capability independently of context.

Repository stars, forks, downloads, mentions, or user counts can be evidence about **adoption or reach**. They are not readiness evidence unless the decision being evaluated is explicitly about adoption or reach.

A disposable prototype can create a valuable learning outcome without becoming an operational service. A useful reverse-planning question is:

> **What outcome do we need, and what evidence, operating capability and work would make that outcome plausible?**

## A capable agent is not automatically a capable supplier

Keep three ideas separate:

1. **Tool capability** — can the AI produce the artefact or perform the task?
2. **Job substance** — does the result contain what this particular job actually requires?
3. **Delivery capability** — can the organisation verify, explain, deploy, support, maintain and stand behind it?

These are substance dimensions, not extra rungs in the six-claim framework.

A simple example of the substance gap:

> **A contact form can look complete while enquiries never reach the business. The interface exists; the promised workflow does not.**

Ask what the AI knew, what it inferred, which assumptions have been checked, what remains before the intended use, and who or what can approve and support the result.

## Treat the workflow, not the isolated task, as the unit of redesign

A product, feature, report, model call, or coding task can improve dramatically while the end-to-end business result barely moves.

A September 2026 *Harvard Business Review* article by Masha Shunko and Serguei Netessine recommends treating the **workflow rather than the individual task** as the object of AI redesign. It describes four recurring failure patterns: accelerating activity rather than value, ignoring the unhappy path, ignoring end-to-end flow, and optimizing the wrong metric.

The article's coding-agent example is especially useful: more code can be produced while the bottleneck moves into review, integration testing, security review, or deployment. The local productivity gain may be real without proving that the overall delivery cycle improved.

In this project, **workflow is not a seventh claim**. It is the process boundary across which stronger claims have to be tested:

**task / product output → end-to-end workflow → Deliverable → repeatable Operating capability → Outcome → Value**

So when someone says **“the product works, but the workflow is not complete,”** the useful next questions are concrete: where does the workflow start and end, which handoffs or checks remain, what happens on the unhappy path, where will the bottleneck move, and which business outcome should improve?

See [Workflow is the unit — where AI output becomes business delivery](content/workflow-not-task.md).

## Management words need evidence too

The same rule applies upward through the organisation. **Workflow, teamwork, KPI, productivity, leadership, and alignment are not magic words that settle a decision.**

A separate September 2026 *Harvard Business Review* article by Gabriele Rosani and Elisa Farri makes teamwork more concrete by treating it as a full arc of activity **before, during, and after** team sessions, and by proposing **intentionality** and **craft** as conditions for useful team-AI collaboration.

So ask:

- **teamwork:** who participates, what happens before/during/after, how are decisions made, and what follow-up turns discussion into action?
- **KPI:** what exactly is measured, in what unit, from which data, against which baseline, and with which guardrails?
- **productivity:** accepted output or outcome per which input, with what quality threshold and which downstream rework included?
- **leadership / alignment:** which observable decisions, coordination, authority, capability, or outcome improved?

A slogan, title, dashboard label, or boss-versus-leader meme can start a question. It is not evidence by itself.

> **Apply the same standard to technical and management claims: define what the term means, define the outcome, and show the evidence.**

## Do not mix the terms

**Vibe coding** describes a way of working, usually prompt-driven creation and rapid iteration.

**AI-assisted work** means AI contributed to producing or performing the work. It does not by itself imply review or quality.

**Responsible AI-assisted practice** adds proportionate evaluation, ownership and controls for the intended use.

**AI slop / workslop** describes a quality problem: output that appears finished but lacks enough substance, correctness, context or usefulness.

These are not mutually exclusive categories. A vibe-coded artefact is AI-assisted; whether it is useful, responsible for the intended use, or low-value output is a separate assessment.

## Judgement is not the same as authority or accountability

AI is not limited to typing code or drafting text. Systems can analyse files and data, compare alternatives, plan, recommend, communicate, handle objections, and perform bounded decision-making. For some tasks, AI may perform better than a person; for others it may perform worse; and for many the best design may be hybrid.

Human decision-makers are fallible too. A title, seniority, or human presence is not a quality certificate.

Keep three questions separate:

- **Judgement / evaluation** — which option appears better under the available evidence and goals?
- **Authority** — who or what is permitted to commit money, make an offer, change a system, or bind the organisation?
- **Accountability / recourse** — where does responsibility for the outcome sit, and who must correct failures?

Human review can be useful or legally required, but **human-in-the-loop is a control pattern, not a guarantee of quality**. Use the human, AI, automated, or hybrid process that produces the best evidenced outcome within the required authority and accountability constraints.

> **Apply the same standard to human, AI and hybrid work: assess the complete process and its results, not the identity of the producer.**

See [AI can do business work too](content/ai-business-capability-and-judgement.md).

## Count the whole job

Use precise units. If drafting changes from **8 labour hours to 2 labour hours**, it uses **75% fewer labour hours**. If the whole illustrated workflow changes from **10 labour hours to 7 labour hours**, it uses **30% fewer labour hours**.

Those figures do not establish elapsed delivery time. Waiting, handoffs and parallel work can change calendar duration without changing summed labour hours.

Count specification, generation, review, correction, testing, integration, deployment, support and maintenance at the level relevant to the decision.

## Measured evidence can point in different directions

The point of an evidence-led framework is not to collect only studies with the same headline. Different studies measure different tasks, populations, tools, and definitions of productivity.

- In [METR's early-2025 randomized study](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/), 16 experienced open-source developers completed 246 real tasks in mature repositories. With AI tools allowed, they took **19% longer** on average. Before the tasks they expected AI to make them 24% faster, and after the study they still believed it had made them about 20% faster. That is strong evidence that perceived speed and measured speed can diverge in this setting; it is not evidence that AI slows most developers.
- In a [controlled GitHub Copilot experiment reported by Microsoft Research](https://www.microsoft.com/en-us/research/publication/the-impact-of-ai-on-developer-productivity-evidence-from-github-copilot/), developers completing a bounded JavaScript HTTP-server task with Copilot finished about **55.8% faster** than the control group. That result is real for the study task and does not establish the same effect for mature repositories or end-to-end delivery.
- In [Noy and Zhang's preregistered experiment published in *Science*](https://doi.org/10.1126/science.adh2586), 453 college-educated professionals completed midlevel writing tasks; ChatGPT access reduced average completion time by **40%** and increased output quality by **18%**. The result is about the selected writing tasks, not all knowledge work.
- In [Dell'Acqua et al.'s preregistered consulting experiment](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321), AI assistance improved quantity, speed, and quality on tasks selected inside the model's capability frontier, while on a selected task outside that frontier AI users were **19% less likely to produce correct solutions**. The important lesson is task heterogeneity, not a universal effect size.

Together these studies support a more disciplined question than “does AI improve productivity?”:

> **For this task, workflow, population, tool, and decision, what outcome changed under a comparable definition?**

## What this guide is not saying

It is not saying that free tools cannot produce professional work, that simple API-based products cannot create value, that human-written work is inherently better, that human judgement is inherently superior, that AI judgement is inherently superior, or that every prototype needs the same assurance burden.

It is saying that **the claim should match the evidence**.

## Recommended reading route

1. [A strong frame is not the same as a finished job](content/frame-vs-finished-work.md)
2. [Tool access vs client readiness](content/tool-access-vs-client-readiness.md)
3. [Workflow is the unit — where AI output becomes business delivery](content/workflow-not-task.md)
4. [Executive guide](content/executive-guide.md)

The broader material on AI business capability, product discovery, architecture economics, open-source economics, organisational capability, agents, representation and retail is deeper reading, not a prerequisite. See the [reading path](docs/reading-path.md).

For evidence methodology, see the [evidence policy](docs/evidence-policy.md), [claim register](data/claims.yml), and canonical [source register](data/sources.yml).
