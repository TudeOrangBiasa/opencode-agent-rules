import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "../..");

const globalConfigDir = path.join(
  process.env.HOME || process.env.USERPROFILE || "",
  ".config",
  "opencode"
);

// ── Auto-Migration: Remove old symlinks from v0.1.x ────────────────────────

function removeOldSymlinks() {
  const MIGRATION_MARKER = ".agent-rules-migrated-v020";
  const markerPath = path.join(globalConfigDir, MIGRATION_MARKER);

  if (fs.existsSync(markerPath)) return;

  const symlinkTargets = [
    { dir: "rules", prefix: null },
    { dir: "commands", prefix: null },
  ];

  let migrated = false;

  for (const { dir, prefix } of symlinkTargets) {
    const dirPath = path.join(globalConfigDir, dir);
    if (!fs.existsSync(dirPath)) continue;

    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        try {
          const stat = fs.lstatSync(fullPath);
          if (!stat.isSymbolicLink()) continue;

          const linkTarget = fs.readlinkSync(fullPath);
          if (linkTarget.includes("opencode-agent-rules")) {
            fs.unlinkSync(fullPath);
            migrated = true;
          }
        } catch {
          // skip
        }
      }
    } catch {
      // skip
    }
  }

  if (migrated) {
    try {
      fs.writeFileSync(markerPath, new Date().toISOString());
    } catch {
      // skip
    }
  }
}

removeOldSymlinks();

// ─── Rule Definitions (inlined to avoid sync I/O at boot) ────────────────────

const RULES = {
  "core-behavior": `# Core Behavior

Use operational guidance, not persona text.

## Default Posture

- Act before explaining when tools can ground the answer.
- Read before editing and verify after meaningful changes.
- Match effort to task complexity and risk.
- Prefer the smallest safe change that solves the real problem.
- Reuse existing patterns before inventing new abstractions.
- Separate observation, inference, and assumption in reports.

## Solver Loop

For non-trivial work:

1. Define the outcome in operational terms.
2. Inspect the repo and current environment before choosing an approach.
3. Find the spine: entry points, data flow, state boundaries, persistence, and user-visible behavior.
4. Build the smallest vertical slice that proves the solution works.
5. Verify at the surface where the user experiences the change.
6. Expand scope only after the core slice is working.

## Scope Control

- Do exactly the slice the user asked for.
- Do not turn planning into implementation or explanation into edits.
- Do not broaden scope with opportunistic cleanup, refactors, or polish unless needed for the requested outcome.
- If scope changes during the work, tell the user what changed and why before continuing further than the original slice.
- If unrelated or unexpected edits appear, stop and ask before proceeding.

## Stuck Loop Policy

- After two failed verification attempts on the same hypothesis, stop repeating the same fix.
- Document evidence from those attempts, then switch strategy: smaller patch, wider read, or one concrete forked question.
- Do not loop on identical reasoning without changing inputs.

## Communication

- Lead with actions, findings, and results.
- Keep progress updates short and high signal.
- Prefer milestone updates over step-by-step narration.
- When blocked, state the blocker, evidence, and smallest next step.`,

  "cli-first": `# CLI-First Scaffolding

For new projects, always use the official framework CLI when one exists.

## Rules

- Do not manually create boilerplate files when an official CLI exists.
- Do not hand-write manifests, generated config, IDE metadata, or framework scaffolds from memory.
- Use non-interactive flags when possible.
- If required choices are missing, ask before running the CLI.
- After any scaffold or generator runs, inspect the created directory structure before continuing.
- For existing projects, never rerun scaffold commands unless the user explicitly asks.

## Examples

Use official commands such as:

\`\`\`bash
pnpm create next-app@latest
pnpm create vite@latest
pnpm dlx nuxi@latest init
pnpm create astro@latest
composer create-project laravel/laravel
\`\`\`

Never fabricate complex generated files such as:

- \`.xcodeproj\`
- \`project.pbxproj\`
- \`.xcworkspace\`
- complex \`.sln\` metadata`,

  "context-budget": `# Context Budget

Keep active context below 80%.

## Thresholds

| Threshold | Behavior |
|-----------|----------|
| 60% | Reduce context loading, checkpoint current state, pass minimal prompts to subagents |
| 80% | Prepare for compaction; preserve only source-of-truth state and active next action |

## Policy

- Prefer source-of-truth files over conversation memory.
- Use codebase search and snippets before reading large files.
- Do not inline entire roadmaps, specs, logs, or task objects into subagent prompts.
- For multi-agent work, pass only task ID, task title, linked spec path, command to execute, and constraints.
- Write checkpoints after each meaningful batch.
- Before long work, summarize current goal, files touched, decisions, verification state, blockers, and next action.

## Compaction Must Preserve

- Current goal.
- Active workflow and command.
- Task ID or project ID.
- Source-of-truth files.
- Key decisions made.
- Files touched.
- Open blockers.
- Verification state: \`changed\`, \`verified\`, \`unverified\`, \`blocked\`.
- Next action.

## Compaction Should Discard

- Resolved discussions.
- Duplicate context.
- Failed hypotheses after evidence has been recorded.
- Raw logs once the important result has been summarized.
- Old alternatives no longer under consideration.`,

  "status-verification": `# Status And Verification

Code is not complete until it has been proved at the surface the user cares about.

## Allowed Status Labels

- \`changed\`: you edited or produced something.
- \`verified\`: you proved a claim with a relevant check.
- \`unverified\`: work exists but required proof was not run.
- \`blocked\`: required progress or proof failed and the task cannot honestly be called complete.
- \`assumption\`: a choice or statement depends on inference rather than direct evidence.

Do not use \`done\`, \`fixed\`, \`working\`, or \`resolved\` without naming proof immediately after.

## Minimum Proof By Change Type

| Change type | Minimum proof |
|-------------|---------------|
| Localized edit | Re-read or one targeted static check |
| Backend, logic, or API change | Targeted test, command, script, or runtime request |
| UI or interaction change | Browser or user-surface verification, plus static checks as needed |
| Integration-sensitive change | Build or typecheck plus one focused behavior check |
| New app or scaffold | Setup/install succeeds, startup or health check succeeds, production build succeeds, one primary happy-path flow works |

Build, lint, and typecheck support completion claims, but they do not replace runtime or surface proof for interaction, styling, navigation, or integration promises.

## Closeout Contract

Every substantive completion summary should include:

- **Summary**: outcome in one short paragraph.
- **Files touched**: paths or areas changed.
- **Verification evidence**: exact commands run, manual checks, user-visible surfaces exercised.
- **Risks and unverified items**: regressions not tested, assumptions, follow-ups.

If intended verification failed and you fall back to a weaker check, say so explicitly.`,
};

// ─── Command Definitions ────────────────────────────────────────────────────

const COMMANDS = {
  "init-rules": {
    description: "Install or refresh base agent rules into the current project",
    prompt: `Install or refresh base agent rules into the current project.

## Purpose

Copy base agent rules (behavior, verification, CLI-first, context budget) into a project that wants structured OpenCode workflow.

## Behavior

### Step 1: Detect Project Root

Find the OpenCode workspace root (where opencode.json or .git exists).

### Step 2: Create Directory Structure

Create if missing:
- .opencode/rules/
- .opencode/plugins/

### Step 3: Install Files

Copy from this repo to project:
- AGENTS.md -> project root
- .opencode/rules/core-behavior.md -> .opencode/rules/
- .opencode/rules/status-verification.md -> .opencode/rules/
- .opencode/rules/cli-first.md -> .opencode/rules/
- .opencode/rules/context-budget.md -> .opencode/rules/
- .opencode/plugins/context-guard.js -> .opencode/plugins/

### Step 4: Handle Existing AGENTS.md

If AGENTS.md already exists in project:
- Read it
- Append managed section at the bottom with BEGIN/END markers
- Do NOT overwrite the existing file.

### Step 5: Merging opencode.json

If project has opencode.json, output instruction to merge compaction config.
If project doesn't have opencode.json, create it with the compaction config.

## Output

Report files installed, AGENTS.md merge status, and opencode.json merge instruction.`,
  },
};

// ─── Plugin Export ───────────────────────────────────────────────────────────

export default async ({ client, project, directory, $ }) => {
  return {
    config(cfg) {
      // Register rules via config hook
      cfg.rules = cfg.rules || {};
      for (const [name, content] of Object.entries(RULES)) {
        if (!cfg.rules[name]) {
          cfg.rules[name] = content;
        }
      }

      // Register commands
      cfg.command = cfg.command || {};
      for (const [name, cmd] of Object.entries(COMMANDS)) {
        if (!cfg.command[name]) {
          cfg.command[name] = cmd;
        }
      }

      // Register compaction config
      const pkgOpencodePath = path.join(packageRoot, "opencode.json");
      if (fs.existsSync(pkgOpencodePath)) {
        try {
          const pkgConfig = JSON.parse(fs.readFileSync(pkgOpencodePath, "utf-8"));
          if (pkgConfig.agent?.compaction && !cfg.agent?.compaction) {
            cfg.agent = cfg.agent || {};
            cfg.agent.compaction = pkgConfig.agent.compaction;
          }
        } catch {
          // skip
        }
      }
    },
  };
};
