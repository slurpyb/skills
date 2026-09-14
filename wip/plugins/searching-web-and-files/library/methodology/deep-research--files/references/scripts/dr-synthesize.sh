#!/bin/zsh
# dr-synthesize.sh — bootstrap the synthesis artifacts.
#
# This script does NOT call any LLM; synthesis is Claude's job.
# It:
#   1. Gathers all <YYYYMMDD>-r{N}-manifest.json files for today's run.
#   2. Copies templates/SUMMARY.md and templates/citation-index.md into
#      resources/ with the run-date prefix.
#   3. Substitutes placeholders that can be filled programmatically
#      (date, round count, source mix, manifest list).
#   4. Writes a sidecar <YYYYMMDD>-synthesis-meta.json with section
#      placeholders (validated:false). dr-validate.py flips validated
#      after schema and structure checks.
#
# Usage:
#   dr-synthesize.sh --workdir <path> [--json]
#
# Output paths:
#   resources/<YYYYMMDD>-SUMMARY.md
#   resources/<YYYYMMDD>-citation-index.md
#   resources/<YYYYMMDD>-synthesis-meta.json
#   resources/<YYYYMMDD>-r6-manifest.json (Phase 6 manifest seed)

set -eu
set -o pipefail

JSON_OUT=0
WORKDIR=""

die() {
  if [[ ${JSON_OUT} -eq 1 ]]; then
    printf '{"status":"error","error":%s}\n' "$(printf '%s' "$1" | python3 -c 'import json,sys;print(json.dumps(sys.stdin.read()))')"
  else
    print -u2 "dr-synthesize: error: $1"
  fi
  exit 1
}

while (( $# )); do
  case "$1" in
    --workdir) WORKDIR="$2"; shift 2 ;;
    --json) JSON_OUT=1; shift ;;
    -h|--help)
      print "Usage: dr-synthesize.sh --workdir <path> [--json]"
      exit 0
      ;;
    *) die "unknown flag: $1" ;;
  esac
done

[[ -z "${WORKDIR}" ]] && die "--workdir required"

RES_DIR="${WORKDIR}/resources"
[[ -d "${RES_DIR}" ]] || die "resources/ does not exist; run dr-init.sh first"

RUN_DATE="$(date -u +%Y%m%d)"
CONFIG_PATH="${RES_DIR}/${RUN_DATE}-run-config.json"
[[ -f "${CONFIG_PATH}" ]] || die "missing run-config: ${CONFIG_PATH}"

SCRIPT_DIR="${0:A:h}"
TEMPLATE_DIR="${SCRIPT_DIR}/../templates"
SUMMARY_TPL="${TEMPLATE_DIR}/SUMMARY.md"
CITATION_TPL="${TEMPLATE_DIR}/citation-index.md"
[[ -f "${SUMMARY_TPL}" ]]  || die "template missing: ${SUMMARY_TPL}"
[[ -f "${CITATION_TPL}" ]] || die "template missing: ${CITATION_TPL}"

SUMMARY_OUT="${RES_DIR}/${RUN_DATE}-SUMMARY.md"
CITATION_OUT="${RES_DIR}/${RUN_DATE}-citation-index.md"
META_OUT="${RES_DIR}/${RUN_DATE}-synthesis-meta.json"
R6_OUT="${RES_DIR}/${RUN_DATE}-r6-manifest.json"

[[ -f "${SUMMARY_OUT}" ]]  && die "synthesis already exists: ${SUMMARY_OUT}"

# Gather context from run config + manifests via python.
python3 - "${CONFIG_PATH}" "${RES_DIR}" "${RUN_DATE}" \
  "${SUMMARY_TPL}" "${CITATION_TPL}" \
  "${SUMMARY_OUT}" "${CITATION_OUT}" "${META_OUT}" "${R6_OUT}" "${WORKDIR}" <<'PY'
import json, sys, pathlib, re, glob, datetime

(config_path, res_dir, run_date, summary_tpl, citation_tpl,
 summary_out, citation_out, meta_out, r6_out, workdir) = sys.argv[1:11]

config = json.loads(pathlib.Path(config_path).read_text())
topic   = config["topic"]
sources = config.get("source_allowlist", [])
axes    = config.get("facet_axes", [])

manifest_glob = sorted(glob.glob(f"{res_dir}/{run_date}-r*-manifest.json"))
manifest_names = [pathlib.Path(p).name for p in manifest_glob if not pathlib.Path(p).name.startswith(f"{run_date}-r6-")]

# Build axis coverage map.
axis_coverage = {axis: {"status": "uncovered", "artifact_count": 0} for axis in axes}
for m_path in manifest_glob:
    m = json.loads(pathlib.Path(m_path).read_text())
    facet = m.get("facet_axis")
    arts = len(m.get("artifacts", []))
    if facet in axis_coverage:
        axis_coverage[facet]["artifact_count"] += arts
        if axis_coverage[facet]["artifact_count"] >= 3:
            axis_coverage[facet]["status"] = "covered"
        elif axis_coverage[facet]["artifact_count"] > 0:
            axis_coverage[facet]["status"] = "partial"

def substitute(template_text):
    text = template_text
    text = text.replace("REPLACE_WITH_USER_TOPIC", topic)
    text = text.replace("REPLACE_WITH_YYYYMMDD", run_date)
    text = text.replace("REPLACE_WITH_WORKDIR", workdir)
    text = text.replace("REPLACE_WITH_SOURCE_LIST", ", ".join(sources))
    text = text.replace("REPLACE_WITH_ROUND_COUNT", str(len(manifest_names)))
    return text

summary_body  = substitute(pathlib.Path(summary_tpl).read_text())
citation_body = substitute(pathlib.Path(citation_tpl).read_text())

pathlib.Path(summary_out).write_text(summary_body)
pathlib.Path(citation_out).write_text(citation_body)

required_sections = [
    "architecture", "install_or_setup", "surface_map",
    "gotchas_and_limitations", "ecosystem_alternatives",
    "use_case_mapping", "next_step_toolchain",
]
section_headings = {
    "architecture": "Architecture",
    "install_or_setup": "Install or Setup",
    "surface_map": "Surface Map",
    "gotchas_and_limitations": "Gotchas and Limitations",
    "ecosystem_alternatives": "Ecosystem Alternatives",
    "use_case_mapping": "Use Case Mapping",
    "next_step_toolchain": "Next Step Toolchain",
    "limitations": "Limitations",
}
sections_meta = {}
for key in required_sections + ["limitations"]:
    sections_meta[key] = {
        "present": True,
        "anchor": section_headings[key],
        "claim_count": 0,
    }

meta = {
    "schema_version": "1.0.0",
    "topic": topic,
    "run_date": run_date,
    "summary_path": pathlib.Path(summary_out).name,
    "citation_index_path": pathlib.Path(citation_out).name,
    "sections": sections_meta,
    "round_manifests": manifest_names,
    "axis_coverage": axis_coverage,
    "claim_count": 0,
    "validated": False,
}
pathlib.Path(meta_out).write_text(json.dumps(meta, indent=2) + "\n")

now = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
r6 = {
    "schema_version": "1.0.0",
    "topic": topic,
    "run_date": run_date,
    "round": 6,
    "phase": "synthesis",
    "facet_axis": "meta",
    "queries": [],
    "artifacts": [
        {"path": pathlib.Path(summary_out).name,  "kind": "synthesis"},
        {"path": pathlib.Path(citation_out).name, "kind": "citation_index"},
        {"path": pathlib.Path(meta_out).name,     "kind": "manifest"},
    ],
    "gaps": [],
    "next_round_hints": [],
    "source_mix": sources or ["other"],
    "started_at": now,
    "ended_at": now,
    "early_stop_reason": "none",
    "notes": "Phase 6 manifest seed. Operator must fill SUMMARY.md and citation-index.md placeholders before running dr-validate.py."
}
pathlib.Path(r6_out).write_text(json.dumps(r6, indent=2) + "\n")
PY

if [[ ${JSON_OUT} -eq 1 ]]; then
  python3 -c '
import json, sys
print(json.dumps({
    "status": "ok",
    "summary": sys.argv[1],
    "citation_index": sys.argv[2],
    "synthesis_meta": sys.argv[3],
    "r6_manifest": sys.argv[4],
}))
' "${SUMMARY_OUT}" "${CITATION_OUT}" "${META_OUT}" "${R6_OUT}"
else
  print "dr-synthesize: ok"
  print "  summary:        ${SUMMARY_OUT}"
  print "  citation index: ${CITATION_OUT}"
  print "  synth meta:     ${META_OUT}"
  print "  r6 manifest:    ${R6_OUT}"
  print "Operator: fill SUMMARY.md and citation-index.md placeholders, then run dr-validate.py."
fi
