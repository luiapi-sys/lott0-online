# LOOP L2 Runbook — lott0.online Assisted Fix

Promotes daily-triage from report-only (L1) to assisted fix in an isolated
git worktree with a verifier pass (L2). Per loop-engineering QUICKSTART "Week two".

## Safety gates
- Only High-Priority single-file / tightly-scoped fixes.
- Every fix in a git worktree (`git worktree add`), never on main.
- A verifier (`loop-verifier`, read-only) must approve before merge.
- No force-push, no `--no-verify`, no secret commits, no disabled tests.
- Verifier FAIL or ambiguous → escalate to human (STATE.md), no infinite retry.

## Flow
1. Triage proposes a minimal fix as a fenced patch (not applied to main).
2. `git worktree add -b loop-fix/<slug> ../lott0-fix-<slug> main`
3. Apply patch, then `npm install && npx prisma generate && npm run build && npm test`
4. Green → `delegate_task` a verifier (role leaf, read-only) with diff + STATE.md + AGENTS.md.
5. PASS → merge worktree (ff), delete worktree, update STATE.md. FAIL → delete worktree, record, escalate.

## Kill switch
- `hermes cron pause fec756ffd57f` · or `loop-pause-all: true` in STATE.md.
- Failed worktree: `git worktree remove --force ../lott0-fix-<slug>`.
