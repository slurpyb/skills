# Effective Rule Writing — research

**Question:** What makes a *rule* (design principle, coding guideline, agent instruction) effective to write and to consume — and what structural format should distilled rules take?
**Origin:** Distilling design/UI skills into rule files. First passes were prose paragraphs that read as "uninformed about effective rule writing." This is the research behind the fix.
**Method:** Go wide with short queries, synthesize, repeat. Two rounds of fan-out search, synthesized against library patterns.

## What This Document Is

This file now aims to do two jobs cleanly:

- **Handbook:** concise, usable guidance for writing rules well.
- **Evidence dossier:** the research record showing where the guidance comes from.

The handbook lives in Parts 1–4. The raw search capture and deep research notes live in the appendices.

## Reading Order

1. Read **Part 1** for the actual advice.
2. Read **Part 2** for the claim ledger and confidence level of each major claim.
3. Read **Part 3** for the remaining research agenda.
4. Use **Appendix A** and **Appendix B** only when you need provenance or exact notes.

## Evidence Tiers

| Tier | Meaning | Current use here |
|---|---|---|
| **A** | Full-text read of a primary or authoritative source | Most of Appendix B |
| **B** | Full-text read of a strong secondary source | Some agent-guidance sources |
| **C** | Search-returned excerpt only | Raw capture items not yet promoted |
| **D** | Local synthesis / inference | Cross-source conclusions and proposed structure |

## Target Shape For A Definitive Resource

The definitive version should stabilize around five durable layers:

1. **Rule taxonomy** — what kinds of rules exist.
2. **Rule anatomy** — what fields each kind of rule needs.
3. **Normative language** — how obligation, recommendation, definition, and exception are phrased.
4. **Authoring guidance** — examples, anti-patterns, maintenance, and governance.
5. **Evidence register** — claim-by-claim support, limits, and disagreements.

---

# PART 1 — HANDBOOK

## Core Thesis

The strongest guidance from the research is not simply "use pattern form." It is:

- Use **pattern form** for recurring tensions and trade-offs.
- Use **declarative reference form** for facts, contracts, and fixed platform truths.
- Use **conditional form** for thresholds, branching decisions, and inferencing logic.
- Use **operational form** for executor instructions: triggers, commands, verification, and escalation.

The failure in the first prose drafts was not lack of intelligence. It was **format mismatch**: treating all rule types as if they wanted the same prose shape.

## Rule Taxonomy

### 1. Definitional / reference rules

Use for language facts, platform contracts, fixed structures, and non-negotiable reference material.

- Purpose: describe what *is true*.
- Best phrasing: declarative, crisp, terminology-stable.
- Best forms: reference page, field manual, compact cheat-sheet.
- Bad smell: inventing fake trade-offs around things that are just platform facts.

### 2. Behavioral / craft rules

Use for recurring authoring decisions where real pressures compete.

- Purpose: resolve a tension well, repeatedly.
- Best phrasing: context + forces + solution + consequences.
- Best forms: pattern, sometimes with linked siblings.
- Bad smell: saying what to do without explaining when it stops being the right trade.

### 3. Operational / agent rules

Use for execution behavior: what the agent or operator should do, when to ask, when to stop, and how to verify completion.

- Purpose: constrain action and reduce failure.
- Best phrasing: trigger, imperative action, boundary, verification.
- Best forms: short instructions, if/then tables, runbooks, commands.
- Bad smell: mixing advice, tutorial, and hard constraint in one paragraph.

## Rule Anatomy By Type

### Definitional / reference

Required fields:

- **Statement** — the fact, contract, or invariant.
- **Scope** — where it applies.
- **Terminology** — the canonical terms.
- **Example** — at least one concrete instance when ambiguity is plausible.
- **Related** — neighboring concepts or rules.

Optional:

- **Exception** only when the contract genuinely has one.
- **Tool check** when the fact can be validated automatically.

### Behavioral / craft

Required fields:

- **Name**
- **Context**
- **Problem**
- **Forces**
- **Solution**
- **Consequences**
- **Related**

Optional:

- **Examples**
- **Confidence**
- **Exception / When not to use**

This is the right home for pattern language.

### Operational / agent

Required fields:

- **Trigger** — when this instruction activates.
- **Action** — what to do.
- **Boundary** — what not to do, or when to ask first.
- **Verification** — what proves completion.
- **Escalation** — when to stop, ask, or switch strategy.

Optional:

- **Commands**
- **Example invocation**
- **Recovery table**

## Format Selection Matrix

| Rule shape | Best format | Why |
|---|---|---|
| Platform fact, language fact, schema truth | Reference / field manual | No real tension; clarity beats rhetoric |
| Recurring trade-off | Pattern | Forces and consequences are the point |
| Threshold, branching logic, decision gate | If/Then table / decision tree | Conditional logic should stay explicit |
| Procedure with rollback or safety steps | Runbook | Sequence and recovery matter |
| Dense one-screen reminders | Cheat-sheet | Fast retrieval beats exposition |
| Testable pass/fail behavior | Gherkin / scenario | Makes compliance observable |

## What makes a rule effective

1. **Directive-first.** Put the actionable statement first.
2. **Concrete and testable.** Replace vague language with thresholds, examples, or checks.
3. **Grounded in a failure mode.** Name what breaks if the rule is ignored.
4. **Scoped.** One concern per rule beats omnibus prose.
5. **Referenceable.** A named rule becomes team vocabulary.
6. **Example-backed.** Show real good/bad cases when ambiguity is likely.
7. **Explicit about cost.** Trade-offs and consequences keep rules from reading as dogma.
8. **Maintained as a living artifact.** Good rules are versioned and pruned.

## Normative Language House Style

- Use **must / must not** for hard behavioral constraints.
- Use **should / should not** only when deviation is allowed but should be justified.
- Use **always / never** for definitional truths or impossibilities, not preferences.
- Use **can** for capability or permission in ordinary prose.
- Avoid using **should** to express probability.
- Avoid `if...then...` for behavioral obligations unless the rule is truly inferential or decision-driven.

## What Not To Encode As A Rule

Do not write a rule for:

- defaults the reader or model can already infer reliably,
- long tutorials,
- process masquerading as policy,
- taste with no named failure mode,
- checks better enforced by a hook, linter, schema, validator, or test,
- repo-specific noise that belongs in an example or reference file instead.

If the guidance does not remove ambiguity, reduce a degree of freedom, or prevent a recurring failure, it is probably not a rule.

## Worked Rewrites

### Example A — bad behavioral prose

Bad:

> Keep components flexible and reusable where possible.

Why it fails:

- no scope
- no failure mode
- no trade-off
- no signal for when not to apply it

Better as a pattern:

```md
**PATTERN: Layout Wraps State**
**Context:** Building reusable UI components.
**Problem.** Components often mix arrangement, appearance, and behavior into one unit.
**Forces:** reuse ⟷ convenience · layout freedom ⟷ component encapsulation
**Solution.** Keep stateful behavior inside the primitive; compose layout around it.
**Consequences:** reuse improves and layout stays swappable; cost: one extra wrapper in some compositions.
**Related:** composition, ownership boundaries
```

### Example B — bad definitional rule

Bad:

> You should usually use sections for major page content.

Why it fails:

- weak modal verb
- sounds optional when it is really describing structure
- no clear contract

Better as reference:

```md
Sections are the primary unit of major page composition in a Shopify theme.
Use a section when the merchant must add, remove, reorder, or configure a page-level block of content.
Use a snippet when the unit is not independently placeable or configurable by the merchant.
```

### Example C — bad threshold rule

Bad:

> If a dialog is kind of risky, make the user confirm it.

Why it fails:

- "kind of risky" is not testable
- the condition is underspecified

Better as conditional logic:

| Condition | Action |
|---|---|
| Destructive action is irreversible | Require explicit confirmation |
| Action is reversible or undoable | Do not interrupt with a confirm dialog by default |
| User impact is high but undo exists | Prefer inline warning + undo over modal confirmation |

## Application To The Distill Task

- **Design principles** usually want behavioral/craft patterns.
- **Thresholds inside principles** want if/then tables or cheat-sheets.
- **Language or platform facts** want reference pages.
- **Agent execution behavior** wants short operational rules with verification and escalation.

That is the main practical output of this research.

---

# PART 2 — CLAIM LEDGER

| Claim | Status | Source tier | Source basis | Implication |
|---|---|---|---|---|
| Pattern form is best for recurring tensions, not all rules | confirmed | A/B | Alexander/Coplien lineage, pattern literature | Do not force all rules into pattern prose |
| Forces and consequences are the load-bearing fields for behavioral rules | confirmed | A | Pattern literature, POSA/Coplien, coding-standards rationale/consequences structures | Every craft rule should expose why and cost |
| `if...then...` is right for inference/threshold logic, not ideal for behavioral obligation | confirmed | A/B | BRCommunity, business-rules theory | Use conditional tables for decision logic; avoid burying obligation in conditionals |
| Good rules should be concrete, scoped, and example-backed | confirmed | B | Cursor/agent guidance, NN/G, standards examples | Prefer thresholds, commands, and real examples over prose blur |
| Rules should name a concrete failure mode | confirmed | A | CERT, Linux style, MISRA-like rationale structures | Every non-trivial rule should answer “what breaks?” |
| Normative words need controlled meaning | confirmed | A | RFC 2119/8174, style guides, business-rules theory | Establish a house style for must/should/always/never |
| Always-loaded agent instructions must be short and scoped | confirmed | B | Anthropic/Cursor/field notes | Keep global instructions minimal; push detail into scoped files |
| Rules are living artifacts and should be pruned | confirmed | B | Anthropic, NN/G, pattern evolution sources | Add review and maintenance discipline |
| Alexander primary text is still worth promoting directly | provisional-high | C/A pending | currently secondary/transcribed support is strong | Promote for canonical wording and confidence markers |
| Codacy and YouTube are useful only as leads | confirmed | C | weak authority compared with primary standards | Do not use them as canon |

---

# PART 3 — REMAINING RESEARCH AND EDITING WORK

## Highest-value next research moves

1. Promote **Alexander primary text** directly for the pattern-language claims.
2. Add one direct canonical pass on **Google style-guide rule anatomy**.
3. Add one direct canonical pass on **CERT/MISRA exception and rationale structure**.
4. Build a **small evidence register** mapping each handbook claim to its strongest source.

## Remaining editorial work

1. Split the handbook from the dossier fully if this becomes a published resource.
2. Add 3–5 more worked rewrites from the actual rule corpus.
3. Add a concise governance section covering ownership, review cadence, and versioning.
4. Add a compact “rule maintenance checklist.”

---

# PART 4 — SOURCE MAP FOR PROMOTION

## Already excerpted / partially synthesized

- cursor-rules reference — https://github.com/sanjeed5/awesome-cursor-rules-mdc/blob/main/cursor-rules-reference.md
- Reddit, *7 rules I give every AI agent* — https://www.reddit.com/r/vibecoding/comments/1srinkd/7_rules_i_give_every_ai_agent_at_the_start_of_a/
- Supernova, *Design Patterns & Guideline Examples* — https://www.supernova.io/blog/design-patterns-and-guideline-examples-to-inspire-your-documentation
- Wikipedia, *Software design pattern* — https://en.wikipedia.org/wiki/Software_design_pattern
- SourceMaking, *Design Patterns* — https://sourcemaking.com/design_patterns

## Highest-value sources to promote next

- Alexander, *A Pattern Language* (Cornell PDF) — https://arl.human.cornell.edu/linked%20docs/Alexander_A_Pattern_Language.pdf
- Wikipedia, *A Pattern Language* — https://en.wikipedia.org/wiki/A_Pattern_Language
- Codacy, *Coding Standards* — https://blog.codacy.com/coding-standards *(low priority; promote only if it yields stronger primary references)*
- YouTube, *Define your design system's principles* — https://www.youtube.com/watch?v=pwzYVIgga2c *(secondary only; promote only if it points to stronger written sources)*

These are the remaining promotion candidates because they either underpin major conclusions or remain unresolved after deep research follow-up.

## Research Follow-up — Promoted sources

Deep research promoted two of the Tier C leads and tested whether the "coding standards" lead list improved materially.

### Promoted: NN/G, *Content Standards in Design Systems*

Perplexity's source-backed summary of the article reinforces several claims already present in this document:

- Content standards should be **clear, concise, and well organized** so people can find and apply them quickly.
- Guidance can be layered at multiple levels: **global** standards and more specific rules for components, patterns, channels, content types, or user groups.
- Effective standards should be **specific and actionable**, not broad advice.
- Teams should preserve **good/bad real examples**, often discovered through content audits, to make standards easier to apply.
- Standards should be treated as **living documentation** with explicit upkeep, regular review, and active circulation across tools and workflows.
- Governance works better when content standards are developed **with** the people who own the design system, rather than as an isolated writing artifact.

Implication for this research: NN/G now supports the document's claims about **clarity**, **specificity**, **examples**, **maintenance**, and **governance**. It is no longer just a title-level lead.

Source: https://www.nngroup.com/articles/content-design-systems/

### Promoted: BRCommunity, *Business Rules and the Many Meanings of If...Then...*

Perplexity's summary of Ross's article strongly supports a key structural claim in this document:

- `if...then...` is appropriate for **inference rules**, thresholds, and decision logic.
- `if...then...` is often **misleading for behavioral/prescriptive rules**, because it buries the real obligation inside conditional logic.
- Behavioral rules are better written in a **declarative form** that states the constraint or obligation directly.
- Mixing behavioral rules with inferencing syntax confuses the difference between a **condition**, a **truth test**, and a **required action/state**.

Implication for this research: the document's format recommendation is now stronger. The rule-shape matrix is not just a stylistic preference; it is supported by business-rules theory distinguishing **behavioral rules** from **decision/inference rules**.

Source: https://www.brcommunity.com/articles.php?id=b187

### Not promoted: generic "coding standards" source expansion

The Perplexity pass for "best authoritative coding-standards sources" produced a mixed result set and leaned on low-authority aggregation. It surfaced plausible candidates, but not with enough evidentiary quality to promote directly into the canon.

Current judgment:

- **Do promote** already-cited primary standards and style guides when needed (Google style guides, C++ Core Guidelines, CERT, MISRA, Linux kernel style).
- **Do not promote** Codacy or generic listicles as definitive evidence unless they point to a stronger underlying source.
- **Treat YouTube as secondary at best** unless it links to a more authoritative written resource.

---

# APPENDIX A — RAW SEARCH CAPTURE

> NOTE ON FIDELITY: this appendix is the **raw capture** — every query and every result returned, verbatim, including which sources came back with no excerpt. The working conclusions above were derived from it, but this appendix is preserved so claims can be re-audited.

## Round 1 — queries fired (single multi-query batch)

1. `how to write effective rules for AI coding agents`
2. `Christopher Alexander pattern language structure context problem solution`
3. `writing actionable design system guidelines`
4. `AGENTS.md cursor rules best practices format`
5. `if-then production rule writing style`

### Round 1 — results (6, merged/reranked)

**1. [PDF] Christopher Alexander Pattern Language — Cornell | ARL**
URL: https://arl.human.cornell.edu/linked%20docs/Alexander_A_Pattern_Language.pdf
Dates: published 2000-01-01 · lastUpdated 2025-03-31
Excerpt returned: *(none — search returned metadata only)*

**2. Content Standards in Design Systems — NN/G**
URL: https://www.nngroup.com/articles/content-design-systems/
Dates: 2024-05-03 · 2026-06-14
Excerpt returned: *(none — metadata only)*

**3. awesome-cursor-rules-mdc/cursor-rules-reference.md at main**
URL: https://github.com/sanjeed5/awesome-cursor-rules-mdc/blob/main/cursor-rules-reference.md
Dates: 2025-02-17 · 2026-05-18
Excerpt returned (verbatim):
> Good rules are focused, actionable, and scoped.
> - Keep rules under 500 lines
> - Split large rules into multiple, composable rules
> - Provide concrete examples or referenced files
> - Avoid vague guidance.
> Write rules like clear internal docs
> - Reuse rules when repeating prompts in chat

**4. Business Rules and the Many Meanings of 'If…Then…' (Features)**
URL: https://www.brcommunity.com/articles.php?id=b187
Dates: 2004-08-01 · 2026-01-12
Excerpt returned: *(none — metadata only)*

**5. 7 rules I give every AI agent at the start of a new project — Reddit (r/vibecoding)**
URL: https://www.reddit.com/r/vibecoding/comments/1srinkd/7_rules_i_give_every_ai_agent_at_the_start_of_a/
Dates: 2026-04-21 · 2026-06-12
Excerpt returned (verbatim):
> 3. "Before making any changes, please outline all files you intend to modify.
> If the list exceeds five, pause and suggest dividing the task."
> 4. "If three consecutive attempts to fix an issue fail, stop.
> Instead, suggest: (a) reverting to the previous state, (b) what we know versus what we don't, and (c) an alternative strategy."

**6. A Pattern Language — Wikipedia**
URL: https://en.wikipedia.org/wiki/A_Pattern_Language
Dates: 2004-11-17 · 2026-03-22
Excerpt returned: *(none — metadata only)*

---

## Round 2 — queries fired (single multi-query batch)

1. `software design pattern forces and consequences explained`
2. `how to document design patterns effectively template`
3. `common mistakes writing developer coding guidelines`
4. `design system principles documentation examples concrete`

### Round 2 — results (5)

**1. Design Patterns and Guideline Examples to Inspire Your Documentation — Supernova**
URL: https://www.supernova.io/blog/design-patterns-and-guideline-examples-to-inspire-your-documentation
Dates: 2024-08-19 · 2026-06-07
Excerpt returned (verbatim):
> Their goal is to offer solutions to common design challenges, helping teams create consistent and user-friendly experiences without needing to reinvent the wheel when designing user interfaces that rely on the design system.
> …
> - Consistency: ensure all team members are aligned, leading to a cohesive user experience across your product.
> - Efficiency: prevent reinventing the wheel, saving time and resources in the design and development process.
> - Onboarding: help new team members quickly grasp and implement your design language.
> - Decision-making: provide a reference for design choices, reducing ambiguity and debates.

**2. Coding Standards: What Are They and Why Are They Important? — Codacy**
URL: https://blog.codacy.com/coding-standards
Dates: 2026-04-03 · 2026-06-12
Excerpt returned: *(none — metadata only)*

**3. Define your design system's principles — Lesson 2 part 1 (YouTube)**
URL: https://www.youtube.com/watch?v=pwzYVIgga2c
Dates: 2023-05-24 · 2026-05-19
Excerpt returned: *(none — metadata only)*

**4. Software design pattern — Wikipedia**
URL: https://en.wikipedia.org/wiki/Software_design_pattern
Dates: 2003-01-03 · 2026-06-08
Excerpt returned (verbatim):
> The documentation for a design pattern describes the context in which the pattern is used, the forces within the context that the pattern seeks to resolve, and the suggested solution.
> …
> A description of the results, side effects, and trade offs caused by using the pattern.

**5. Design Patterns — SourceMaking**
URL: https://sourcemaking.com/design_patterns
Dates: date null · lastUpdated 2026-06-12
Excerpt returned (verbatim):
> **design pattern** is a general repeatable solution to a commonly occurring problem in software design.
> A design pattern isn't a finished design that can be transformed directly into code.
> It is a description or template for how to solve a problem that can be used in many different situations.
> …
> Design patterns can speed up the development process by providing tested, proven development paradigms.
> Effective software design requires considering issues that may not become visible until later in the implementation.
> Reusing design patterns helps to prevent subtle issues that can cause major problems and improves code readability for coders and architects familiar with the patterns.
> …
> In addition, patterns allow developers to communicate using well-known, well understood names for software interactions.
> Common design patterns can be improved over time, making them more robust than ad-hoc designs.

---

## Coverage / gaps in the raw capture (honest)

- **Excerpt-bearing sources (4):** cursor-rules reference, Reddit agent-rules, Supernova, Wikipedia *Software design pattern*, SourceMaking. (These carry the actual quotable substance above.)
- **Metadata-only (returned but not excerpted by search):** Alexander PDF (Cornell), Wikipedia *A Pattern Language*, NN/G content standards, brcommunity If…Then…, Codacy coding standards, the YouTube principles lesson. Their *titles* corroborate the themes but their bodies were not pulled — they are leads, not yet read in full.
- **Not yet fetched:** none of the full pages were opened with a reader/scraper; the above is search-returned excerpt text only. Deeper fetch of the metadata-only sources (esp. Alexander, RFC 2119, GoF template, NN/G) is the obvious next round if we want primary-source depth.

---

# APPENDIX B — DEEP SOURCE READS

Three research agents each went wide with short queries, then **fetched and read the primary sources in full** (not snippets), returning detailed notes with verbatim quotes and URLs. Pasted below unedited.

---

## LANE 1 — THE PATTERN FORM (Alexander · GoF · POSA · Coplien · Portland)

### THE PATTERN FORM as a structure for writing rules — research notes

These notes are built from full-text reads of primary and authoritative secondary sources (not snippets). Every claim is cited to its URL. Verbatim quotes are in quotation marks.

### 1. Christopher Alexander — *A Pattern Language* / *The Timeless Way of Building*

**The exact anatomy of an Alexander pattern.** Alexander describes his own form in the front matter of *A Pattern Language* (pp. x–xi); Jim Coplien transcribed it verbatim on the c2 wiki. The pattern is a **sandwich**: larger patterns at the top (context), the problem/solution in the middle, smaller patterns at the bottom (links). In order:
> - "A picture, which shows an archetypical example of the pattern.
> - An introductory paragraph, which sets the **context** for the pattern
> - Three delimiting diamonds
> - A headline in bold type that gives the essence of the **problem** in one or two sentences
> - The body, the longest section: background, motivation, variations
> - The **solution**, in bold type: how to solve the problem
> - A diagram, that shows the solution as a labeled picture
> - Another three diamonds to terminate the main body
> - A paragraph that ties the pattern to all the *smaller* related patterns that round out this one"

Source: https://www.c2.com/ppr/wiki/WikiPagesAboutWhatArePatterns/AlexandrianForm.html

Coplien's alternate decomposition (same page): Title, Prologue, Problem statement, Discussion, Solution, Diagram, Epilogue — with:
> - "Problem statement - One or two sentences that summarize the problem solved by the pattern.
> - Discussion - Anywhere from 4 to 40 paragraphs that illuminate the system of forces resolved by the pattern.
> - Solution - One or two sentences that tell you what to do to solve the problem."

**Critique worth keeping (same page).** Dave Harris: *"the problem definition doesn't identify the forces explicitly. It explains the problem, but without breaking it down into forces or explaining why. I would like to see the forces."* — exactly the gap later software forms close by giving Forces its own heading.

**Typographic conventions (load-bearing).** Wikipedia, *Pattern language*:
> "Alexander uses a special text layout to mark the different sections of his patterns. For instance, the problem statement and the solution statement are printed in bold font, the latter is always preceded by the 'Therefore:' keyword."

Evernden/Erskine corroborate the bold solution-as-instruction:
> "This solution is always stated in the form of an instruction so that you know exactly what you need to do, to build the pattern."

Source: http://www.echo.iat.sfu.ca/library/evernden_02_patterns_5forms.pdf

**The star rating = epistemic confidence.** *A Pattern Language* p. xv:
> "the asterisks represent our degree of faith in these hypotheses… no matter what the asterisks say, the patterns are still hypotheses, all 253 of them—and are, therefore, all tentative, all free to evolve under the impact of new experience and observation."

Source: https://en.wikipedia.org/wiki/A_Pattern_Language

**Canonical definition.**
> "Each pattern describes a problem which occurs over and over again in our environment, and then describes the core of the solution to that problem, in such a way that you can use this solution a million times over, without ever doing it the same way twice."

And the three-part rule (introducing *forces*):
> "As an element in the world, each pattern is a relationship between a certain context, a certain system of forces which occurs repeatedly in that context, and a certain spatial configuration which allows these forces to resolve themselves."

Source: https://www.cs.unc.edu/~stotts/COMP723-s15/patterns/gabriel.html

**Patterns form a *language / network*, not a list.** Patterns are ordered by scale (large → small) and cross-reference by number, forming a directed graph.
> "A pattern language… contains links from one pattern to another, so when trying to apply one pattern in a project, a designer is pushed to other patterns… In Alexander's book, such links are collected in the 'references' part, and echoed in the linked pattern's 'context' part – thus the overall structure is a directed graph."
> "Alexander argues that the connections in the network can be considered even more meaningful than the text of the patterns themselves."

**Catalogue vs. language (critical):** patterns with no linking are a *catalogue*, not a *language*.
> "Some authors… like Gamma et al. in *Design Patterns*, make only little use of pattern linking… we would speak of a *pattern catalogue* rather than a *pattern language*."

Source: https://en.wikipedia.org/wiki/Pattern_language

**Forces = the conflict at the center.**
> "Often these problems arise from a conflict of different interests or 'forces'. A pattern emerges as a dialogue that will then help to balance the forces…"

Source: https://en.wikipedia.org/wiki/Pattern_language

### 2. Gang of Four — *Design Patterns* (Gamma, Helm, Johnson, Vlissides)

The GoF template is the **most heavily-headed** form: 13 sections (Hillside, the patterns community's own site), each purpose verbatim:
1. **Pattern Name and Classification** — "The pattern's name conveys the essence of the pattern succinctly."
2. **Intent** — "What does the design pattern do? What is its rationale and intent? What particular design issue or problem does it address?"
3. **Also Known As** — "Other well-known names for the pattern, if any."
4. **Motivation** — "A scenario that illustrates a design problem and how the class and object structures in the pattern solve the problem."
5. **Applicability** — "What are the situations in which the design pattern can be applied?… How can you recognize these situations?"
6. **Structure** — class diagram.
7. **Participants** — "The classes and/or objects participating… and their responsibilities."
8. **Collaborations** — "How the participants collaborate to carry out their responsibilities."
9. **Consequences** — "How does the pattern support its objectives? What are the trade-offs and results of using the pattern? What aspect of system structure does it let you vary independently?"
10. **Implementation** — "What pitfalls, hints, or techniques should you be aware of…?"
11. **Sample Code.**
12. **Known Uses** — "Examples of the pattern found in real systems… at least two examples from different domains."
13. **Related Patterns** — "What design patterns are closely related…? What are the important differences? With which other patterns should this one be used?"

Source: https://hillside.net/index.php/gang-of-four-template

**GoF has no "Forces" heading** — it distributes force-discussion across Motivation/Applicability/Consequences, which is exactly what motivated Coplien to make forces explicit:
> "Many pattern descriptions put their emphasis on the solution… rather than on often conflicting forces… Motivated by this drawback of the GoF form, the Coplien form… defines a more rigid pattern structure. It includes explicit sections for forces and consequences, in which the forces and the implications… are presented in bullet form."

Source: http://sce.carleton.ca/faculty/weiss/papers/2006/mussbacher-vikingplop-2006.pdf

### 3. POSA, Portland Form, Coplien / Canonical Form

**POSA Vol 1** template (verbatim section purposes): Name · Example ("Demonstrate existence of the problem & need for the pattern") · Context · Problem ("Problem addressed & forces associated") · Solution · Structure · Dynamics · Implementation · Variants · Known Uses · Consequences ("Benefits and potential liabilities") · See Also. Signature move = **Example Resolved** (returns to the opening example, shows it solved).
Source: http://www0.cs.ucl.ac.uk/staff/w.emmerich/lectures/3C05-04-05/POSA.pdf

**Portland Form** (Ward Cunningham, c2) — shortest, prose-driven (≤1 page); signature is the bold **"Therefore"** pivot. Shape:
> "such and so forces create this or that problem, therefore, build a thing-a-ma-jig to deal with them." — "The solution name becomes the pattern's title."
> "A wise designer resolves the stronger forces first, then goes on to address weaker ones. Patterns capture this ordering by citing stronger and weaker patterns in opening and closing paragraphs."

Source: https://c2.com/ppr/about/portland.html

**Coplien / Canonical Form** makes forces a first-class bulleted section, adds Resulting Context + Rationale. Sections: **Name → Problem → Context → Forces → Solution → Resulting Context → Rationale**. Field definitions (Evernden/Erskine reproducing Coplien/Lea):
> - **The forces:** "The forces describe pattern design trade-offs; what pulls the problem in different directions, toward different solutions?… Forces reveal the intricacies of a problem and define the kinds of trade-offs that must be considered… A good pattern description should fully encapsulate all the forces which have an impact upon it."
> - **Resulting context:** "This tells which forces the pattern resolves and which forces remain unresolved… and it points to more patterns… sometimes called resolution of forces."

Coplien on linking via context:
> "One can think of a pattern as balancing forces for a problem in one context, leaving a new context. Contexts weave patterns together into a pattern language."

Source: http://csis.pace.edu/~grossman/dcs/SoftwarePatterns_Coplien.pdf

Coplien's five tests for a good pattern: solves a problem · is a proven concept · the solution isn't obvious · describes a relationship · has a significant human component. Source: https://www.cs.unc.edu/~stotts/COMP723-s15/patterns/gabriel.html

### 4. Why FORCES and CONSEQUENCES are the load-bearing fields

The single best quote (Evernden/Erskine):
> "The forces should amplify and illustrate the problem statement because it is through the forces that one fully appreciates the problem. If we understand the forces in a pattern, then we understand the problem (because we understand the trade-offs) and the solution (because we know how it balances the forces)."

Gabriel — without forces it's "merely a solution… not a pattern":
> "This is not a pattern. It is merely a solution to a problem in a context."

Fowler — forces ARE how you reason about applicability:
> "patterns writers talk about forces, because forces are a way of exploring the indications and contra-indications for the pattern."
> "Whenever I think I have a pattern, I try to think about when I would not use the pattern."

Source: https://www.martinfowler.com/articles/writingPatterns.html

Subtlety (Kelly): a *force* is something you intend to resolve; a pressure you can only account for belongs in *Context*, not *Forces*. Source: https://hillside.net/europlop/HillsideEurope/Papers/EuroPLoP2004/2004_Kelly_Business%20StrategyDesignPatterns.pdf

### Comparison of field sets

| Concern | Alexander | GoF | POSA | Coplien | Portland |
|---|---|---|---|---|---|
| Name | ✅ | ✅ +Classification | ✅ | ✅ | ✅ = solution's name |
| Context (→ larger) | ✅ intro | ✅ Applicability | ✅ | ✅ | ✅ |
| Problem | ✅ bold headline | ✅ Motivation | ✅ | ✅ | ✅ |
| **Forces** | ⚠️ in prose | ⚠️ no heading | in Problem | ✅ explicit bullets | ✅ in prose |
| Solution ("Therefore") | ✅ bold | ✅ Structure/Participants | ✅ +Dynamics | ✅ | ✅ after **Therefore** |
| **Consequences/trade-offs** | implied | ✅ Consequences | ✅ benefits+liabilities | ✅ Resulting Context+Rationale | implied |
| Proof | ⭐ star rating | ✅ Known Uses (≥2) | ✅ Known Uses | "proven concept" | — |
| Links to next/smaller | ✅ + numbered refs | ✅ Related (sparse→catalogue) | ✅ See Also | ✅ Resulting Context | ✅ |
| Length | ~6pp narrative | ~12pp, 13 headings | ~12pp | ~2pp | <1pp |

**Trajectory:** all forms reduce to **Name → Context → Problem(+Forces) → *Therefore*/Solution → Consequences/Resulting-Context → Links**; the software community's contribution was promoting *forces* and *consequences* to explicit headings.

### Key takeaways for writing RULES as patterns
1. **Adopt the irreducible skeleton:** Name → Context → Problem(+Forces) → *Therefore*-Solution → Consequences → Links.
2. **Make the FORCES explicit** — don't bury them in prose. Test: *if I deleted the forces, could the reader still tell when NOT to apply the rule?*
3. **Use a single unmissable "Therefore" pivot** from tension to imperative directive.
4. **Name the rule after its solution, memorably,** so the name becomes team vocabulary.
5. **Always state CONSEQUENCES** — the cost ledger, and name the *unresolved* forces (they hand you to the next rule).
6. **Link rules into a LANGUAGE, not a catalogue** — Context points up to the larger rule, Resulting Context down to smaller ones; order by scale.
7. **Encode confidence honestly** (Alexander's star idea) — mark battle-tested vs provisional.
8. **Distinguish a *force* (resolvable) from a *context constraint* (only accountable-for).**
9. **Anchor every rule in a recurring, proven situation with a concrete example** (POSA: Example → Example Resolved).
10. **Heading-count is a dial, not a default** — Portland (<1pp, explicit forces) is usually the sweet spot for concise rules; "more valuable to have a bunch of good patterns, poorly organized than a really good structure with weak patterns" (Fowler).

Source index: c2 Alexandrian Form https://www.c2.com/ppr/wiki/WikiPagesAboutWhatArePatterns/AlexandrianForm.html · c2 Portland https://c2.com/ppr/about/portland.html · Wikipedia Pattern language https://en.wikipedia.org/wiki/Pattern_language · Wikipedia A Pattern Language https://en.wikipedia.org/wiki/A_Pattern_Language · Hillside GoF template https://hillside.net/index.php/gang-of-four-template · Fowler https://www.martinfowler.com/articles/writingPatterns.html · Gabriel/Coplien https://www.cs.unc.edu/~stotts/COMP723-s15/patterns/gabriel.html · Coplien PDF http://csis.pace.edu/~grossman/dcs/SoftwarePatterns_Coplien.pdf · POSA http://www0.cs.ucl.ac.uk/staff/w.emmerich/lectures/3C05-04-05/POSA.pdf · Evernden/Erskine http://www.echo.iat.sfu.ca/library/evernden_02_patterns_5forms.pdf · Mussbacher http://sce.carleton.ca/faculty/weiss/papers/2006/mussbacher-vikingplop-2006.pdf · Kelly https://hillside.net/europlop/HillsideEurope/Papers/EuroPLoP2004/2004_Kelly_Business%20StrategyDesignPatterns.pdf

---

## LANE 2 — RULES FOR AI CODING AGENTS (Cursor · AGENTS.md · Anthropic · field notes)

Method note: the community reference `sanjeed5/awesome-cursor-rules-mdc/cursor-rules-reference.md` is a verbatim mirror of Cursor's own official docs — treated as one source. The genuinely independent value-add is the field-note cluster (HumanLayer, GitHub's 2,500-repo analysis, Sant'Anna, "configs are broken") and Anthropic's own docs.

**SOURCE 1 — Cursor Rules** (https://cursor.com/docs · mirror https://github.com/sanjeed5/awesome-cursor-rules-mdc/blob/main/cursor-rules-reference.md)
Activation modes: Always Apply · Apply Intelligently (agent decides from `description`) · Apply to Specific Files (glob) · Apply Manually (@-mention).
> "Large language models don't retain memory between completions. Rules provide persistent, reusable context at the prompt level."
Best Practices (verbatim): "Good rules are focused, actionable, and scoped. — Keep rules under 500 lines — Split large rules into multiple, composable rules — Provide concrete examples or referenced files — Avoid vague guidance. Write rules like clear internal docs — Reuse rules when repeating prompts in chat."
For Apply-Intelligently rules, **the `description` is the only thing the agent sees when deciding relevance** — a weak/missing description is the #1 silent failure (FAQ confirms). Precedence: "Team Rules → Project Rules → User Rules. All applicable rules are merged; earlier sources take precedence when guidance conflicts" — conflicts resolve by precedence, not reconciliation.

**SOURCE 2 — AGENTS.md** (https://agents.md/ · https://github.com/openai/agents.md)
> "Think of AGENTS.md as a README for agents… the extra, sometimes detailed context coding agents need" — "build steps, tests, and conventions that might clutter a README."
No required fields: "AGENTS.md is just standard Markdown. Use any headings you like." The canonical example is almost entirely **executable commands with flags** plus explicit boundaries ("Run `pnpm lint` and `pnpm test` before committing"). Nesting: "The closest AGENTS.md to the edited file wins; explicit user chat prompts override everything."

**SOURCE 3 — Anthropic, Claude Code best practices** (https://code.claude.com/docs/en/best-practices)
> "Most best practices are based on one constraint: Claude's context window fills up fast, and performance degrades as it fills."
The prune test: "For each line, ask: 'Would removing this cause Claude to make mistakes?' If not, cut it. **Bloated CLAUDE.md files cause Claude to ignore your actual instructions!**"
Include/Exclude table (verbatim): ✅ commands Claude can't guess, code style differing from defaults, testing instructions, repo etiquette, project-specific architecture, env quirks, non-obvious gotchas — ❌ anything inferable from code, standard conventions, detailed API docs (link instead), frequently-changing info, long tutorials, file-by-file descriptions, self-evident advice ("write clean code").
Two diagnostics: "If Claude keeps doing something you don't want despite having a rule against it, the file is probably too long and the rule is getting lost. If Claude asks you questions that are answered in CLAUDE.md, the phrasing might be ambiguous."
Hooks vs instructions: "Unlike CLAUDE.md instructions which are advisory, hooks are deterministic and guarantee the action happens." Verification: "Claude stops when the work looks done… Give Claude something that produces a pass or fail, and the loop closes on its own."

**SOURCE 4 — Anthropic, Claude Code memory** (https://code.claude.com/docs/en/memory)
Four dimensions (verbatim): **Size** — "target under 200 lines… Longer files consume more context and reduce adherence." **Structure** — headers + bullets, "Claude scans structure the same way readers do." **Specificity** — "'Use 2-space indentation' instead of 'Format code properly'." **Consistency** — "if two rules contradict each other, Claude may pick one arbitrarily."
Mechanism: "CLAUDE.md content is delivered as a user message after the system prompt, not as part of the system prompt itself… there's no guarantee of strict compliance, especially for vague or conflicting instructions… To block an action regardless of what Claude decides, use a PreToolUse hook instead."
When to add a rule: "Claude makes the same mistake a second time · a code review catches something Claude should have known · you type the same correction you typed last session · a new teammate would need the same context." Path-scoped `.claude/rules/*.md` with `paths:` frontmatter load only on matching files.

**SOURCE 5 — Anthropic, "Be clear and direct"** (https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/be-clear-and-direct)
Golden rule: "Show your prompt to a colleague with minimal context… If they'd be confused, Claude will be too."
Positive over negative: "**Tell Claude what to do instead of what not to do** — Instead of: 'Do not use markdown' — Try: 'Your response should be composed of smoothly flowing prose paragraphs.'"
Give the why: "never use ellipses *since the text-to-speech engine will not know how to pronounce them*… Claude is smart enough to generalize from the explanation."
Examples: "one of the most reliable ways to steer… Include 3–5 examples," relevant/diverse/structured.
**Modern-model caveat (verbatim):** "Claude Opus 4.5 and Claude Opus 4.6 are also more responsive to the system prompt… these models may now overtrigger. The fix is to dial back any aggressive language. Where you might have said 'CRITICAL: You MUST use this tool when...', you can use more normal prompting like 'Use this tool when...'." → qualifies the older "add IMPORTANT/YOU MUST" advice.

**SOURCE 6 — GitHub, "How to write a great agents.md: Lessons from 2,500+ repositories"** (https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)
Strongest empirical source. Six core areas: "Commands, testing, project structure, code style, git workflow, and boundaries." Do's: "Put commands early… Include flags and options, not just tool names." "One real code snippet showing your style beats three paragraphs describing it." "Set clear boundaries… 'Never commit secrets' was the most common helpful constraint." "Three-tier boundaries: always do, ask first, never do." Method: "Start simple. Test it. Add detail when your agent makes mistakes."

**SOURCE 7 — HumanLayer, "Writing a good CLAUDE.md"** (https://www.humanlayer.dev/blog/writing-a-good-claude-md)
The instruction budget: "Frontier thinking LLMs can follow ~150-200 instructions with reasonable consistency"; Claude Code's own system prompt is "~50 individual instructions." Crucially: "As instruction count increases, instruction-following quality decreases **uniformly**" — a marginal low-value rule degrades adherence to *every* rule. Keep <60 lines internally; "<300 lines is best." "Never send an LLM to do a linter's job." Why Claude ignores it: the system-reminder says the context "may or may not be relevant… do not respond unless highly relevant," so non-universal rules get dismissed → include only universally-applicable info. "Prefer pointers to copies" (copies go stale). Contrarian: "Don't use `/init` or auto-generate your CLAUDE.md" (directly contradicts Anthropic's "run /init then refine" — flagged disagreement).

**SOURCE 8 — Field notes cluster**
- Sant'Anna (https://psantanna.com/claude-code-my-workflow/workflow-guide.html): "If it exceeds ~150 lines, Claude starts ignoring rules silently." (independent corroboration)
- avifenesh, "Your AI Agent Configs Are Probably Broken" (https://dev.to/avifenesh/your-ai-agent-configs-are-probably-broken-and-you-dont-know-it-16n1): silent-failure catalogue — malformed YAML, PascalCase-vs-kebab-case names, missing trigger phrases, wrong hook event names, files over tool caps (Windsurf 12k chars, Copilot ~4k chars). "Important instructions buried mid-file get deprioritized due to primacy/recency effects."
- Dust (https://dust.tt/blog/how-to-write-ai-agent-instructions): "Set clear rules about what the agent should never do. This is the most frequently skipped section and the one that causes the most production failures." "Most effective agent instructions run 200-500 words."
- Addy Osmani (https://addyosmani.com/blog/good-spec/): "Divide and conquer: give the AI one focused task at a time."
- Karpathy four rules (https://themenonlab.blog/blog/karpathy-claude-md-four-rules-ai-coding-agents): Think Before Coding · Simplicity First · Surgical Changes ("Touch only what you must… Flag—don't delete—pre-existing dead code") · Goal-Driven Execution.

### CONSOLIDATED — what makes an agent-consumable rule effective (each traced)
1. **Be specific and verifiable, not vague** (memory; best-practices; Cursor; be-clear-and-direct).
2. **Treat the agent as a capable new hire with zero project context** (be-clear-and-direct; HumanLayer).
3. **Mind the instruction budget — every rule taxes every other rule** (~150–200; degrades uniformly) (HumanLayer).
4. **Keep the always-loaded file short** — <200 lines (Anthropic), <500 (Cursor), <60–300 (HumanLayer), >~150 silent-fail (Sant'Anna); tool caps exist.
5. **Apply the prune test to every line** (best-practices).
6. **Exclude what the model already knows or can read** (best-practices include/exclude; HumanLayer "don't send an LLM to do a linter's job").
7. **One concern per rule; split and scope as it grows** (Cursor; Dust; Osmani).
8. **Scope rules to where they apply** (glob/path) so they don't compete for attention (Cursor; memory; agents.md).
9. **Make auto-attached rules self-describing** — the `description` is all the agent sees (Cursor).
10. **Lead with executable commands, including flags** (GitHub 2,500; agents.md).
11. **Show one real example instead of describing** — better, point at an exemplar file (GitHub; be-clear-and-direct; Cursor).
12. **State explicit boundaries — always do / ask first / never do** — most-skipped, highest-impact (GitHub; Dust).
13. **Prefer positive/imperative phrasing — tell it what TO do** (be-clear-and-direct).
14. **Give the *why* behind a rule** (be-clear-and-direct; HumanLayer WHAT/WHY/HOW).
15. **Use emphasis sparingly — it can backfire on current models** (best-practices vs prompt-eng).
16. **Provide a verification hook in the rule itself** (best-practices; Karpathy #4).
17. **Eliminate contradictions; conflicts resolve silently by precedence** (memory; Cursor; avifenesh).
18. **Position the most important rules at top or bottom** (avifenesh, primacy/recency).
19. **Use structure (headers + bullets)** (memory; Cursor).
20. **Keep only universally-applicable content always-loaded; everything else is progressive disclosure** (HumanLayer; memory; best-practices).
21. **For anything that MUST happen every time, use a deterministic hook, not a rule** (best-practices; memory).
22. **Write a rule only once a pattern earns it; then iterate empirically** (memory; GitHub; best-practices).
23. **Validate that the rule actually loads/fires — silent failure is the default** (avifenesh; Cursor FAQ).
24. **Constrain scope/over-engineering explicitly when you want minimal diffs** (Karpathy; be-clear-and-direct anti-overengineering block).

Two field disagreements flagged: (a) `/init` auto-generation — Anthropic pro, HumanLayer con (reconcile: scaffold then hand-curate); (b) emphasis words — older best-practices endorse, current prompt-eng warns of overtriggering (reconcile: reserve for the few rules that need force).

---

## LANE 3 — NORMATIVE LANGUAGE & STANDARDS (RFC 2119/8174 · style guides · MISRA/CERT/ESLint/PEP 8 · business-rules theory)

### Normative Language and Standards for Phrasing Rules — Research Notes

Every source below was fetched and read; quoted text is verbatim, with full URLs.

### 1. RFC 2119 + RFC 8174 (BCP 14) — the keyword system

**RFC 2119** ("Key words for use in RFCs to Indicate Requirement Levels," Bradner, March 1997; BCP 14). URL: https://www.rfc-editor.org/rfc/rfc2119
The five definitions (verbatim):
> "**MUST** This word, or the terms 'REQUIRED' or 'SHALL', mean that the definition is an absolute requirement of the specification.
> **MUST NOT** … an absolute prohibition…
> **SHOULD** This word, or the adjective 'RECOMMENDED', mean that there may exist valid reasons in particular circumstances to ignore a particular item, but the full implications must be understood and carefully weighed before choosing a different course.
> **SHOULD NOT** … there may exist valid reasons in particular circumstances when the particular behavior is acceptable or even useful, but the full implications should be understood and the case carefully weighed…
> **MAY** This word, or the adjective 'OPTIONAL', mean that an item is truly optional."

§6 "Guidance in the use of these Imperatives" (verbatim — the caution against overusing MUST):
> "Imperatives of the type defined in this memo must be used with care and sparingly. In particular, they MUST only be used where it is actually required for interoperation or to limit behavior which has potential for causing harm… they must not be used to try to impose a particular method on implementors where the method is not required for interoperability."

§7 Security Considerations: authors "should take the time to elaborate the security implications of not following recommendations or requirements."

Takeaways: SHOULD ≠ optional — deviation requires "valid reasons" *and* "full implications… weighed"; "the force of these words is modified by the requirement level of the document in which they are used."

**RFC 8174** (Leiba, May 2017; updates 2119): "only UPPERCASE usage of the key words have the defined special meanings." The modern boilerplate ends "…when, and only when, they appear in all capitals, as shown here." URL: https://www.rfc-editor.org/rfc/rfc8174 — i.e. uppercase is the *trigger* that switches a word from ordinary English to a binding requirement.

### 2. Exemplary style guides as rule-writing models

**Google Developer Documentation Style Guide** (https://developers.google.com/style):
- Active voice (https://developers.google.com/style/voice): "use active voice… instead of passive voice"; "Make clear who's performing the action."
- Present tense (https://developers.google.com/style/tense): "Use present tense for statements that describe general behavior… avoid the hypothetical future *would*."
- Imperative (https://developers.google.com/style/person): "If you're telling the reader to do something, then use the imperative (the *you* is implied)."
- Word list (https://developers.google.com/style/word-list): **must** = "required action or state"; **should** = "Generally avoid. Because *should* is ambiguous by definition…"; **may** = "reserve for official policy or legal… To convey permission, use *can*"; **can** = permission/ability; **might** = possibility; **please** = "Don't use… in the normal course of explaining how to use a product."

**Google C++/Python Style Guides — the Definition / Pros / Cons / Decision structure** (the model for a non-trivial rule):
C++ "Exceptions" (https://google.github.io/styleguide/cppguide.html): one-line verdict "We do not use C++ exceptions." → Definition → Pros → Cons → Decision, closing by naming exactly what it covers ("This prohibition also applies to…"). The eight **Goals** double as criteria for exceptions, incl. "Style rules should pull their weight" and "Optimize for the reader, not the writer."
Python (https://google.github.io/styleguide/pyguide.html) §2.10 Lambdas: "Okay for one-liners." → Definition/Pros/Cons/Decision. Verdicts are bare assertions: "Lambdas are allowed." / "Optimize for readability, not conciseness."

**Microsoft Writing Style Guide**:
- Top-10 (https://learn.microsoft.com/en-us/style-guide/top-10-tips-style-voice): "Most of the time, start each statement with a verb."
- Verbs (https://learn.microsoft.com/en-us/style-guide/grammar/verbs): "use the indicative mood. It's crisp and straightforward without being bossy"; imperative for "Instructions, procedures, direct commands"; subjunctive "avoid"; "Keep it active whenever you can"; present tense "the best choice for most content."
- should vs must (https://learn.microsoft.com/en-us/style-guide/a-z-word-list-term-collections/s/should-vs-must): "Use *should* only to describe an action that's recommended but optional… Use *must* only to describe a required action"; "Don't use *should* to indicate probability… use *might*"; "make your tone helpful, not bossy."
- can/may (…/c/can-may): "Don't use *may,* which might be interpreted as providing permission."

### 3. Coding-standards literature — purpose and rule structure

**MISRA C:2012** (https://misra.org.uk/ amendments; defs reproduced in Bagnara & Hill https://arxiv.org/pdf/2112.12823):
> "A **directive** is a guideline for which it is not possible to provide the full description necessary to perform a check for compliance… A **rule** is a guideline for which a complete description of the requirement has been provided."
Categories (verbatim): "**Mandatory:** …must comply… deviation is not permitted. **Required:** …shall comply… a formal deviation is required where this is not the case. **Advisory:** recommendations that should be followed as far as is reasonably practical… non-compliances should be documented."
Each guideline carries **Category / Analysis / Applies to / Amplification / Rationale / Exception(s) / Example** — Amplification defines terms/scope, Rationale explains why, Exception is first-class. Requirement text uses **shall**.

**SEI CERT C** (https://cmu-sei.github.io/secure-coding-standards/): a guideline is a **Rule** iff (1) violation likely causes a safety/security defect, (2) no reliance on annotations/assumptions, (3) conformance determinable by automated analysis/inspection; else a **Recommendation**. Rule titles ARE imperatives ("Do not dereference null pointers"); structure = description → repeated Noncompliant/Compliant pairs → Risk Assessment (Severity × Likelihood × Remediation Cost → Priority/Level) → Related Guidelines. Examples grounded in real CVEs.

**PEP 8** (https://peps.python.org/pep-0008/) — "A Foolish Consistency…": "code is read much more often than it is written"; "Consistency with this style guide is important. Consistency within a project is more important. Consistency within one module or function is the most important. However, know when to be inconsistent…" + four explicit reasons to ignore a guideline. **Linux kernel style** (https://www.kernel.org/doc/html/latest/process/coding-style.html): per-rule explicit "Rationale:" tied to concrete failure modes ("never break user-visible strings… that breaks the ability to grep for them"). **ESLint** (https://eslint.org/docs/latest/rules/no-unused-vars): Rule Details / Options / **When Not To Use It** / Related Rules; incorrect/correct example pairs; severity off/warn/error.

**The converged rule skeleton:** Normative statement (imperative title) · Amplification/scope · Rationale (tied to a concrete failure mode) · Trade-offs (Pros/Cons) · Decision/verdict · Compliant/non-compliant examples · Exceptions/when-not-to-apply · Severity class · Tool-checkability. "The strongest rules are grounded in a concrete failure mode, not abstract taste."

### 4. Business-rules theory

**Business Rules Manifesto** (https://www.businessrulesgroup.org/brmanifesto.htm): "Rules are not process and not procedure" (2.2); "Rules should be expressed declaratively in natural-language sentences" (4.1); "If something cannot be expressed, then it is not a rule" (4.2); "A set of statements is declarative only if the set has no implicit sequencing" (4.3); "Exceptions to rules are expressed by other rules" (4.7); "'More rules' is not better. Usually fewer 'good rules' is better" (8.4).

**Ronald Ross, "What Is a Business Rule?"** (https://www.brcommunity.com/articles.php?id=b525):
> "a rule serves as a *criterion* for making decisions." "A rule always tends to remove a degree of freedom… If some guidance is given but does not tend to remove some degree of freedom… it is not a rule per se. Such guidance is called an *advice*."
> "All rules are either *behavioral*… or *definitional*… Behavioral rules always carry the sense of *obligation* or *prohibition*… RuleSpeak prescribes the rule keywords *must* or *only*… Definitional rules always carry the sense of *necessity* or *impossibility*… *always* or *never*."
> On softening: a *must* restated as *should* "is still a business rule, only with a lighter sense of prohibition. What actually changed was its presumed *level of enforcement*… now it's simply a *guideline*." But: "it's better to use consistent wording for all behavioral rules… Guidance is one thing; level of enforcement is another."
> "if-then syntax is not well suited for expressing behavioral rules."

**RuleSpeak** (https://www.rulespeak.com/en/): every rule statement includes exactly one Rule Keyword — **must** or **only**; advice uses **may** / **need not**. "'if' indicates qualification continuous over time; 'when'… applies only at certain point(s) in time." Avoid bare "may … if" (no "only").

**Governance hierarchy:** policy/standard/procedure = mandatory & binding; **guideline** = advisory/recommended; **principle** = the underlying justified value that informs the rest (TOGAF principle = Name + Statement + Rationale + Implications, https://pubs.opengroup.org/architecture/togaf92-doc/arch/chap20.html).

**SBVR alethic vs deontic** (https://en.wikipedia.org/wiki/Semantics_of_Business_Vocabulary_and_Business_Rules): alethic (necessity/possibility → "it is necessary/impossible that") = structural/definitional rules; deontic (obligation/permission/prohibition → "it is obligatory/permitted/prohibited that") = operative/behavioral rules.

### 5. Normative phrasing toolkit (synthesized, traced)

**Requirement-level vocabulary** — one controlled term per intended force:

| Intended force | Keyword(s) | Source |
|---|---|---|
| Absolute obligation | MUST / REQUIRED / SHALL (uppercase); RuleSpeak *must* | RFC 2119 §1; RFC 8174; b525 |
| Absolute prohibition | MUST NOT / SHALL NOT; *must not* (≡ "may…only") | RFC 2119 §2; b676 |
| Recommendation (deviation allowed, justified) | SHOULD / RECOMMENDED; MISRA Advisory | RFC 2119 §3; MISRA |
| Discouragement | SHOULD NOT / NOT RECOMMENDED | RFC 2119 §4 |
| Restricted permission | *may … only …* | RuleSpeak |
| Permission / optional | MAY / OPTIONAL; "can" (Google/MS) | RFC 2119 §5; Google; MS |
| Possibility (not a rule) | *might* / "can" (outcome) | Google; MS |
| Definitional necessity | *always*; "it is necessary that" | b525; SBVR |
| Definitional impossibility | *never*; "it is impossible that" | b525; SBVR |

Disambiguation guards: uppercase = the normative trigger (RFC 8174); never use SHOULD for probability (MS); avoid "may" for permission, prefer "can" (MS/Google); don't mix guidance with enforcement level (Ross).

Other toolkit items: **SHOULD carries an obligation to justify deviation** (RFC 2119 §3; MISRA deviation process). **Don't overuse MUST** — reserve for safety/correctness/interop (RFC 2119 §6; Google Goal 1; Manifesto 8.4). **Declarative, atomic, subject-first** — state WHAT not HOW (Manifesto 2.2/4.1/4.3), one explicit singular subject, exactly one rule keyword, "if"=continuous / "when"=point-in-time (RuleSpeak). **Imperative mood, active voice, present tense, indicative for facts, direct-not-bossy, cut politeness filler** (Google + Microsoft). **Do/Don't + compliant/non-compliant example pairs** as the dominant illustration device.

**Full rule anatomy (when >1 line):** (1) Normative statement, one keyword · (2) Amplification/scope · (3) Rationale tied to a concrete failure mode · (4) Trade-offs (Pros/Cons) for contested rules · (5) scoped Decision/verdict · (6) paired examples · (7) Exceptions/when-not-to-apply (first-class) · (8) severity/enforcement class · (9) consistency/precedence note.

**Classify before phrasing:** behavioral (violable; must/must not/only; deontic) vs definitional (not violable; always/never; alethic); rule (removes a degree of freedom) vs advice (may/need not); rule vs principle (a principle sits above and justifies rules — Name+Statement+Rationale+Implications).

Retrieval caveats (lane 3): RFC 2119 verbatim text reconstructed from three agreeing IETF mirrors + OASIS reproduction (primary refused on copyright grounds); MISRA full text paywalled, quoted from official amendment PDFs + Bagnara (MISRA WG member); CERT URLs migrated wiki.sei.cmu.edu → cmu-sei.github.io; RuleSpeak PDFs image-based, cross-confirmed against brcommunity HTML; Business Rules Manifesto "fewer good rules" is Article 8 (not 7) in canonical v2.0.

---
