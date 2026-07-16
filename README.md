# lott0.online

Enterprise lottery backend — **NestJS 11 + Prisma 7 (PostgreSQL 18) + Clean Architecture**,
with **Loop Engineering** (triage automation via Hermes).

> ⚠️ Foundation only. Domain modules (identity/wallet/lottery/betting/payment/agent/commission)
> are scaffolded as a skeleton; the runtime `LoopWorkerService` (audit/optimize/consolidate)
> is implemented and verified. Full domain logic is the next phase (see Roadmap).

## Stack
- NestJS 11, TypeScript strict, `@nestjs/schedule` (loop workers)
- Prisma 7 (`prisma-client` generator → `src/generated/prisma`, git-ignored) + `@prisma/adapter-pg`
- PostgreSQL 18 (Docker `postgres:18-alpine`), Redis 7 (Docker)
- pino (redacted logger), `@nestjs/terminus` (health), Swagger

## Quick start
```bash
npm install
cp .env.example .env          # edit secrets before prod
npx prisma generate
docker compose -f docker/docker-compose.yml up -d postgres redis
npx prisma migrate dev
npm run prisma:seed
npm run start:dev             # → http://localhost:3100/v1
```

## Local ports
- App: **3100**
- Postgres (container): **5455** (5432 taken by another project) → maps to 5432 inside
- Redis: **6380** (6379 taken) → maps to 6379 inside
- Keep `.env.example` ↔ `docker/docker-compose.yml` in sync (5455 / 6380).

## Scripts
| cmd | desc |
|---|---|
| `npm run build` | `nest build` (strict TS) → `dist/main.js` |
| `npm test` | Jest unit (3 tests in `test/unit`) |
| `npm run prisma:generate` | Prisma client → `src/generated/prisma` |
| `npm run prisma:migrate` | dev migration |
| `npm run prisma:seed` | seed system_config |
| `npm run start:prod` | `node dist/main.js` |

## API
Base: `http://localhost:3100/v1` (URI versioning v1)
- `GET /v1/health` · `GET /v1/health/ready` — terminus probes
- `GET /v1/workers` — active loop workers
- `GET /v1/workers/trigger/:name` — run a worker on demand (`audit|optimize|consolidate`)
- `GET /docs` — Swagger

## Architecture
```
src/
├── main.ts                 # bootstrap + pipes/filters/interceptor + Swagger
├── app.module.ts
├── config/                 # AppConfigService (env contract)
├── shared/
│   ├── database/           # PrismaService (adapter-pg, @Global)
│   ├── logger/             # AppLogger (pino + redact)
│   ├── response/           # ResponseFactory + envelope interceptor + exception filter
│   └── health/             # terminus controller
└── modules/workers/        # LoopWorkerService (audit/optimize/consolidate) + controller
```

## Loop Engineering (triage automation)
Per [cobusgreyling/loop-engineering](https://github.com/cobusgreyling/loop-engineering):
- `STATE.md` (loop memory), `LOOP.md` (loop defs), `loop-budget.md`, `loop-run-log.md`
- `safety.md`, `loop-constraints.md`, `patterns/registry.yaml`
- Skills: `.hermes/skills/loop-triage` + `.hermes/skills/loop-verifier`
- Scheduler: `hermes cron create "0 7 * * 1-5" --skill loop-triage --deliver local --workdir .`
- Audit: `npx @cobusgreyling/loop-audit . --suggest` ( scored 90+ / 100 after L2 prep )
- The backend `LoopWorkerService` is the **runtime** loop (DB maintenance); the
  `loop-triage` cron is the **engineering** loop (repo health). Distinct.

## Roadmap (next phases)
- [ ] Identity module (JWT + refresh rotation + RBAC)
- [ ] Wallet double-entry ledger + reconciliation
- [ ] Lottery core + draw lifecycle
- [ ] Betting / Payment / Agent / Commission
- [ ] Wire financial integrity (transactions, FOR UPDATE lock, idempotency)

## Notes
- Prisma 7 ESM generated client is compiled by `nest build` (output `dist/`). Do not
  `require()` it from CJS; use `nest build` / `tsx` (ESM) only.
- This repo was rebuilt from scratch after a disk-full data loss; commits are pushed
  to remote `origin` (github.com/luiapi-sys/lott0-online) — keep pushing after every change.
