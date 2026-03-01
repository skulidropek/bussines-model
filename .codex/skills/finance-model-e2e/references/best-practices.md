# Best Practices from Finance Leaders and Standards

This file captures high-confidence practices that reduce financial-model errors.

## A) Governance and spreadsheet discipline

1. Use a standard methodology for model design/build/review.
- Rationale: prevents ad-hoc logic and hidden assumptions.
- Source: ICAEW Twenty Principles (principles 2, 9, 11, 18, 19, 20).

2. Build controls from the start, not at the end.
- Required controls: arithmetic identities, warning flags, reconciliation sheets.
- Source: ICAEW principle 17.

3. Keep formulas simple, consistent, and avoid hard-coded constants in formulas.
- Source: ICAEW principles 12, 13, 14.

4. Enforce structure: clear input -> process -> output flow.
- Source: ICAEW principle 9.

5. Adopt FAST-style model readability and transparency.
- Flexible, Appropriate, Structured, Transparent.
- Source: FAST Standard.

## B) Finance-manager operating model (FP&A)

1. Use probability-weighted scenarios for volatile environments.
- Source: McKinsey FP&A practices for volatile environments.

2. Focus planning on forward-looking cash outcomes under uncertainty.
- Source: McKinsey CFO downturn guidance.

3. Use rolling re-forecast and faster scenario loops when annual budgets become stale.
- Source: McKinsey just-in-time budgeting / scenario planning guidance.

4. Improve spend visibility and reallocation speed; do not optimize static budgets only.
- Source: McKinsey SG&A and zero-based productivity insights.

## C) Cash-flow and valuation consistency

1. Match discount rate with cash-flow definition.
- FCFF -> WACC.
- FCFE -> cost of equity.
- Source: Wall Street Prep cost-of-capital guidance; CFA refresher.

2. Keep FCFF/FCFE definitions explicit and stable through the file.
- Source: CFA free cash flow valuation reading; CFI FCFF definition.

3. Define tax base explicitly.
- Typical corporate modeling uses taxes on EBT for equity cash-flow consistency.
- If TZ is ambiguous, declare assumption and quantify impact.

4. Disclose timing convention explicitly.
- t0 vs t1 discounting can materially shift NPV.

## D) Three mandatory quality gates for any model

1. Accounting closure gate
- BS identity and retained earnings roll-forward must pass.

2. Cash-flow closure gate
- Delta cash equals CFO + CFI + CFF.

3. Financing policy gate
- Dividend lock logic, debt waterfall, covenant tests, and interest timing must pass.

## Sources

- ICAEW: Twenty principles for good spreadsheet practice (2024)
  - https://www.icaew.com/technical/technology/excel-community/20-principles-for-good-spreadsheet-practice-2024-edition
- FAST Standard
  - https://www.fast-standard.org/
- IFRS IAS 7 Statement of Cash Flows
  - https://www.ifrs.org/issued-standards/list-of-standards/ias-7-statement-of-cash-flows/
- McKinsey advanced FP&A practices (scenario probabilities)
  - https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/advanced-fp-and-a-practices-for-a-volatile-macroeconomic-and-business-environment
- McKinsey CFO crisis planning (cash and scenarios)
  - https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/the-cfos-role-in-navigating-the-downturn
- McKinsey just-in-time budgeting
  - https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/just-in-time-budgeting-for-a-volatile-economy
- Wall Street Prep cost of capital alignment
  - https://www.wallstreetprep.com/knowledge/cost-of-capital/
- CFA Institute free cash flow valuation
  - https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/free-cash-flow-valuation
- CFI FCFF definition
  - https://corporatefinanceinstitute.com/resources/financial-modeling/free-cash-flow-to-firm-fcff/
