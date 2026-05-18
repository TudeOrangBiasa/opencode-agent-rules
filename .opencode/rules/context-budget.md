# Context Budget

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
- Verification state: `changed`, `verified`, `unverified`, `blocked`.
- Next action.

## Compaction Should Discard

- Resolved discussions.
- Duplicate context.
- Failed hypotheses after evidence has been recorded.
- Raw logs once the important result has been summarized.
- Old alternatives no longer under consideration.
