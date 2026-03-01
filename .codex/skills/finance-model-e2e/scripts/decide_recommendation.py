#!/usr/bin/env python3
"""
Choose one final recommendation using a game-theory decision policy.

Usage:
  python3 decide_recommendation.py \
    --matrix decision_matrix.json \
    --policy decision_policy.json \
    --output decision_report.json
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def normalize(values: list[float]) -> list[float]:
    lo = min(values)
    hi = max(values)
    if abs(hi - lo) < 1e-12:
        return [1.0 for _ in values]
    return [(v - lo) / (hi - lo) for v in values]


def validate_probabilities(states: list[dict]) -> None:
    total = sum(float(s["probability"]) for s in states)
    if abs(total - 1.0) > 1e-6:
        raise ValueError(f"State probabilities must sum to 1.0, got {total}")


def check_constraints(alt: dict, hard: dict) -> tuple[bool, list[str]]:
    """
    Generic threshold checks. All keys in hard policy are optional.
    Supported keys:
      min_npv_fcff, min_npv_fcfe, min_dscr, min_liquidity, max_payback_year
    """
    metrics = alt.get("metrics", {})
    fails = []

    def metric(key: str, default: float | int | None = None):
        return metrics.get(key, default)

    if "min_npv_fcff" in hard and float(metric("npv_fcff", -1e30)) < float(hard["min_npv_fcff"]):
        fails.append("npv_fcff_below_threshold")
    if "min_npv_fcfe" in hard and float(metric("npv_fcfe", -1e30)) < float(hard["min_npv_fcfe"]):
        fails.append("npv_fcfe_below_threshold")
    if "min_dscr" in hard and float(metric("dscr_min", -1e30)) < float(hard["min_dscr"]):
        fails.append("dscr_below_threshold")
    if "min_liquidity" in hard and float(metric("liquidity_min", -1e30)) < float(hard["min_liquidity"]):
        fails.append("liquidity_below_threshold")
    if "max_payback_year" in hard and float(metric("debt_free_year", 1e30)) > float(hard["max_payback_year"]):
        fails.append("payback_too_late")

    return (len(fails) == 0, fails)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--matrix", required=True, help="Path to decision matrix JSON")
    parser.add_argument("--policy", required=True, help="Path to decision policy JSON")
    parser.add_argument("--output", required=True, help="Path to output report JSON")
    args = parser.parse_args()

    matrix = json.loads(Path(args.matrix).read_text(encoding="utf-8"))
    policy = json.loads(Path(args.policy).read_text(encoding="utf-8"))

    states = matrix["states"]
    alternatives = matrix["alternatives"]
    validate_probabilities(states)

    state_names = [s["name"] for s in states]
    probs = {s["name"]: float(s["probability"]) for s in states}
    hard = policy.get("hard_constraints", {})
    weights = policy.get("weights", {"expected_value": 0.5, "worst_case": 0.3, "minimax_regret": 0.2})

    # Pre-compute maximum payoff in each state for regret calculations.
    max_state_payoff: dict[str, float] = {}
    for st in state_names:
        max_state_payoff[st] = max(float(a["payoffs"][st]) for a in alternatives)

    scored = []
    for alt in alternatives:
        name = alt["name"]
        payoffs = {k: float(v) for k, v in alt["payoffs"].items()}

        # Ensure payoff coverage.
        missing_states = [s for s in state_names if s not in payoffs]
        if missing_states:
            raise ValueError(f"Alternative {name} misses states: {missing_states}")

        expected_value = sum(payoffs[s] * probs[s] for s in state_names)
        worst_case = min(payoffs[s] for s in state_names)
        regrets = {s: max_state_payoff[s] - payoffs[s] for s in state_names}
        max_regret = max(regrets.values())

        feasible, fail_reasons = check_constraints(alt, hard)
        scored.append(
            {
                "name": name,
                "expected_value": expected_value,
                "worst_case": worst_case,
                "max_regret": max_regret,
                "regrets": regrets,
                "feasible": feasible,
                "constraint_fail_reasons": fail_reasons,
                "metrics": alt.get("metrics", {}),
            }
        )

    feasible_rows = [r for r in scored if r["feasible"]]
    if not feasible_rows:
        payload = {
            "recommended": None,
            "status": "hard_fail",
            "reason": "No feasible alternatives after hard constraints",
            "alternatives": scored,
        }
        Path(args.output).write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        raise SystemExit(4)

    ev_norm = normalize([r["expected_value"] for r in feasible_rows])
    wc_norm = normalize([r["worst_case"] for r in feasible_rows])
    # Lower regret is better, so normalize negative regret.
    rg_norm = normalize([-r["max_regret"] for r in feasible_rows])

    for i, row in enumerate(feasible_rows):
        score = (
            float(weights.get("expected_value", 0.5)) * ev_norm[i]
            + float(weights.get("worst_case", 0.3)) * wc_norm[i]
            + float(weights.get("minimax_regret", 0.2)) * rg_norm[i]
        )
        row["robust_score"] = score

    feasible_rows.sort(key=lambda x: x["robust_score"], reverse=True)
    winner = feasible_rows[0]
    second_score = feasible_rows[1]["robust_score"] if len(feasible_rows) > 1 else winner["robust_score"]
    margin = winner["robust_score"] - second_score

    payload = {
        "status": "ok",
        "recommended": winner["name"],
        "confidence": {
            "score_margin_vs_second": margin,
            "winner_score": winner["robust_score"],
            "runner_up_score": second_score,
        },
        "weights": weights,
        "hard_constraints": hard,
        "alternatives": scored,
        "feasible_ranked": feasible_rows,
    }

    out = Path(args.output)
    out.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {out}; recommended={winner['name']}")


if __name__ == "__main__":
    main()
