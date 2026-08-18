# DRY

How to find the code that already exists, and when to extract.

## Grep before you write

Run these against `src/` for the name and for the concept behind it — a `formatDate` you are about to write may already exist as `displayDate`:

```bash
rg -n "functionName|ComponentName" src/
rg -n "export (async )?function" src/lib/
rg -n "^export (interface|type)" src/interfaces/
```

Then read the hits in `src/lib/`, `src/components/common/`, and `src/interfaces/` before deciding the code is new. A near-match is a candidate to extend: add a parameter to the existing helper rather than shipping a variant beside it.

## Thresholds

- Logic written a second time → extract to `src/lib/` and import it in both places.
- A type declared in a second file → move to `src/interfaces/` and import it in both places.
- The same prop shape across three components → give it its own interface and `extends` the specific ones from it.

Extract at the moment of the second copy, while both call sites are in front of you.

## Worked extraction

```typescript
// Before: this expression lives in three components
new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

// After: src/lib/utils.ts
/**
 * Format a date for display.
 *
 * @param date - Date to format
 * @param locale - BCP 47 locale string
 * @returns Human-readable date string
 */
export function formatDate(date: Date, locale = 'en-US'): string {
  return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
}
```

## Common duplications

| Duplication | Where it goes |
|---|---|
| The same `getCollection` query in several pages | one query function in `src/lib/<type>.ts` |
| The same props declared in several components | one interface in `src/interfaces/component.interface.ts` |
| The same `<meta>` tags across layouts | the base layout, with the varying parts as props |
| The same fetch-and-handle-error block | one service function that returns a typed result |

## Sweeps

```bash
# files over the 90-line split point
rg --files src -g '*.{astro,ts,tsx}' | xargs wc -l | awk '$1 > 90'

# copy-pasted blocks
npx jscpd ./src --threshold 3 --min-lines 5
```
