# Agents — Nexus Development Guide

## Commands

| Command         | Description                   |
| --------------- | ----------------------------- |
| `bun run dev`   | Start dev server on port 8000 |
| `bun run build` | Production build              |
| `bun run test`  | Run tests (Vitest)            |

## Key Conventions

- DO NOT use any unless strictly needed to.
- **Runtime**: Bun (always use `bun`, not npm/yarn/pnpm)
- **snake_case** for API fields (e.g., `jwt_token`, `amount_in_piastres`)
- **camelCase** for TypeScript/React
- Import alias: `#/` (e.g., `import { useAuth } from "#/hooks/use-auth"`)

## UI Development

- shadcn/ui components are in `src/components/ui/` — they're **copied, not npm packages**
- **Always check for an existing shadcn component before making your own**
- Run available shadcn commands to add new components first

## Testing & Build

- Run `bun run build` before showing the user the changes — build must pass

