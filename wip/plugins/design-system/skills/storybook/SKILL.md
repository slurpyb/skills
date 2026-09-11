---
name: storybook
description: Storybook 8+ — writing stories (CSF3), configuring main.ts / preview.ts, addons (essentials, a11y, designs, MSW), parameters, args/argTypes, decorators, doc blocks, test-runner / Vitest integration, and framework setup (React/Vite, Next.js, SvelteKit, Vue). Use when authoring or debugging stories, configuring Storybook, mocking network requests, or wiring component tests.
---

# Storybook

Storybook is a workshop for building, documenting, and testing UI components in isolation. This skill covers CSF3 story syntax, configuration entry points, addons, mocking, and the test-runner.

## When to use

- Authoring or refactoring `*.stories.ts(x)` files
- Editing `.storybook/main.ts` or `.storybook/preview.ts`
- Adding/removing addons (a11y, designs, MSW, Vitest)
- Setting up Storybook for a new framework (React/Vite, Next.js, SvelteKit, Vue)
- Mocking network requests or modules in stories
- Wiring up the test-runner or Vitest project

## Key concepts

- **CSF3 (Component Story Format 3)** — default export is `Meta`, named exports are `StoryObj`. `args` drive props; `argTypes` describe controls.
- **`main.ts`** — declares `stories` glob, `framework`, `addons`, and Vite/Webpack tweaks.
- **`preview.ts`** — global `parameters`, `decorators`, `loaders`, `globalTypes` (theme/locale toggles).
- **Decorators** — wrap stories with providers (Theme, Router, Query). Stack global → component → story.
- **Loaders** — async setup that runs before render (e.g. MSW init, fetch fixtures).
- **Doc blocks** — `<Meta>`, `<Story>`, `<Canvas>`, `<Controls>`, `<ArgTypes>`, `<Source>` for MDX docs pages.
- **Test-runner / Vitest** — Storybook 8 ships a Vitest project (`@storybook/experimental-addon-test`) that turns stories into runnable tests with Playwright browser mode.

## Quick reference

### 1. Basic story (CSF3, TypeScript)

```ts
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  component: Button,
  args: { label: 'Click me' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary'] },
  },
}
export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = { args: { variant: 'primary' } }
export const Secondary: Story = { args: { variant: 'secondary' } }
```

### 2. `main.ts`

```ts
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-designs',
    '@storybook/experimental-addon-test',
  ],
  framework: { name: '@storybook/react-vite', options: {} },
  typescript: { reactDocgen: 'react-docgen-typescript' },
}
export default config
```

### 3. `preview.ts` with global decorator + parameters

```ts
import type { Preview } from '@storybook/react'
import { ThemeProvider } from '../src/theme'

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        light: { name: 'Light', value: '#F7F9F2' },
        dark: { name: 'Dark', value: '#333' },
      },
    },
    a11y: { test: 'error' },
  },
  decorators: [
    (Story, ctx) => (
      <ThemeProvider theme={ctx.globals.theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
  globalTypes: {
    theme: {
      defaultValue: 'light',
      toolbar: { items: ['light', 'dark'], icon: 'paintbrush' },
    },
  },
}
export default preview
```

### 4. Mock network requests with MSW

```ts
// .storybook/preview.ts
import { initialize, mswLoader } from 'msw-storybook-addon'
initialize()
export default { loaders: [mswLoader] }
```

```ts
// some.stories.ts
import { http, HttpResponse } from 'msw'

export const LoggedIn: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/user', () =>
          HttpResponse.json({ name: 'Ada' })
        ),
      ],
    },
  },
}
```

### 5. Interaction test inside a story (`play`)

```ts
import { userEvent, within, expect } from '@storybook/test'

export const Submits: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.type(c.getByRole('textbox'), 'hello')
    await userEvent.click(c.getByRole('button', { name: /submit/i }))
    await expect(c.getByText(/sent/i)).toBeInTheDocument()
  },
}
```

### 6. Install Storybook / addons

```bash
# New project
npx storybook@latest init

# Add an addon (CLI handles config wiring)
npx storybook@latest add @storybook/addon-a11y
npx storybook@latest add @storybook/addon-designs
```

### 7. Test-runner script

```jsonc
// package.json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "test-storybook": "vitest --project=storybook"
  }
}
```

## Common pitfalls

- **Barrel imports break HMR / story discovery.** Import the component file directly, not the package barrel: `import { Button } from '@org/ui/Button'`, not `'@org/ui'`.
- **`stories` glob mismatch** in `main.ts` silently hides stories — check it matches your repo layout (often `../packages/**/*.stories.tsx` in monorepos).
- **`argTypes.control` only renders if the value is serializable** — JSX/functions need a `mapping` or a custom decorator instead.
- **`play` functions require `@storybook/test`** (Storybook 8), not the old `@storybook/jest` / `@storybook/testing-library`.
- **MSW handlers reset between stories** — declare them per-story or via a decorator, not globally.

## Reference files

`references/` contains scraped excerpts of the official docs:

- `get-started.md` — install, framework setup
- `configure.md` — `main.ts`, `preview.ts`, env, builders
- `writing-stories.md` — CSF3, args/argTypes, decorators, play
- `doc-blocks.md` — MDX doc blocks
- `api.md` — API reference
- `other.md`, `8.md`, `9.md` — misc topics, version notes

Open the matching reference when the snippets above don't cover the question.
