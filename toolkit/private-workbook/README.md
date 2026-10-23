# AI Output to Value — private workbook

Use this folder **inside your organisation** for a real decision review. It is deliberately separate from the public teaching cases.

> **Do not publish confidential client names, contracts, production metrics, personal data, credentials, proprietary workflows, or internal evidence merely to use this method.**

The method needs inspectable evidence for the people authorised to make the decision; it does not require public disclosure.

## Suggested folder

```text
private-review/
├── decision.md
├── claim.json
├── decision-register.md
└── evidence/
    ├── README.md
    ├── tests-or-evals/
    ├── measurements/
    ├── runbooks-or-controls/
    └── decision-records/
```

Use only the subfolders that matter to the decision.

## Workflow

1. Copy `decision.md`, `claim.json` and `decision-register.md` into a private project folder.
2. Keep one row per open decision in your copy of `decision-register.md`. Status is only `PASS`, `BLOCKED`, or `INSUFFICIENT EVIDENCE`. Do not average the rows.
3. Name the **decision sought** before collecting more evidence.
4. Put supporting internal material under `evidence/` or link to the organisation's existing controlled systems.
5. Evaluate `claim.json` with the interactive Claim Gate, CLI, WebMCP, or native MCP.
6. Record what would change the decision and the stop/restrict rule.
7. Keep the evidence private according to your organisation's access, retention, legal, security, and client obligations.

A `PASS` means the supplied record satisfies the deterministic gate for the selected decision. It is **not an audit of the underlying system or evidence**.

## Public reporting

If the organisation later wants to describe the work publicly, create a separate public summary containing only claims and evidence that are authorised for disclosure. Do not treat this workbook as a publication template.
