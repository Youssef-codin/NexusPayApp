# Nexus — Payment Wallet

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-runtime-fbf0df?style=flat-square&logo=bun&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Biome](https://img.shields.io/badge/Biome-linter-60A5FA?style=flat-square&logo=biome&logoColor=white)
[![Backend](https://img.shields.io/badge/Backend-Youssef--codin%2FNexusPay-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Youssef-codin/NexusPay)

### [Visit the website here!](https://nexuspay.youssef-alshenawy.workers.dev/)

Send money, schedule transfers, manage your wallet balance.

---

## Quick Start

```bash
bun install
bun run dev
```

Visit `http://localhost:8000`

---

## Commands

| Command          | Description                   |
| ---------------- | ----------------------------- |
| `bun run dev`    | Start dev server on port 8000 |
| `bun run build`  | Production build              |
| `bun run lint`   | Lint with Biome               |
| `bun run format` | Format with Biome             |

---

## Tech Stack

|                   |                              |
| ----------------- | ---------------------------- |
| **Framework**     | React 19 + TypeScript        |
| **Build**         | Vite 8 + Bun                 |
| **Routing**       | TanStack Router (file-based) |
| **Data Fetching** | TanStack Query v5            |
| **State**         | Zustand + persist            |
| **Forms**         | React Hook Form + Zod        |
| **Styling**       | Tailwind v4 + shadcn/ui      |
| **Payments**      | Stripe                       |

---

## Testing Payments (Stripe)

| Card                  | Result    |
| --------------------- | --------- |
| `4242 4242 4242 4242` | Success   |
| `4000 0000 0000 9995` | Declined  |
| `4000 0027 6000 3184` | 3D Secure |

Expiry: any future date · CVC: any 3 digits · ZIP: any 5 digits
