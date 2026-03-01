# Assumptions for "Задача для ИИ 2"

- `Discount rate`: 15% annual.
- `Horizon`: 5 years (`t0..t5`).
- `Timing`: CAPEX at `t0`; operating effect in annual periods `t1..t5`.
- `Cash-flow granularity`: source inputs are monthly, valuation is annual (`monthly * 12`).
- `Taxes`: not modeled (not provided in TZ).
- `Inflation/indexation`: not modeled (not provided in TZ).
- `Depreciation/salvage value`: not modeled (not provided in TZ).
- `Financing structure`: unlevered project economics only.
- `Decision rule`: accept if `NPV > 0` and `IRR > discount rate`.

## Sensitivity design

- `Price sensitivity` (one-way, fixed interval): 180, 190, 200, 210, 215, 220 RUB/L.
- `Interval sensitivity` (one-way, fixed price): 1.75, 1.90, 2.00, 2.10, 2.15, 2.25 replacements/month.
- `Tornado`: low/high pairs selected to keep IRR defined on both ends:
  - price: 180 vs 215
  - interval: 1.75 vs 2.15
