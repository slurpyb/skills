#!/bin/zsh
# dr-fetch-authoritative.sh — fetch authoritative raw content (vendor docs,
# GitHub raw, registry APIs, RFCs) into resources/ with consistent naming.
#
# Usage:
#   dr-fetch-authoritative.sh --workdir <path> --round 5 \
#                             --urls "url1||url2||url3" \
#                             [--source-type vendor_docs|registry|rfc_spec|other] \
#                             [--format md|json|html|raw] \
#                             [--json]
#
# Each URL becomes:
#   <YYYYMMDD>-r{round}-auth-{host}-{slug}.<ext>
#
# Manifest is written to <YYYYMMDD>-r{round}-manifest.json (atomic; if a
# manifest already exists for this round, the script appends the new
# artifacts under back_fill[]).

set -eu
set -o pipefail

JSON_OUT=0
WORKDIR=""
ROUND=""
URLS=""
SOURCE_TYPE="vendor_docs"
FORMAT="md"

die() {
  if [[ ${JSON_OUT} -eq 1 ]]; then
    printf '{"status":"error","error":%s}\n' "$(printf '%s' "$1" | python3 -c 'import json,sys;print(json.dumps(sys.stdin.read()))')"
  else
    print -u2 "dr-fetch-authoritative: error: $1"
  fi
  exit 1
}

while (( $# )); do
  case "$1" in
    --workdir) WORKDIR="$2"; shift 2 ;;
    --round) ROUND="$2"; shift 2 ;;
    --urls) URLS="$2"; shift 2 ;;
    --source-type) SOURCE_TYPE="$2"; shift 2 ;;
    --format) FORMAT="$2"; shift 2 ;;
    --json) JSON_OUT=1; shift ;;
    -h|--help)
      print "Usage: dr-fetch-authoritative.sh --workdir <path> --round 5 --urls 'u1||u2' [--source-type vendor_docs] [--format md] [--json]"
      exit 0
      ;;
    *) die "unknown flag: $1" ;;
  esac
done

[[ -z "${WORKDIR}" ]] && die "--workdir required"
[[ -z "${ROUND}" ]]   && die "--round required"
[[ -z "${URLS}" ]]    && die "--urls required (use || as separator)"

case "${FORMAT}" in
  md|json|html|raw) ;;
  *) die "--format must be md|json|html|raw" ;;
esac

RES_DIR="${WORKDIR}/resources"
[[ -d "${RES_DIR}" ]] || die "resources/ does not exist; run dr-init.sh first"
RUN_DATE="$(date -u +%Y%m%d)"
CONFIG_PATH="${RES_DIR}/${RUN_DATE}-run-config.json"
[[ -f "${CONFIG_PATH}" ]] || die "missing run-config: ${CONFIG_PATH}"

TOPIC="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["topic"])' "${CONFIG_PATH}")"

if ! command -v curl >/dev/null 2>&1; then
  die "curl not found in PATH"
fi

typeset -a ULIST
ULIST=("${(@s.||.)URLS}")
(( ${#ULIST[@]} > 0 )) || die "no urls parsed"

slugify() {
  python3 -c '
import re, sys
s = sys.argv[1].lower()
s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
print(s[:40] or "page")
' "$1"
}

host_of() {
  python3 -c '
import sys
from urllib.parse import urlparse
u = urlparse(sys.argv[1])
host = (u.hostname or "unknown").replace("www.", "")
host = host.replace(".", "-")
print(host[:40])
' "$1"
}

path_slug_of() {
  python3 -c '
import re, sys
from urllib.parse import urlparse
p = urlparse(sys.argv[1]).path or "/index"
p = p.strip("/").lower()
p = re.sub(r"[^a-z0-9]+", "-", p).strip("-")
print(p[:40] or "index")
' "$1"
}

EXT="${FORMAT}"
[[ "${FORMAT}" == "raw" ]] && EXT="bin"
STARTED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

typeset -a OUT_PATHS
typeset -a SUCCESSES
typeset -a IDS
typeset -a QPROMPTS
LETTERS=(a b c d e f g h i j k l m n o p q r s t u v w x y z)

typeset -a EFFECTIVE_PATHS
for ((i=1; i<=${#ULIST[@]}; i++)); do
  url="${ULIST[$i]}"
  letter="${LETTERS[$i]}"
  host="$(host_of "${url}")"
  slug="$(path_slug_of "${url}")"
  out="${RES_DIR}/${RUN_DATE}-r${ROUND}-auth-${host}-${slug}.${EXT}"
  qid="r${ROUND}auth${letter}"
  if curl -fsSL --max-time 60 -A "deep-research/1.0" "${url}" -o "${out}"; then
    SUCCESSES+=("true")
    OUT_PATHS+=("${RUN_DATE}-r${ROUND}-auth-${host}-${slug}.${EXT}")
    EFFECTIVE_PATHS+=("${RUN_DATE}-r${ROUND}-auth-${host}-${slug}.${EXT}")
  else
    SUCCESSES+=("false")
    rm -f "${out}"
    OUT_PATHS+=("")
    print -u2 "dr-fetch-authoritative: failed: ${url}"
  fi
  IDS+=("${qid}")
  QPROMPTS+=("${url}")
done

ENDED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

MANIFEST_PATH="${RES_DIR}/${RUN_DATE}-r${ROUND}-manifest.json"

python3 - "${MANIFEST_PATH}" "${TOPIC}" "${RUN_DATE}" "${ROUND}" \
  "${STARTED_AT}" "${ENDED_AT}" "${SOURCE_TYPE}" \
  "${(j:|:)IDS}" "${(j:|:)QPROMPTS}" "${(j:|:)OUT_PATHS}" "${(j:|:)SUCCESSES}" <<'PY'
import json, sys, pathlib

(out_path, topic, run_date, round_, started, ended, source_type,
 ids_str, prompts_str, paths_str, succ_str) = sys.argv[1:12]

ids     = ids_str.split("|") if ids_str else []
prompts = prompts_str.split("|") if prompts_str else []
paths   = paths_str.split("|") if paths_str else []
succ    = succ_str.split("|") if succ_str else []

queries = []
artifacts = []
for i, qid in enumerate(ids):
    queries.append({
        "id": qid,
        "prompt": prompts[i] if i < len(prompts) else "",
        "source_type": source_type,
        "fired_at": started,
        "succeeded": succ[i] == "true" if i < len(succ) else False,
    })
    path_i = paths[i] if i < len(paths) else ""
    if not path_i:
        continue
    artifacts.append({
        "path": path_i,
        "kind": "raw_fetch",
        "linked_query_id": qid,
    })

p = pathlib.Path(out_path)
if p.exists():
    existing = json.loads(p.read_text())
    existing.setdefault("back_fill", [])
    for q in queries:
        existing["back_fill"].append({
            "query_id": q["id"],
            "reason": "authoritative fetch",
            "succeeded": q["succeeded"],
        })
    existing.setdefault("artifacts", []).extend(artifacts)
    existing.setdefault("queries", []).extend(queries)
    if source_type not in existing.get("source_mix", []):
        existing.setdefault("source_mix", []).append(source_type)
    existing["ended_at"] = ended
    p.write_text(json.dumps(existing, indent=2) + "\n")
else:
    manifest = {
        "schema_version": "1.0.0",
        "topic": topic,
        "run_date": run_date,
        "round": int(round_),
        "phase": "authoritative",
        "facet_axis": "authoritative_sources",
        "queries": queries,
        "artifacts": artifacts,
        "gaps": [],
        "next_round_hints": [],
        "source_mix": [source_type],
        "started_at": started,
        "ended_at": ended,
        "early_stop_reason": "none",
        "notes": "Auto-generated by dr-fetch-authoritative.sh; operator should add gaps[] and next_round_hints[] before validation."
    }
    p.write_text(json.dumps(manifest, indent=2) + "\n")
PY

if [[ ${JSON_OUT} -eq 1 ]]; then
  python3 - "${MANIFEST_PATH}" "${(j:|:)EFFECTIVE_PATHS}" <<'PY'
import json, sys
manifest_path, paths_str = sys.argv[1:3]
print(json.dumps({
    "status": "ok",
    "manifest": manifest_path,
    "artifacts": [p for p in (paths_str.split("|") if paths_str else []) if p],
}))
PY
else
  print "dr-fetch-authoritative: ok"
  print "  manifest:  ${MANIFEST_PATH}"
  print "  artifacts: ${#EFFECTIVE_PATHS[@]}"
  for p in "${EFFECTIVE_PATHS[@]}"; do
    print "    ${p}"
  done
fi
