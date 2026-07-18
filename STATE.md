# Loop State — lott0.online

Last run: 2026-07-18 (daily triage — build PASS, test:unit PASS 3/3, lint:check FAIL: missing eslint.config.js)

## High Priority (loop is acting or waiting on human)
- Identity module (JWT + refresh rotation + RBAC) — foundation scaffolding done, domain logic pending.
- Wallet double-entry ledger integrity — must be wired before any deposit path.
- `lint:check` is broken — no `eslint.config.js` (ESLint 9 needs flat config). Lint has never run since 2026-07-16 rebuild; CI (`ci.yml`) also skips lint. Low-effort fix: add `eslint.config.js` with @typescript-eslint flat config. Report-only (week-one rule) — do NOT auto-create.

## Watch List
- Betting / Payment / Agent / Commission modules — not yet scaffolded.
- Prisma ESM client vs CJS `dist` build gap — use `nest build`; verify-bootstrap via tsx (ESM).
- Redis port collision in dev (5432/5433 taken by other projects) — compose uses 5455 / 6380.
- Lint absent from CI — `ci.yml` runs build + test + boot-smoke but not `npm run lint:check`; add it once eslint.config.js exists.

## Recent Noise (ignored this run)
- pino-pretty / @prisma/client dev-only deps — expected, resolved.
- App port 3100 (CI smoke) consistent with `AppConfigService` default; DB/Redis ports 5455/6380 in sync between `.env.example` ↔ `docker-compose.yml` — no port drift.

## Post-Run Critique (from last run)
- 2026-07-18: Lint gap surfaced (missing eslint.config.js) — first real tooling defect since rebuild. Build + unit tests green. No source changes (week-one rule).

---
Run log:
- 2026-07-18 (daily triage): re-verify build PASS / test:unit 3/3 PASS / lint:check FAIL (no eslint.config.js). New finding: broken lint script + CI skips lint. No source edits. Tree clean, up to date with origin/main.
