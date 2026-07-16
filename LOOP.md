# LOOP.md — lott0.online Loop Definitions

This file describes the loops running on this repo. Keep in agreement with
[STATE.md](./STATE.md) (run `npx @cobusgreyling/loop-sync .` after editing either).

## Loop 1 — Daily Triage (L1, report-only)

- **Tool:** Hermes (`hermes cron`)
- **Skill:** `loop-triage` (`.hermes/skills/loop-triage/SKILL.md`, also user-scoped)
- **State file:** [STATE.md](./STATE.md) — loop reads + writes it every run
- **Budget:** [loop-budget.md](./loop-budget.md)
- **Run ledger:** [loop-run-log.md](./loop-run-log.md)
- **Constraints:** [loop-constraints.md](./loop-constraints.md)
- **Safety:** [safety.md](./safety.md)

### What it does
1. Read STATE.md. 2. Scan repo (commits, build/test, config drift). 3. Merge
findings into High Priority / Watch List. 4. Update `Last run`. 5. Do NOT edit
source code (week-one rule: report only).

## Future loops
- **L2** — assisted fix in worktree + `loop-verifier` (see [LOOP-L2.md](./LOOP-L2.md)).
- **Event-driven CI triage** — `POST /hooks/agent` on CI failure.
