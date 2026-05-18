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

### Option 1: Manual Copy

```bash
cp AGENTS.md /path/to/project/
cp -r .opencode/rules /path/to/project/.opencode/
cp -r .opencode/plugins /path/to/project/.opencode/
```

Then merge `opencode.json` into the project's `opencode.json`.

### Option 2: Use /init-rules Command

If you have OpenCode running:

```
/init-rules
```

This command will:
1. Detect project root
2. Create `.opencode/rules/` and `.opencode/plugins/` if missing
3. Copy all rule files
4. Merge with existing AGENTS.md if present
5. Provide opencode.json merge instructions

## Compaction Model

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

## Context Budget

- 60%: reduce context and checkpoint.
- 80%: preserve state for compaction.
- Compaction must preserve current goal, source-of-truth files, decisions, files touched, verification state, blockers, and next action.

## Related

- `sdd-multiagent-opencode`: SDD workflow layer.
- Impeccable / Taste / Nothing Design: optional UI skill layers.
