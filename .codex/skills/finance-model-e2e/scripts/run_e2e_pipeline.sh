#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 6 ]]; then
  echo "Usage: $0 <tz.txt> <model.xlsx> <mappings.json> <validation_config.json> <requirements.json> <traceability.csv> [decision_matrix.json decision_policy.json]"
  exit 1
fi

TZ_FILE="$1"
MODEL_FILE="$2"
MAPPINGS_FILE="$3"
VALIDATION_FILE="$4"
REQ_OUT="$5"
TRACE_OUT="$6"
DECISION_MATRIX="${7:-}"
DECISION_POLICY="${8:-}"

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

python3 "$ROOT_DIR/scripts/extract_tz_requirements.py" --input "$TZ_FILE" --output "$REQ_OUT"
python3 "$ROOT_DIR/scripts/generate_traceability.py" --requirements "$REQ_OUT" --output "$TRACE_OUT"
python3 "$ROOT_DIR/scripts/recalc_fcff_fcfe.py" --workbook "$MODEL_FILE" --config "$MAPPINGS_FILE" --output metric_reconciliation.json
python3 "$ROOT_DIR/scripts/validate_model.py" --workbook "$MODEL_FILE" --config "$VALIDATION_FILE" --output validation_report.json

if [[ -n "$DECISION_MATRIX" && -n "$DECISION_POLICY" ]]; then
  python3 "$ROOT_DIR/scripts/decide_recommendation.py" --matrix "$DECISION_MATRIX" --policy "$DECISION_POLICY" --output decision_report.json
fi

echo "E2E pipeline completed. Outputs:"
echo "- $REQ_OUT"
echo "- $TRACE_OUT"
echo "- metric_reconciliation.json"
echo "- validation_report.json"
if [[ -n "$DECISION_MATRIX" && -n "$DECISION_POLICY" ]]; then
  echo "- decision_report.json"
fi
