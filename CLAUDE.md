# Agents — Nexus Development Guide

## Task completion Requirements

- Always run `bun lint`, `bun typecheck` and `bun format` and make sure they pass before considering a task complete.

## Key Conventions

- DO NOT use any unless strictly needed to.
- **Runtime**: Bun (always use `bun`, not npm/yarn/pnpm)

## UI Development

- shadcn/ui components are in `src/components/ui/` — they're **copied, not npm packages**
- **Always check for an existing shadcn component before making your own**
- Run available shadcn commands to add new components first
