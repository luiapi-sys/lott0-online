# loop-budget.md — Token / Cost Budget (L2+ gate)

Placeholder until auto-fix is enabled.

## Current (L1, report-only)
- Pattern: daily-triage · Level: L1 · Cadence: 1d (Mon–Fri)
- Est. tokens/run: TBD (`npx @cobusgreyling/loop-cost --pattern daily-triage --level L1 --cadence 1d`)
- Circuit breaker: not armed (no auto-fix yet)

## Before L2
- [ ] Run `loop-cost` for the fix-capable pattern
- [ ] Set max iterations / consecutive-failure cap
- [ ] Wire `loop-guard` / `loop-context --check`
