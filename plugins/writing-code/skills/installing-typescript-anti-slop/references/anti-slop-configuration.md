# Anti-slop configuration

Load after copying the bundled plugin. Why: all generic rules must remain errors and installed tooling must stay outside application lint scope.

Merge the plugin and ignores into `.oxlintrc*`, `oxlint.config.*`, or Vite+ `lint`. Keep existing entries:

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

Adjust the plugin path when installed elsewhere. Add other local agent/generated directories explicitly; never ignore every dot-directory. For Vite+, mirror these patterns in `fmt.ignorePatterns`.

Enable every generic rule at `"error"`: `no-chained-type-assertions`, `no-conditional-empty-object-spread`, `no-known-value-widening`, `no-module-mocking`, `no-object-parameters`, `no-reflect-apply`, `no-reflect-get`, `no-runtime-typeof`, `no-shape-in-symbol-names`, `no-unknown-parameters`, `no-unknown-returns`, `no-unknown-type-aliases`, `no-unsafe-dictionary-type`, `no-widen-then-assert`, and `require-safety-comment-for-type-assertion`.

If a package manifest directly declares `effect`, or the user explicitly requests it, also add:

```ts
jsPlugins: [{
  name: "anti-slop-effect",
  specifier: "./tools/oxlint/anti-slop/effect/index.ts",
}],
rules: { "anti-slop-effect/no-service-constructor-imports": "error" },
```

Merge rather than replace arrays and rule maps. A transitive lockfile occurrence does not justify Effect activation. The Effect rule covers relative imports; report package-alias imports as a limitation.

Next: return to the `SKILL.md` done gate and run lint plus typecheck.
