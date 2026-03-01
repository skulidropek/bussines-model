# Financial Model Taxonomy

Use this taxonomy to choose the correct model architecture before implementing formulas.

## 1) Integrated 3-statement model
- Goal: baseline corporate forecasting and valuation.
- Core outputs: P&L, BS, CF, FCFF/FCFE, NPV/IRR.
- Typical use: investment decisions, capital planning, lender materials.

## 2) DCF valuation model
- Goal: estimate enterprise or equity value from discounted future cash flows.
- Core outputs: EV, equity value, sensitivities.
- Typical use: buy-side/sell-side valuation.

## 3) M&A merger model (accretion/dilution)
- Goal: post-transaction EPS and value impact.
- Core outputs: pro forma statements, synergy bridge, accretion/dilution.

## 4) LBO model
- Goal: sponsor returns under leveraged capital structure.
- Core outputs: debt schedule, covenant path, IRR/MOIC.

## 5) Project finance model
- Goal: non-recourse feasibility and debt capacity.
- Core outputs: DSCR/LLCR/PLCR, waterfall, sculpted debt.

## 6) Budget + rolling forecast model
- Goal: operating performance control and reforecasting.
- Core outputs: monthly/quarterly plan vs actual, driver-based forecasts.

## 7) Startup/runway model
- Goal: cash runway and fundraising timing.
- Core outputs: burn, runway, scenario-based hiring/revenue plans.

## 8) Real estate model
- Goal: property-level returns and financing viability.
- Core outputs: NOI, cap rate, levered/unlevered IRR.

## 9) Bank lending / covenant model
- Goal: credit risk and covenant headroom tracking.
- Core outputs: leverage/coverage tests, downside resilience.

## Decision rule for archetype selection

1. If TZ requires all three statements and accounting closure: choose integrated 3-statement as base.
2. If TZ is infrastructure/asset project with debt waterfall: choose project finance.
3. If TZ is transaction-specific (buyout/merger): choose LBO or M&A model.
4. If TZ is planning cadence and operational management: choose budget/forecast.

## Sources
- CFI: types of financial models
  - https://corporatefinanceinstitute.com/resources/financial-modeling/types-of-financial-model/
- Wall Street Prep: financial modeling overview
  - https://www.wallstreetprep.com/knowledge/financial-modeling/
- Damodaran (valuation lectures and materials)
  - https://pages.stern.nyu.edu/~adamodar/
