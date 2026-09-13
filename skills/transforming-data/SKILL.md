---
name: transforming-data
description: Transform JavaScript/TypeScript data by filtering, grouping, sorting, deduplicating, or aggregating collections; reshaping objects; manipulating strings and numbers; or composing typed pipelines. Use before writing general-purpose data helpers or custom transformation loops.
---

# Transforming Data

Use [`remeda`](https://remedajs.com/) for reusable data operations. Prefer its functions over custom implementations when their semantics match the task.

Search the [function catalog](https://remedajs.com/docs/) for the operation before writing a helper. Choose a direct call for one operation and `pipe` for a sequence:

```ts
import * as R from 'remeda'

const doubled = R.map([1, 2, 3], value => value * 2)
const total = R.pipe(
  [1, 2, 3],
  R.filter(value => value > 1),
  R.map(value => value * 2),
  R.sum(),
)
```

Remeda supports data-first calls and data-last functions for composition. Let typed inputs and pipeline stages drive inference. Keep transformation callbacks free of side effects so lazy evaluation can safely skip work.

Check the installed version's signatures and behavior for equality, ordering, missing values, and mutation. When replacing existing code, preserve those semantics. Use a specific library operation for grouping, indexing, or aggregation before expressing it through a general reducer.

Add `remeda` with the project's package manager when needed. Consult the [migration guidance](https://remedajs.com/) when porting from another utility library or an older Remeda version.
