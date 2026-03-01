---
name: finance-model-e2e
description: Use this skill when a user asks to build, audit, or fix any financial model from a technical specification (TZ). It enforces requirement traceability, explicit assumptions, independent FCFF/FCFE recalculation, hard quality gates, and end-to-end delivery checks.
---

# Finance Model E2E

## When to use

Use this skill if the task includes any of:
- build or rebuild a financial model from a TZ/spec
- verify whether model calculations match TZ
- resolve metric mismatches (FCFF/FCFE/NPV/IRR)
- produce a defensible finance output (model + controls + presentation)

## Non-negotiable workflow

Run this workflow in order. Do not skip gates.

1. Parse TZ into machine-checkable requirements
- Run `scripts/extract_tz_requirements.py` on the TZ text.
- Produce `requirements.json` with include/exclude/timing/rates/open assumptions.

2. Build traceability matrix first
- Run `scripts/generate_traceability.py`.
- Every requirement must map to model location(s) before final output.
- Unmapped requirement means hard fail.

3. Select model archetype
- Read `references/model-taxonomy.md`.
- Pick one archetype and document why.

4. Lock assumptions explicitly
- Create assumptions block in model and report:
  - tax base (EBIT or EBT)
  - discount timing (t0 or t1)
  - day count (365/360)
  - debt interest timing and repayment waterfall
- If TZ is ambiguous, do not guess silently. Record assumption and sensitivity impact.

5. Build model with required controls
- Use layout from `references/model-blueprints.md`.
- Required controls:
  - balance identity
  - cash bridge identity
  - dividend lock while debt > 0
  - formula integrity (#REF scan)

6. Run independent recalculation
- Configure `scripts/recalc_fcff_fcfe.py` with row mappings.
- Compare model metrics against independent engine.
- Tolerance default: 0.1% for NPV/IRR and 1 unit for identity checks.

7. Validate hard gates
- Run `scripts/validate_model.py`.
- Any failed gate means no final recommendation.

8. Produce one final decision (game-theory policy)
- Run `scripts/decide_recommendation.py` with decision matrix and policy.
- Use hard constraints first, then EV + worst-case + minimax regret scoring.
- Final output must contain only one selected recommendation.

9. End-to-end delivery check
- If there is a presentation/app output, verify displayed metrics match source-of-truth metrics JSON.
- Use MCP Playwright for UI checks.

## Hard fail conditions

Stop and mark result as not accepted if any is true:
- a TZ requirement is not mapped
- tax logic is implicit or contradictory
- FCFF/FCFE definition is not explicit
- discount timing not explicit
- controls fail (`balance`, `cash bridge`, `dividend lock`)
- independent recalc deviates above tolerance

## Required final artifacts

1. `requirements.json`
2. `traceability.csv`
3. `assumptions.md` (or assumptions section in report)
4. `validation_report.json`
5. `metric_reconciliation.json`
6. `decision_report.json` with one recommendation only
7. final recommendation with explicit confidence and open risks

## Script quickstart

```bash
python3 scripts/extract_tz_requirements.py --input tz.txt --output requirements.json
python3 scripts/generate_traceability.py --requirements requirements.json --output traceability.csv
python3 scripts/recalc_fcff_fcfe.py --workbook model.xlsx --config mappings.json --output metric_reconciliation.json
python3 scripts/validate_model.py --workbook model.xlsx --config validation_config.json --output validation_report.json
python3 scripts/decide_recommendation.py --matrix decision_matrix.json --policy decision_policy.json --output decision_report.json
```

## Reporting standard

Always report:
- chosen FCFF/FCFE formulas
- tax base and timing assumptions
- exact reason for any mismatch (numeric bridge)
- pass/fail by gate
- one final decision only after all gates pass
- score margin and hard-constraint status for non-selected options

For deeper guidance, read:
- `references/best-practices.md`
- `references/qa-checklist.md`
- `references/model-taxonomy.md`
- `references/model-blueprints.md`
- `references/game-theory-decision-framework.md`
