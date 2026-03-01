# Game-Theory Decision Framework for One Final Recommendation

Use this framework when the user asks for one decision instead of multiple scenario narratives.

## Inputs

1. States of nature with probabilities (downside/base/upside).
2. Alternatives (strategies) with payoffs by state.
3. Hard finance constraints:
- minimum `NPV_FCFF`
- minimum `NPV_FCFE`
- minimum `DSCR`
- minimum liquidity
- maximum debt-free year

## Decision logic

1. Filter out infeasible alternatives (hard constraints).
2. Compute expected payoff:
- `EV(a) = sum_s P(s) * payoff(a,s)`
3. Compute worst-case payoff:
- `WC(a) = min_s payoff(a,s)`
4. Compute minimax regret:
- `Regret(a,s) = max_i payoff(i,s) - payoff(a,s)`
- `MR(a) = max_s Regret(a,s)`
5. Normalize and aggregate:
- maximize `Score(a) = w_ev * EV_norm + w_wc * WC_norm + w_mr * (1 - MR_norm)`

## Why this works in finance management

1. EV captures value creation under the base probability mix.
2. Worst-case protects downside survivability.
3. Regret controls "missed upside" relative to the best competitor strategy in each state.
4. Hard constraints protect solvency and policy rules independent of score.

## Output standard

Always return:
1. One selected alternative.
2. Score margin versus the second-best feasible alternative.
3. Constraint pass/fail for all rejected options.
4. The exact policy weights used.

## Source references

- Von Neumann & Morgenstern (foundations of game theory)
  - https://press.princeton.edu/books/hardcover/9780691130613/theory-of-games-and-economic-behavior
- Yale Open Courses: Game Theory (conceptual grounding on strategies/payoffs)
  - https://oyc.yale.edu/economics/econ-159
- Corporate decision analysis and regret concepts in management science:
  - https://pubsonline.informs.org/journal/mnsc
