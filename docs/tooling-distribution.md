# Tooling and distribution release track

Tooling/distribution readiness is tracked separately from the **first reviewed method release**.

A reviewed method/publication can be approved without publishing an npm package, shipping an installable agent wrapper, or claiming broad WebMCP compatibility, unless a specific reviewed-release requirement genuinely depends on that surface. Conversely, publishing or tagging a tool does **not** establish that the method's terminology, cited claims, examples, or release artefact have completed independent review.

The reviewed-method acceptance bar remains in [`first-reviewed-release.md`](first-reviewed-release.md). Issue #1 remains the umbrella publication milestone; this document owns the separate distribution/tooling milestones.

## Two independent readiness claims

### Reviewed method release

This claim is about the publication and method itself:

- frozen public terminology and claim definitions for the release;
- release-scope content and examples;
- accepted independent-review dispositions for launch-critical evidence;
- policy, provenance, correction, confidentiality, licensing, and reuse terms;
- rendered usability/print checks and reader testing;
- an explicit, reproducible reviewed artefact and approval decision.

The reviewed artefact may include executable instruments such as the Claim Gate, schema, examples, and browser UI. Requiring those artefacts to be internally consistent is **not** the same as requiring every distribution channel or wrapper to be published and supported.

### Tooling/distribution release

This claim is made per surface. It is about packaging, version identity, host compatibility, conformance, and maintenance expectations.

A tool may consume a reviewed method release, but that does not make the tool itself reviewed or supported on every host. A tool may also be published while the method remains a working preview.

## Surface records

Every distributed surface must state a version identity, intended use, and support/compatibility boundary. "Current" below means the source state in this repository; a governed adopter should pin a reviewed tag or commit rather than infer support from `main`.

### Deterministic Claim Gate CLI and contract

- **Version identity:** contract family `schemas/v1/`; the CLI implementation is identified by the repository release tag or commit containing `scripts/claim_gate.py`, `claim.schema.json`, and `decision-gates.json`. There is no separately published CLI package at present.
- **Intended use:** deterministic local evaluation of a supplied `claim.json` against the selected decision gate, including CI and human/agent handoffs.
- **Support / compatibility boundary:** compatibility is defined by the pinned v1 schema/gate contract and the tested Python implementation in the same repository revision. A `PASS` evaluates the supplied record; it is not an audit of the underlying facts, evidence, system, or people. Packaging the CLI independently is optional and is not a reviewed-method release prerequisite.

### GitHub Action

- **Version identity:** the repository tag or commit used in `uses: milleleaf/ai-output-to-value@...`; there is no independent Action semver today. `@main` is a moving working-preview reference.
- **Intended use:** apply the same deterministic Claim Gate to a caller repository's `claim.json` and expose the verdict as workflow outputs.
- **Support / compatibility boundary:** supported behaviour is the behaviour of the pinned repository revision, its composite-action dependencies, and the GitHub Actions environment it was tested against. Callers should pin a reviewed tag or immutable commit for governed use. Availability of the Action does not mean the method has been reviewed, and a reviewed method release does not promise that every runner/host combination is supported.

### Native MCP / optional npm distribution

- **Version identity:** source package `@milleleaf/mcp-output-to-value` version `0.1.0`; the package is currently `private: true` and is not published to npm.
- **Intended use:** local stdio MCP access for IDE, desktop, and terminal agents to query the framework and evaluate supplied claim records.
- **Support / compatibility boundary:** current source requires Node.js 20+ and supports stdio as the first transport. Host-specific MCP behaviour, future Streamable HTTP deployment, npm publication, and package-manager support are separate distribution decisions. If npm publication is chosen later, that package release must state the method/contract revision it consumes. npm publication by itself must never be presented as evidence that the method was independently reviewed.

### Browser WebMCP

- **Version identity:** the publication tag or commit that contains `webmcp.js` and the generated publication API it consumes; there is no independent WebMCP semver at present.
- **Intended use:** progressive browser-agent access to the same framework/claim data and acknowledged handoff into the visible Claim Gate.
- **Support / compatibility boundary:** WebMCP is available only where the browser exposes the required `document.modelContext` surface and where the publication build has been tested. The human-visible Claim Gate and static publication must remain usable without WebMCP. Broad browser/agent compatibility is a separate tooling milestone, not a prerequisite for approving the method.

### Web UI and PDF build package

- **Version identity:** source package `@milleleaf/ai-output-to-value-web` version `0.1.0`; it is private source used to build the publication artefact rather than a published npm package.
- **Intended use:** build the interactive React/Tailwind Claim Gate UI and the pdfcn/Takumi meeting-brief PDF on top of canonical publication data.
- **Support / compatibility boundary:** compatibility is the tested build/toolchain in the pinned repository revision. Rendered UI/PDF checks can be part of the reviewed-method acceptance bar because those artefacts are in the publication; publishing the web package to npm is not required and would be a separate distribution decision.

### Agent skill and wrappers

- **Version identity:** the repository tag or commit containing `toolkit/skills/applying-ai-output-to-value/SKILL.md` and `toolkit/skills/facilitating-the-decision-meeting/SKILL.md`. There is no separately versioned registry package today.
- **Intended use:** `applying-ai-output-to-value` gives coding and terminal agents the decision-first stop rules. `facilitating-the-decision-meeting` walks the eight questions and fills the claim-card fields in prose, then stops when the decision and the next evidence are named.
- **Support / compatibility boundary:** model and host behaviour can vary, so a skill is guidance rather than a deterministic proof mechanism. Any Claude Code, Cursor, Copilot, `AGENTS.md`, or future registry wrapper should remain a thin pointer to the canonical skill and state the host versions it was tested against. Do not publish either skill to a host registry until a repository tag contains the Access decision (`01-access` in `schemas/v1/decision-gates.json`). Tag `v0.1.0-rc.1` predates that decision. Until a later tag includes it, install from a pinned commit. Installing a skill does not establish a reviewed method, and a reviewed method release does not imply every wrapper is operationally supported. The native MCP server stays stdio from a pinned commit. It is not published to npm, and it is not hosted as a remote server, until the tagging policy in the checklist below is real. `blank_decision_record` returns an empty register row. It does not score a project.

## Cross-surface conformance

Separate release tracks do **not** remove conformance requirements.

Before a surface is presented as compatible with a given method/contract revision:

- it should consume or bundle the same declared schema/gate contract rather than silently re-encode semantics;
- shared fixtures should produce compatible verdicts where the surfaces claim the same behaviour;
- a release/tag should identify the method/contract revision the tool consumes;
- host/runtime assumptions and unsupported modes should be documented;
- support and maintenance expectations should be explicit.

A conformance test can establish that implementations agree on the supplied fixtures. It does not establish that the underlying evidence is true.

## Tooling/distribution milestone checklist

These items are intentionally **not** part of the first reviewed-method checklist unless a future publication requirement explicitly imports one of them:

- [ ] Decide whether the native MCP package should be published to npm and define its release/versioning policy.
- [ ] Define an explicit tagging/versioning policy for the GitHub Action rather than relying on `@main`.
- [ ] Record a tested WebMCP browser/agent compatibility matrix before making a broad compatibility claim.
- [ ] Decide whether agent skills/wrappers should be distributed through host-specific registries and record tested host versions.
- [ ] State maintenance/support expectations for each externally distributed surface.
- [ ] Run cross-surface conformance checks against the exact method/contract revision before each tooling release.

Completing any item above does not, by itself, approve the reviewed method. Approving the reviewed method does not, by itself, complete any item above.
