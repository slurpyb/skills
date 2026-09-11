<!--
Copy-audit output format. Lead with the highest-leverage fixes. Quote the offending
span and give the rewrite. Density is the signal — one booster is fine, ten is a tell.
Populate the scanner rows from: scripts/readability.py and scripts/scan_markers.py.
-->

# Copy Audit — [page / asset name]

## Verdict
[1–2 sentences: does this copy do its job? The single biggest thing to fix.]

## Readability gate
| Metric | Score | Target | Pass? |
| --- | --- | --- | --- |
| Words / sentence | [x] | ~16 avg | [✓/✗] |
| Flesch Reading Ease | [x] | ≥ 60 | [✓/✗] |
| Flesch-Kincaid grade | [x] | ≤ 9 | [✓/✗] |
| Passive voice | [x]% | low | [✓/✗] |

## Marker scan (density per 1k words)
| Signal | Count | Read |
| --- | --- | --- |
| Hedges | [n] | [weakening claims? where] |
| Boosters | [n] | [hollow in bulk?] |
| Vague evidentials | [n] | ["studies show" with no source] |
| Buzzwords / puffery | [n] | [smuggled evaluation] |
| AI-slop detectors | [n] | [classes that fired] |

## Findings (highest leverage first)
### 1. [Title — e.g. "Feature-led where it should be benefit-led"]
- **Where:** [section / line]
- **Problem:** > "[quoted span]"
- **Why it costs you:** [the mechanism — WIIFM, fluency, stance, etc.]
- **Rewrite:** > "[the fix]"

### 2. [Title]
- **Where / Problem / Why / Rewrite** …

## Quick wins (one-line fixes)
- [ ] [span] → [fix]
- [ ] [span] → [fix]
