#!/usr/bin/env python3
"""
Extract machine-checkable requirement buckets from TZ text.

Usage:
  python3 extract_tz_requirements.py --input tz.txt --output requirements.json
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

KEYWORDS = {
    "must_build": [r"\bbuild\b", r"\bпостро", r"\bmodel\b", r"\bотчет"],
    "must_calculate": [r"\bcalculate\b", r"\bрассчит", r"\bnpv\b", r"\birr\b", r"\bfcff\b", r"\bfcfe\b"],
    "include": [r"\binclude\b", r"\bучесть\b", r"\bс учетом\b", r"\bдолжен\b"],
    "exclude": [r"\bexclude\b", r"\bпренебречь\b", r"\bне учитывать\b"],
    "timing_rules": [r"\bend of year\b", r"\bконце года\b", r"\bморатори\b", r"\bдо момента\b"],
}

RATE_RE = re.compile(r"(?P<label>[A-Za-zА-Яа-я\s%()/-]{2,80})[:\-\s]+(?P<rate>\d+[\.,]?\d*\s*%?)")
RATE_HINT_RE = re.compile(
    r"rate|ставк|tax|налог|discount|дисконт|interest|процент|inflation|инфляц",
    re.IGNORECASE,
)


def split_lines(text: str) -> list[str]:
    raw = []
    for line in text.splitlines():
        parts = [p.strip(" -\t\u2022") for p in re.split(r"[.;]", line)]
        raw.extend([p.strip() for p in parts if p.strip()])
    return raw


def classify(lines: list[str]) -> dict[str, list[str]]:
    out: dict[str, list[str]] = {k: [] for k in KEYWORDS}
    out["open_assumptions"] = []

    for ln in lines:
        lower = ln.lower()
        matched = False
        for bucket, patterns in KEYWORDS.items():
            if any(re.search(p, lower) for p in patterns):
                out[bucket].append(ln)
                matched = True
        if re.search(r"допущ|assumption|assume|по умолчанию", lower):
            out["open_assumptions"].append(ln)
        if not matched and re.search(r"npv|irr|fcf|cash|tax|налог|debt|кредит|дивид", lower):
            out["must_calculate"].append(ln)

    # de-duplicate preserving order
    for k in out:
        seen = set()
        uniq = []
        for x in out[k]:
            if x not in seen:
                uniq.append(x)
                seen.add(x)
        out[k] = uniq

    return out


def extract_rates(lines: list[str]) -> list[dict[str, str]]:
    rates = []
    for ln in lines:
        for m in RATE_RE.finditer(ln):
            label = m.group("label").strip()
            rate = m.group("rate").strip()
            is_percent = "%" in rate
            has_hint = bool(RATE_HINT_RE.search(label) or RATE_HINT_RE.search(ln))
            numeric_value = float(rate.replace("%", "").replace(",", ".").strip())

            # Reject obvious year captures unless there is a rate hint.
            looks_like_year = 1900 <= numeric_value <= 2200 and not is_percent
            if looks_like_year and not has_hint:
                continue

            # Keep only rate-like values: percentages or lines with rate/tax/discount hints.
            if is_percent or has_hint:
                rates.append({"label": label, "rate": rate, "source": ln})
    return rates


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="Path to TZ text file")
    parser.add_argument("--output", required=True, help="Path to output JSON")
    args = parser.parse_args()

    text = Path(args.input).read_text(encoding="utf-8")
    lines = split_lines(text)
    buckets = classify(lines)
    rates = extract_rates(lines)

    payload = {
        "source_file": str(Path(args.input)),
        "line_count": len(lines),
        "requirements": buckets,
        "explicit_rates": rates,
    }

    out_path = Path(args.output)
    out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main()
