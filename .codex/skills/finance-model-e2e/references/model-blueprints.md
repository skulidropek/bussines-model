# Model Blueprints

## Blueprint A: Exam / single-sheet mode

Use when TZ requires all calculations on one worksheet.

1. Inputs and explicit assumptions
2. Operational drivers
3. Taxes
4. Working capital
5. Capex and commissioning (including CIP if needed)
6. Debt waterfall and financing policy
7. P&L
8. Balance sheet
9. Cash flow statement
10. FCFF/FCFE and valuation metrics
11. Controls and final recommendation

### Naming convention
- Prefix rows with block tags where possible: `IN_`, `OP_`, `TX_`, `WC_`, `DEBT_`, `PL_`, `BS_`, `CF_`, `VAL_`, `CTRL_`.

## Blueprint B: Production multi-sheet mode

1. `00_Index`
2. `01_Inputs`
3. `02_Assumptions`
4. `03_Drivers`
5. `04_Taxes`
6. `05_Financing`
7. `06_PnL`
8. `07_BalanceSheet`
9. `08_CashFlow`
10. `09_Valuation`
11. `10_Controls`
12. `11_Traceability`
13. `12_Outputs`

## Required outputs

- FCFF series
- FCFE series
- NPV and IRR for both definitions
- debt repayment year (if debt is present)
- final accept/reject decision

## Required controls

- `BS_Check = Assets - (Liabilities + Equity)` should be 0
- `Cash_Check = Cash_t - Cash_t-1 - NetCF` should be 0
- `Dividend_Lock_Check` should not allow dividends while debt > 0
- `Formula_Error_Check` should indicate no formula integrity errors

## Typical pitfalls

1. Tax base ambiguity (EBIT vs EBT)
2. Mixing t0 and t1 discounting in one model
3. Working-capital sign mistakes in CF statement
4. Debt interest calculated on inconsistent balance point
5. Unit mismatch (base currency vs thousands)
