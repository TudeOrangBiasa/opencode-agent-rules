# Status And Verification

Code is not complete until it has been proved at the surface the user cares about.

## Allowed Status Labels

- `changed`: you edited or produced something.
- `verified`: you proved a claim with a relevant check.
- `unverified`: work exists but required proof was not run.
- `blocked`: required progress or proof failed and the task cannot honestly be called complete.
- `assumption`: a choice or statement depends on inference rather than direct evidence.

Do not use `done`, `fixed`, `working`, or `resolved` without naming proof immediately after.

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

If intended verification failed and you fall back to a weaker check, say so explicitly.
