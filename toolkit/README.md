# AI Output to Value — adopter toolkit

This directory packages the decision framework into lightweight operational artefacts. The target decision determines the gate; the identity of the producer does not.

## 1. Start with a machine-readable claim

Copy [`claim.example.json`](claim.example.json) and validate it against:

- `https://milleleaf.github.io/ai-output-to-value/schemas/v1/claim.schema.json`
- `https://milleleaf.github.io/ai-output-to-value/schemas/v1/decision-gates.json`

Local deterministic evaluation:

```bash
python scripts/claim_gate.py path/to/claim.json --json
```

Possible gate states are `PASS`, `BLOCKED`, and `INSUFFICIENT_EVIDENCE`. There is deliberately no percentage-complete score.

> **Gate ≠ truth.** `PASS` means the supplied record satisfies the deterministic gate for the selected decision. It is not an audit of the underlying system, measurement, people, or evidence references.

## 2. Learn from filled samples before starting blank

The [`samples/`](samples/) folder contains ten fictional `claim.json` records: three original teaching cases (four records) and a cross-domain pack of six more.

- website prototype — **Explore → PASS**;
- the same website — **Operate → BLOCKED**;
- internal incident-summary tool — **Rely → PASS**;
- killed idea — **Outcome → PASS** on decision-changing learning;
- the cross-domain pack — six records showing false claim promotions, described in [`samples/README.md`](samples/README.md).

The website pair deliberately keeps the artefact conceptually the same while changing the requested decision. This demonstrates why the decision selects the gate.

The live Claim Gate can load these samples directly.

## 3. Use the interactive gate

Open:

`https://milleleaf.github.io/ai-output-to-value/tools/claim-gate.html`

Human, AI and hybrid workflows operate on the same `claim.json` contract:

- **human** — complete/edit the visible form;
- **AI** — evaluate the record through WebMCP or native MCP;
- **hybrid** — import/export `claim.json`, or let a compatible browser agent populate the local form for inspection/editing.

The tool can copy Markdown/JSON, download JSON, and print a compact decision record. Its HTML also contains a readable static fallback, schema links, decision thresholds and teaching records for no-JavaScript clients and crawlers.

## 4. Fill the Outcome worksheet when the decision is 05 Outcome

Use [`templates/outcome-worksheet.md`](templates/outcome-worksheet.md) for the general Outcome decision. It requires the decision/intervention, workflow or population, outcome measure, baseline period/value, after or comparison period/value, consistent-definition check, material confounds, adverse effects, attribution qualification, evidence source, and the result that would reverse the conclusion.

When time is relevant, **elapsed time and labour hours are recorded separately**. Faster elapsed time is not automatically labour saved.

For software-delivery initiatives, [`templates/software-outcome-pack.json`](templates/software-outcome-pack.json) supplies DORA's five current metric names plus AI-specific leading indicators. It now points back to the general worksheet so DORA telemetry can supply evidence without becoming a competing scoring framework.

The worksheet includes a numeric worked example where review elapsed time improves while reviewer labour rises. That supports an Outcome claim without automatically establishing Value.

Neither instrument marks a Claim Gate check PASS automatically.

## 5. Fill the Value workbook when the decision is 06 Value

Use [`value-cost-ledger.md`](value-cost-ledger.md) when the decision is scale, renew, expand, or stop.

The ledger requires users to distinguish:

- elapsed time from labour hours;
- labour removed from labour shifted into review, rework, support, maintenance, or incident handling;
- model/API/tool/vendor cost;
- infrastructure cost;
- integration, testing, evaluation, assurance, and security cost;
- support/maintenance and incident/risk cost;
- opportunity cost and the alternative not taken;
- option value of information, including a justified stop;
- attribution qualification and evidence sources.

Do not force unlike quantities into one total unless the conversion is explicit and defensible. The worked stop example treats decision-changing information as a positive result without booking avoided planned spend as automatic realised profit.

Completing the ledger supports a Value decision record; it does not independently validate the underlying measurements or auto-populate PASS checks.

## 6. Keep real evidence private with the workbook

Use [`private-workbook/`](private-workbook/) inside the adopting organisation. It contains:

```text
private-workbook/
├── README.md
├── decision.md
├── claim.json
└── evidence/
    └── README.md
```

The built site also publishes a downloadable ZIP at:

`/downloads/ai-output-to-value-private-workbook.zip`

The public project does not need access to the organisation's confidential evidence. Keep client names, contracts, production metrics, personal data, proprietary workflows, credentials and other restricted material inside the appropriate controlled systems.

## 7. Add the GitHub Action

After checking out the caller repository:

```yaml
- name: AI Output to Value decision gate
  uses: milleleaf/ai-output-to-value@main
  with:
    claim: governance/claim.json
```

For governed use, replace `@main` with a reviewed release/tag or commit SHA.

The Action evaluates the supplied `claim.json`. It does **not** add extra requirements merely because code was AI-generated.

By default the step fails when the gate does not return `PASS`. Set `fail-on-block: 'false'` to read the result and let the calling workflow decide — **only the exact value `false` disables failure**, so a typo such as `yes` or an empty value keeps the protective behaviour. A missing or malformed claim record always fails the step, because there is no result to report.

The Action exposes the gate result as step outputs, so a caller can branch on the verdict instead of parsing stdout:

```yaml
- name: AI Output to Value decision gate
  id: gate
  uses: milleleaf/ai-output-to-value@main
  with:
    claim: governance/claim.json
    fail-on-block: 'false'

- name: Require Operating capability before release
  if: steps.gate.outputs.status != 'PASS'
  env:
    GATE_STATUS: ${{ steps.gate.outputs.status }}
    GATE_DECISION: ${{ steps.gate.outputs.target-decision }}
    GATE_REQUIRED: ${{ steps.gate.outputs.required-claim-level }}
    GATE_FAILED: ${{ steps.gate.outputs.failed-check-count }}
    GATE_UNKNOWN: ${{ steps.gate.outputs.unknown-check-count }}
  run: |
    echo "Gate returned $GATE_STATUS for $GATE_DECISION"
    echo "Required claim: $GATE_REQUIRED"
    echo "$GATE_FAILED failed, $GATE_UNKNOWN unknown"
    exit 1
```

> **Read outputs through `env:`, never by interpolating `${{ }}` into a `run:` block.**
> `target-decision` is echoed from the claim record, which in an adopter repository
> is written by whoever opened the pull request. GitHub substitutes an expression as
> *text* before the shell parses it, so a record containing `$(...)` in that field
> executes on your runner. Through `env:` the same value arrives as data and is
> printed inertly.

| Output | Meaning |
| --- | --- |
| `status` | `PASS`, `BLOCKED` or `INSUFFICIENT_EVIDENCE` |
| `target-decision` | Identifier of the decision evaluated |
| `decision-label` | Human-facing label for that decision |
| `required-claim-level` | Weakest claim level sufficient for the decision |
| `asserted-claim-level` | Claim level asserted by the record |
| `claim-mismatch` | `true` when the asserted level does not match the required one |
| `failed-check-count` / `unknown-check-count` / `passed-check-count` | Check tallies |
| `result-json` | The complete result as compact JSON |

The step also writes a short verdict to the job summary.

**Gate ≠ truth.** A `PASS` output reports that the *supplied record* satisfies the deterministic checks for the selected decision. It is not an audit of the underlying system, measurement, people, or evidence references.

## 8. Add the pull-request questions

This repository's [pull request template](../.github/pull_request_template.md) is intentionally actor-neutral. Adapt the same sections in adopter repositories:

- decision sought;
- demonstrated vs inferred;
- intended use and limits;
- workflow boundary and moved bottleneck;
- actors / assurance / authority / accountability;
- evidence and measurement;
- next evidence and stop rule.

## 9. Install the agent skill / give agents the same rules

The canonical agent contract is [`skills/applying-ai-output-to-value/SKILL.md`](skills/applying-ai-output-to-value/SKILL.md). Use it when an agent is about to say work is done/complete, client-ready, production-ready, validated/verified, ready to operate, has demonstrated Outcome/ROI/Value, or is justified to scale/renew/expand.

For Claude Code installation, a one-copy multi-agent layout, thin Cursor/Copilot/`AGENTS.md` wrappers, and conformance fixtures, see the [agent-skill package README](skills/applying-ai-output-to-value/README.md).

The skill deliberately preserves the lower-bound rule: if the next decision needs only Output and Output is established, the correct answer can be **“Output established; no higher claim is needed for this decision.”**

[`AGENT_RULES.md`](AGENT_RULES.md) remains as a compatibility pointer for earlier adopters; do not fork the claim definitions or gate semantics into wrapper files.

For native MCP setup, see [`../packages/mcp/README.md`](../packages/mcp/README.md).

## 10. Use instruments to inspect claims, not to mint Value

[`operating-kit.md`](operating-kit.md) lists vendor-neutral instrument classes for evaluation/trace, contract/e2e testing, operational evidence, software-delivery telemetry, and cost/value evidence.

MCP servers and skills are context pipes. They can materially improve Access, Output and evidence retrieval; they do not create Value merely by being connected.

## 11. Place the method inside the relevant governance system

See [`../docs/framework-crosswalk.md`](../docs/framework-crosswalk.md) for a short orientation to NIST AI RMF, ISO/IEC 42001, EU AI Act Article 14, and Australia's current Guidance for AI Adoption.

AI Output to Value is a decision/evidence method, not a substitute for law, certification, regulator guidance, contract obligations, or sector controls.

## 12. Machine-readable publication data

The public site generates:

- `/api/v1/framework.json`
- `/api/v1/gates.json`
- `/api/v1/articles.json`
- `/api/v1/claims.json`
- `/api/v1/sources.json`
- `/api/v1/failure-modes.json` in the working preview;
- `/templates/outcome-worksheet.md`;
- `/templates/software-outcome-pack.json`;
- `/templates/value-cost-ledger.md`;
- `/samples/*.claim.json`.

WebMCP, native MCP and the interactive UI should consume the same published contract rather than re-encoding the framework independently.
