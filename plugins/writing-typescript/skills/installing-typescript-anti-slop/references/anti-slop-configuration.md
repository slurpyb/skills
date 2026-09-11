# Anti-slop configuration

Merge the local plugin into existing Oxlint configuration while keeping installed tooling outside application lint scope.

```ts
ignorePatterns: [
  ".agent/**", ".agents/**", ".claude/**", ".codex/**", ".continue/**",
  ".cursor/**", ".gemini/**", ".opencode/**", ".pi/**", ".roo/**",
  ".windsurf/**", "tools/oxlint/anti-slop/**",
],
jsPlugins: [
  { name: "anti-slop", specifier: "./tools/oxlint/anti-slop/index.ts" },
],
```

Adjust paths for the selected destination. Add repository-specific generated or agent directories explicitly. For Vite+, mirror the patterns in `fmt.ignorePatterns`.

Read the copied plugin's exported `rules` map and enable every key as `"anti-slop/<key>": "error"`. The exported map is the rule-name source of truth.

When a package manifest directly declares `effect`, or the user explicitly requests the policy, add:

```ts
jsPlugins: [{
  name: "anti-slop-effect",
  specifier: "./tools/oxlint/anti-slop/effect/index.ts",
}],
rules: { "anti-slop-effect/no-service-constructor-imports": "error" },
```

Merge arrays and rule maps with existing configuration. A transitive lockfile occurrence leaves Effect inactive. The Effect rule covers relative imports; report package-alias imports as a limitation.

## Completion

Every exported generic rule is enabled at error severity, existing settings remain present, installed tooling is ignored precisely, Effect activation matches intent, and lint plus typecheck pass.
