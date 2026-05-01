# Nexus — Payment Wallet Application

A React SPA for sending money, scheduling transfers, and managing wallet balance.

## Quick Start

```bash
bun install
bun run dev
```

Visit `http://localhost:8000`

---

## Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server on port 8000 |
| `bun run build` | Production build |
| `bun run preview` | Preview production build |
| `bun run test` | Run tests (Vitest) |
| `bun run lint` | Lint with Biome |
| `bun run format` | Format with Biome |

---

## Tech Stack

- **Runtime**: Bun
- **Build**: Vite 8
- **Framework**: React 19
- **Language**: TypeScript
- **Routing**: TanStack Router (file-based)
- **Data Fetching**: TanStack Query v5
- **State**: Zustand + persist middleware
- **Forms**: React Hook Form + Zod
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Icons**: Lucide React

---

## Project Structure

```
src/
├── api/           # Axios + typed API client
├── components/    # Shared components + shadcn/ui
├── features/     # Feature-based modules (auth, wallet, transfers, scheduled)
├── hooks/        # TanStack Query hooks
├── lib/          # Utilities, schemas, formatters
├── routes/       # TanStack Router file-based routing
├── store/        # Zustand auth store
└── types/        # TypeScript interfaces
```

---

## Design System

The UI uses a **Neo-Brutalist** design:

- **Background**: `#fcf8ff` (light surface)
- **Borders**: 2px/4px solid black
- **Shadows**: Hard offset `4px 4px 0px #000000`
- **Accent**: Electric green `#00ff87`
- **Font**: Space Grotesk
- **Border-radius**: 0px everywhere

---

## API Integration

The frontend connects to a backend at `/api`. Key endpoints:

### Authentication
- `POST /auth/login` → `{jwt_token, refresh_token, email, full_name}`
- `POST /auth/register` → `{jwt_token, refresh_token, ...}`
- `POST /auth/refresh` → `{jwt_token, refresh_token}`

### Wallet
- `GET /wallet/` → `{id, user_id, balance, created_at}`
- `PATCH /wallet/` with `{amount}` → `{client_secret, amount, currency}`

### Transfers
- `GET /transfers/` → `{from_wallet_id, transfers: [...]}`
- `GET /transfers/:id` → `{transfer: {...}}`
- `POST /transfers/` with `{to_wallet_id, amount_in_piastres, note?, scheduled_at?}`

### Scheduled
- `GET /transfers/scheduled/` → `{scheduled_transfers: [...]}`
- `DELETE /transfers/scheduled/:id` → `{cancelled_id}`

### Users
- `GET /users?name=<query>` → Search recipients

**Note**: All amounts are in **piastres** (100 piastres = 1 EGP).

---

## Auth Flow

1. User logs in → stores `jwt_token` and `refresh_token` in Zustand + localStorage
2. Every request gets `Authorization: Bearer <jwt_token>` via axios interceptor
3. On 401, axios automatically tries to refresh using `refresh_token`
4. If refresh fails, user is logged out

---

## Adding New Features

### New API Endpoint
Add to `src/api/client.ts`:
```typescript
export const newApi = {
  something: () => client.get<ReturnType>("/endpoint"),
}
```

### New Type
Add to `src/types/index.ts`:
```typescript
export interface NewType {
  field: string
}
```

### New Form
1. Add Zod schema to `src/lib/schemas.ts`
2. Create component in `src/features/<feature>/`
3. Use RHF + zodResolver + TanStack Query mutation

### New Route
Add file to `src/routes/` following TanStack Router naming:
- `_prefix/filename.tsx` → `/prefix/filename`
- `_prefix/_index.tsx` → `/prefix` (index route)

---

## For Developers

- Use `#/` path alias for imports (e.g., `import { useAuth } from "#/hooks/use-auth"`)
- shadcn/ui components are in `src/components/ui/` — they're copied, not npm packages
- Run `bun run build` before deploying — build must pass
- Don't commit secrets — use env variables for API keys

---

## Troubleshooting

**Build fails?**
```bash
bun run build
```

**Linting errors?**
```bash
bun run lint --write  # auto-fix
```

**Dev server not starting?**
```bash
rm -rf node_modules/.cache
bun run dev
```

---

## Notes for LLMs

This project uses specific patterns. See `AGENTS.md` (if exists) or remember:

- **snake_case** for API fields (e.g., `jwt_token`, `amount_in_piastres`)
- **camelCase** for TypeScript/React
- Zustand store uses `persist` middleware — check localStorage if auth state persists unexpectedly
- TanStack Router auto-generates `routeTree.gen.ts` — don't edit manually
- Forms use Zod schemas, not manual validation