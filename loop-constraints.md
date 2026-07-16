# loop-constraints.md — Structured Constraints

## Must never
- Edit source code in L1 (report-only).
- Commit `.env` or any secret.
- Run `git push --force`, `git commit --no-verify`, or disable security/validation.
- Change money precision (always Decimal(18,2)) or PK strategy (always UUID).

## Must always
- Keep `.env.example` ↔ `docker/docker-compose.yml` ports in sync (5455 / 6380).
- Run `npm run build` + `npm test` before claiming any change is done.
- Record triage outcomes in STATE.md + append to loop-run-log.md.
- Push to remote after every commit (disk-loss lesson learned).

## Escalation
- Unknown / out-of-scope → High Priority in STATE.md, stop. No infinite retry.
- Kill switch: `hermes cron pause fec756ffd57f` or `loop-pause-all: true` in STATE.md.
