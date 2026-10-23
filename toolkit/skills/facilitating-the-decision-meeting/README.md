# Facilitating the decision meeting — agent skill

This skill walks the eight questions and fills the claim-card fields in prose. It stops when the decision and the next evidence are named.

It is the meeting skill. [`applying-ai-output-to-value`](../applying-ai-output-to-value/SKILL.md) remains the skill for an agent about to say done, production ready, verified, or ROI proved. This skill does not replace that one.

## Install from a pinned commit

Copy the directory into the agent skill path for the host you use. For Claude Code, from a clone pinned to a commit:

```bash
mkdir -p .claude/skills
cp -R toolkit/skills/facilitating-the-decision-meeting .claude/skills/
```

## Distribution hold

Do not publish this skill, or `applying-ai-output-to-value`, to a host registry until a repository tag contains the Access decision (`01-access` in `schemas/v1/decision-gates.json`). Tag `v0.1.0-rc.1` predates that decision: its gate lists explore, rely, operate, measure-outcome, and scale-renew-stop. Until a later tag includes Access, install either skill from a pinned commit of this repository. See [`docs/tooling-distribution.md`](../../../docs/tooling-distribution.md).
