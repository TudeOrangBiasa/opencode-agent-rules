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
    "@tudeorangbiasa/opencode-agent-rules@git+https://github.com/TudeOrangBiasa/opencode-agent-rules.git"
  ]
}
```

Restart OpenCode. The plugin auto-registers rules, agents, and context management.

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

Free-tier default:

```json
{
  "agent": {
    "compaction": {
      "model": "opencode/minimax-m2.1-free",
      "temperature": 0.1
    }
  }
}
```

## Context Budget

- 60%: reduce context and checkpoint.
- 80%: preserve state for compaction.
- Compaction must preserve current goal, source-of-truth files, decisions, files touched, verification state, blockers, and next action.

## Related

- `sdd-multiagent-opencode`: SDD workflow layer.
- Impeccable / Taste / Nothing Design: optional UI skill layers.
