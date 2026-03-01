# Assumptions for "Задача для ИИ 2"

- `Discount rate`: 15% annual.
- `Horizon`: 5 years (`t0..t5`).
- `Timing`: CAPEX at `t0`; operating effect in annual periods `t1..t5`.
- `Cash-flow granularity`: source inputs are monthly, valuation is annual (`monthly * 12`).
- `VAT handling`: VAT is **not modeled**; CAPEX is converted to ex-VAT value (`15,000,000 / 1.2 = 12,500,000 RUB`).
- `Taxes`: not modeled (not provided in TZ).
- `Inflation/indexation`: not modeled (not provided in TZ).
- `Depreciation/salvage value`: not modeled (not provided in TZ).

## Scenario settings

- `Scenario 1 (Base)`: `price_project = 200`, `freq_project = 2.0`.
- `Scenario 2 (Conservative)`: `price_project = 200 * (1 + 5%) = 210`, `freq_project = 2.0 + 0.1 = 2.1`.
- Scenario comparison is built in-sheet with formulas and delta columns.

## Sensitivity design

- `Price sensitivity` (one-way, fixed interval): 180, 190, 200, 210, 215, 220 RUB/L.
- `Interval sensitivity` (one-way, fixed price): 1.75, 1.90, 2.00, 2.10, 2.15, 2.25 replacements/month.
- `Tornado`: low/high pairs selected to keep IRR defined on both ends:
  - price: 180 vs 215
  - interval: 1.75 vs 2.15
