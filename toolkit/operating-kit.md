# Mild operating kit — instruments that can inspect a claim

This is intentionally **not** a preferred-vendor stack. Tools, MCP servers, agents, dashboards, and repositories can increase Access and Output. They do not automatically establish Deliverable, Operating capability, Outcome, or Value.

Choose instruments according to the failure mode and the decision being made.

| Claim boundary | Evidence job | Typical instrument class | Examples |
| --- | --- | --- | --- |
| **Access → Output** | Confirm the tool can actually produce or perform the bounded task | usage inventory, reproducible fixture, tool/API log | organisation usage inventory; API/tool logs; a saved reproducible prompt/fixture |
| **Output → Deliverable** | Test the named acceptance criteria and important failure modes | eval/trace system, deterministic fixture, contract test, end-to-end test | Promptfoo, Langfuse, or the UK AI Security Institute's Inspect AI, re-run on the same fixture; plus the enquiry, file, or test that shows the result arrived |
| **Deliverable → Operating capability** | Show the organisation can repeatedly operate, detect, recover, support, and change the workflow | CI/CD controls, observability, runbooks, rollback/recovery tests, ownership records | the CI, ownership record, and incident/runbook system already in use; the decision register's owner and stop date |
| **Operating capability → Outcome** | Measure whether the end-to-end result changed against a baseline | product/operations measurement, DORA-capable delivery telemetry, experimental or quasi-experimental comparison | [Outcome worksheet](templates/outcome-worksheet.md), including what was predicted before the trial beside what was measured; for software delivery, the [DORA pack](templates/software-outcome-pack.json) |
| **Outcome → Value** | Account for relevant cost, labour movement, risk, alternatives and trade-offs | finance/cost records, incident cost, support effort, customer/business measure, decision log | [Value cost ledger](value-cost-ledger.md), filled from internal cost records |

The stable machine identifier for **Operating capability** remains `04-capability`.

## MCP and agent skills are context pipes

Repository, documentation, ticket, log, browser and data MCP/skill integrations can give an agent better context and make the workflow more inspectable. That can materially improve **Access**, **Output**, and the evidence-gathering process.

They do not mint Value simply because the agent can reach more systems.

GitHub, Linear, or an observability MCP can make evidence easier to retrieve. They stay context pipes. Installing one is an Access fact.

An agent about to say the work is done, production ready, verified, or worth the cost uses [`applying-ai-output-to-value`](skills/applying-ai-output-to-value/SKILL.md), plus this repository's native MCP server once that server is pinned to a commit. A meeting that only needs the eight questions uses [`facilitating-the-decision-meeting`](skills/facilitating-the-decision-meeting/SKILL.md) and stops when the decision and the next evidence are named. Neither skill is published to a host registry until a repository tag contains the Access decision. Tag `v0.1.0-rc.1` does not.

Ask instead:

- Which claim does this integration help inspect?
- Which evidence becomes easier to retrieve or reproduce?
- Which permissions or authority does it expose?
- Which new failure mode does the integration introduce?
- What remains outside the tool's view?

## Software Outcome default

For a software-delivery initiative, the project provides a [software Outcome pack](templates/software-outcome-pack.json) based on DORA's five current delivery metrics:

- change lead time;
- deployment frequency;
- failed deployment recovery time;
- change fail rate;
- deployment rework rate.

When AI-assisted delivery is the intervention, also consider leading indicators such as the share of AI-touched changes, review wait time for those changes, and revert/rollback rate for those changes.

Use the [general Outcome worksheet](templates/outcome-worksheet.md) to record baseline/after values, what was predicted before the trial beside what was measured, definition consistency, confounds, adverse effects, attribution qualification, evidence sources, and the reversal rule. These are measurement suggestions, not automatic evidence that AI caused the result or that the result created business Value.

Keep open decisions on the [decision register](templates/decision-register.md): one row per decision, with status `PASS`, `BLOCKED`, or `INSUFFICIENT EVIDENCE`. The same project may have several rows. The register has no average.

## Keep the operating kit proportionate

An exploration does not need production observability merely because production observability is useful elsewhere. Use the **lowest claim sufficient for the next decision**, and add an instrument only when the evidence it provides can change that decision.
