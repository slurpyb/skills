# Forms

Confirm each signature with `consult-astro-docs` before writing. This file is the gotchas, not the API.

## The page renders per request

`<form method="POST" action={actions.x}>` works only on an on-demand rendered page. On `static` output, add `export const prerender = false` to that page. See `astro-7`.

## Reading the result

`getActionResult()` lives on the render context, not on `astro:actions`:

```astro
---
import { actions, isInputError } from 'astro:actions';

const result = Astro.getActionResult(actions.newsletter);
if (result && !result.error) return Astro.redirect('/confirmation');

const fieldErrors = isInputError(result?.error) ? result.error.fields : {};
---
<form method="POST" action={actions.newsletter}>
  <input required type="email" name="email" />
  {fieldErrors.email && <p>{fieldErrors.email.join(', ')}</p>}
  <button>Sign up</button>
</form>
```

`astro:actions` exports exactly `ACTION_QUERY_PARAMS`, `ActionError`, `actions`, `defineAction`, `getActionContext`, `getActionPath`, `isActionError`, and `isInputError`.

`isInputError(error)` takes one argument and gates `error.fields`, which maps each input `name` to an array of messages. Read `fields` behind that check.

Submitting clears the inputs. To keep the values, enable view transitions and add `transition:persist` to each input.

## Validators for form inputs

| Input | Validator |
|---|---|
| `type="number"` | `z.number()` |
| `type="checkbox"` | `z.coerce.boolean()` |
| `type="file"` | `z.instanceof(File)`, and the form needs `enctype="multipart/form-data"` |
| Repeated `name` | `z.array(...)` |
| Everything else | `z.string()` |

An empty submitted input arrives as `null` rather than `""` — arrays and booleans excepted — so let the schema accept `null` for optional text fields.

Narrow a multi-purpose form with `z.discriminatedUnion('type', [...])` keyed on a hidden `type` field.

## Progressive enhancement

The form above is the zero-JS path. Layer JS on top by intercepting `submit`, calling `actions.name(new FormData(form))`, and routing with `navigate()` from `astro:transitions/client`.

Astro renders the form result from the POST itself — no cookie redirect since v5. A refresh raises "confirm form resubmission", and the result is gone on revisit. For POST/Redirect/GET, handle `action.calledFrom === 'form'` in middleware through `getActionContext()` and persist the result in a session store.
