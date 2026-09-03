# Library configuration

A published TypeScript package must align source, declaration, runtime, and package export contracts.

Verify:

- declaration emit and declaration maps;
- explicit output directories separated from source;
- source maps for supported debugging workflows;
- `module` and `moduleResolution` for each published runtime format;
- package exports that resolve runtime files and declarations together;
- the lowest supported TypeScript and runtime targets;
- project references only at real package boundaries;
- clean build and declaration output from a fresh checkout.

Test consumer imports through package exports rather than source-relative paths. Inspect emitted declarations for leaked private types, inaccessible constraints, and unexpectedly complex inference.

## Completion

Every public entry point resolves runtime code and declarations, emitted types expose only owned public contracts, and the lowest supported compiler and runtime checks pass.
