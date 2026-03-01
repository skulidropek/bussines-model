# Final Recommendation — Задача для ИИ 2

## Decision

**BUY_LAB**

## Scenario comparison (formula-driven)

- `Scenario 1 (Base)`: NPV **9,624,223.65 RUB**, IRR **44.39%**, DPP **2.41 years** -> **ПРИНИМАТЬ**
- `Scenario 2 (Conservative)`: NPV **-1,639,017.48 RUB**, IRR **9.32%**, DPP **6.20 years** -> **ОТКЛОНИТЬ**
- `Delta (2-1)`: NPV **-11,263,241.13 RUB**, IRR **-35.07 p.p.**, DPP **+3.79 years**

## Confidence

- Robust score margin vs runner-up: **0.80**
- Winner score: **0.90**
- Runner-up score: **0.10**

## Quality gates

- Requirement traceability: **complete** (`traceability.csv`, no unmapped rows).
- Formula integrity (`#REF!` scan): **PASS**.
- Controls (`balance_identity`, `cash_bridge`, `dividend_lock_status`): **PASS**.
- Independent FCFF/FCFE reconciliation: **PASS**, deviation = **0.00%**.

## Open risks

- Conservative scenario turns economics negative due to simultaneous deterioration in oil price and replacement interval.
- Execution risk remains concentrated in operational discipline of interval management and procurement price control.
