# Application configuration

Application configs model the framework, bundler, runtime, and owned source tree.

Evaluate these options against inherited presets and repository constraints:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "isolatedModules": true,
    "noEmit": true
  }
}
```

- Match `module` and `moduleResolution` to the actual runtime or bundler.
- Keep strict null checking enabled.
- Include owned application and script sources.
- Exclude generated and vendored output.
- Use project references only for real package boundaries.
- Treat `skipLibCheck` as a measured compatibility or performance decision.

## Completion

Effective options match the framework and runtime, every owned source is checked once, generated output is excluded, and repository lint plus typecheck pass.
