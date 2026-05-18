export const ContextGuard = async () => {
  return {
    "experimental.session.compacting": async (_input, output) => {
      output.context.push(`## Context Guard\n\nWhen compacting this session, preserve the project operating state rather than a chat transcript.\n\nRequired structure:\n\n### Current Goal\n- What the user is trying to accomplish now.\n\n### Active Workflow\n- Workflow type: SDD / maintenance / bootstrap / general engineering.\n- Current command or phase.\n- Task ID or project ID if present.\n\n### Source Of Truth\n- AGENTS.md, DESIGN.md, PRODUCT.md, .sdd/project-profile.json, specs, plans, tasks, or roadmap paths that matter.\n\n### Decisions Made\n- Durable decisions and their rationale.\n\n### Files Touched\n- Created, modified, or intentionally avoided files.\n\n### Verification State\n- changed: what exists.\n- verified: exact proof run.\n- unverified: what was not checked.\n- blocked: blockers and evidence.\n\n### Next Action\n- The smallest concrete next step.\n\nDiscard resolved discussion, duplicate context, raw logs after summarization, and old alternatives no longer under consideration.`)
    },
  }
}
