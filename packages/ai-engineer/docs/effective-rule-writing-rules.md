# Effective Rule Writing — self-describing rules

This file is intentionally written to model its own advice. Each rule is named,
scoped, concrete, consequence-aware, and linked to its neighbors.

---

## RULE 1 — Choose The Right Form

**Context:** You are about to write guidance and call it a rule.

**Problem.** Rules fail when they are written in the wrong shape: facts dressed up
as patterns, thresholds buried in prose, or procedures written like principles.

**Forces:** brevity ⟷ precision · reuse ⟷ fit-for-purpose structure

**Solution.** Match the form to the rule's real job:

- use **reference** form for facts, contracts, and fixed structures,
- use **pattern** form for recurring trade-offs,
- use **if/then** form for thresholds and branching logic,
- use **runbook** form for procedures and recovery steps.

**Consequences:** The rule becomes easier to apply and easier to maintain. Cost:
you must decide the rule type before drafting.

**Related:** RULE 2, RULE 5, RULE 7

---

## RULE 2 — One Rule, One Decision

**Context:** You are drafting a new rule or revising an overloaded one.

**Problem.** A rule that tries to settle many decisions at once becomes vague,
contradictory, and hard to remember.

**Forces:** completeness ⟷ clarity · density ⟷ retrievability

**Solution.** Make each rule remove exactly one degree of freedom. If a paragraph
contains several distinct decisions, split it into separate linked rules.

**Consequences:** Rules become easier to scan, test, cite, and update. Cost: the
rule set grows in count and needs cross-links.

**Related:** RULE 1, RULE 6

---

## RULE 3 — State The Rule Before The Rationale

**Context:** The reader needs to act, not infer your conclusion.

**Problem.** Narrative-first guidance forces the reader to reconstruct the actual
rule from explanation, examples, and caveats.

**Forces:** persuasion ⟷ speed of use · explanation ⟷ retrieval

**Solution.** Put the directive first. Follow it with only the rationale needed
to explain why the rule exists, when it matters, and what breaks without it.

**Consequences:** The rule is easier to apply under time pressure. Cost: the
author must cut explanatory indulgence.

**Related:** RULE 4, RULE 5

---

## RULE 4 — Name The Failure Mode

**Context:** The rule is non-trivial and competes with other plausible choices.

**Problem.** A rule without a named failure mode reads like taste, not guidance.

**Forces:** simplicity ⟷ defensibility · local convenience ⟷ systemic reliability

**Solution.** Say what goes wrong if the rule is ignored. Name a concrete failure:
drift, ambiguity, invalid state, inaccessible UI, broken reuse, unsafe action,
silent contradiction, or some other real cost.

**Consequences:** Exceptions become easier to judge because the risk is explicit.
Cost: weak rules with no real failure mode become obviously unjustified.

**Related:** RULE 3, RULE 6

---

## RULE 5 — Make The Boundary Explicit

**Context:** The rule applies sometimes, not always.

**Problem.** Readers misuse rules when they cannot tell where the rule stops.

**Forces:** generality ⟷ correctness · consistency ⟷ local adaptation

**Solution.** State the boundary in the rule itself:

- when it applies,
- when it does not,
- when to choose a neighboring rule instead.

If the decision is threshold-based, convert the boundary into a table or decision
rule instead of leaving it implicit.

**Consequences:** Misapplication drops and exceptions become first-class. Cost:
you must do the harder work of drawing the line clearly.

**Related:** RULE 1, RULE 7

---

## RULE 6 — Show At Least One Real Example

**Context:** The wording could be misunderstood even if the rule is correct.

**Problem.** Abstract guidance leaves too much room for interpretation.

**Forces:** token economy ⟷ teachability · abstraction ⟷ transfer

**Solution.** Add at least one concrete example when ambiguity is plausible. Use
good/bad pairs when the mistake pattern is common.

**Consequences:** Adoption improves because the reader sees what the rule means in
practice. Cost: examples must be maintained when the underlying standard changes.

**Related:** RULE 2, RULE 4

---

## RULE 7 — Encode Obligation Precisely

**Context:** The rule needs a clear enforcement level.

**Problem.** Words like "should," "usually," and "kind of" blur whether the rule
is mandatory, advisory, definitional, or merely suggestive.

**Forces:** flexibility ⟷ consistency · nuance ⟷ enforceability

**Solution.** Use controlled language:

- **must / must not** for hard behavioral constraints,
- **should / should not** only when justified deviation is allowed,
- **always / never** for definitional truths,
- avoid `if...then...` for behavioral obligations unless the rule is truly
  inferential or threshold-based.

**Consequences:** Readers can tell whether deviation is allowed and what kind of
rule they are reading. Cost: authors must choose enforcement level deliberately.

**Related:** RULE 1, RULE 5

---

## RULE 8 — Treat Rules As Maintained Artifacts

**Context:** The rule set will be reused over time by humans or agents.

**Problem.** Unowned rules decay into stale prose, contradictions, and dead
advice.

**Forces:** speed of publication ⟷ long-term reliability · completeness ⟷ upkeep

**Solution.** Version rules, prune weak ones, review examples, and update linked
neighbors when a rule changes. If enforcement can be automated, prefer a tool or
test over repeated prose reminders.

**Consequences:** The rule set stays trustworthy. Cost: ownership and review are
required; rules are not write-once documents.

**Related:** RULE 2, RULE 6, RULE 7

---

## Compact Checklist

Before keeping a rule, ask:

1. Is this actually a rule, or just explanation?
2. Did I choose the right form?
3. Does it remove one clear degree of freedom?
4. Is the directive stated before the rationale?
5. Did I name the failure mode?
6. Is the boundary explicit?
7. Is the enforcement level precise?
8. Does it need an example?
9. Could a tool enforce this better than prose?
