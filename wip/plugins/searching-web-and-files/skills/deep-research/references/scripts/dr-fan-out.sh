#!/bin/zsh
# dr-fan-out.sh — fire N parallel perplexity-cli queries for one facet axis,
# save raw outputs as datestamped artifacts, and emit a per-round manifest.
#
# Usage:
#   dr-fan-out.sh --workdir <path> --round N --phase <phase> --facet <axis> \
#                 --queries "q1||q2||q3||q4" \
#                 [--mode web|academic|sec] [--recency hour|day|week|month|year] \
#                 [--source-type perplexity] [--json]
#
# Notes:
#   - All scripts read run config from resources/<YYYYMMDD>-run-config.json,
#     never hard-coded.
#   - Queries are joined with `||` so multi-word queries don't need quoting.
#   - Subject-neutral; the topic is appended from run-config to each query
#     ONLY if --append-topic is set.

set -eu
set -o pipefail

JSON_OUT=0
WORKDIR=""
ROUND=""
PHASE=""
FACET=""
QUERIES=""
MODE="web"
RECENCY=""
SOURCE_TYPE="perplexity"
APPEND_TOPIC=0

die() {
  if [[ ${JSON_OUT} -eq 1 ]]; then
    printf '{"status":"error","error":%s}\n' "$(printf '%s' "$1" | python3 -c 'import json,sys;print(json.dumps(sys.stdin.read()))')"
  else
    print -u2 "dr-fan-out: error: $1"
  fi
  exit 1
}

while (( $# )); do
  case "$1" in
    --workdir) WORKDIR="$2"; shift 2 ;;
    --round) ROUND="$2"; shift 2 ;;
    --phase) PHASE="$2"; shift 2 ;;
    --facet) FACET="$2"; shift 2 ;;
    --queries) QUERIES="$2"; shift 2 ;;
    --mode) MODE="$2"; shift 2 ;;
    --recency) RECENCY="$2"; shift 2 ;;
    --source-type) SOURCE_TYPE="$2"; shift 2 ;;
    --append-topic) APPEND_TOPIC=1; shift ;;
    --json) JSON_OUT=1; shift ;;
    -h|--help)
      print "Usage: dr-fan-out.sh --workdir <path> --round N --phase <phase> --facet <axis> --queries 'q1||q2||q3||q4' [--mode web] [--recency week] [--source-type perplexity] [--append-topic] [--json]"
      exit 0
      ;;
    *) die "unknown flag: $1" ;;
  esac
done

[[ -z "${WORKDIR}" ]] && die "--workdir required"
[[ -z "${ROUND}" ]] && die "--round required"
[[ -z "${PHASE}" ]] && die "--phase required"
[[ -z "${FACET}" ]] && die "--facet required"
[[ -z "${QUERIES}" ]] && die "--queries required (use || as separator)"

RES_DIR="${WORKDIR}/resources"
[[ -d "${RES_DIR}" ]] || die "resources/ does not exist; run dr-init.sh first"

RUN_DATE="$(date -u +%Y%m%d)"
CONFIG_PATH="${RES_DIR}/${RUN_DATE}-run-config.json"
[[ -f "${CONFIG_PATH}" ]] || die "missing run-config: ${CONFIG_PATH}"

TOPIC="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["topic"])' "${CONFIG_PATH}")"
[[ -z "${TOPIC}" ]] && die "topic empty in run-config"

if ! command -v perplexity-cli >/dev/null 2>&1; then
  die "perplexity-cli not found in PATH"
fi

# Split queries by literal '||'
typeset -a QLIST
QLIST=("${(@s.||.)QUERIES}")
QCOUNT=${#QLIST[@]}
(( QCOUNT > 0 )) || die "no queries parsed from --queries"
(( QCOUNT <= 26 )) || die "fan-out limited to 26 queries (a-z)"

STARTED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
LETTERS=(a b c d e f g h i j k l m n o p q r s t u v w x y z)

slugify() {
  python3 -c '
import re, sys
s = sys.argv[1]
s = s.lower()
s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
print(s[:40] or "query")
' "$1"
}

typeset -a ARTIFACT_PATHS
typeset -a SUCCEEDED
typeset -a QUERY_PROMPTS
typeset -a SLUGS
typeset -a IDS

# Fire queries in parallel using zsh subshells; collect a single-line status
# token (ok|fail) into a status file. Logs and stderr go to a separate .log
# file so the status read is deterministic.
run_one() {
  local letter="$1"
  local prompt="$2"
  local slug="$3"
  local status_file="$4"
  local out="${RES_DIR}/${RUN_DATE}-r${ROUND}${letter}-${slug}.json"
  local final_prompt="${prompt}"
  if [[ ${APPEND_TOPIC} -eq 1 ]]; then
    final_prompt="${prompt} ${TOPIC}"
  fi
  local args=("search" "${final_prompt}")
  if [[ -n "${MODE}" && "${MODE}" != "web" ]]; then
    args+=("--mode" "${MODE}")
  fi
  if [[ -n "${RECENCY}" ]]; then
    args+=("--recency" "${RECENCY}")
  fi
  if perplexity-cli "${args[@]}" >"${out}" 2>"${out}.err"; then
    rm -f "${out}.err"
    print "ok" >"${status_file}"
  else
    print -u2 "dr-fan-out: query ${letter} failed; see ${out}.err"
    print "fail" >"${status_file}"
  fi
}

typeset -a JOB_PIDS
typeset -a JOB_OUTS
mkdir -p "${RES_DIR}/.dr-fan-out-tmp"
TMP_DIR="$(mktemp -d "${RES_DIR}/.dr-fan-out-tmp/${RUN_DATE}-r${ROUND}-XXXXXX")"

for ((i=1; i<=QCOUNT; i++)); do
  letter="${LETTERS[$i]}"
  prompt="${QLIST[$i]}"
  slug="$(slugify "${prompt}")"
  qid="r${ROUND}${letter}"
  IDS+=("${qid}")
  QUERY_PROMPTS+=("${prompt}")
  SLUGS+=("${slug}")
  ARTIFACT_PATHS+=("${RUN_DATE}-r${ROUND}${letter}-${slug}.json")

  status_file="${TMP_DIR}/${qid}.status"
  ( run_one "${letter}" "${prompt}" "${slug}" "${status_file}" ) &
  JOB_PIDS+=("$!")
  JOB_OUTS+=("${status_file}")
done

# Wait and collect outcomes
for ((i=1; i<=${#JOB_PIDS[@]}; i++)); do
  wait "${JOB_PIDS[$i]}" || true
  status_token="$(<"${JOB_OUTS[$i]}" 2>/dev/null)"
  status_token="${status_token%%[$'\n\r ']*}"
  if [[ "${status_token}" == "ok" ]]; then
    SUCCEEDED+=("true")
  else
    SUCCEEDED+=("false")
  fi
done

ENDED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

# Emit manifest.
MANIFEST_PATH="${RES_DIR}/${RUN_DATE}-r${ROUND}-manifest.json"

python3 - "${MANIFEST_PATH}" "${TOPIC}" "${RUN_DATE}" "${ROUND}" "${PHASE}" "${FACET}" \
  "${STARTED_AT}" "${ENDED_AT}" "${SOURCE_TYPE}" \
  "${(j:|:)IDS}" "${(j:|:)QUERY_PROMPTS}" "${(j:|:)ARTIFACT_PATHS}" "${(j:|:)SUCCEEDED}" <<'PY'
import json, sys, pathlib
(out_path, topic, run_date, round_, phase, facet, started, ended, source_type,
 ids_str, prompts_str, paths_str, succ_str) = sys.argv[1:14]
ids = ids_str.split("|") if ids_str else []
prompts = prompts_str.split("|") if prompts_str else []
paths = paths_str.split("|") if paths_str else []
succ = succ_str.split("|") if succ_str else []
queries = []
for i, qid in enumerate(ids):
    queries.append({
        "id": qid,
        "prompt": prompts[i] if i < len(prompts) else "",
        "source_type": source_type,
        "fired_at": started,
        "succeeded": succ[i] == "true" if i < len(succ) else False,
    })
artifacts = []
for i, qid in enumerate(ids):
    if i >= len(paths):
        continue
    artifacts.append({
        "path": paths[i],
        "kind": "raw_search",
        "linked_query_id": qid,
    })
manifest = {
    "schema_version": "1.0.0",
    "topic": topic,
    "run_date": run_date,
    "round": int(round_),
    "phase": phase,
    "facet_axis": facet,
    "queries": queries,
    "artifacts": artifacts,
    "gaps": [],
    "next_round_hints": [],
    "source_mix": [source_type],
    "started_at": started,
    "ended_at": ended,
    "early_stop_reason": "none",
    "notes": "Auto-generated by dr-fan-out.sh; operator should fill gaps[] and next_round_hints[] before validation."
}
pathlib.Path(out_path).write_text(json.dumps(manifest, indent=2) + "\n")
PY

rm -rf "${TMP_DIR}"

if [[ ${JSON_OUT} -eq 1 ]]; then
  python3 - "${MANIFEST_PATH}" "${(j:|:)ARTIFACT_PATHS}" <<'PY'
import json, sys
manifest_path, artifacts_str = sys.argv[1:3]
print(json.dumps({
    "status": "ok",
    "manifest": manifest_path,
    "artifacts": artifacts_str.split("|") if artifacts_str else [],
}))
PY
else
  print "dr-fan-out: ok"
  print "  manifest: ${MANIFEST_PATH}"
  print "  artifacts (${#ARTIFACT_PATHS[@]}):"
  for p in "${ARTIFACT_PATHS[@]}"; do
    print "    ${p}"
  done
fi
