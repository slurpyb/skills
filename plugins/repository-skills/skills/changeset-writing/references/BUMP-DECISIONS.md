# Bump Decisions

The `changesets` tool deliberately doesn't give you more than major, minor, and patch to choose from. Its own docs explain why: the finer nuance, bug fix vs. feature vs. breaking, belongs in the changeset's description text, not in a taxonomy of labels. That means the bump itself is a smaller decision than it looks, but a few real situations don't map cleanly onto "did I add, change, or remove something," and those are the ones worth a real decision tree.

## The default tree

**Patch**: a bug fix, a performance improvement, or an internal change with no visible API difference. The consumer's code doesn't need to change, and nothing they were relying on now behaves differently.

**Minor**: a new, backward-compatible capability. Existing consumer code keeps working exactly as before; there's just more available now than there was.

**Major**: something a consumer currently relies on now behaves differently, has a different signature, or is gone. If existing code, unmodified, would now do the wrong thing or fail to compile/run, it's major.

Test each one against a single question: if a consumer upgrades and changes nothing in their own code, does anything break or silently behave differently? No, not user-visible at all: skip the changeset. No, but there's more available now: minor. No, purely internal: patch. Yes: major.

## Edge cases

**Dependency-only bumps.** Swapping an internal dependency, upgrading a transitive package, changing how something is implemented under the hood, these are patch by default, even when the underlying behavior technically shifts, as long as no consumer-visible contract changes. A widely-used CSS framework's own changelog has a real example of this exact judgment call: a change to how spacing utilities compile their `calc()` output (`m-1` now generates `var(--spacing)` instead of `calc(var(--spacing) * 1)`) is a real, observable difference in generated CSS, and it's still listed as an ordinary `Changed` entry, not flagged as breaking. The generated CSS's computed result is identical; only its literal text changed. That's the line: does the _output_ change, or does the _behavior_ change. If you can't tell which one you're looking at, generate both versions and diff them before deciding.

**Experimental or unstable APIs.** An API that's explicitly labeled experimental, unstable, or preview doesn't need a major bump to change shape, but only if it was actually labeled that way before you shipped it, not after the fact to justify a smaller bump in hindsight. If you're about to ship a breaking change to something you're only now deciding to call "experimental," that's not a bump decision, that's a naming decision you should have made earlier. Document the instability up front in the API's own docs, not just in the changeset.

**Deprecation without removal.** Marking something deprecated, adding a warning, keeping it working, is minor: nothing breaks yet. But it still needs a changeset, and a clear one. Keep a Changelog's guiding principle on this is worth repeating: "when people upgrade from one version to another, it should be painfully clear when something will break... if you do nothing else, list deprecations, removals, and any breaking changes." A deprecation changeset should say what to migrate to and, if you know it, when the removal will actually land.

**Monorepo cross-package coupling.** When one package's change forces a version bump in another (a type it re-exports moved, an internal API it called changed shape), you don't need to hand-write a duplicate changeset for the dependent package, changesets already has a `getDependencyReleaseLine` hook that generates a "bumped because of an upstream dependency" line automatically. Write the changeset once, at the package where the change actually happened. When a single release bundles several changesets at different bump levels for the same package, the tool flattens them into a single bump at the highest level requested, you don't need to reconcile that yourself either.

**"Is this even user-facing" filter.** The most common mistake isn't picking the wrong bump, it's writing a changeset for something that shouldn't have one at all. The changesets docs say this directly: "not every change requires a changeset... we recommend not adding a blocking element to contributions in the absence of a changeset." Keep a Changelog's anti-pattern list backs this from the other direction, warning against a changelog "with commit log diffs," full of "merge commits, commits with obscure titles, documentation changes." If you're tempted to write a changeset just because CI expects one, ask whether a consumer would ever read it and learn something. If not, it's noise, and noise in a changelog trains readers to stop reading it.
