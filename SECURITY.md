# Security policy

## Reporting a vulnerability

Please report a suspected vulnerability **privately**, not in a public issue or discussion:

**[Report a vulnerability](https://github.com/milleleaf/ai-output-to-value/security/advisories/new)** (GitHub private vulnerability reporting for this repository).

Include what you found, the file or surface affected, the version or commit, and the smallest input or steps that reproduce it. This project is maintained by one person, so there is no fixed response time, but reports are read and acknowledged on a best-effort basis.

## What is in scope

- the claim gate: `scripts/claim_gate.py` and the native MCP server in `packages/mcp`;
- the reusable GitHub Action (`action.yml`);
- the web UI and WebMCP surface (`web/`, `webmcp.js`, `tools/claim-gate.html`);
- the build and CI workflows in `.github/`, including anything that could publish attacker-controlled content or leak a secret.

A claim gate that returns a wrong verdict for a malformed record is a correctness bug, and a public issue is fine unless the input can also be used to attack something.

## What is out of scope

- factual, evidentiary or wording errors in the guide: use the [correction issue template](https://github.com/milleleaf/ai-output-to-value/issues/new?template=correction.yml);
- disagreement with the method itself;
- a gate result being read as an audit. A gate result evaluates only the supplied decision record.

## Supported versions

Only the current `main` branch and the latest pre-release tag receive fixes. The native MCP package is private and not published to npm, so there are no published package versions to patch.
