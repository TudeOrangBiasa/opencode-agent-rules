# Agent Rules Context

## Purpose

`@tudeorangbiasa/opencode-agent-rules` is base OpenCode behavior package. It provides reusable agent discipline: act-before-explain posture, read-before-edit, status/verification reporting, CLI-first scaffolding, scope control, context budget, and compaction rules.

This package is intentionally separate from SDD. Users can install rules-only without adopting SDD workflow.

## Boundary

This context owns:

- Root `AGENTS.md` agent contract.
- `.opencode/rules/*.md` rule source files.
- `.opencode/plugins/register.js` rule/command registration and global compaction config loading.
- `.opencode/plugins/context-guard.js` compaction summary guard.
- `.opencode/commands/init-rules.md` manual/local setup command.
- `opencode-agent-rules.json` default compaction config.
- Package docs and publish metadata.

This context does not own SDD commands, SDD agents, SDD templates, or SDD CLI behavior except as vendored downstream copy in `sdd-multiagent-opencode/vendor/opencode-agent-rules/`.

## Domain Terms

- Agent contract: behavioral rules loaded for OpenCode agents.
- Rule source: markdown file under `.opencode/rules/`.
- Inlined rule: matching rule text embedded inside `.opencode/plugins/register.js`.
- Context budget: guidance for reducing loaded context around 60% and preparing compaction around 80%.
- Compaction: model-assisted session summarization that must preserve active goal, source of truth, decisions, touched files, verification state, and next action.
- Context guard: plugin hook for `experimental.session.compacting` that appends required summary structure.
- Status labels: `changed`, `verified`, `unverified`, `blocked`, `assumption`.
- CLI-first scaffolding: preference for official CLIs/generators over hand-written generated boilerplate.
- Closeout contract: final report must name proof for completed work.

## Key Flows

Plugin install flow:

1. OpenCode loads `.opencode/plugins/register.js`.
2. Plugin registers rules into `cfg.rules` without overwriting existing names.
3. Plugin registers `/init-rules` command when absent.
4. Plugin reads `~/.config/opencode/opencode-agent-rules.json`, creating default config if missing.
5. Plugin applies `agent.compaction` only when caller config has not set one.

Compaction flow:

1. `context-guard.js` receives `experimental.session.compacting` event.
2. It appends required summary sections to compaction context.
3. Summary preserves current goal, active workflow, source of truth, decisions, files touched, verification state, and next action.

Maintenance flow:

1. Edit rule markdown source.
2. Mirror same behavior into `RULES` in `.opencode/plugins/register.js`.
3. If SDD should ship same rule, mirror into `sdd-multiagent-opencode/vendor/opencode-agent-rules/`.
4. Verify touched JS with `node --check`.

## Verification

Use focused checks:

- `node --check .opencode/plugins/register.js`
- `node --check .opencode/plugins/context-guard.js`
- `npm pack --dry-run --json`

No package test script exists currently.

## Source Inspirations

Rules layer is inspired by `madebyaris/advance-minimax-m2-cursor-rules`, converted for OpenCode as plugin/package behavior rather than Cursor-only rules.
