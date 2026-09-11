#!/usr/bin/env python3
"""Readability quality gate: Flesch Reading Ease, Flesch-Kincaid grade,
words-per-sentence, and an approximate passive-voice rate.

Maslen's gate (Write to Sell): treat these as pass/fail on every draft.
  - Words/sentence : aim ~16 average; a number in the 20s+ means split a sentence.
  - Flesch RE      : >= 60 is where plain English begins (higher = easier).
  - FK grade       : ~7 means a busy, half-attentive reader can act without effort.
  - Passive        : aim low (the book itself is ~3%); don't be a slave to it.
The book practises this: Write to Sell scores RE 66.6 / FK 7.1 / ~13 WPS / 3% passive.

Usage:
  python readability.py FILE
  cat draft.md | python readability.py
"""
import sys
import re
import argparse

VOWELS = "aeiouy"


def count_syllables(word):
    word = re.sub(r"[^a-z]", "", word.lower())
    if not word:
        return 0
    groups = re.findall(r"[aeiouy]+", word)
    n = len(groups)
    if word.endswith("e") and not word.endswith("le") and n > 1:
        n -= 1
    return max(1, n)


def split_sentences(text):
    # Strip markdown headings/list markers so they don't read as sentences.
    text = re.sub(r"(?m)^\s{0,3}#{1,6}\s+", "", text)
    text = re.sub(r"(?m)^\s*[-*+]\s+", "", text)
    parts = re.split(r"(?<=[.!?])[\"')\]]?\s+", text.strip())
    return [s for s in (p.strip() for p in parts) if re.search(r"[A-Za-z]", s)]


PASSIVE_RE = re.compile(
    r"\b(?:am|is|are|was|were|be|been|being|get|got|gets)\b\s+(?:\w+ly\s+)?(?:\w+ed|"
    r"done|made|given|taken|seen|known|shown|built|sold|held|kept|sent|paid|won|"
    r"lost|found|written|driven|chosen|broken|spoken|drawn)\b",
    re.IGNORECASE,
)


def analyze(text):
    sentences = split_sentences(text)
    words = re.findall(r"[A-Za-z][A-Za-z'\-]*", text)
    n_sent = max(1, len(sentences))
    n_words = max(1, len(words))
    syllables = sum(count_syllables(w) for w in words)

    wps = n_words / n_sent
    syl_per_word = syllables / n_words
    flesch = 206.835 - 1.015 * wps - 84.6 * syl_per_word
    fk_grade = 0.39 * wps + 11.8 * syl_per_word - 15.59
    passive = sum(1 for s in sentences if PASSIVE_RE.search(s))
    passive_pct = 100.0 * passive / n_sent
    return {
        "sentences": len(sentences), "words": len(words), "syllables": syllables,
        "wps": wps, "flesch": flesch, "fk_grade": fk_grade,
        "passive_pct": passive_pct,
    }


def verdict(m):
    checks = []
    checks.append(("Words/sentence", f"{m['wps']:.1f}", m["wps"] <= 18,
                   "<=16 ideal, 20s+ = split sentences"))
    checks.append(("Flesch Reading Ease", f"{m['flesch']:.1f}", m["flesch"] >= 60,
                   ">=60 plain English"))
    checks.append(("Flesch-Kincaid grade", f"{m['fk_grade']:.1f}", m["fk_grade"] <= 9,
                   "<=9 (book = 7.1)"))
    checks.append(("Passive voice", f"{m['passive_pct']:.0f}%", m["passive_pct"] <= 10,
                   "aim low (book ~3%, approx)"))
    return checks


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("file", nargs="?", help="file to check; omit for stdin")
    args = ap.parse_args()
    text = open(args.file, encoding="utf-8").read() if args.file else sys.stdin.read()

    m = analyze(text)
    print(f"\nReadability  ({m['words']} words, {m['sentences']} sentences)")
    print("-" * 58)
    all_pass = True
    for name, val, ok, note in verdict(m):
        flag = "PASS" if ok else "FAIL"
        all_pass = all_pass and ok
        print(f"  {flag}  {name:<22} {val:>6}   {note}")
    print("-" * 58)
    print("  GATE:", "PASS — ship it" if all_pass
          else "FAIL — revise (usually: split the long sentences, shorten long words)")


if __name__ == "__main__":
    main()
