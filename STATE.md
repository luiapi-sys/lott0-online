# Loop State — lott0.online

Last run: never (re-created 2026-07-16 after disk-loss; rebuilt from scratch)

## High Priority (loop is acting or waiting on human)
- Identity module (JWT + refresh rotation + RBAC) — foundation scaffolding done, domain logic pending.
- Wallet double-entry ledger integrity — must be wired before any deposit path.

## Watch List
- Betting / Payment / Agent / Commission modules — not yet scaffolded.
- Prisma ESM client vs CJS `dist` build gap — use `nest build`; verify-bootstrap via tsx (ESM).
- Redis port collision in dev (5432/5433 taken by other projects) — compose uses 5455 / 6380.

## Recent Noise (ignored this run)
- pino-pretty / @prisma/client dev-only deps — expected, resolved.

## Post-Run Critique (from last run)
- (none yet — first run after rebuild)

---
Run log: —
