#!/usr/bin/env python3
"""Scan copy for stance markers and AI-slop / corporate-prose patterns.

Reports, with line-anchored spans:
  - hedges            tentativeness that weakens a claim
  - boosters          certainty/emphasis (great in moderation, hollow in bulk)
  - evidentials_vague authority with no accountable source ("studies show")
  - brand_prosody     buzzwords/puffery smuggled in as description
  - prose_audit/*     AI-slop detector bank (Strunk/Orwell/Williams/Pinker + WP AI Cleanup)

Usage:
  python scan_markers.py FILE [FILE ...]      # scan files
  python scan_markers.py -                    # scan stdin
  cat draft.md | python scan_markers.py       # stdin (no args)
  python scan_markers.py --json FILE          # machine-readable JSON

Heuristic and recall-oriented: every hit is a candidate to review, not a verdict.
A booster or a buzzword is not wrong in isolation — density is the signal.
"""
import sys
import os
import re
import json
import argparse

HERE = os.path.dirname(os.path.abspath(__file__))
LEX_PATH = os.path.join(HERE, "lexicons.json")


def load_lexicons():
    with open(LEX_PATH, encoding="utf-8") as f:
        return json.load(f)


def _alt(strings):
    # Longest-first so multi-word / hyphenated forms win over their prefixes.
    return "|".join(re.escape(s) for s in sorted(strings, key=len, reverse=True))


def build_marker_regexes(markers):
    """One compiled regex per marker category (lemmas + multi-word patterns)."""
    compiled = {}
    for cat, data in markers.items():
        parts = []
        lemmas = data.get("lemmas") or []
        if lemmas:
            parts.append(r"\b(?:" + _alt(lemmas) + r")\b")
        patterns = data.get("patterns") or []
        if patterns:
            # spaces in a pattern become flexible whitespace; guard word edges
            pat_alt = "|".join(re.escape(p).replace(r"\ ", r"\s+") for p in
                               sorted(patterns, key=len, reverse=True))
            parts.append(r"(?<![A-Za-z])(?:" + pat_alt + r")(?![A-Za-z])")
        if parts:
            compiled[cat] = re.compile("|".join(parts), re.IGNORECASE)
    return compiled


def line_of(text, pos):
    return text.count("\n", 0, pos) + 1


def scan_text(text, marker_re, prose_classes):
    hits = []  # (category, label, line, matched_text, action)
    for cat, rx in marker_re.items():
        for m in rx.finditer(text):
            hits.append((cat, cat, line_of(text, m.start()), m.group(0).strip(), ""))
    for cls in prose_classes:
        name = cls["class"]
        action = cls.get("action", "")
        for lit in cls.get("literals", []):
            for m in re.finditer(re.escape(lit), text, re.IGNORECASE):
                hits.append(("prose_audit", name, line_of(text, m.start()),
                             m.group(0).strip(), action))
        for pat in cls.get("regex", []):
            try:
                rx = re.compile(pat, re.IGNORECASE)
            except re.error:
                continue
            for m in rx.finditer(text):
                frag = m.group(0).strip()
                if frag:
                    hits.append(("prose_audit", name, line_of(text, m.start()),
                                 frag[:90], action))
    return hits


def words_in(text):
    return re.findall(r"[A-Za-z][A-Za-z'\-]*", text)


def report(name, text, hits, marker_meta):
    n_words = max(1, len(words_in(text)))
    by_cat = {}
    for cat, label, ln, frag, action in hits:
        by_cat.setdefault(label if cat == "prose_audit" else cat, []).append((cat, ln, frag, action))

    print(f"\n=== {name}  ({n_words} words, {len(hits)} flags) ===")

    order = ["hedges", "boosters", "evidentials_vague", "brand_prosody_seed"]
    print("\n-- stance markers --")
    any_stance = False
    for cat in order:
        items = by_cat.get(cat)
        if not items:
            continue
        any_stance = True
        density = 1000.0 * len(items) / n_words
        desc = marker_meta.get(cat, {}).get("description", "")
        print(f"  {cat:<18} {len(items):>3}  ({density:.1f}/1k words)  {desc}")
        for _cat, ln, frag, _a in items[:8]:
            print(f"       L{ln}: {frag}")
        if len(items) > 8:
            print(f"       ... +{len(items) - 8} more")
    if not any_stance:
        print("  (none)")

    prose = {k: v for k, v in by_cat.items() if v and v[0][0] == "prose_audit"}
    print("\n-- prose-audit (AI-slop / corporate prose) --")
    if not prose:
        print("  (none)")
    else:
        for label in sorted(prose, key=lambda k: -len(prose[k])):
            items = prose[label]
            action = items[0][3]
            print(f"  {label:<22} {len(items):>3}  -> {action}")
            for _cat, ln, frag, _a in items[:6]:
                print(f"       L{ln}: {frag}")
            if len(items) > 6:
                print(f"       ... +{len(items) - 6} more")


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("files", nargs="*", help="files to scan; '-' or empty = stdin")
    ap.add_argument("--json", action="store_true", help="emit JSON")
    args = ap.parse_args()

    lex = load_lexicons()
    marker_re = build_marker_regexes(lex["markers"])
    prose_classes = lex["prose_audit"]["classes"]
    marker_meta = lex["markers"]

    sources = []
    if not args.files or args.files == ["-"]:
        sources.append(("<stdin>", sys.stdin.read()))
    else:
        for fp in args.files:
            if fp == "-":
                sources.append(("<stdin>", sys.stdin.read()))
                continue
            with open(fp, encoding="utf-8") as f:
                sources.append((fp, f.read()))

    out = []
    for name, text in sources:
        hits = scan_text(text, marker_re, prose_classes)
        if args.json:
            out.append({
                "source": name,
                "words": len(words_in(text)),
                "flags": [{"category": c, "label": lab, "line": ln,
                           "text": frag, "action": a}
                          for c, lab, ln, frag, a in hits],
            })
        else:
            report(name, text, hits, marker_meta)

    if args.json:
        print(json.dumps(out if len(out) > 1 else out[0], indent=2))


if __name__ == "__main__":
    main()
