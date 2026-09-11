---
name: state-machine-design
description: Use when a feature involves multiple states or transitions. Recognizes the shape, names states and events, designs guards, actions, and hierarchy, and visualizes or simulates the result.
---

# State Machine Design

A framework-agnostic methodology for designing state machines. Built from Harel's foundational statecharts papers, the W3C SCXML spec, and how XState, Spring Statemachine, Stateless, python-statemachine, and Erlang's `gen_statem` actually get used. Not any single one of them. Use [GLOSSARY.md](references/GLOSSARY.md)'s terms exactly. See [SOURCES.md](references/SOURCES.md) for what this is built on, and where the sources disagree with each other.

## 1. Recognize the shape

Is this actually a state machine? Here's the tell: the same event gets handled differently depending on a finite, countable mode. It's often hiding as a pile of booleans where most combinations never actually occur, the boolean-soup smell. See [METHODOLOGY.md](references/METHODOLOGY.md#1-recognize-the-shape).

## 2. Determine scope and elicit the behavior

Model one component, one process, one lifecycle. Not a whole application. Find out what actually happens before you design anything: ask "what happens when...?" for every event, in every candidate state, including the cases nobody thought to mention. See [METHODOLOGY.md](references/METHODOLOGY.md#2-determine-scope) and [#3](references/METHODOLOGY.md#3-elicit-the-behavior).

## 3. Name states and events

Write down the finite state and event set, using [GLOSSARY.md](references/GLOSSARY.md)'s terms only. No loose synonyms. Different behavior on the same event means a different state. Identical behavior means the same state.

## 4. Design the machine

Flat happy path first. Then the rest of the workflow: errors, retries, timeouts. Then guards, pure, no side effects. Then hierarchy, only once duplication actually shows up, scavenge for reuse, don't nest ahead of time. Then parallel regions, only for concerns that are genuinely independent. Then history, only for a real "resume where I left off" need. Full detail in [METHODOLOGY.md](references/METHODOLOGY.md), including exactly where the sources disagree: transition-priority direction, guard order across regions.

## 5. Choose a representation

Pick whatever's idiomatic where this machine will actually live. An XState-style config or a reducer for UI and component behavior. A flat machine with a rich context for a backend process or actor, hierarchy and parallel regions come from the UI-statechart lineage, they are not universal, don't force them onto an actor-model design. See [METHODOLOGY.md](references/METHODOLOGY.md#12-decide-the-representation-last-and-match-the-paradigm).

## 6. Visualize

Never end on prose alone. Three tiers, and you only climb as far as the machine actually demands. A **Mermaid** diagram by default. A **`state-machine-cat`**-rendered static SVG once there's a history state (Mermaid cannot render one at all) or the layout has gotten genuinely hard to read. A **self-contained interactive HTML/JS simulator** once the point is to explore the machine, or guards are crowding one event. Full decision rule, syntax, and the fill-in template in [VISUALIZATION-FORMAT.md](references/VISUALIZATION-FORMAT.md) and [assets/simulator-template.html](assets/simulator-template.html).

## 7. Deliver

Try the Artifact tool first. Fall back to writing the file to the OS temp directory and opening it. Tell the user exactly what got produced and where. The visualization is this skill's deliverable, not something to mention in passing.
