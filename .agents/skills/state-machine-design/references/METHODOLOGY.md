# Methodology

Here is the process, built from Harel's original statecharts formalism, the W3C SCXML spec, and how XState, Spring Statemachine, Stateless, python-statemachine, `transitions`, `gen_statem`, and Robot actually get used. Not any single one of them. All of them, argued against each other. Use the terms in [GLOSSARY.md](GLOSSARY.md) exactly. Don't drift.

## 1. Recognize the shape

A problem is a state machine when the system responds to the same event differently depending on some finite mode it is in, and that mode is one of a small, countable set of possibilities that rule each other out.

Here is the tell, and it shows up everywhere: the boolean-soup smell. Several flags that look independent (`isLoading`, `isError`, `hasData`, `isRetrying`) but most of their combinations never actually happen. The ones that do happen get handled by threading if-chains through every event handler. XState's own docs point to this. Samek's crash course points to it. Statecharts.dev built an entire chapter around it. This is not an edge case. This is the case.

Ask yourself: could you plausibly end up with `isLoading: true, hasData: true, isError: true` all at once, and would that be a bug? If yes, you have a state machine. Every combination that is actually reachable is a candidate state.

Two signs this is not worth modeling as a state machine. First, behavior never actually changes across your candidate states. Then it is one state with some display logic, not several states. Second, the "modes" are not mutually exclusive, several can be true at once, and behavior depends on the combination, not on transitions between them. That is just a pile of independent booleans, and forcing it into a state machine recreates the exact problem statecharts exist to solve, with none of the payoff.

## 2. Determine scope

Model one component, one process, or one meaningful lifecycle. Not a whole application. Every source that talks about scope says the same thing: statecharts.dev calls the alternative "a statechart from hell." If your design keeps absorbing new screens, forms, and unrelated features into one machine, stop and split it. Usually into a parent and child relationship through `invoke`, or into separate machines that talk to each other through events.

## 3. Elicit the behavior

Before you name a single state, find out what actually happens. Here is Harel's own method, from the Lavi avionics project (see [SOURCES.md](SOURCES.md)): ask a domain expert one deceptively simple question, over and over, for every event, in every state. "What happens when...?" Ask it about the cases nobody thought to mention too. This surfaces the error paths, the timeouts, the "nothing happens because it's already in progress" case, far better than starting from a diagram ever will.

No domain expert on hand? Ask the same question of the code you already have. If conditional logic already exists, it is already an implicit state machine. Your job is to make it explicit, not invent new behavior.

## 4. Name states and events

Now write down the finite set of states and the finite set of events, using the words in [GLOSSARY.md](GLOSSARY.md). Two rules, and both came up again and again across every source:

Name states so a non-engineer could read them. Harel has a story about this: a pilot corrected a transition arrow on a whiteboard, because the notation was clear enough for a domain expert to catch a mistake. XState's docs state the same rule outright.

And the sharpest test we found anywhere, for where a state boundary belongs: different behavior in response to the same event means a different state. Identical behavior means the same state. That is it. That is the whole test.

## 5. Design the happy path first, flat

Model the main path as a flat sequence of states. No hierarchy. No parallel regions. Not yet. Samek calls this "High-Level Design," his second step. XState's docs say it plainly: "begin with a flat state structure and only introduce parent states when patterns emerge." Hierarchy and parallel regions are refactors you apply once duplication or genuine independence shows up. They are not where you start.

## 6. Model the whole workflow, not just success

Now add what the happy path leaves out. Error states. Retry and recovery states. Timeouts. A state for "an event arrived while we were already busy." This is where step 3 pays for itself. Almost everything a first pass misses lives here, not in the happy path.

## 7. Add guards, keep them pure

A guard gates a transition on a condition. Every source that talks about guard hygiene agrees on two things. First, guards must be pure. No side effects. Stateless says it. python-statemachine says it. XState says it. Put side effects in actions, never in guards. Second, too many guards is itself a problem. Statecharts.dev's glossary has an entire "Criticism" section on this: heavy guard use just rebuilds the if-chain mess statecharts are supposed to remove. If you keep writing the same guard condition on multiple transitions, or across multiple states, that is your signal. Promote it. Either to a **condition state** that consolidates the branching once, or to an actual state split. Go back to step 4 or 5.

## 8. Scavenge for reuse, then add hierarchy

Once you have the flat happy path plus every edge case, look for transitions that repeat, word for word, across sibling states. Samek names this step outright: "Scavenging for Reuse." He is blunt about it: reuse does not come automatically, you have to go hunting for it. When you find it, pull the shared substates into a **compound state**, so the shared transition gets defined once, at the parent. Keep the nesting shallow. Only nest when children genuinely share behavior. Never nest just to make the diagram look organized. Deep nesting costs comprehension and buys you nothing. XState's docs say this directly.

## 9. Split independent concerns into parallel regions

Only when two or more aspects of your state are genuinely independent, meaning one can change without touching the other, model them as separate **regions** of a **parallel state**. Do not model them as a cross-product of combined states. The payoff here is not a feeling, it is a number, and it shows up in Harel's original 1987 paper, in Samek, and in STL4IoT: model n independent binary concerns as a cross-product and you get 2^n combined states. Model them as parallel regions and you get roughly n states, total. And do not wire transitions directly between regions. XState's docs warn against this explicitly. If one region needs to react to another, that is a **guard** reading the other region's active state. Not a straight line drawn between them.

## 10. Add history only for genuine "resume where I left off"

A history state earns its place when re-entering a compound state should skip the default initial substate and pick up wherever it actually was. Not as a default you bolt onto every compound state out of habit. Decide shallow versus deep on purpose: shallow resumes one level, deep resumes the exact nested configuration. And remember the cold-start case: the very first entry, before the parent has ever been active, uses history's own default target. There is nothing to remember yet.

## 11. Note the advanced escape hatches, don't reach for them by default

Three constructs exist for real needs, but none of them should shape your first draft. **Invoke and actors**, for spawning a child process, promise, or subscription tied to a state's lifecycle. Think of it as the async version of an entry action. **Activities**, for long-running work that is not naturally event-shaped. **Delayed transitions**, for timers. Bring each one in only when the actual need shows up. Not before.

## 12. Decide the representation last, and match the paradigm

Pick a concrete representation based on where this machine will actually live. This is deliberately your last decision. Everything from step 1 through step 11 should hold up regardless of what code it turns into.

If this is UI or component behavior, frontend, an embedded device's interface, anything with real orthogonal concerns and resumable modes, the Harel lineage fits well: an XState-style config, Spring Statemachine's fluent builder, python-statemachine's declarative classes, or your own reducer or transition table if a library is overkill.

If this is a backend process or service, hierarchy and parallel regions are often the wrong call entirely. The actor-model lineage, `gen_statem`, deliberately has neither, because the real question there is which messages this process will currently accept, not what's visually active at once. A flat machine with a rich `Context` field is frequently the better design for a backend process. Not a simplified version of a better one. Do not import parallel-region thinking into an actor just because it helped in step 9.

Not sure which paradigm fits? Ask this: are you describing what a user or operator perceives, or what messages a process will accept? The answer picks the representation family for you.

## Subtleties worth telling whoever reads the design

Transition priority across a hierarchy boundary is not something everyone agrees on. See the [terminology conflicts in GLOSSARY.md](GLOSSARY.md#terminology-conflicts). State which convention your engine uses, if it matters here.

Guard evaluation order across parallel regions is left unspecified by UML and SCXML, on purpose. Write guards so the order genuinely cannot change the outcome. No shared mutable state, no races between two regions' guards.

UML's textbook transition sequence, guard then exit then transition-action then entry, has a real defect. It runs the transition action after the source state has already been exited. Samek compares it to calling a method on an object that's half-destroyed. Prefer guard, then transition-action, then exit and entry as one atomic unit, unless your engine forces the other order on you.
