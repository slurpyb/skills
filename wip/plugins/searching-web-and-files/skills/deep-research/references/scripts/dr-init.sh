#!/bin/zsh
# dr-init.sh — bootstrap a deep-research run.
# Subject-neutral. Reads no hard-coded topic; everything from CLI flags.
#
# Usage:
#   dr-init.sh --topic "<topic>" --workdir "<path>" \
#              [--depth-budget 6] [--sources perplexity,exa,octocode,...] \
#              [--axes orientation,core_mechanics,...] [--json]
#
# Output:
#   resources/<YYYYMMDD>-run-config.json
#   resources/<YYYYMMDD>-r0-manifest.json (Phase 0 manifest seed)
#
# Honors --json for machine-readable status.

set -eu
set -o pipefail

JSON_OUT=0
TOPIC=""
WORKDIR=""
DEPTH_BUDGET=6
SOURCES_DEFAULT="perplexity,exa,octocode,vendor_docs"
SOURCES=""
AXES_DEFAULT="orientation,core_mechanics,interfaces,lifecycle,operational,failure_modes,ecosystem_neighbors,authoritative_sources,version_skew,gotchas"
AXES=""

die() {
  if [[ ${JSON_OUT} -eq 1 ]]; then
    printf '{"status":"error","error":%s}\n' "$(printf '%s' "$1" | python3 -c 'import json,sys;print(json.dumps(sys.stdin.read()))')"
  else
    print -u2 "dr-init: error: $1"
  fi
  exit 1
}

while (( $# )); do
  case "$1" in
    --topic) TOPIC="$2"; shift 2 ;;
    --workdir) WORKDIR="$2"; shift 2 ;;
    --depth-budget) DEPTH_BUDGET="$2"; shift 2 ;;
    --sources) SOURCES="$2"; shift 2 ;;
    --axes) AXES="$2"; shift 2 ;;
    --json) JSON_OUT=1; shift ;;
    -h|--help)
      print "Usage: dr-init.sh --topic '<topic>' --workdir '<path>' [--depth-budget N] [--sources csv] [--axes csv] [--json]"
      exit 0
      ;;
    *) die "unknown flag: $1" ;;
  esac
done

[[ -z "${TOPIC}" ]]   && die "--topic required"
[[ -z "${WORKDIR}" ]] && die "--workdir required"

[[ -z "${SOURCES}" ]] && SOURCES="${SOURCES_DEFAULT}"
[[ -z "${AXES}" ]]    && AXES="${AXES_DEFAULT}"

RUN_DATE="$(date -u +%Y%m%d)"
STARTED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
RES_DIR="${WORKDIR}/resources"
mkdir -p "${RES_DIR}"

CONFIG_PATH="${RES_DIR}/${RUN_DATE}-run-config.json"
R0_PATH="${RES_DIR}/${RUN_DATE}-r0-manifest.json"

if [[ -f "${CONFIG_PATH}" ]]; then
  die "run-config already exists for today: ${CONFIG_PATH} (datestamped artifacts are append-only)"
fi

# CSV → JSON array via python (portable, escape-safe).
CSV_TO_JSON() {
  local csv="$1"
  python3 -c '
import json, sys
csv = sys.argv[1]
items = [s.strip() for s in csv.split(",") if s.strip()]
print(json.dumps(items))
' "${csv}"
}

SOURCES_JSON="$(CSV_TO_JSON "${SOURCES}")"
AXES_JSON="$(CSV_TO_JSON "${AXES}")"

python3 - "${CONFIG_PATH}" "${TOPIC}" "${RUN_DATE}" "${STARTED_AT}" "${DEPTH_BUDGET}" "${SOURCES_JSON}" "${AXES_JSON}" <<'PY'
import json, sys, pathlib
out_path, topic, run_date, started_at, depth_budget, sources_json, axes_json = sys.argv[1:8]
config = {
    "schema_version": "1.0.0",
    "topic": topic,
    "run_date": run_date,
    "started_at": started_at,
    "depth_budget": int(depth_budget),
    "source_allowlist": json.loads(sources_json),
    "facet_axes": json.loads(axes_json),
    "operator_notes": "",
}
pathlib.Path(out_path).write_text(json.dumps(config, indent=2) + "\n")
PY

python3 - "${R0_PATH}" "${TOPIC}" "${RUN_DATE}" "${STARTED_AT}" "${SOURCES_JSON}" "${CONFIG_PATH}" <<'PY'
import json, sys, pathlib, datetime
out_path, topic, run_date, started_at, sources_json, config_path = sys.argv[1:7]
ended_at = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
manifest = {
    "schema_version": "1.0.0",
    "topic": topic,
    "run_date": run_date,
    "round": 0,
    "phase": "scope",
    "facet_axis": "meta",
    "queries": [],
    "artifacts": [
        {"path": pathlib.Path(config_path).name, "kind": "run_config"}
    ],
    "gaps": [],
    "next_round_hints": [],
    "source_mix": json.loads(sources_json),
    "started_at": started_at,
    "ended_at": ended_at,
    "early_stop_reason": "none",
    "notes": "Phase 0 scope manifest. Operator should add facet-axis confidence notes."
}
pathlib.Path(out_path).write_text(json.dumps(manifest, indent=2) + "\n")
PY

if [[ ${JSON_OUT} -eq 1 ]]; then
  python3 -c '
import json, sys
print(json.dumps({
    "status": "ok",
    "run_date": sys.argv[1],
    "config_path": sys.argv[2],
    "round0_manifest": sys.argv[3]
}))
' "${RUN_DATE}" "${CONFIG_PATH}" "${R0_PATH}"
else
  print "dr-init: ok"
  print "  run_date:        ${RUN_DATE}"
  print "  config:          ${CONFIG_PATH}"
  print "  round0 manifest: ${R0_PATH}"
fi
