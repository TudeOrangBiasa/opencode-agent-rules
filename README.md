# OpenCode Agent Rules

Base OpenCode agent rules for execution discipline, verification, CLI-first scaffolding, and context window management.

This repo is intentionally **not** an SDD workflow kit. It is the base behavior layer used by any project.

## Layers

Use this with higher-level workflow kits:

```txt
opencode-agent-rules        # base behavior, verification, context policy
        ↓
sdd-multiagent-opencode     # SDD commands, agents, skills, specs
        ↓
external UI skills          # impeccable, taste, nothing-design, etc.
```

## Contents

```txt
AGENTS.md
opencode.json
.opencode/
├── rules/
│   ├── core-behavior.md
│   ├── status-verification.md
│   ├── cli-first.md
│   └── context-budget.md
└── plugins/
    └── context-guard.js
```

## Install

### Plugin Install (Recommended)

Add to your `opencode.json` (global or project-level):

```json
{
  "plugin": [
    "@tudeorangbiasa/opencode-agent-rules@latest"
  ]
}
```

Restart OpenCode. The plugin auto-registers rules, agents, and context management.

To pin a specific version:

```json
{
  "plugin": [
    "@tudeorangbiasa/opencode-agent-rules@0.3.0"
  ]
}
```

**Why npm instead of GitHub?** GitHub installs pull the latest commit which may include beta/unstable changes. npm packages are versioned and tested before publish, so you get a stable, mature release.

### npx Install (Fallback)

For projects that prefer local files instead of a plugin:

```bash
cd your-project
npx -y -p @tudeorangbiasa/opencode-agent-rules init-rules
```

### Manual Copy

```bash
cp AGENTS.md /path/to/project/
cp -r .opencode/rules /path/to/project/.opencode/
cp -r .opencode/plugins /path/to/project/.opencode/
```

Then merge `opencode.json` into the project's `opencode.json`.

## Compaction Model

Configure the compaction model in one global plugin config:

`~/.config/opencode/opencode-agent-rules.json`

Free-tier default:

```json
{
  "agent": {
    "compaction": {
      "model": "opencode/minimax-m2.5-free",
      "temperature": 0.1
    }
  }
}
```

Run `opencode models opencode | grep "free"` to verify current free model availability.

Restart OpenCode after editing the global config.

## Context Budget

- 60%: reduce context and checkpoint.
- 80%: preserve state for compaction.
- Compaction must preserve current goal, source-of-truth files, decisions, files touched, verification state, blockers, and next action.

## Related

- `sdd-multiagent-opencode`: SDD workflow layer.
- Impeccable / Taste / Nothing Design: optional UI skill layers.
