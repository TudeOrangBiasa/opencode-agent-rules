# CLI-First Scaffolding

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

```bash
pnpm create next-app@latest
pnpm create vite@latest
pnpm dlx nuxi@latest init
pnpm create astro@latest
composer create-project laravel/laravel
```

Never fabricate complex generated files such as:

- `.xcodeproj`
- `project.pbxproj`
- `.xcworkspace`
- complex `.sln` metadata
