---
title: "Performance profiling"
---

If Panda is taking too long to process your files, you can use the `--cpu-prof` with the `panda`, `panda cssgen`,
`panda codegen` and `panda debug` commands to generate a flamegraph of the whole process, which will allow you (or us as
maintainers) to see which part of the process is taking the most time.

This will generate a `panda-{command}-{timestamp}.cpuprofile` file in the current working directory, which can be opened
in tools like [Speedscope](https://www.speedscope.app/)

```bash
pnpm panda --cpu-prof
```