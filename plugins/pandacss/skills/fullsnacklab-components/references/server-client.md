# Server and client boundaries

Interactive components in `@fullsnacklab/components` declare a client runtime boundary. Keep that boundary as small as the product interaction allows.

## Boundary placement

Server-render data, copy, permissions, and static structure. Move only interactive state and package components that require client behavior into a client component.

```text
server data and authorization
            ↓ serialized props
small client interaction wrapper
            ↓
@fullsnacklab/components
```

Do not move an entire page to the client only because one control opens, selects, resizes, or edits.

## Serializable props

Props crossing the boundary should be serializable data. Convert server resources, dates, errors, and domain objects into explicit view models before passing them to client wrappers.

Callbacks, element refs, and package context belong on the client side of the boundary.

## Hydration stability

Initial client output must match server output.

- Use stable identifiers and deterministic item order.
- Avoid rendering from browser-only state during the first pass.
- Initialize controlled values from serialized props or a stable default.
- Delay browser measurement until after mount.
- Keep temporary positioned content closed unless the same state exists on both sides.

## Providers

Mount package-wide providers once at the narrowest common client boundary. `Toaster` belongs at an application boundary where all operations that call `toaster` can reach it.

Use family `RootProvider` only for external state that intentionally belongs to that family. It is not an application-wide provider.

## Lazy content

Several overlays remove their content while closed. Treat each open cycle as a fresh mount:

- initialize local draft state deliberately;
- clean up timers, listeners, and requests;
- avoid querying content nodes before opening;
- return focus after content unmounts;
- preserve feature state outside the temporary content when it must survive closure.

## Server actions and requests

Keep request ownership in the feature. Components display pending, success, and failure and expose user intent. Avoid embedding network calls in reusable visual wrappers.

On pending state, preserve the action name and prevent only unsafe duplicates. On failure, keep recoverable input and return focus to a useful control or message.

## Completion check

- The client boundary contains only interactive code.
- Crossing props are serializable and deterministic.
- Initial markup hydrates without divergence.
- Providers mount once at the intended scope.
- Lazy content cleans up and remounts safely.
- Feature operations, not visual wrappers, own requests.
