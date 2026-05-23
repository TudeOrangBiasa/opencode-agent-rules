# /init-rules

Install or refresh base agent rules into the current project.

## Purpose

Copy base agent rules (behavior, verification, CLI-first, context budget) into a project that wants structured OpenCode workflow.

## Behavior

### Step 1: Detect Project Root

Find the OpenCode workspace root (where `opencode.json` or `.git` exists).

### Step 2: Create Directory Structure

Create if missing:
- `.opencode/rules/`
- `.opencode/plugins/`

### Step 3: Install Files

Copy from this repo to project:
- `AGENTS.md` → project root
- `.opencode/rules/core-behavior.md` → `.opencode/rules/`
- `.opencode/rules/status-verification.md` → `.opencode/rules/`
- `.opencode/rules/cli-first.md` → `.opencode/rules/`
- `.opencode/rules/context-budget.md` → `.opencode/rules/`
- `.opencode/plugins/context-guard.js` → `.opencode/plugins/`

### Step 4: Handle Existing AGENTS.md

If `AGENTS.md` already exists in project:
- Read it
- Append managed section at the bottom:

```md
<!-- BEGIN:opencode-agent-rules -->
## OpenCode Agent Rules

Managed by opencode-agent-rules. Do not edit manually.

Base rules installed: [date]
- core-behavior.md
- status-verification.md
- cli-first.md
- context-budget.md
<!-- END:opencode-agent-rules -->
```

- Do NOT overwrite the existing file.

### Step 5: Merging opencode.json

If project has `opencode.json`, output instruction:

```
To enable compaction, merge this into your opencode.json:

{
  "agent": {
    "compaction": {
      "model": "opencode/nemotron-3-super-free",
      "temperature": 0.1
    }
  }
}
```

If project doesn't have `opencode.json`, create it with the compaction config.

## Output

Report:
- Files installed
- AGENTS.md merge status
- opencode.json merge instruction

## Example

```
/init-rules
```

Output:
```
✅ Installed base rules to /path/to/project/

Files:
- AGENTS.md (merged)
- .opencode/rules/core-behavior.md
- .opencode/rules/status-verification.md
- .opencode/rules/cli-first.md
- .opencode/rules/context-budget.md
- .opencode/plugins/context-guard.js

⚠️ Merge compaction config into opencode.json:

{
  "agent": {
    "compaction": {
      "model": "opencode/nemotron-3-super-free",
      "temperature": 0.1
    }
  }
}
```
