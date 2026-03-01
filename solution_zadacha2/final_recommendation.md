# Final Recommendation — Задача для ИИ 2

## Decision

**BUY_LAB**

## Confidence

- Robust score margin vs runner-up: **0.80**
- Winner score: **0.90**
- Runner-up score: **0.10**

## Base-case economics

- `NPV (15%, 5 years)`: **7,124,223.65 RUB**
- `IRR`: **33.70%**
- `DPP`: **2.98 years**

## Quality gates

- Requirement traceability: **complete** (`traceability.csv`, no unmapped rows).
- Formula integrity (`#REF!` scan): **PASS**.
- Controls (`balance_identity`, `cash_bridge`, `dividend_lock_status`): **PASS**.
- Independent FCFF/FCFE reconciliation: **PASS**, deviation = **0.00%**.

## Open risks

- Downside scenario (higher oil price + weaker interval effect) yields negative NPV.
- Practical execution risk is concentrated in achieving target replacement interval and procurement price discipline.
- Model excludes taxes/inflation/depreciation due missing TZ data; this should be revisited if investment memo requires accounting-grade detail.
