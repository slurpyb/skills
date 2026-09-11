# Feedback and status

Use this reference for `Alert`, `Clipboard`, `Loader`, `Progress`, `Skeleton`, `Spinner`, and `Toast`.

## Match feedback to duration

- Use **Spinner** for compact indeterminate activity where surrounding text already names the operation.
- Use **Loader** when spinner placement and loading text belong together.
- Use **Skeleton** to reserve the shape of content that is expected to appear.
- Use **Progress** when completion can be measured or when a larger operation needs an explicit status region.
- Use **Alert** for persistent inline status that remains relevant in the current context.
- Use **Toast** for transient operation results that do not require immediate interaction.
- Use **Clipboard Indicator** for local copied-state feedback beside the copy action.

## State ownership

The operation owns pending, success, and failure. Presentation components reflect that state; they do not start requests or maintain a second copy of operation state.

Keep previous content visible during refresh when removing it would cause layout shift or erase useful context. Use a skeleton for initial content shape, not every background update.

## Announcements

- Name the operation in visible loading text when the context is ambiguous.
- Announce success once, close to the operation that caused it.
- State failure and recovery, not only that an error occurred.
- Avoid simultaneous inline, transient, and page-level announcements for one result.
- Do not rely only on color, icons, or animation.

## Progress truthfulness

Use determinate progress only when the application receives meaningful progress. Do not animate a fabricated percentage toward completion. For unknown duration, use indeterminate presentation and text that explains the current phase.

## Transient messages

Mount one `Toaster` at the application boundary. Call `toaster` from operation edges after the result is known. Keep messages concise and include a recovery action only when it is safe and useful.

Persistent errors, validation details, and decisions that block progress belong inline rather than only in a transient message.

## Completion check

- Feedback type matches duration and importance.
- Visible text names the state or operation.
- One announcement represents one result.
- Progress is truthful.
- Loading preserves useful layout and interaction expectations.
- Failure includes a recovery path when one exists.
