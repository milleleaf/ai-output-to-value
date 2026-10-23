# Applying AI Output to Value — agent skill package

`SKILL.md` is the canonical agent contract for this package. It is designed to intervene when an agent is about to overclaim readiness, verification, outcome, ROI, or value while still allowing a bounded Output-only task to stop at Output.

The files under `wrappers/` are intentionally thin. They only route a coding-agent instruction surface back to the canonical `SKILL.md`; they do not reimplement the six claims or gate semantics.

## Quick install

### Claude Code

Claude Code discovers project skills under `.claude/skills/<name>/SKILL.md`.

From a clone of this repository:

```bash
mkdir -p .claude/skills
cp -R toolkit/skills/applying-ai-output-to-value .claude/skills/
```

That gives:

```text
.claude/skills/applying-ai-output-to-value/SKILL.md
```

For a personal install, copy the directory to `~/.claude/skills/` instead.

Official reference: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview

### One canonical copy for several agents

If the same repository uses several coding agents, vendor the package once:

```bash
rm -rf .ai-output-to-value
cp -R toolkit/skills/applying-ai-output-to-value .ai-output-to-value
```

The canonical installed contract is then:

```text
.ai-output-to-value/SKILL.md
```

Point each agent surface at that file rather than copying the semantic rules into multiple instruction files.

For Claude Code on systems where repository symlinks are practical:

```bash
mkdir -p .claude/skills
ln -s ../../.ai-output-to-value .claude/skills/applying-ai-output-to-value
```

If symlinks are unsuitable, use the Claude-only copy method above and treat that installed `SKILL.md` as the canonical copy for the repository.

## Thin wrappers

### Cursor

Cursor project rules live under `.cursor/rules/*.mdc`.

```bash
mkdir -p .cursor/rules
cp .ai-output-to-value/wrappers/cursor.mdc .cursor/rules/ai-output-to-value.mdc
```

The wrapper points to `.ai-output-to-value/SKILL.md` using Cursor file context rather than reproducing the framework.

Official reference: https://docs.cursor.com/context/rules

### GitHub Copilot

Repository-wide Copilot instructions can live at `.github/copilot-instructions.md`. If that file already exists, merge the short pointer from `wrappers/copilot-instructions.md` into it rather than overwriting unrelated project guidance.

```bash
mkdir -p .github
cp .ai-output-to-value/wrappers/copilot-instructions.md .github/copilot-instructions.md
```

Official reference: https://docs.github.com/en/copilot/how-tos/configure-custom-instructions-in-your-ide/add-repository-instructions-in-your-ide

### `AGENTS.md`-style agents

Merge `wrappers/AGENTS.fragment.md` into the relevant `AGENTS.md`. The fragment only tells the agent when to load the canonical skill.

## What should trigger the skill?

Typical trigger language includes:

- done / complete;
- client-ready;
- production-ready;
- validated / verified;
- ready to operate;
- Outcome demonstrated;
- ROI demonstrated / Value proved;
- scale / renew / expand justified.

The skill then asks what decision is actually being made and selects the weakest sufficient claim.

It should **not** force a production-readiness process onto a request that only needs a prototype, draft, experiment, or other Output. A valid bounded conclusion is:

> **Output established; no higher claim is needed for this decision.**

## Conformance fixtures

`conformance/fixtures.json` contains adversarial prompts plus expected decision-scoped gate results. The repository test suite checks that:

- the fixtures map to the canonical decision-gate contract;
- “done”, “production ready”, and “ROI proved” overclaims are represented;
- an Output-only case stops at Output;
- review/assurance is not treated as authority/sign-off;
- wrappers continue to point to `SKILL.md` rather than duplicating the framework.

Run:

```bash
python -m unittest tests.test_agent_skill_conformance
```

These fixtures are a lightweight contract test for the packaged instructions. They are not a benchmark proving that every model will follow the skill perfectly.

## Canonical machine contract

The skill defers to the same public machine-readable contract as the rest of the project:

- https://milleleaf.github.io/ai-output-to-value/schemas/v1/claim.schema.json
- https://milleleaf.github.io/ai-output-to-value/schemas/v1/decision-gates.json

A Claim Gate result evaluates the supplied record. It does not certify truth or replace an organisation's actual authority/sign-off process.
