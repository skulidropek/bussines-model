# Financial Model QA Checklist

Use this checklist before declaring model completion.

## 1. TZ mapping and assumptions

- [ ] Every explicit TZ requirement exists in `traceability.csv`.
- [ ] Every excluded item has a TZ-based reason.
- [ ] Tax base is explicit (EBIT or EBT) and documented.
- [ ] Discount timing is explicit (t0 or t1) and documented.
- [ ] Day-count convention is explicit (365/360).

## 2. Formula integrity

- [ ] No `#REF!` errors.
- [ ] No circular references unless explicitly intended and controlled.
- [ ] Inputs are not hard-coded inside complex formulas.
- [ ] Unit consistency is preserved (e.g., rub vs thousand rub).

## 3. Accounting closure

- [ ] Balance sheet closes every period.
- [ ] Retained earnings roll-forward reconciles to net income and dividends.
- [ ] Working capital movements reconcile to CF statement.

## 4. Cash-flow closure

- [ ] `Delta Cash == CFO + CFI + CFF` every period.
- [ ] Interest timing matches debt balance definition.
- [ ] Debt draw/repay signs are consistent across statements.

## 5. Financing policy and restrictions

- [ ] Dividend lock while debt > 0 is enforced.
- [ ] Covenant constraints are checked if applicable.
- [ ] Debt never becomes negative due to formula artifacts.

## 6. Valuation consistency

- [ ] FCFF formula is defined and consistent across periods.
- [ ] FCFE formula is defined and consistent across periods.
- [ ] Discount rate is matched to cash flow type.
- [ ] Terminal value assumptions (if used) are documented and tested.

## 7. Independent recalc and reconciliation

- [ ] Independent engine reproduces FCFF/FCFE series.
- [ ] NPV/IRR differences are within tolerance.
- [ ] Any residual difference has a numeric bridge and root cause.

## 8. Delivery quality

- [ ] Final recommendation is derived only after all gates pass.
- [ ] Presentation numbers match source-of-truth metrics.
- [ ] Risks and assumptions are disclosed in final summary.
