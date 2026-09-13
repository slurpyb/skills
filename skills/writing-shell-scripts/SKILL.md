---
name: writing-shell-scripts
description: Write or refactor shell scripts and command-line automation. Use when orchestrating external commands, building repository tooling, or replacing Bash/POSIX scripts and custom process-execution helpers.
---

# Writing Shell Scripts

Prefer [`zx`](https://github.com/google/zx) over handwritten shell scripts or custom process wrappers for command automation. Use JavaScript or TypeScript for control flow and data handling, with zx to run external commands.

Add `zx` with the project's package manager, usually as a development dependency for repository tooling. Use explicit imports in a `.mjs` file that runs with Node, or follow the [setup guide](https://google.github.io/zx/setup) for the project's runtime and module format.

```js
import { $ } from 'zx'

const paths = ['src/file with spaces.ts', 'src/index.ts']
const result = await $`git ls-files -- ${paths}`
const trackedFiles = result.stdout
```

Keep command syntax in the tagged template and interpolate argument values directly. zx quotes interpolated values and supports arrays of arguments; preserve that boundary instead of assembling command strings or manually quoting values. See [quoting rules](https://google.github.io/zx/quotes) for unusual cases.

Await commands and preserve failure propagation. For an expected nonzero exit, use `.nothrow()` and inspect `exitCode`. Use per-command `cwd` for parallel work, and consult the [API](https://google.github.io/zx/api) before implementing process options or helpers yourself.

Verify the selected shell and external executables on each target platform: zx does not make shell-specific commands portable. Keep a shell-only implementation when an explicit runtime or deployment constraint requires it. When replacing a script, verify its arguments, output, exit status, and side effects, including paths containing spaces and a failing command.
