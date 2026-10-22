# Web UI and PDF stack

The publication keeps its existing Markdown/YAML/Python evidence and release-control pipeline as the canonical content layer. The `web/` package is the presentation layer built on top of the generated publication data.

## Distribution status

- **Version identity:** source package `@milleleaf/ai-output-to-value-web` version `0.1.0`, plus the repository tag/commit used to build the publication artefact. The package is private source, not a published npm surface.
- **Intended use:** build the interactive publication UI and the generated meeting-brief PDF from the canonical publication data.
- **Support / compatibility boundary:** support is the tested React/TypeScript/Tailwind/pdfcn/Takumi toolchain in the pinned repository revision. Rendered UI/PDF checks may be part of the reviewed-method acceptance bar because those artefacts are in the publication; publishing this package to npm is not required and would be a separate tooling decision.

Browser WebMCP is also versioned by the publication tag/commit rather than this package version, and remains progressive enhancement where the required browser API exists. See [`../docs/tooling-distribution.md`](../docs/tooling-distribution.md) for the separate release track and browser compatibility boundary.

## UI stack

- **React + TypeScript** for interactive UI islands.
- **Tailwind CSS v4** for design tokens, layout utilities, and the progressive styling layer applied to generated publication pages.
- **shadcn/ui conventions with Base UI primitives** for interactive controls. Do not introduce Radix primitives into this package unless there is a documented requirement that Base UI cannot satisfy.
- **pdfcn on Takumi** for actual PDF documents. PDF components are installed from the pdfcn shadcn registry and then used by the document templates under `scripts/`.

The initial Base UI migrations are:

- article **Copy MD / Open in** toolbar;
- interactive **Claim gate** form, selects, cards, buttons, and status presentation.

The Tailwind layer also owns fragile cross-page layout rules such as article tables and table-card evidence footers so these do not continue accumulating page-specific CSS patches.

## Build

From a clean checkout:

```bash
cd web
npm install
npm run pdfcn:sync
npm run typecheck
cd ..
python scripts/build_with_ui.py
```

`build_with_ui.py`:

1. builds the canonical Python publication and `/api/v1` data;
2. builds the React/Tailwind bundle into `site/ui/`;
3. injects the shared UI assets into generated pages;
4. renders `site/downloads/ai-output-to-value-meeting-brief.pdf` with pdfcn/Takumi.

GitHub Actions runs the same flow for both the working preview and proposed release artifact.

## One claim gate on every surface

The Claim Gate page, WebMCP and the native MCP server all run `packages/mcp/src/gate-core.mjs`; the Python CLI and Action run `scripts/claim_gate.py`, and the conformance fixture (`tests/fixtures/claim-gate-conformance.json`) holds the two together. The build emits the shared module as `site/ui/gate-core.js`, and `npm run build` fails if any of these disagree with the fixture:

- `scripts/check-gate-conformance.mjs` runs the built browser bundle;
- `scripts/check-webmcp-conformance.mjs` runs the real `webmcp.js` through its `aiov_evaluate_claim_record` tool (it uses Node's experimental `vm` module loader);
- `scripts/check-ui-verdict.ts` checks that the page can show PASS only when the shared gate returns PASS.

A complete form takes the shared gate's verdict for the record it exports. An incomplete form shows INSUFFICIENT_EVIDENCE and lists what is missing, because an unfilled field is not a malformed record.

## pdfcn

`npm run pdfcn:sync` installs the owned source components used by the PDF template:

```text
@pdfcn/takumi/text
@pdfcn/takumi/section
@pdfcn/takumi/stack
@pdfcn/takumi/badge
@pdfcn/takumi/divider
@pdfcn/theme-professional
```

The current document template is `scripts/render-meeting-brief.tsx`.

## Migration rule

This is deliberately a progressive migration. Existing stable article/evidence URLs and the Python release machinery should not be rewritten merely to adopt the UI stack.

For new UI work:

1. prefer an existing shadcn/Base UI component;
2. express spacing, responsive layout, typography, and state styling through Tailwind tokens/utilities;
3. add handwritten CSS only for publication-wide semantics that are awkward to express as component utilities;
4. put printable/generated documents in pdfcn rather than extending browser print CSS into a second document-layout system;
5. keep actor-neutral decision/evidence semantics in the canonical data layer, not inside UI components.

The goal is not "zero CSS". The goal is one reusable component/design system instead of accumulating unrelated fixes for each page.
