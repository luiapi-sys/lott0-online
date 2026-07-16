# safety.md — lott0.online Loop Engineering

## Week-one (L1) — report-only, always
- Loop reads repo, writes STATE.md / LOOP.md / loop-run-log.md.
- Must NOT edit source code, open PRs, merge, or `git push`.
- Output stays `--deliver local` until human explicitly trusts it.

## Human escalation path
- Cannot progress / out of scope → record in STATE.md High Priority, stop.

## Least privilege
- Triage skill: read + state-file write only. No deploy keys, no `--yolo`.

## Stall / no-progress (L2+)
- Before auto-fix: max iterations + consecutive-failure cap. Escalate on repeat.

## Kill switch
- `hermes cron pause fec756ffd57f` — pause without losing history.
- `loop-pause-all: true` in STATE.md — short-circuit (no side effects).

## Secrets
- Never commit `.env`. Rotate any credential that touched chat/log output.
