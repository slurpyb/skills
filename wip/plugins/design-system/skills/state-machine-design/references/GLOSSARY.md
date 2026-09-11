# Glossary

Here is the vocabulary for this skill. Use these words. Not synonyms, not whatever term feels natural in the moment. These words.

We anchored on the W3C SCXML spec's own terms wherever SCXML has one. It is the closest thing to an industry standard, so it wins ties. Where SCXML is silent, we fall back to Harel's original 1987 terms. Every file in this skill, and every artifact this skill produces, uses this list and nothing else. Check [SOURCES.md](SOURCES.md) if you want to see where a term choice came from, or where the sources fought about it.

**State**:
A distinct mode of behavior. While it is active, the system responds to events differently than it would in any other state. Atomic means a leaf, no substates, unless we say otherwise.
_Avoid_: mode, status. Call it a state even when that feels too formal.

**Compound state**:
A state that contains child states, exactly one of which is active at a time. Build one when several states already share transitions or behavior worth factoring out. Not for organization. Organization is not a reason to nest.
_Avoid_: composite state, or-state, parent state, nested state. Different sources use all four. Pick "compound" and never look back.

**Parallel state**:
A state whose children ("regions") are all active at once, independently. Use this for concerns that are genuinely independent, not just things that happen to occur at the same time.
_Avoid_: orthogonal state, AND-state. These are Harel's original 1987 words. Historically correct, but SCXML and nearly every engine we checked settled on "parallel."

**Region**:
One child of a parallel state. Regions should never transition to each other directly. If one region needs to react to another, that is a guard checking the other region's active state, not a straight line between them.

**Configuration**:
The full, legal set of states that are active right now. One atomic state per active region, plus every one of their ancestors. Once you have hierarchy or parallel regions, there is no single "current state" anymore. This is what "the state" of a running machine actually means.
_Avoid_: state value (that is XState's word for it, fine to mention once, not the term we use), active state set.

**Event**:
A named signal the machine responds to. It either happened or it did not. No partial events, no maybes.
_Avoid_: trigger, message. Real synonyms, used by real engines (Stateless and `transitions` call events "triggers"; gen_statem splits them into call, cast, and info for actor-model reasons). Still, "event" is the word that carries across every source.

**Transition**:
The rule. From this state, on this event, if this guard passes, go to that state, and run these actions. This is the atomic unit of behavior in a state machine. Everything else in this glossary exists to describe pieces of a transition.

**Guard**:
A pure, side-effect-free condition that decides whether an otherwise-matching transition actually fires. If you keep writing the same guard on the same event from the same state, stop. That is a signal to build a **condition state**, or split the state outright, instead of stacking guards.
_Avoid_: condition, guard clause, predicate, check, gate. "Condition" especially shows up everywhere (python-statemachine, `transitions`, Samek all use it). Say "guard" anyway.

**Action**:
Executable behavior attached to a transition, or to a state's entry or exit. Three kinds. **Entry action** runs when a state becomes active. **Exit action** runs when it stops being active. **Transition action** runs while moving between states, after exit and before entry.
_Avoid_: callback, side effect, handler, executable content. "Executable content" is SCXML's own formal term and it is accurate, but every engine's public API just calls this an action. So do we.

**Activity**:
Long-running work. Not the same as an action, which is instantaneous. An activity starts on entry and has to be stopped explicitly on exit: polling, a spinner, a subscription. Not every engine has a real primitive for this. SCXML does not. You simulate it with `invoke`, or with manual start and stop actions.
_Avoid_: do-action. That is Spring's and UML's word. Mention it once, then drop it.

**Context**:
Extended state. Data the machine carries that does not, by itself, change which events get handled. Here is the sharp test, borrowed from gen_statem, the best-stated rule in all of our research: if a piece of data changes which transitions are even valid, it belongs in a state, not in context.
_Avoid_: data model (SCXML's formal term, fine as a gloss), variables, or just "data" on its own, which means nothing.

**Pseudostate**:
A state the machine can never actually rest in. It gets resolved to a real state immediately. Three kinds: **initial state** (where you start by default), **history state**, and **condition state**.

**Condition state**:
A pseudostate that exists to consolidate guard logic that would otherwise get duplicated across several incoming transitions. It does for guard branching what hierarchy does for shared transitions. This is Harel's original device (drawn as a circled C). Modern engines rarely implement it as its own construct. Usually you hand-build it as a state made entirely of automatic transitions.
_Avoid_: choice pseudostate, junction. UML's names for close to the same idea, split by whether the guard is checked at design time or runtime. Most teams do not need that distinction.

**History state**:
A pseudostate that, when you re-enter a compound state, resumes into whatever substate was active before, instead of jumping to the default initial one. **Shallow** remembers just the immediate child. **Deep** remembers the whole nested configuration. The very first entry, before the parent has ever been visited, falls back to an explicit default target. History only takes over the second time and after.

**Self-transition**:
A transition whose target is its own source. It still fully re-runs exit and entry actions, and it resets any pending delayed transitions. People reach for this expecting a no-op. It is not one. Remember that.

**Internal transition** / **External transition**:
These only differ when the target is a descendant of a compound source state. External, the default, exits and re-enters the source, so its entry and exit actions run. Internal skips the source's own entry and exit, and only fires entry and exit for states strictly between source and target. Getting this backwards is a well-documented, easy way to ship a bug.
_Avoid_: local transition. SCXML and statecharts.dev's alternate name for "internal." Same thing.

**Automatic transition**:
A transition with no triggering event. It gets checked, and taken if its guard passes, the instant the machine is otherwise idle. Chain a few of these together with only guards, and that is how a condition state resolves.
_Avoid_: always (XState's name for it), eventless transition, transient transition. All correct. Pick one and stop switching between them mid-document.

**Delayed transition**:
A transition that fires after a fixed or computed duration, and cancels automatically if the state gets exited first. Not every engine has this built in. SCXML fakes it with a delayed self-send plus a cancel.

**Invoke** / **Actor**:
Invoke spawns a running process, a child machine, a promise, a subscription, tied to a state's lifecycle. It starts on entry, tears down on exit, and only talks to the parent through events in and out. Actor is the broader word for the running thing itself. Useful once you have more than one invoked or spawned process to talk about together. Treat both as an escape hatch. Reach for them last, never first.

**Run-to-completion (RTC)**:
The guarantee that one external event gets fully processed, including every internal event and automatic transition it cascades into, before the next external event is even looked at. This is the single most load-bearing guarantee across every engine we checked. Break it, by letting events interleave out of order, and you get the classic hard-to-reproduce bug.

**Microstep** / **Macrostep**:
A microstep is one cycle: exit, then transition actions, then entry. A macrostep is the full chain of microsteps that one external event triggers, ending when the machine settles into a stable configuration with nothing left to fire automatically. One external event. Exactly one macrostep.
_Avoid_: step and superstep. Statemate's own original names for these two things, and they point the opposite direction you would guess. See [the terminology conflicts below](#terminology-conflicts).

**Final state**:
A state that marks its region, or the whole machine, as done. A parallel state only counts as done once every one of its regions has independently reached its own final state.

## Terminology conflicts

Know these before you assume anything is universal.

**Transition priority direction is a real fight, not a naming quirk.** When two enabled transitions conflict across a hierarchy boundary, SCXML, XState, and the OO statecharts lineage (Harel and Gery, 1997) all give priority to the more specific, innermost state. The original Statemate semantics (Harel and Naamad, 1996) gave priority to the outermost state instead. Same author, two papers, opposite answers. Spring Statemachine makes this a config option (`transitionConflictPolicy: CHILD | PARENT`) because both conventions are alive in production. Know which one your engine picked. Do not assume.

**"Step" means the opposite thing depending on who wrote it.** Statemate's own "step" equals SCXML's "microstep." Statemate's "superstep" equals SCXML's "macrostep." We use SCXML's names, because they are the ones you are more likely to run into today.

**Guard versus condition, action versus callback: naming only, no real difference.** python-statemachine and `transitions` both call the exact same thing SCXML and XState call a "guard" or an "action" by the name "condition" or "callback" in their own APIs. We picked guard and action. Everyone else's word still means the same thing.

**Hierarchy and parallel regions are not universal, and that is not a flaw.** SCXML, Harel's original paper, XState, Spring, and python-statemachine treat them as fundamental. Stateless, `transitions` without its extension, Robot, and the entire actor-model lineage (`gen_statem`) leave them out entirely, on purpose. This is not one camp being wrong. It is two different problems: UI and component behavior versus backend process and message handling. See step 12 in [METHODOLOGY.md](METHODOLOGY.md).
