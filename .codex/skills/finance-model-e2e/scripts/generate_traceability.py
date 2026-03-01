#!/usr/bin/env python3
"""
Generate a traceability CSV template from extracted requirements.

Usage:
  python3 generate_traceability.py --requirements requirements.json --output traceability.csv
"""

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path


def flatten_requirements(payload: dict) -> list[tuple[str, str]]:
    reqs = []
    buckets = payload.get("requirements", {})
    for bucket, items in buckets.items():
        for item in items:
            reqs.append((bucket, item))
    return reqs


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--requirements", required=True, help="Path to requirements.json")
    parser.add_argument("--output", required=True, help="Path to output CSV")
    args = parser.parse_args()

    payload = json.loads(Path(args.requirements).read_text(encoding="utf-8"))
    reqs = flatten_requirements(payload)

    out = Path(args.output)
    with out.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow([
            "req_id",
            "bucket",
            "requirement_text",
            "status",
            "model_location",
            "formula_or_logic",
            "validation_check",
            "notes",
        ])
        for i, (bucket, text) in enumerate(reqs, start=1):
            w.writerow([
                f"REQ-{i:03d}",
                bucket,
                text,
                "unmapped",
                "",
                "",
                "",
                "",
            ])

    print(f"Wrote {out} with {len(reqs)} rows")


if __name__ == "__main__":
    main()
