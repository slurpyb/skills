# Storybook - Api

**Pages:** 108

---

## Parameters | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/parameters

**Contents:**
- Parameters
- Story parameters
- Meta parameters
- Project parameters
- Available parameters
  - layout
  - options
    - options.storySort
  - test
    - clearMocks

Parameters are static metadata used to configure your stories and addons in Storybook. They are specified at the story, meta (component), project (global) levels.

Parameters specified at the story level apply to that story only. They are defined in the parameters property of the story (named export):

Parameters specified at the story level will override those specified at the project level and meta (component) level.

Parameter's specified in a CSF file's meta configuration apply to all stories in that file. They are defined in the parameters property of the meta (default export):

Parameters specified at the meta (component) level will override those specified at the project level.

Parameters specified at the project (global) level apply to all stories in your Storybook. They are defined in the parameters property of the default export in your .storybook/preview.js|ts file:

Storybook only accepts a few parameters directly.

Type: 'centered' | 'fullscreen' | 'padded'

Specifies how the canvas should lay out the story.

The options parameter can only be applied at the project level.

Type: StorySortConfig | StorySortFn

Specifies the order in which stories are displayed in the Storybook UI.

When specifying a configuration object, the following options are available:

When specifying a custom sorting function, the function behaves like a typical JavaScript sorting function. It accepts two stories to compare and returns a number. For example:

See the guide for usage examples.

Similar to Vitest, it will call .mockClear() on all spies created with fn() from @storybook/test when a story unmounts. This will clear mock history, but not reset its implementation to the default one.

Similar to Vitest, it will call .mockReset() on all spies created with fn() from @storybook/test when a story unmounts. This will clear mock history and reset its implementation to an empty function (will return undefined).

Similar to Vitest, it will call .restoreMocks() on all spies created with fn() from @storybook/test when a story unmounts. This will clear mock history and reset its implementation to the original one.

Unhandled errors might cause false positive assertions. Setting this to true will prevent the play function from failing and showing a warning when unhandled errors are thrown during execution.

All other parameters are contributed by addons. The essential addon's parameters are documented on their individual pages:

No matter where they're specified, parameters are ultimately applied to a single story. Parameters specified at the project (global) level are applied to every story in that project. Those specified at the meta (component) level are applied to every story associated with that meta. And parameters specified for a story only apply to that story.

When specifying parameters, they are merged together in order of increasing specificity:

Parameters are merged, so objects are deep-merged, but arrays and other properties are overwritten.

In other words, the following specifications of parameters:

Will result in the following parameter values applied to each story:

**Examples:**

Example 1 (typescript):
```typescript
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta: Meta<typeof Button> = {
  component: Button,
};
 
export default meta;
type Story = StoryObj<typeof Button>;
 
export const OnDark: Story = {
  // 👇 Story-level parameters
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};
```

Example 2 (jsx):
```jsx
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { Meta } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta: Meta<typeof Button> = {
  component: Button,
  //👇 Creates specific parameters at the component level
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};
 
export default meta;
```

Example 3 (json):
```json
// Replace your-renderer with the renderer you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-renderer';
 
const preview: Preview = {
  parameters: {
    backgrounds: {
      values: [
        { name: 'light', value: '#fff' },
        { name: 'dark', value: '#333' },
      ],
    },
  },
};
 
export default preview;
```

Example 4 (json):
```json
{
  storySort?: StorySortConfig | StorySortFn;
}
```

---

## Canvas | Storybook docs

**URL:** https://storybook.js.org/docs/api/doc-blocks/doc-block-canvas

**Contents:**
- Canvas
- Canvas
  - additionalActions
  - className
  - layout
  - meta
  - of
  - source
  - sourceState
  - story

The Canvas block is a wrapper around a Story, featuring a toolbar that allows you to interact with its content while automatically providing the required Source snippets.

When using the Canvas block in MDX, it references a story with the of prop:

In previous versions of Storybook it was possible to pass in arbitrary components as children to Canvas. That is deprecated and the Canvas block now only supports a single story.

ℹ️ Like most blocks, the Canvas block is configured with props in MDX. Many of those props derive their default value from a corresponding parameter in the block's namespace, parameters.docs.canvas.

The following sourceState configurations are equivalent:

The example above applied the parameter at the story level, but it could also be applied at the component (or meta) level or project level.

Default: parameters.docs.canvas.additionalActions

Provides any additional custom actions to show in the bottom right corner. These are simple buttons that do anything you specify in the onClick function.

Default: parameters.docs.canvas.className

Provides HTML class(es) to the preview element, for custom styling.

Type: 'centered' | 'fullscreen' | 'padded'

Default: parameters.layout or parameters.docs.canvas.layout or 'padded'

Specifies how the canvas should layout the story.

In addition to the parameters.docs.canvas.layout property or the layout prop, the Canvas block will respect the parameters.layout value that defines how a story is laid out in the regular story view.

Type: CSF file exports

Specifies the CSF file to which the story is associated.

You can render a story from a CSF file that you haven’t attached to the MDX file (via Meta) by using the meta prop. Pass the full set of exports from the CSF file (not the default export!).

Specifies which story's source is displayed.

Type: SourceProps['code'] | SourceProps['format'] | SourceProps['language'] | SourceProps['type']

Specifies the props passed to the inner Source block. For more information, see the Source Doc Block documentation.

The dark prop is ignored, as the Source block is always rendered in dark mode when shown as part of a Canvas block.

Type: 'hidden' | 'shown' | 'none'

Default: parameters.docs.canvas.sourceState or 'hidden'

Specifies the initial state of the source panel.

Type: StoryProps['inline'] | StoryProps['height'] | StoryProps['autoplay']

Specifies the props passed to the inner Story block. For more information, see the Story Doc Block documentation.

Default: parameters.docs.canvas.withToolbar

Determines whether to render a toolbar containing tools to interact with the story.

**Examples:**

Example 1 (jsx):
```jsx
import { Meta, Canvas } from '@storybook/addon-docs/blocks';
import * as ButtonStories from './Button.stories';
 
<Meta of={ButtonStories} />
 
<Canvas of={ButtonStories.Primary} />
```

Example 2 (sql):
```sql
import { Canvas } from '@storybook/addon-docs/blocks';
```

Example 3 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
} satisfies Meta<typeof Button>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Basic: Story = {
  parameters: {
    docs: {
      canvas: { sourceState: 'shown' },
    },
  },
};
```

Example 4 (jsx):
```jsx
<Canvas of={ButtonStories.Basic} sourceState="shown" />
```

---

## webpackFinal | Storybook docs

**URL:** https://storybook.js.org/docs/api/main-config/main-config-webpack-final

**Contents:**
- webpackFinal
- Options

Parent: main.js|ts configuration

Type: async (config: Config, options: WebpackOptions) => Config

Customize Storybook's Webpack setup when using the webpack builder.

Type: { configType?: 'DEVELOPMENT' | 'PRODUCTION' }

There are other options that are difficult to document here. Please introspect the type definition for more information.

**Examples:**

Example 1 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-webpack5, nextjs, angular, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  webpackFinal: async (config, { configType }) => {
    if (configType === 'DEVELOPMENT') {
      // Modify config for development
    }
    if (configType === 'PRODUCTION') {
      // Modify config for production
    }
    return config;
  },
};
 
export default config;
```

---

## TableOfContents | Storybook docs

**URL:** https://storybook.js.org/docs/api/doc-blocks/doc-block-tableofcontents

**Contents:**
- TableOfContents
- Enabling the table of contents
- toc parameter options
  - contentsSelector
  - disable
  - headingSelector
  - ignoreSelector
  - title
  - unsafeTocbotOptions

The TableOfContents block renders a table of contents for the current documentation page, allowing users to navigate between sections quickly. It appears as a fixed sidebar on the right side of the documentation page and is hidden on smaller screens (below 768px).

The table of contents is enabled and configured via the docs.toc parameter rather than being added directly to MDX files. When enabled, it is automatically rendered alongside the page content by Storybook's docs container.

For a step-by-step guide on enabling and customizing the table of contents, see the Generate a table of contents section in the Autodocs documentation.

Enable the table of contents globally in your Storybook preview configuration:

You can also enable or disable it for specific components in their stories file:

The docs.toc parameter accepts either true (to enable with defaults) or an object with the following properties:

Default: '.sbdocs-content'

CSS selector for the container to search for headings. Use this if you have a custom docs page layout.

When true, it hides the table of contents for the documentation page. A hidden (empty) container is still rendered to preserve the page layout.

CSS selector that defines which heading levels to include in the table of contents. For example, use 'h1, h2, h3' to include the top three heading levels.

Default: '.docs-story *, .skip-toc'

CSS selector for headings to exclude from the table of contents. By default, headings inside story blocks are excluded. To also exclude a specific heading, add the skip-toc class to it.

Type: string | null | ReactElement

Default: 'Table of contents' (visually hidden)

Text or element to display as the title above the table of contents. Set to null to render no title. When a string is provided, it is rendered as a visually hidden <h2> by default; pass a non-empty string to make it visible.

Provides additional configuration options passed directly to the underlying Tocbot library. These options are not guaranteed to remain available in future versions of Storybook.

**Examples:**

Example 1 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Preview } from '@storybook/your-framework';
 
const preview: Preview = {
  parameters: {
    docs: {
      toc: true, // 👈 Enables the table of contents
    },
  },
};
 
export default preview;
```

Example 2 (jsx):
```jsx
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta } from '@storybook/your-framework';
 
import { MyComponent } from './MyComponent';
 
const meta = {
  component: MyComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      toc: {
        disable: true, // 👈 Disables the table of contents
      },
    },
  },
} satisfies Meta<typeof MyComponent>;
 
export default meta;
```

Example 3 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Preview } from '@storybook/your-framework';
 
const preview: Preview = {
  parameters: {
    docs: {
      toc: {
        contentsSelector: '.sbdocs-content',
        headingSelector: 'h1, h2, h3',
        ignoreSelector: '#primary',
        title: 'Table of Contents',
        disable: false,
        unsafeTocbotOptions: {
          orderedList: false,
        },
      },
    },
  },
};
 
export default preview;
```

---

## features | Storybook docs

**URL:** https://storybook.js.org/docs/api/main-config/main-config-features

**Contents:**
- features
- actions
- argTypeTargetsV7
- backgrounds
- componentsManifest
- changeDetection
- controls
- developmentModeForBuild
- experimentalCodeExamples
- experimentalTestSyntax

Parent: main.js|ts configuration

Enables Storybook's additional features.

Enable the Actions feature.

Filter args with a "target" on the type from the render function.

Enable the Backgrounds feature.

Generate manifests, used by the MCP server.

Enable change detection. When enabled, Storybook monitors your git working tree and the builder's module graph to show which stories are new, modified, or related to code changes. Changed stories are displayed with status icons in the sidebar.

Enable the Controls feature.

Set NODE_ENV to 'development' in built Storybooks for better testing and debugging capabilities.

Enable the new code example generation method for React components (as seen in the story previews in an autodocs page).

Unlike the current implementation, this method reads the actual stories source file, which is faster to generate, more readable, and more accurate. However, they are not dynamic: they won't update if you change values in the Controls table.

Enable the experimental .test method with the CSF Next format.

Enable the Highlight feature.

Enable the Interactions feature.

Apply decorators from preview.js before decorators from addons or frameworks. More information.

Enable the Measure feature.

Enable the Outline feature.

Enable the onboarding checklist sidebar widget.

Enable the Viewport feature.

**Examples:**

Example 1 (json):
```json
{
  actions?: boolean;
  argTypeTargetsV7?: boolean;
  backgrounds?: boolean;
  changeDetection?: boolean;
  componentsManifest?: boolean;
  controls?: boolean;
  developmentModeForBuild?: boolean;
  experimentalCodeExamples?: boolean;
  experimentalTestSyntax?: boolean;
  highlight?: boolean;
  interactions?: boolean;
  legacyDecoratorFileOrder?: boolean;
  measure?: boolean;
  outline?: boolean;
  sidebarOnboardingChecklist?: boolean;
  toolbars?: boolean;
  viewport?: boolean;
}
```

Example 2 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  features: {
    argTypeTargetsV7: true,
  },
};
 
export default config;
```

Example 3 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  features: {
    componentsManifest: true,
  },
};
 
export default config;
```

Example 4 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  features: {
    changeDetection: false,
  },
};
 
export default config;
```

---

## Typeset | Storybook docs

**URL:** https://storybook.js.org/docs/api/doc-blocks/doc-block-typeset

**Contents:**
- Typeset
- Typeset
  - fontFamily
  - fontSizes
  - fontWeight
  - sampleText

The Typeset block helps document the fonts used throughout your project.

Typeset is configured with the following props:

Provides a font family to be displayed.

Type: (string | number)[]

Provides a list of available font sizes (in px).

Specifies the weight of the font to be displayed.

Sets the text to be displayed.

**Examples:**

Example 1 (jsx):
```jsx
import { Meta, Typeset } from '@storybook/addon-docs/blocks';
 
<Meta title="Typography" />
 
export const typography = {
  type: {
    primary: '"Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  weight: {
    regular: '400',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  size: {
    s1: 12,
    s2: 14,
    s3: 16,
    m1: 20,
    m2: 24,
    m3: 28,
    l1: 32,
    l2: 40,
    l3: 48,
  },
};
 
export const SampleText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
 
# Typography
 
**Font:** Nunito Sans
 
**Weights:** 400(regular), 700(bold), 800(extrabold), 900(black)
 
<Typeset
  fontSizes={[
    Number(typography.size.s1),
    Number(typography.size.s2),
    Number(typography.size.s3),
    Number(typography.size.m1),
    Number(typography.size.m2),
    Number(typography.size.m3),
    Number(typography.size.l1),
    Number(typography.size.l2),
    Number(typography.size.l3),
  ]}
  fontWeight={typography.weight.black}
  sampleText={SampleText}
  fontFamily={typography.type.primary}
/>
```

Example 2 (sql):
```sql
import { Typeset } from '@storybook/addon-docs/blocks';
```

---

## Title | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/doc-blocks/doc-block-title

**Contents:**
- Title
- Title
  - children
  - of

The Title block serves as the primary heading for your docs entry. It is typically used to provide the component or page name.

Title is configured with the following props:

Type: JSX.Element | string

Provides the content. Falls back to value of title in an attached CSF file (or value derived from autotitle), trimmed to the last segment. For example, if the title value is 'path/to/components/Button', the default content is 'Button'.

Type: CSF file exports

Specifies which meta's title is displayed.

**Examples:**

Example 1 (sql):
```sql
import { Title } from '@storybook/blocks';
 
<Title>This is the title</Title>
```

Example 2 (sql):
```sql
import { Title } from '@storybook/blocks';
```

---

## features | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/main-config/main-config-features

**Contents:**
- features
- argTypeTargetsV7
- backgroundsStoryGlobals
- legacyDecoratorFileOrder
- viewportStoryGlobals
- developmentModeForBuild

Parent: main.js|ts configuration

Enables Storybook's additional features.

Filter args with a "target" on the type from the render function.

Configures the Backgrounds addon to opt-in to the new story globals API for configuring backgrounds.

Apply decorators from preview.js before decorators from addons or frameworks. More information.

Configures the Viewports addon to opt-in to the new story globals API for configuring viewports.

Set NODE_ENV to 'development' in built Storybooks for better testing and debugging capabilities.

**Examples:**

Example 1 (json):
```json
{
  argTypeTargetsV7?: boolean;
  backgroundsStoryGlobals?: boolean;
  legacyDecoratorFileOrder?: boolean;
  viewportStoryGlobals?: boolean;
  developmentModeForBuild?: boolean;
}
```

Example 2 (python):
```python
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  features: {
    argTypeTargetsV7: true,
  },
};
 
export default config;
```

Example 3 (python):
```python
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  features: {
    backgroundsStoryGlobals: true,
  },
};
 
export default config;
```

Example 4 (python):
```python
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  features: {
    legacyDecoratorFileOrder: true,
  },
};
 
export default config;
```

---

## Addon API | Storybook docs

**URL:** https://storybook.js.org/docs/8/addons/addons-api

**Contents:**
- Addon API
- Core Addon API
  - addons.add()
  - addons.register()
  - addons.getChannel()
  - makeDecorator
- Storybook API
  - api.selectStory()
  - api.selectInCurrentKind()
  - api.setQueryParams()

Storybook's API allows developers to interact programmatically with Storybook. With the API, developers can build and deploy custom addons and other tools that enhance Storybook's functionality.

Our API is exposed via two distinct packages, each one with a different purpose:

The add method allows you to register the type of UI component associated with the addon (e.g., panels, toolbars, tabs). For a minimum viable Storybook addon, you should provide the following arguments:

The render function is called with active. The active value will be true when the panel is focused on the UI.

Serves as the entry point for all addons. It allows you to register an addon and access the Storybook API. For example:

Now you'll get an instance to our StorybookAPI. See the api docs for Storybook API regarding using that.

Get an instance to the channel to communicate with the manager and the preview. You can find this in both the addon register code and your addon’s wrapper component (where used inside a story).

It has a NodeJS EventEmitter compatible API. So, you can use it to emit events and listen to events.

Use the makeDecorator API to create decorators in the style of the official addons. Like so:

If the story's parameters include { exampleParameter: { disable: true } } (where exampleParameter is the parameterName of your addon), your decorator will not be called.

The makeDecorator API requires the following arguments:

Storybook's API allows you to access different functionalities of Storybook UI.

The selectStory API method allows you to select a single story. It accepts the following two parameters; story kind name and an optional story name. For example:

This is how you can select the above story:

Similar to the selectStory API method, but it only accepts the story as the only parameter.

This method allows you to set query string parameters. You can use that as temporary storage for addons. Here's how you define query params:

Additionally, if you need to remove a query parameter, set it as null instead of removing them from the addon. For example:

Allows retrieval of a query parameter enabled via the setQueryParams API method. For example:

This method allows you to get the application URL state, including any overridden or custom parameter values. For example:

This method allows you to register a handler function called whenever the user navigates between stories.

This method allows you to override the default Storybook UI configuration (e.g., set up a theme or hide UI elements):

The following table details how to use the API values:

The following options are configurable under the sidebar namespace:

The following options are configurable under the toolbar namespace:

To help streamline addon development and reduce boilerplate code, the API exposes a set of hooks to access Storybook's internals. These hooks are an extension of the @storybook/manager-api package.

It allows access to Storybook's internal state. Similar to the useglobals hook, we recommend optimizing your addon to rely on React.memo, or the following hooks; useMemo, useCallback to prevent a high volume of re-render cycles.

The useStorybookApi hook is a convenient helper to allow you full access to the Storybook API methods.

Allows setting subscriptions to events and getting the emitter to emit custom events to the channel.

The messages can be listened to on both the iframe and the manager.

The useAddonState is a useful hook for addons that require data persistence, either due to Storybook's UI lifecycle or for more complex addons involving multiple types (e.g., toolbars, panels).

The useParameter retrieves the current story's parameters. If the parameter's value is not defined, it will automatically default to the second value defined.

Extremely useful hook for addons that rely on Storybook Globals. It allows you to obtain and update global values. We also recommend optimizing your addon to rely on React.memo, or the following hooks; useMemo, useCallback to prevent a high volume of re-render cycles.

Hook that allows you to retrieve or update a story's args.

Learn more about the Storybook addon ecosystem

**Examples:**

Example 1 (sql):
```sql
import { addons } from '@storybook/preview-api';
 
import { useStorybookApi } from '@storybook/manager-api';
```

Example 2 (jsx):
```jsx
import React from 'react';
 
import { addons, types } from '@storybook/manager-api';
 
import { AddonPanel } from '@storybook/components';
 
const ADDON_ID = 'myaddon';
const PANEL_ID = `${ADDON_ID}/panel`;
 
addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'My Addon',
    render: ({ active }) => (
      <AddonPanel active={active}>
        <div> Storybook addon panel </div>
      </AddonPanel>
    ),
  });
});
```

Example 3 (sql):
```sql
import { addons } from '@storybook/preview-api';
 
// Register the addon with a unique name.
addons.register('my-organisation/my-addon', (api) => {});
```

Example 4 (jsx):
```jsx
import React, { useCallback } from 'react';
 
import { FORCE_RE_RENDER } from '@storybook/core-events';
import { addons } from '@storybook/preview-api';
import { useGlobals } from '@storybook/manager-api';
import { IconButton } from '@storybook/components';
import { OutlineIcon } from '@storybook/icons';
 
const ExampleToolbar = () => {
  const [globals, updateGlobals] = useGlobals();
 
  const isActive = globals['my-param-key'] || false;
 
  // Function that will update the global value and trigger a UI refresh.
  const refreshAndUpdateGlobal = () => {
    updateGlobals({
      ['my-param-key']: !isActive,
    }),
      // Invokes Storybook's addon API method (with the FORCE_RE_RENDER) event to trigger a UI refresh
      addons.getChannel().emit(FORCE_RE_RENDER);
  };
 
  const toggleToolbarAddon = useCallback(() => refreshAndUpdateGlobal(), [isActive]);
 
  return (
    <IconButton
      key="Example"
      active={isActive}
      title="Show the toolbar addon"
      onClick={toggleToolbarAddon}
    >
      <OutlineIcon />
    </IconButton>
  );
};
```

---

## Meta | Storybook docs

**URL:** https://storybook.js.org/docs/api/doc-blocks/doc-block-meta

**Contents:**
- Meta
- Meta
  - isTemplate
  - name
  - of
  - title
- Attached vs. unattached

The Meta block is used to attach a custom MDX docs page alongside a component’s list of stories. It doesn’t render any content, but serves two purposes in an MDX file:

The Meta block doesn’t render anything visible.

Meta is configured with the following props:

Determines whether the MDX file serves as an automatic docs template. When true, the MDX file is not indexed as it normally would be.

Sets the name of the attached doc entry. You can attach more than one MDX file to the same component in the sidebar by setting different names for each file's Meta.

Type: CSF file exports

Specifies which CSF file is attached to this MDX file. Pass the full set of exports from the CSF file (not the default export!).

Attaching an MDX file to a component’s stories with the of prop serves two purposes:

The of prop is optional. If you don’t want to attach a specific CSF file to this MDX file, you can either use the title prop to control the location, or emit Meta entirely, and let autotitle decide where it goes.

Sets the title of an unattached MDX file.

If you want to change the sorting of the docs entry with the component’s stories, use Story Sorting, or add specific MDX files to your stories field in main.js in order.

In Storybook, a docs entry (MDX file) is "attached" when it is associated with a stories file, via Meta's of prop. Attached docs entries display next to the stories list under the component in the sidebar.

"Unattached" docs entries are not associated with a stories file and can be displayed anywhere in the sidebar via Meta's title prop.

**Examples:**

Example 1 (jsx):
```jsx
import { Meta } from '@storybook/addon-docs/blocks';
import * as ButtonStories from './Button.stories';
 
<Meta of={ButtonStories} />
```

Example 2 (sql):
```sql
import { Meta } from '@storybook/addon-docs/blocks';
```

Example 3 (jsx):
```jsx
import { Meta } from '@storybook/addon-docs/blocks';
import * as ComponentStories from './component.stories';
 
{/* This MDX file is now called "Special Docs" */}
 
<Meta of={ComponentStories} name="Special Docs" />
```

Example 4 (jsx):
```jsx
import { Meta, Story } from '@storybook/addon-docs/blocks';
import * as ButtonStories from './Button.stories';
 
<Meta of={ButtonStories} />
```

---

## previewHead | Storybook docs

**URL:** https://storybook.js.org/docs/api/main-config/main-config-preview-head

**Contents:**
- previewHead

Parent: main.js|ts configuration

Type: (head: string) => string

Programmatically adjust the preview <head> of your Storybook. Most often used by addon authors.

If you don't need to programmatically adjust the preview head, you can add scripts and styles to preview-head.html instead.

For example, you can conditionally add scripts or styles, depending on the environment:

**Examples:**

Example 1 (jsx):
```jsx
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  previewHead: (head) => `
    ${head}
    ${
      process.env.ANALYTICS_ID ? '<script src="https://cdn.example.com/analytics.js"></script>' : ''
    }
  `,
};
 
export default config;
```

---

## Description | Storybook docs

**URL:** https://storybook.js.org/docs/api/doc-blocks/doc-block-description

**Contents:**
- Description
- Description
  - of
- Writing descriptions

The Description block displays the description for a component, story, or meta, obtained from their respective JSDoc comments.

Description is configured with the following props:

Type: Story export or CSF file exports

Specifies where to pull the description from. It can either point to a story or a meta, depending on which description you want to show.

Descriptions are pulled from the JSDoc comments or parameters, and they are rendered as markdown. See Writing descriptions for more details.

There are multiple places to write the description of a component/story, depending on what you want to achieve. Descriptions can be written at the story level to describe each story of a component, or they can be written at the meta or component level to describe the component in general.

Descriptions can be written as JSDoc comments above stories, meta, or components. Alternatively they can also be specified in parameters. To describe a story via parameters instead of comments, add it to parameters.docs.description.story; to describe meta/component, add it to parameters.docs.description.component.

We recommend using JSDoc comments for descriptions, and only use the parameters.docs.description.X properties in situations where comments are not possible to write for some reason, or where you want the description shown in Storybook to be different from the comments. Comments provide a better writing experience as you don’t have to worry about indentation, and they are more discoverable for other developers that are exploring the story/component sources.

When documenting a story, reference a story export in the of prop (see below) and the Description block will look for descriptions in the following order:

When documenting a component, reference a meta export in the of prop (see below) and the Description block will look for descriptions in the following order:

This flow gives you powerful ways to override the description for each scenario. Take the following example:

**Examples:**

Example 1 (jsx):
```jsx
import { Meta, Description } from '@storybook/addon-docs/blocks';
import * as ButtonStories from './Button.stories';
 
<Meta of={ButtonStories} />
 
<Description of={ButtonStories.Primary} />
```

Example 2 (sql):
```sql
import { Description } from '@storybook/addon-docs/blocks';
```

Example 3 (javascript):
```javascript
/**
 * The Button component shows a button
 */
export const Button = () => <button>Click me</button>;
```

Example 4 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { Button } from './Button';
 
/**
 * Button stories
 * These stories showcase the button
 */
const meta = {
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'Another description, overriding the comments',
      },
    },
  },
} satisfies Meta<typeof Button>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
/**
 * Primary Button
 * This is the primary button
 */
export const Primary: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Another description on the story, overriding the comments',
      },
    },
  },
};
```

---

## Main configuration | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/main-config/main-config

**Contents:**
- Main configuration
- main.js or main.ts
- config

The main configuration defines a Storybook project's behavior, including the location of stories, addons to use, feature flags, and other project-specific settings.

This configuration is defined in .storybook/main.js|ts, which is located relative to the root of your project.

A typical Storybook configuration file looks like this:

An object to configure Storybook containing the following properties:

**Examples:**

Example 1 (python):
```python
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  // Required
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  // Optional
  addons: ['@storybook/addon-essentials'],
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public'],
};
 
export default config;
```

---

## ArgTypes | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/doc-blocks/doc-block-argtypes

**Contents:**
- ArgTypes
- ArgTypes
  - exclude
  - include
  - of
  - sort

The ArgTypes block can be used to show a static table of arg types for a given component, as a way to document its interface.

If you’re looking for a dynamic table that shows a story’s current arg values for a story and supports users changing them, see the Controls block instead.

ℹ️ Like most blocks, the ArgTypes block is configured with props in MDX. Many of those props derive their default value from a corresponding parameter in the block's namespace, parameters.docs.argTypes.

The following exclude configurations are equivalent:

The example above applied the parameter at the component (or meta) level, but it could also be applied at the project or story level.

Type: string[] | RegExp

Default: parameters.docs.argTypes.exclude

Specifies which arg types to exclude from the args table. Any arg types whose names match the regex or are part of the array will be left out.

Type: string[] | RegExp

Default: parameters.docs.argTypes.include

Specifies which arg types to include in the args table. Any arg types whose names don’t match the regex or are not part of the array will be left out.

Type: Story export or CSF file exports

Specifies which story to get the arg types from. If a CSF file exports is provided, it will use the primary (first) story in the file.

Type: 'none' | 'alpha' | 'requiredFirst'

Default: parameters.docs.argTypes.sort or 'none'

Specifies how the arg types are sorted.

**Examples:**

Example 1 (jsx):
```jsx
import { Meta, ArgTypes } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';
 
<Meta of={ButtonStories} />
 
<ArgTypes of={ButtonStories} />
```

Example 2 (sql):
```sql
import { ArgTypes } from '@storybook/blocks';
```

Example 3 (jsx):
```jsx
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta: Meta<typeof Button> = {
  component: Button,
  parameters: {
    docs: {
      controls: { exclude: ['style'] },
    },
  },
};
 
export default meta;
```

Example 4 (jsx):
```jsx
<ArgTypes of={ButtonStories} exclude={['style']} />
```

---

## logLevel | Storybook docs

**URL:** https://storybook.js.org/docs/api/main-config/main-config-log-level

**Contents:**
- logLevel

Parent: main.js|ts configuration

Type: 'debug' | 'error' | 'info' | 'trace' | 'warn'

Configures Storybook's logs in the browser terminal. Useful for debugging.

**Examples:**

Example 1 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  logLevel: 'debug',
};
 
export default config;
```

---

## core | Storybook docs

**URL:** https://storybook.js.org/docs/api/main-config/main-config-core

**Contents:**
- core
- allowedHosts
- builder
- channelOptions
  - channelOptions.maxDepth
- crossOriginIsolated
- disableProjectJson
- disableTelemetry
- disableWebpackDefaults
- disableWhatsNewNotifications

Parent: main.js|ts configuration

Configures Storybook's internal features.

Type: string[] | true

Configures the allowed hosts for the Storybook dev server, used for Origin and Host header validation. Storybook's localhost and local network (or --host) addresses are always allowed. Use this when accessing your local Storybook instance through a reverse proxy (e.g. your webapp dev server). Set to true to disable hostname validation (insecure).

Configures Storybook's builder, Vite or Webpack.

With the new Framework API, framework.options.builder is now the preferred way to configure the builder.

You should only use core.builder.options if you need to configure a builder that is not part of a framework.

Configures the channel used by Storybook to communicate between the manager and preview.

Only two properties are likely to be used:

The maximum depth of nested objects to serialize across the channel. Larger values will be slower.

Enable CORS headings to run document in a "secure context". See SharedArrayBuffer security requirements

This enables these headers in development-mode:

Disables the generation of project.json, a file containing Storybook metadata

Disables Storybook's telemetry collection.

Disables Storybook's default Webpack configuration.

Disables the "What's New" notifications in the UI for new Storybook versions and ecosystem updates (e.g., addons, content, etc.).

Enable crash reports to be sent to Storybook telemetry.

**Examples:**

Example 1 (csharp):
```csharp
{
  allowedHosts?: string[] | true;
  builder?: string | { name: string; options?: BuilderOptions };
  channelOptions?: ChannelOptions;
  crossOriginIsolated?: boolean;
  disableProjectJson?: boolean;
  disableTelemetry?: boolean;
  disableWebpackDefaults?: boolean;
  disableWhatsNewNotifications?: boolean;
  enableCrashReports?: boolean;
  renderer?: RendererName;
}
```

Example 2 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  core: {
    allowedHosts: ['storybook.example.local'],
  },
};
 
export default config;
```

Example 3 (elixir):
```elixir
| '@storybook/builder-vite' | '@storybook/builder-webpack5'
| {
    name: '@storybook/builder-vite' | '@storybook/builder-webpack5';
    options?: BuilderOptions;
  }
```

Example 4 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  framework: '@storybook/your-framework',
  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: {
        viteConfigPath: '../../../vite.config.js',
      },
    },
  },
};
 
export default config;
```

---

## viteFinal | Storybook docs

**URL:** https://storybook.js.org/docs/api/main-config/main-config-vite-final

**Contents:**
- viteFinal
- Options

Parent: main.js|ts configuration

Type: (config: Vite.InlineConfig, options: Options) => Vite.InlineConfig | Promise<Vite.InlineConfig>

Customize Storybook's Vite setup when using the Vite builder.

Type: { configType?: 'DEVELOPMENT' | 'PRODUCTION' }

There are other options that are difficult to document here. Please introspect the type definition for more information.

**Examples:**

Example 1 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs-vite, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  async viteFinal(config, { configType }) {
    const { mergeConfig } = await import('vite');
 
    if (configType === 'DEVELOPMENT') {
      // Your development configuration goes here
    }
    if (configType === 'PRODUCTION') {
      // Your production configuration goes here.
    }
    return mergeConfig(config, {
      // Your environment configuration here
    });
  },
};
 
export default config;
```

---

## Component Story Format (CSF) | Storybook docs

**URL:** https://storybook.js.org/docs/api/csf/index

**Contents:**
- Component Story Format (CSF)
- Default export
- Named story exports
- Args story inputs
- Play function
- Custom render functions
- Storybook export vs. name handling
- Non-story exports
- Upgrading from CSF 2 to CSF 3
  - Spreadable story objects

Component Story Format (CSF) is the recommended way to write stories. It's an open standard based on ES6 modules that is portable beyond Storybook.

In CSF, stories and component metadata are defined as ES Modules. Every component story file consists of a required default export and one or more named exports.

The default export defines metadata about your component, including the component itself, its title (where it will show up in the navigation UI story hierarchy), decorators, and parameters.

The component field is required and used by addons for automatic prop table generation and display of other component metadata. The title field is optional and should be unique (i.e., not re-used across files).

For more examples, see writing stories.

With CSF, every named export in the file represents a story object by default.

The exported identifiers will be converted to "start case" using Lodash's startCase function. For example:

We recommend that all export names to start with a capital letter.

Story objects can be annotated with a few different fields to define story-level decorators and parameters, and also to define the name of the story.

Storybook's name configuration element is helpful in specific circumstances. Common use cases are names with special characters or Javascript restricted words. If not specified, Storybook defaults to the named export.

Starting in SB 6.0, stories accept named inputs called Args. Args are dynamic data that are provided (and possibly updated by) Storybook and its addons.

Consider Storybook’s "Button" example of a text button that logs its click events:

Now consider the same example, re-written with args:

Not only are these versions shorter and more accessible to write than their no-args counterparts, but they are also more portable since the code doesn't depend on the actions feature specifically.

For more information on setting up Docs and Actions, see their respective documentation.

Storybook's play functions are small snippets of code executed when the story renders in the UI. They are convenient helper methods to help you test use cases that otherwise weren't possible or required user intervention.

A good use case for the play function is a form component. With previous Storybook versions, you'd write your set of stories and had to interact with the component to validate it. With Storybook's play functions, you could write the following story:

When the story renders in the UI, Storybook executes each step defined in the play function and runs the assertions without the need for user interaction.

Starting in Storybook 6.4, you can write your stories as JavaScript objects, reducing the boilerplate code you need to generate to test your components, thus improving functionality and usability. Render functions are helpful methods to give you additional control over how the story renders. For example, if you were writing a story as an object and you wanted to specify how your component should render, you could write the following:

When Storybook loads this story, it will detect the existence of a render function and adjust the component rendering accordingly based on what's defined.

Storybook handles named exports and the name option slightly differently. When should you use one vs. the other?

Storybook will always use the named export to determine the story ID and URL.

If you specify the name option, it will be used as the story display name in the UI. Otherwise, it defaults to the named export, processed through Storybook's storyNameFromExport and lodash.startCase functions.

When you want to change the name of your story, rename the CSF export. It will change the name of the story and also change the story's ID and URL.

It would be best if you used the name configuration element in the following cases:

In some cases, you may want to export a mixture of stories and non-stories (e.g., mocked data).

You can use the optional configuration fields includeStories and excludeStories in the default export to make this possible. You can define them as an array of strings or regular expressions.

Consider the following story file:

When this file renders in Storybook, it treats ComplexStory and SimpleStory as stories and ignores the data named exports.

For this particular example, you could achieve the same result in different ways, depending on what's convenient:

The first option is the recommended solution if you follow the best practice of starting story exports with an uppercase letter (i.e., use UpperCamelCase).

Storybook provides a codemod to help you upgrade from CSF 2 to CSF 3. You can run it with the following command:

In CSF 2, the named exports are always functions that instantiate a component, and those functions can be annotated with configuration options. For example:

This declares a Primary story for a Button that renders itself by spreading { primary: true } into the component. The default.title metadata says where to place the story in a navigation hierarchy.

Here's the CSF 3 equivalent:

Let's go through the changes individually to understand what's going on.

In CSF 3, the named exports are objects, not functions. This allows us to reuse stories more efficiently with the JS spread operator.

Consider the following addition to the intro example, which creates a PrimaryOnDark story that renders against a dark background:

Here's the CSF 2 implementation:

Primary.bind({}) copies the story function, but it doesn't copy the annotations hanging off the function, so we must add PrimaryOnDark.args = Primary.args to inherit the args.

In CSF 3, we can spread the Primary object to carry over all its annotations:

Learn more about named story exports.

In CSF 3, you specify how a story renders through a render function. We can rewrite a CSF 2 example to CSF 3 through the following steps.

Let's start with a simple CSF 2 story function:

Now, let's rewrite it as a story object in CSF 3 with an explicit render function that tells the story how to render itself. Like CSF 2, this gives us full control of how we render a component or even a collection of components.

Learn more about render functions.

But in CSF 2, a lot of story functions are identical: take the component specified in the default export and spread args into it. What's interesting about these stories is not the function, but the args passed into the function.

CSF 3 provides default render functions for each renderer. If all you're doing is spreading args into your component—which is the most common case—you don't need to specify any render function at all:

For more information, see the section on custom render functions.

Finally, CSF 3 can automatically generate titles.

You can still specify a title like in CSF 2, but if you don't specify one, it can be inferred from the story's path on disk. For more information, see the section on configuring story loading.

**Examples:**

Example 1 (jsx):
```jsx
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta } from '@storybook/your-framework';
 
import { MyComponent } from './MyComponent';
 
const meta = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Path/To/MyComponent',
  component: MyComponent,
  decorators: [
    /* ... */
  ],
  parameters: {
    /* ... */
  },
} satisfies Meta<typeof MyComponent>;
 
export default meta;
```

Example 2 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { MyComponent } from './MyComponent';
 
const meta = {
  component: MyComponent,
} satisfies Meta<typeof MyComponent>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Basic: Story = {};
 
export const WithProp: Story = {
  render: () => <MyComponent prop="value" />,
};
```

Example 3 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { MyComponent } from './MyComponent';
 
const meta = {
  component: MyComponent,
} satisfies Meta<typeof MyComponent>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Simple: Story = {
  name: 'So simple!',
  // ...
};
```

Example 4 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { action } from 'storybook/actions';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
} satisfies Meta<typeof Button>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Basic: Story = {
  render: () => <Button label="Hello" onClick={action('clicked')} />,
};
```

---

## babel | Storybook docs

**URL:** https://storybook.js.org/docs/api/main-config/main-config-babel

**Contents:**
- babel
- Babel.Config
- Options

Parent: main.js|ts configuration

Type: (config: Babel.Config, options: Options) => Babel.Config | Promise<Babel.Config>

Customize Storybook's Babel setup.

Addon authors should use babelDefault instead, which is applied to the preview config before any user presets have been applied.

The options provided by Babel are only applicable if you've enabled the @storybook/addon-webpack5-compiler-babel addon.

If you have an existing Babel configuration file (e.g., .babelrc), it will be automatically detected and used by Storybook without any additional configuration required.

Type: { configType?: 'DEVELOPMENT' | 'PRODUCTION' }

There are other options that are difficult to document here. Please introspect the type definition for more information.

**Examples:**

Example 1 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  async babel(config, { configType }) {
    if (configType === 'DEVELOPMENT') {
      // Your development configuration goes here
    }
    if (configType === 'PRODUCTION') {
      // Your production configuration goes here.
    }
    return config;
  },
};
 
export default config;
```

---

## webpackFinal | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/main-config/main-config-webpack-final

**Contents:**
- webpackFinal
- Options

Parent: main.js|ts configuration

Type: async (config: Config, options: WebpackOptions) => Config

Customize Storybook's Webpack setup when using the webpack builder.

Type: { configType?: 'DEVELOPMENT' | 'PRODUCTION' }

There are other options that are difficult to document here. Please introspect the type definition for more information.

**Examples:**

Example 1 (typescript):
```typescript
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  webpackFinal: async (config, { configType }) => {
    if (configType === 'DEVELOPMENT') {
      // Modify config for development
    }
    if (configType === 'PRODUCTION') {
      // Modify config for production
    }
    return config;
  },
};
 
export default config;
```

---

## IconGallery | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/doc-blocks/doc-block-icongallery

**Contents:**
- IconGallery
- Documenting icons
  - Automate icon documentation
- IconGallery
  - children
- IconItem
  - name
  - children

The IconGallery block enables you to easily document React icon components associated with your project, displayed in a neat grid.

To document a set of icons, use the IconGallery block to display them in a grid. Each icon is wrapped in an IconItem block, enabling you to specify its properties, such as the name and the icon itself.

If you're working on a project that contains a large number of icons that you want to document, you can extend the IconGallery block, wrap IconItem in a loop, and iterate over the icons you want to document, including their properties. For example:

IconGallery is configured with the following props:

Type: React.ReactNode

IconGallery expects only IconItem children.

IconItem is configured with the following props:

Sets the name of the icon.

Type: React.ReactNode

Provides the icon to be displayed.

**Examples:**

Example 1 (typescript):
```typescript
import { Meta, IconGallery, IconItem } from '@storybook/blocks';
 
import { Icon as IconExample } from './Icon';
 
<Meta title="Iconography" />
 
# Iconography
 
<IconGallery>
  <IconItem name="mobile">
    <IconExample name="mobile" />
  </IconItem>
  <IconItem name="user">
    <IconExample name="user" />
  </IconItem>
  <IconItem name="browser">
    <IconExample name="browser" />
  </IconItem>
  <IconItem name="component">
    <IconExample name="component" />
  </IconItem>
  <IconItem name="calendar">
    <IconExample name="calendar" />
  </IconItem>
   <IconItem name="paintbrush">
    <IconExample name="paintbrush" />
  </IconItem>
   <IconItem name="add">
    <IconExample name="add" />
  </IconItem>
  <IconItem name="subtract">
    <IconExample name="subtract" />
  </IconItem>
   <IconItem name="document">
    <IconExample name="document" />
  </IconItem>
  <IconItem name="graphline">
    <IconExample name="graphline" />
  </IconItem>
</IconGallery>
```

Example 2 (typescript):
```typescript
import { Meta, IconGallery, IconItem } from '@storybook/blocks';
 
import { Icon as IconExample } from './Icon';
import * as icons from './icons';
 
# Iconography
 
<IconGallery>
  {Object.keys(icons).map((icon) => (
    <IconItem name={icon}>
      <IconExample icon={icon} />
    </IconItem>
  ))}
</IconGallery>
```

Example 3 (sql):
```sql
import { IconGallery } from '@storybook/blocks';
```

Example 4 (sql):
```sql
import { IconItem } from '@storybook/blocks';
```

---

## Description | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/doc-blocks/doc-block-description

**Contents:**
- Description
- Description
  - of
- Writing descriptions

The Description block displays the description for a component, story, or meta, obtained from their respective JSDoc comments.

Description is configured with the following props:

Type: Story export or CSF file exports

Specifies where to pull the description from. It can either point to a story or a meta, depending on which description you want to show.

Descriptions are pulled from the JSDoc comments or parameters, and they are rendered as markdown. See Writing descriptions for more details.

There are multiple places to write the description of a component/story, depending on what you want to achieve. Descriptions can be written at the story level to describe each story of a component, or they can be written at the meta or component level to describe the component in general.

Descriptions can be written as JSDoc comments above stories, meta, or components. Alternatively they can also be specified in parameters. To describe a story via parameters instead of comments, add it to parameters.docs.description.story; to describe meta/component, add it to parameters.docs.description.component.

We recommend using JSDoc comments for descriptions, and only use the parameters.docs.description.X properties in situations where comments are not possible to write for some reason, or where you want the description shown in Storybook to be different from the comments. Comments provide a better writing experience as you don’t have to worry about indentation, and they are more discoverable for other developers that are exploring the story/component sources.

When documenting a story, reference a story export in the of prop (see below) and the Description block will look for descriptions in the following order:

When documenting a component, reference a meta export in the of prop (see below) and the Description block will look for descriptions in the following order:

This flow gives you powerful ways to override the description for each scenario. Take the following example:

**Examples:**

Example 1 (jsx):
```jsx
import { Meta, Description } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';
 
<Meta of={ButtonStories} />
 
<Description of={ButtonStories.Primary} />
```

Example 2 (sql):
```sql
import { Description } from '@storybook/blocks';
```

Example 3 (javascript):
```javascript
/**
 * The Button component shows a button
 */
export const Button = () => <button>Click me</button>;
```

Example 4 (typescript):
```typescript
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { Button } from './Button';
 
/**
 * Button stories
 * These stories showcase the button
 */
const meta: Meta<typeof Button> = {
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'Another description, overriding the comments',
      },
    },
  },
};
 
export default meta;
type Story = StoryObj<typeof Button>;
 
/**
 * Primary Button
 * This is the primary button
 */
export const Primary: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Another description on the story, overriding the comments',
      },
    },
  },
};
```

---

## docs | Storybook docs

**URL:** https://storybook.js.org/docs/api/main-config/main-config-docs

**Contents:**
- docs
- defaultName
- docsMode

Parent: main.js|ts configuration

Configures Storybook's auto-generated documentation.

Name used for generated documentation pages.

Only show documentation pages in the sidebar (usually set with the --docs CLI flag).

**Examples:**

Example 1 (json):
```json
{
  defaultName?: string;
  docsMode?: boolean;
}
```

Example 2 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  docs: {
    defaultName: 'Documentation',
  },
};
 
export default config;
```

Example 3 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  docs: {
    docsMode: true,
  },
};
 
export default config;
```

---

## staticDirs | Storybook docs

**URL:** https://storybook.js.org/docs/api/main-config/main-config-static-dirs

**Contents:**
- staticDirs
- With configuration objects

Parent: main.js|ts configuration

Type: (string | { from: string; to: string })[]

Sets a list of directories of static files to be loaded by Storybook.

When using Vite-based frameworks, additional directories may be copied to your build directory because of Vite's own static asset handling. You can set Vite's publicDir option to false to disable this behavior.

You can also use a configuration object to define the directories:

**Examples:**

Example 1 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs: ['../public', '../static'],
};
 
export default config;
```

Example 2 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs: [{ from: '../my-custom-assets/images', to: '/assets' }],
};
 
export default config;
```

---

## framework | Storybook docs

**URL:** https://storybook.js.org/docs/api/main-config/main-config-framework

**Contents:**
- framework
- name
- options
  - options.builder

Parent: main.js|ts configuration

Type: FrameworkName | { name: FrameworkName; options?: FrameworkOptions }

Configures Storybook based on a set of framework-specific settings.

For available frameworks and their options, see their respective documentation.

Type: Record<string, any>

While many options are specific to a framework, there are some options that are shared across some frameworks, e.g. those that configure Storybook's builder.

Type: Record<string, any>

Configures Storybook's builder, Vite or Webpack.

**Examples:**

Example 1 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: {
    name: '@storybook/your-framework',
    options: {
      legacyRootApi: true,
    },
  },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
};
 
export default config;
```

---

## Canvas | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/doc-blocks/doc-block-canvas

**Contents:**
- Canvas
- Canvas
  - additionalActions
  - className
  - layout
  - meta
  - of
  - source
  - sourceState
  - story

The Canvas block is a wrapper around a Story, featuring a toolbar that allows you to interact with its content while automatically providing the required Source snippets.

When using the Canvas block in MDX, it references a story with the of prop:

In previous versions of Storybook it was possible to pass in arbitrary components as children to Canvas. That is deprecated and the Canvas block now only supports a single story.

ℹ️ Like most blocks, the Canvas block is configured with props in MDX. Many of those props derive their default value from a corresponding parameter in the block's namespace, parameters.docs.canvas.

The following sourceState configurations are equivalent:

The example above applied the parameter at the story level, but it could also be applied at the component (or meta) level or project level.

Default: parameters.docs.canvas.additionalActions

Provides any additional custom actions to show in the bottom right corner. These are simple buttons that do anything you specify in the onClick function.

Default: parameters.docs.canvas.className

Provides HTML class(es) to the preview element, for custom styling.

Type: 'centered' | 'fullscreen' | 'padded'

Default: parameters.layout or parameters.docs.canvas.layout or 'padded'

Specifies how the canvas should layout the story.

In addition to the parameters.docs.canvas.layout property or the layout prop, the Canvas block will respect the parameters.layout value that defines how a story is laid out in the regular story view.

Type: CSF file exports

Specifies the CSF file to which the story is associated.

You can render a story from a CSF file that you haven’t attached to the MDX file (via Meta) by using the meta prop. Pass the full set of exports from the CSF file (not the default export!).

Specifies which story's source is displayed.

Type: SourceProps['code'] | SourceProps['format'] | SourceProps['language'] | SourceProps['type']

Specifies the props passed to the inner Source block. For more information, see the Source Doc Block documentation.

The dark prop is ignored, as the Source block is always rendered in dark mode when shown as part of a Canvas block.

Type: 'hidden' | 'shown' | 'none'

Default: parameters.docs.canvas.sourceState or 'hidden'

Specifies the initial state of the source panel.

Type: StoryProps['inline'] | StoryProps['height'] | StoryProps['autoplay']

Specifies the props passed to the inner Story block. For more information, see the Story Doc Block documentation.

Default: parameters.docs.canvas.withToolbar

Determines whether to render a toolbar containing tools to interact with the story.

**Examples:**

Example 1 (jsx):
```jsx
import { Meta, Canvas } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';
 
<Meta of={ButtonStories} />
 
<Canvas of={ButtonStories.Primary} />
```

Example 2 (sql):
```sql
import { Canvas } from '@storybook/blocks';
```

Example 3 (typescript):
```typescript
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta: Meta<typeof Button> = {
  component: Button,
};
 
export default meta;
type Story = StoryObj<typeof Button>;
 
export const Basic: Story = {
  parameters: {
    docs: {
      canvas: { sourceState: 'shown' },
    },
  },
};
```

Example 4 (jsx):
```jsx
<Canvas of={ButtonStories.Basic} sourceState="shown" />
```

---

## managerHead | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/main-config/main-config-manager-head

**Contents:**
- managerHead

Parent: main.js|ts configuration

Type: (head: string) => string

Programmatically adjust the manager's <head> of your Storybook. For example, load a custom font or add a script. Most often used by addon authors.

If you don't need to programmatically adjust the manager head, you can add scripts and styles to manager-head.html instead.

For example, you can conditionally add scripts or styles, depending on the environment:

**Examples:**

Example 1 (jsx):
```jsx
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  managerHead: (head) => `
    ${head}
    <link rel="preload" href="/fonts/my-custom-manager-font.woff2" />
  `,
};
 
export default config;
```

---

## stories | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/main-config/main-config-stories

**Contents:**
- stories
- With an array of globs
- With a configuration object
  - StoriesSpecifier
    - StoriesSpecifier.directory
    - StoriesSpecifier.files
    - StoriesSpecifier.titlePrefix
- With a custom implementation

Parent: main.js|ts configuration

Configures Storybook to load stories from the specified locations. The intention is for you to colocate a story file along with the component it documents:

If you want to use a different naming convention, you can alter the glob using the syntax supported by picomatch.

Keep in mind that some addons may assume Storybook's default naming convention.

Storybook will load stories from your project as found by this array of globs (pattern matching strings).

Stories are loaded in the order they are defined in the array. This allows you to control the order in which stories are displayed in the sidebar:

Additionally, you can customize your Storybook configuration to load your stories based on a configuration object. This object is of the type StoriesSpecifier, defined below.

For example, if you wanted to load your stories from a packages/components directory, you could adjust your stories configuration field into the following:

When Storybook starts, it will look for any file containing the stories extension inside the packages/components directory and generate the titles for your stories.

Where to start looking for story files, relative to the root of your project.

Default: '**/*.@(mdx|stories.@(js|jsx|mjs|ts|tsx))'

A glob, relative to StoriesSpecifier.directory (with no leading ./), that matches the filenames to load.

When auto-titling, prefix used when generating the title for your stories.

💡 Storybook now statically analyzes the configuration file to improve performance. Loading stories with a custom implementation may de-optimize or break this ability.

You can also adjust your Storybook configuration and implement custom logic to load your stories. For example, suppose you were working on a project that includes a particular pattern that the conventional ways of loading stories could not solve. In that case, you could adjust your configuration as follows:

**Examples:**

Example 1 (scala):
```scala
| (string | StoriesSpecifier)[]
| async (list: (string | StoriesSpecifier)[]) => (string | StoriesSpecifier)[]
```

Example 2 (unknown):
```unknown
•
└── components
    ├── Button.ts
    └── Button.stories.ts
```

Example 3 (python):
```python
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
};
 
export default config;
```

Example 4 (python):
```python
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
};
 
export default config;
```

---

## logLevel | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/main-config/main-config-log-level

**Contents:**
- logLevel

Parent: main.js|ts configuration

Type: 'debug' | 'error' | 'info' | 'trace' | 'warn'

Configures Storybook's logs in the browser terminal. Useful for debugging.

**Examples:**

Example 1 (python):
```python
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  logLevel: 'debug',
};
 
export default config;
```

---

## typescript | Storybook docs

**URL:** https://storybook.js.org/docs/api/main-config/main-config-typescript

**Contents:**
- typescript
- check
- checkOptions
- reactDocgen
- reactDocgenTypescriptOptions
- skipCompiler

Parent: main.js|ts configuration

Configures how Storybook handles TypeScript files.

Optionally run fork-ts-checker-webpack-plugin. Note that because this uses a Webpack plugin, it is only available when using the Webpack builder.

Options to pass to fork-ts-checker-webpack-plugin, if enabled. See docs for available options.

Type: 'react-docgen' | 'react-docgen-typescript' | false

Configures which library, if any, Storybook uses to parse React components, react-docgen or react-docgen-typescript. Set to false to disable parsing React components. react-docgen-typescript invokes the TypeScript compiler, which makes it slow but generally accurate. react-docgen performs its own analysis, which is much faster but incomplete.

Type: ReactDocgenTypescriptOptions

Configures the options to pass to react-docgen-typescript-plugin if react-docgen-typescript is enabled. See docs for available options for Webpack projects or for Vite projects.

Disable parsing of TypeScript files through the compiler, which is used for Webpack5.

**Examples:**

Example 1 (json):
```json
{
  check?: boolean;
  checkOptions?: CheckOptions;
  reactDocgen?: 'react-docgen' | 'react-docgen-typescript' | false;
  reactDocgenTypescriptOptions?: ReactDocgenTypescriptOptions;
  skipCompiler?: boolean;
}
```

Example 2 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  typescript: {
    check: true,
  },
};
 
export default config;
```

Example 3 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-webpack5, nextjs, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  typescript: {
    check: true,
    checkOptions: {
      eslint: true,
    },
  },
};
 
export default config;
```

Example 4 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  typescript: {
    reactDocgen: 'react-docgen',
  },
};
 
export default config;
```

---

## Source | Storybook docs

**URL:** https://storybook.js.org/docs/api/doc-blocks/doc-block-source

**Contents:**
- Source
- Source
  - code
  - dark
  - excludeDecorators
  - language
  - of
  - transform
  - type

The Source block is used to render a snippet of source code directly.

ℹ️ Like most blocks, the Source block is configured with props in MDX. Many of those props derive their default value from a corresponding parameter in the block's namespace, parameters.docs.source.

The following language configurations are equivalent:

The example above applied the parameter at the story level, but it could also be applied at the component (or meta) level or project level.

Default: parameters.docs.source.code

Provides the source code to be rendered.

Default: parameters.docs.source.dark

Determines if the snippet is rendered in dark mode.

Light mode is only supported when the Source block is rendered independently. When rendered as part of a Canvas block—like it is in autodocs—it will always use dark mode.

Default: parameters.docs.source.excludeDecorators

Determines if decorators are rendered in the source code snippet.

Default: parameters.docs.source.language or 'jsx'

Specifies the language used for syntax highlighting.

Specifies which story's source is rendered.

Type: (code: string, storyContext: StoryContext) => string | Promise<string>

Default: parameters.docs.source.transform

An async function to dynamically transform the source before being rendered, based on the original source and any story context necessary. The returned string is displayed as-is. If both code and transform are specified, transform will be ignored.

This example shows how to use Prettier to format all source code snippets in your documentation. The transform function is applied globally through the preview configuration, ensuring consistent code formatting across all stories.

Type: 'auto' | 'code' | 'dynamic'

Default: parameters.docs.source.type or 'auto'

Specifies how the source code is rendered.

Note that dynamic snippets will only work if the story uses args and the Story block for that story is rendered along with the Source block.

**Examples:**

Example 1 (jsx):
```jsx
import { Meta, Source } from '@storybook/addon-docs/blocks';
import * as ButtonStories from './Button.stories';
 
<Meta of={ButtonStories} />
 
<Source of={ButtonStories.Primary} />
```

Example 2 (sql):
```sql
import { Source } from '@storybook/addon-docs/blocks';
```

Example 3 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
} satisfies Meta<typeof Button>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Basic: Story = {
  parameters: {
    docs: {
      source: { language: 'ts' },
    },
  },
};
```

Example 4 (jsx):
```jsx
<Source of={ButtonStories.Basic} language="tsx" />
```

---

## API references | Storybook docs

**URL:** https://storybook.js.org/docs/8/api

**Contents:**
- API references
- Configuration
- Stories
- Docs

An overview of all available API references for Storybook.

Storybook's primary configuration file, which specifies your Storybook project's behavior, including the location of your stories, the addons you use, feature flags and other project-specific settings.

This configuration file controls the way stories are rendered. You can also use it to run code that applies to all stories.

This configuration file controls the behavior of Storybook's UI, the manager.

Storybook is a CLI tool. You can start Storybook in development mode or build a static version of your Storybook.

Component Story Format (CSF) is the API for writing stories. It's an open standard based on ES6 modules that is portable beyond Storybook.

ArgTypes specify the behavior of args. By specifying the type of an arg, you constrain the values that it can accept and provide information about args that are not explicitly set.

Parameters are static metadata used to configure your stories addons in Storybook. They are specified at the story, meta (component), project (global) levels.

Storybook offers several doc blocks to help document your components and other aspects of your project.

---

## Typeset | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/doc-blocks/doc-block-typeset

**Contents:**
- Typeset
- Typeset
  - fontFamily
  - fontSizes
  - fontWeight
  - sampleText

The Typeset block helps document the fonts used throughout your project.

Typeset is configured with the following props:

Provides a font family to be displayed.

Type: (string | number)[]

Provides a list of available font sizes (in px).

Specifies the weight of the font to be displayed.

Sets the text to be displayed.

**Examples:**

Example 1 (jsx):
```jsx
import { Meta, Typeset } from '@storybook/blocks';
 
<Meta title="Typography" />
 
export const typography = {
  type: {
    primary: '"Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  weight: {
    regular: '400',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  size: {
    s1: 12,
    s2: 14,
    s3: 16,
    m1: 20,
    m2: 24,
    m3: 28,
    l1: 32,
    l2: 40,
    l3: 48,
  },
};
 
export const SampleText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
 
# Typography
 
**Font:** Nunito Sans
 
**Weights:** 400(regular), 700(bold), 800(extrabold), 900(black)
 
<Typeset
  fontSizes={[
    Number(typography.size.s1),
    Number(typography.size.s2),
    Number(typography.size.s3),
    Number(typography.size.m1),
    Number(typography.size.m2),
    Number(typography.size.m3),
    Number(typography.size.l1),
    Number(typography.size.l2),
    Number(typography.size.l3),
  ]}
  fontWeight={typography.weight.black}
  sampleText={SampleText}
  fontFamily={typography.type.primary}
/>
```

Example 2 (sql):
```sql
import { Typeset } from '@storybook/blocks';
```

---

## tags | Storybook docs

**URL:** https://storybook.js.org/docs/api/main-config/main-config-tags

**Contents:**
- tags
- [tagName]
  - [tagName].defaultFilterSelection

Parent: main.js|ts configuration

Type: { [tagName: string]: { defaultFilterSelection?: 'include' | 'exclude' } }

Define custom tags for your stories, or alter the default configuration of built-in tags.

The name of the tag. This can be any static (i.e. not created dynamically) string, either a built-in tag or a custom tag of your own design.

Type: 'include' | 'exclude'

Set the default filter selection state for a tag in the Storybook sidebar. If set to include, stories with this tag are selected as included. If set to exclude, stories with this tag are selected as excluded, and must be explicitly included by selecting the tag in the sidebar filter menu. If not set, the tag has no default selection.

**Examples:**

Example 1 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  tags: {
    // 👇 Define a custom tag named "experimental"
    experimental: {
      defaultFilterSelection: 'exclude', // Or 'include'
    },
  },
};
 
export default config;
```

---

## Source | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/doc-blocks/doc-block-source

**Contents:**
- Source
- Source
  - code
  - dark
  - excludeDecorators
  - format
  - language
  - of
  - transform
  - type

The Source block is used to render a snippet of source code directly.

ℹ️ Like most blocks, the Source block is configured with props in MDX. Many of those props derive their default value from a corresponding parameter in the block's namespace, parameters.docs.source.

The following language configurations are equivalent:

The example above applied the parameter at the story level, but it could also be applied at the component (or meta) level or project level.

Default: parameters.docs.source.code

Provides the source code to be rendered.

Default: parameters.docs.source.dark

Determines if the snippet is rendered in dark mode.

Light mode is only supported when the Source block is rendered independently. When rendered as part of a Canvas block—like it is in autodocs—it will always use dark mode.

Default: parameters.docs.source.excludeDecorators

Determines if decorators are rendered in the source code snippet.

Type: boolean | 'dedent' | BuiltInParserName

Default: parameters.docs.source.format or true

Specifies the formatting used on source code. Both true and 'dedent' have the same effect of removing any extraneous indentation. Supports all valid prettier parser names.

Default: parameters.docs.source.language or 'jsx'

Specifies the language used for syntax highlighting.

Specifies which story's source is rendered.

Type: (code: string, storyContext: StoryContext) => string

Default: parameters.docs.source.transform

A function to dynamically transform the source before being rendered, based on the original source and any story context necessary. The returned string is displayed as-is. If both code and transform are specified, transform will be ignored.

Type: 'auto' | 'code' | 'dynamic'

Default: parameters.docs.source.type or 'auto'

Specifies how the source code is rendered.

Note that dynamic snippets will only work if the story uses args and the Story block for that story is rendered along with the Source block.

**Examples:**

Example 1 (jsx):
```jsx
import { Meta, Source } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';
 
<Meta of={ButtonStories} />
 
<Source of={ButtonStories.Primary} />
```

Example 2 (sql):
```sql
import { Source } from '@storybook/blocks';
```

Example 3 (typescript):
```typescript
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta: Meta<typeof Button> = {
  component: Button,
};
 
export default meta;
type Story = StoryObj<typeof Button>;
 
export const Basic: Story = {
  parameters: {
    docs: {
      source: { language: 'tsx' },
    },
  },
};
```

Example 4 (jsx):
```jsx
<Source of={ButtonStories.Basic} language="tsx" />
```

---

## refs | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/main-config/main-config-refs

**Contents:**
- refs
- Using a function
- Disable a ref

Parent: main.js|ts configuration

Configures Storybook composition.

You can use a function to dynamically configure refs:

Some package dependencies automatically compose their Storybook in yours. You can disable this behavior by setting disable to true for the package name:

**Examples:**

Example 1 (json):
```json
{ [key: string]:
  | { title: string; url: string; expanded?: boolean, sourceUrl?: string }
  | (config: { title: string; url: string; expanded?: boolean, sourceUrl: string }) => { title: string; url: string; expanded?: boolean, sourceUrl?: string }
  | { disable: boolean }
}
```

Example 2 (python):
```python
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  refs: {
    'design-system': {
      title: 'Storybook Design System',
      url: 'https://master--5ccbc373887ca40020446347.chromatic.com/',
      expanded: false, // Optional, true by default,
      sourceUrl: 'https://github.com/storybookjs/storybook', // Optional
    },
  },
};
 
export default config;
```

Example 3 (typescript):
```typescript
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
 
  // 👇 Retrieve the current environment from the configType argument
  refs: (config, { configType }) => {
    if (configType === 'DEVELOPMENT') {
      return {
        react: {
          title: 'Composed React Storybook running in development mode',
          url: 'http://localhost:7007',
        },
        angular: {
          title: 'Composed Angular Storybook running in development mode',
          url: 'http://localhost:7008',
        },
      };
    }
    return {
      react: {
        title: 'Composed React Storybook running in production',
        url: 'https://your-production-react-storybook-url',
      },
      angular: {
        title: 'Composed Angular Storybook running in production',
        url: 'https://your-production-angular-storybook-url',
      },
    };
  },
};
 
export default config;
```

Example 4 (python):
```python
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  refs: {
    'package-name': { disable: true },
  },
};
 
export default config;
```

---

## ColorPalette | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/doc-blocks/doc-block-colorpalette

**Contents:**
- ColorPalette
- ColorPalette
  - children
- ColorItem
  - colors
  - subtitle
  - title

The ColorPalette block allows you to document all color-related items (e.g., swatches) used throughout your project.

ColorPalette is configured with the following props:

Type: React.ReactNode

ColorPalette expects only ColorItem children.

ColorItem is configured with the following props:

Type: string[] | { [key: string]: string }

Provides the list of colors to be displayed. Accepts any valid CSS color format (hex, RGB, HSL, etc.). When an object is provided, the keys will be displayed above the values. Additionally, it supports gradients such as 'linear-gradient(to right, white, black)' or 'linear-gradient(65deg, white, black)', etc.

Provides an additional description of the color.

Sets the name of the color to be displayed.

**Examples:**

Example 1 (jsx):
```jsx
import { Meta, ColorPalette, ColorItem } from '@storybook/blocks';
 
<Meta title="Colors" />
 
<ColorPalette>
  <ColorItem
    title="theme.color.greyscale"
    subtitle="Some of the greys"
    colors={{ White: '#FFFFFF', Alabaster: '#F8F8F8', Concrete: '#F3F3F3' }}
  />
  <ColorItem 
    title="theme.color.primary" 
    subtitle="Coral" 
    colors={{ WildWatermelon: '#FF4785' }} 
  />
  <ColorItem 
    title="theme.color.secondary" 
    subtitle="Ocean" 
    colors={{ DodgerBlue: '#1EA7FD' }} 
  />
  <ColorItem
    title="theme.color.positive"
    subtitle="Green"
    colors={{
      Apple: 'rgba(102,191,60,1)',
      Apple80: 'rgba(102,191,60,.8)',
      Apple60: 'rgba(102,191,60,.6)',
      Apple30: 'rgba(102,191,60,.3)',
    }}
  />
  <ColorItem
    title="gradient"
    subtitle="Grayscale"
    colors={{
      Gradient: 'linear-gradient(to right,white,black)',
    }}
  />
  <ColorItem
    title="gradient"
    subtitle="Grayscale"
    colors={['linear-gradient(65deg,white,black)']}
  />
</ColorPalette>
```

Example 2 (sql):
```sql
import { ColorPalette } from '@storybook/blocks';
```

Example 3 (sql):
```sql
import { ColorItem } from '@storybook/blocks';
```

---

## Subtitle | Storybook docs

**URL:** https://storybook.js.org/docs/api/doc-blocks/doc-block-subtitle

**Contents:**
- Subtitle
- Subtitle
  - children
  - of

The Subtitle block can serve as a secondary heading for your docs entry.

Subtitle is configured with the following props:

Type: JSX.Element | string

Default: parameters.docs.subtitle

Provides the content.

Type: CSF file exports

Specifies which meta's subtitle is displayed.

**Examples:**

Example 1 (sql):
```sql
import { Subtitle } from '@storybook/addon-docs/blocks';
 
<Subtitle>This is the subtitle</Subtitle>
```

Example 2 (sql):
```sql
import { Subtitle } from '@storybook/addon-docs/blocks';
```

---

## MCP server API | Storybook docs

**URL:** https://storybook.js.org/docs/ai/mcp/api

**Contents:**
- MCP server API
- @storybook/addon-mcp options
  - toolsets
    - dev
    - docs
    - test

While they are in preview, Storybook's AI capabilities (specifically, the manifests and MCP server) are currently only supported for React projects.

Additionally, the API may change in future releases. We welcome feedback and contributions to help improve this feature.

The MCP server addon accepts the following options to configure the tools provided by the MCP server. You can provide these options when registering the addon in your main.js|ts file:

Configuration object to toggle which toolsets are enabled in the MCP server. By default, all toolsets are enabled.

The development toolset includes the get-storybook-story-instructions and preview-stories tools.

The docs toolset includes the get-documentation, get-documentation-for-story, and list-all-documentation tools.

The testing toolset includes the run-story-tests tool.

**Examples:**

Example 1 (lua):
```lua
// Replace your-framework with the framework you are using (e.g., react-vite, vue3-vite, angular, etc.)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    // ... your existing addons
    {
      name: '@storybook/addon-mcp',
      options: {
        toolsets: {
          dev: false,
        },
      },
    },
  ],
};
 
export default config;
```

Example 2 (json):
```json
{
  dev?: boolean;
  docs?: boolean;
  test?: boolean;
}
```

Example 3 (css):
```css
{
  dev: true,
  docs: true,
  test: true,
}
```

---

## ArgTypes | Storybook docs

**URL:** https://storybook.js.org/docs/api/doc-blocks/doc-block-argtypes

**Contents:**
- ArgTypes
- ArgTypes
  - exclude
  - include
  - of
  - sort

The ArgTypes block can be used to show a static table of arg types for a given component, as a way to document its interface.

If you’re looking for a dynamic table that shows a story’s current arg values for a story and supports users changing them, see the Controls block instead.

ℹ️ Like most blocks, the ArgTypes block is configured with props in MDX. Many of those props derive their default value from a corresponding parameter in the block's namespace, parameters.docs.argTypes.

The following exclude configurations are equivalent:

The example above applied the parameter at the component (or meta) level, but it could also be applied at the project or story level.

Type: string[] | RegExp

Default: parameters.docs.argTypes.exclude

Specifies which arg types to exclude from the args table. Any arg types whose names match the regex or are part of the array will be left out.

Type: string[] | RegExp

Default: parameters.docs.argTypes.include

Specifies which arg types to include in the args table. Any arg types whose names don’t match the regex or are not part of the array will be left out.

Type: Story export or CSF file exports

Specifies which story to get the arg types from. If a CSF file exports is provided, it will use the primary (first) story in the file.

Type: 'none' | 'alpha' | 'requiredFirst'

Default: parameters.docs.argTypes.sort or 'none'

Specifies how the arg types are sorted.

**Examples:**

Example 1 (jsx):
```jsx
import { Meta, ArgTypes } from '@storybook/addon-docs/blocks';
import \* as ButtonStories from './Button.stories';
 
<Meta of={ButtonStories} />
 
<ArgTypes of={ButtonStories} />
```

Example 2 (sql):
```sql
import { ArgTypes } from '@storybook/addon-docs/blocks';
```

Example 3 (jsx):
```jsx
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
  parameters: {
    docs: {
      argTypes: { exclude: ['style'] },
    },
  },
} satisfies Meta<typeof Button>;
 
export default meta;
```

Example 4 (jsx):
```jsx
<ArgTypes of={ButtonStories} exclude={['style']} />
```

---

## previewAnnotations | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/main-config/main-config-preview-annotations

**Contents:**
- previewAnnotations

Parent: main.js|ts configuration

Type: string[] | ((config: string[], options: Options) => string[] | Promise<string[]>)

Add additional scripts to run in the story preview.

Mostly used by frameworks. Storybook users and addon authors should add scripts to preview.js instead.

**Examples:**

Example 1 (lua):
```lua
// @storybook/nextjs framework's src/preset.ts
 
import type { StorybookConfig } from './types';
 
export const previewAnnotations: StorybookConfig['previewAnnotations'] = (entry = []) => [
  ...entry,
  require.resolve('@storybook/nextjs/preview.js'),
];
```

---

## indexers | Storybook docs

**URL:** https://storybook.js.org/docs/api/main-config/main-config-indexers

**Contents:**
- indexers
- Indexer
  - test
  - createIndex
    - fileName
    - IndexerOptions
      - makeTitle
    - IndexInput
      - exportName
      - importPath

While this feature is experimental, it must be specified by the experimental_indexers property of StorybookConfig.

Parent: main.js|ts configuration

Type: (existingIndexers: Indexer[]) => Promise<Indexer[]>

Indexers are responsible for building Storybook's index of stories—the list of all stories and a subset of their metadata like id, title, tags, and more. The index can be read at the /index.json route of your Storybook.

The indexers API is an advanced feature that allows you to customize Storybook's indexers, which dictate how Storybook indexes and parses files into story entries. This adds more flexibility to how you can write stories, including which language stories are defined in or where to get stories from.

They are defined as a function that returns the full list of indexers, including the existing ones. This allows you to add your own indexer to the list, or to replace an existing one:

Unless your indexer is doing something relatively trivial (e.g. indexing stories with a different naming convention), in addition to indexing the file, you will likely need to transpile it to CSF so that Storybook can read them in the browser.

Specifies which files to index and how to index them as stories.

A regular expression run against file names included in the stories configuration that should match all files to be handled by this indexer.

Type: (fileName: string, options: IndexerOptions) => Promise<IndexInput[]>

Function that accepts a single CSF file and returns a list of entries to index.

The name of the CSF file used to create entries to index.

Options for indexing the file.

Type: (userTitle?: string) => string

A function that takes a user-provided title and returns a formatted title for the index entry, which is used in the sidebar. If no user title is provided, one is automatically generated based on the file name and path.

See IndexInput.title for example usage.

An object representing a story to be added to the stories index.

For each IndexInput, the indexer will add this export (from the file found at importPath) as an entry in the index.

Default: The original fileName passed to the createIndex function

The file to import from, e.g. the CSF file.

It is likely that the fileName being indexed is not CSF, in which you will need to transpile it to CSF so that Storybook can read it in the browser.

⚠️ Custom importPaths are only supported in Vite-based projects. To use them in Webpack-based projects, you will need to transpile the source file to CSF and leave importPath empty to use the original fileName.

Type: 'story' | 'test'

The subtype of the story entry when type is 'story'. Use this to mark an entry as a test (experimental). If not specified, defaults to 'story'.

The raw path/package of the file that provides meta.component, if one exists.

Default: Auto-generated from title

Define the custom id for meta of the entry.

If specified, the export default (meta) in the CSF file must have a corresponding id property, to be correctly matched.

Default: Auto-generated from exportName

The name of the entry.

Tags for filtering entries in Storybook and its tools.

Default: Auto-generated from the meta (or default export) of importPath

Determines the location of the entry in the sidebar.

Most of the time, you should not specify a title, so that your indexer will use the default naming behavior. When specifying a title, you must use the makeTitle function provided in IndexerOptions to also use this behavior. For example, here's an indexer that merely appends a "Custom" prefix to the title derived from the file name:

Default: Auto-generated from title/metaId and exportName

Define the custom id for the story of the entry.

If specified, the story in the CSF file must have a corresponding __id property, to be correctly matched.

Only use this if you need to override the auto-generated id.

The value of importPath in an IndexInput must resolve to a CSF file. Most custom indexers, however, are only necessary because the input is not CSF. Therefore, you will likely need to transpile the input to CSF, so that Storybook can read it in the browser and render your stories.

Transpiling the custom source format to CSF is beyond the scope of this documentation. This transpilation is often done at the builder level (Vite and/or Webpack), and we recommend using unplugin to create plugins for multiple builders.

The general architecture looks something like this:

Let's look at an example of how this might work.

First, here's an example of a non-CSF source file:

The builder plugin would then:

That resulting CSF file would then be indexed by Storybook. It would look something like this:

Some example usages of custom indexers include:

This indexer generates stories for components based on JSON fixture data. It looks for *.stories.json files in the project, adds them to the index and separately converts their content to CSF.

An example input JSON file could look like this:

A builder plugin will then need to transform the JSON file into a regular CSF file. This transformation could be done with a Vite plugin similar to this:

You can use a custom indexer and builder plugin to create your API to define stories extending the CSF format. To learn more, see the following proof of concept to set up a custom indexer to generate stories dynamically. It contains everything needed to support such a feature, including the indexer, a Vite plugin, and a Webpack loader.

Custom indexers can be used for an advanced purpose: defining stories in any language, including template languages, and converting the files to CSF. To see examples of this in action, you can refer to @storybook/addon-svelte-csf for Svelte template syntax and storybook-vue-addon for Vue template syntax.

The indexer API is flexible enough to let you process arbitrary content, so long as your framework tooling can transform the exports in that content into actual stories it can run. This advanced example demonstrates how you can create a custom indexer to process a collection of URLs, extract the title and URL from each page, and render them as sidebar links in the UI. Implemented with Svelte, it can be adapted to any framework.

Start by creating the URL collection file (i.e., src/MyLinks.url.js) with a list of URLs listed as named exports. The indexer will use the export name as the story title and the value as the unique identifier.

Adjust your Vite configuration file to include a custom plugin complementing the indexer. This will allow Storybook to process and import the URL collection file as stories.

Update your Storybook configuration (i.e., .storybook/main.js|ts) to include the custom indexer.

Add a Storybook UI configuration file (i.e., .storybook/manager.js|ts) to render the indexed URLs as sidebar links in the UI:

This example's code and live demo are available on StackBlitz.

**Examples:**

Example 1 (javascript):
```javascript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    // 👇 Make sure files to index are included in `stories`
    '../src/**/*.custom-stories.@(js|jsx|ts|tsx)',
  ],
  experimental_indexers: async (existingIndexers) => {
    const customIndexer = {
      test: /\.custom-stories\.[tj]sx?$/,
      createIndex: async (fileName) => {
        // See API and examples below...
      },
    };
    return [...existingIndexers, customIndexer];
  },
};
 
export default config;
```

Example 2 (scala):
```scala
{
  test: RegExp;
  createIndex: (fileName: string, options: IndexerOptions) => Promise<IndexInput[]>;
}
```

Example 3 (scala):
```scala
{
  makeTitle: (userTitle?: string) => string;
}
```

Example 4 (typescript):
```typescript
{
  exportName: string;
  importPath: string;
  type: 'story';
  subtype?: 'story' | 'test';
  rawComponentPath?: string;
  metaId?: string;
  name?: string;
  tags?: string[];
  title?: string;
  __id?: string;
}
```

---

## Parameters | Storybook docs

**URL:** https://storybook.js.org/docs/api/parameters

**Contents:**
- Parameters
- Story parameters
- Meta parameters
- Project parameters
- Available parameters
  - layout
  - options
    - options.storySort
  - test
    - clearMocks

Parameters are static metadata used to configure your stories and addons in Storybook. They are specified at the story, meta (component), project (global) levels.

Parameters specified at the story level apply to that story only. They are defined in the parameters property of the story (named export):

Parameters specified at the story level will override those specified at the project level and meta (component) level.

Parameter's specified in a CSF file's meta configuration apply to all stories in that file. They are defined in the parameters property of the meta (or default export):

Parameters specified at the meta (component) level will override those specified at the project level.

Parameters specified at the project (global) level apply to all stories in your Storybook. They are defined in the parameters property of the meta (or default export) in your .storybook/preview.* file:

Storybook only accepts a few parameters directly.

Type: 'centered' | 'fullscreen' | 'padded'

Specifies how the canvas should lay out the story.

The options parameter can only be applied at the project level.

Type: StorySortConfig | StorySortFn

Specifies the order in which stories are displayed in the Storybook UI.

When specifying a configuration object, the following options are available:

When specifying a custom sorting function, the function behaves like a typical JavaScript sorting function. It accepts two stories to compare and returns a number. For example:

See the guide for usage examples.

Similar to Vitest, it will call .mockClear() on all spies created with fn() from storybook/test when a story unmounts. This will clear mock history, but not reset its implementation to the default one.

Similar to Vitest, it will call .mockReset() on all spies created with fn() from storybook/test when a story unmounts. This will clear mock history and reset its implementation to an empty function (will return undefined).

Similar to Vitest, it will call .restoreMocks() on all spies created with fn() from storybook/test when a story unmounts. This will clear mock history and reset its implementation to the original one.

Unhandled errors might cause false positive assertions. Setting this to true will prevent the play function from failing and showing a warning when unhandled errors are thrown during execution.

All other parameters are contributed by features. The essential feature's parameters are documented on their individual pages:

No matter where they're specified, parameters are ultimately applied to a single story. Parameters specified at the project (global) level are applied to every story in that project. Those specified at the meta (component) level are applied to every story associated with that meta. And parameters specified for a story only apply to that story.

When specifying parameters, they are merged together in order of increasing specificity:

Parameters are merged, so objects are deep-merged, but arrays and other properties are overwritten.

In other words, the following specifications of parameters:

Will result in the following parameter values applied to each story:

**Examples:**

Example 1 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
} satisfies Meta<typeof Button>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Primary: Story = {
  // 👇 Story-level parameters
  parameters: {
    backgrounds: {
      options: {
        red: { name: 'Red', value: '#f00' },
        green: { name: 'Green', value: '#0f0' },
        blue: { name: 'Blue', value: '#00f' },
      },
    },
  },
};
```

Example 2 (jsx):
```jsx
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
  //👇 Creates specific parameters at the component level
  parameters: {
    backgrounds: {
      options: {},
    },
  },
} satisfies Meta<typeof Button>;
 
export default meta;
```

Example 3 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Preview } from '@storybook/your-framework';
 
const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        light: { name: 'Light', value: '#fff' },
        dark: { name: 'Dark', value: '#333' },
      },
    },
  },
};
 
export default preview;
```

Example 4 (json):
```json
{
  storySort?: StorySortConfig | StorySortFn;
}
```

---

## previewAnnotations | Storybook docs

**URL:** https://storybook.js.org/docs/api/main-config/main-config-preview-annotations

**Contents:**
- previewAnnotations

Parent: main.js|ts configuration

Type: string[] | ((config: string[], options: Options) => string[] | Promise<string[]>)

Add additional scripts to run in the story preview.

Mostly used by frameworks. Storybook users and addon authors should add scripts to preview.js instead.

**Examples:**

Example 1 (lua):
```lua
// @storybook/nextjs framework's src/preset.ts
 
import type { StorybookConfig } from './types';
 
export const previewAnnotations: StorybookConfig['previewAnnotations'] = (entry = []) => [
  ...entry,
  import.meta.resolve('@storybook/nextjs/preview'),
];
```

---

## babel | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/main-config/main-config-babel

**Contents:**
- babel
- Babel.Config
- Options

Parent: main.js|ts configuration

Type: (config: Babel.Config, options: Options) => Babel.Config | Promise<Babel.Config>

Customize Storybook's Babel setup.

Addon authors should use babelDefault instead, which is applied to the preview config before any user presets have been applied.

The options provided by Babel are only applicable if you've enabled the @storybook/addon-webpack5-compiler-babel addon.

If you have an existing Babel configuration file (e.g., .babelrc), it will be automatically detected and used by Storybook without any additional configuration required.

Type: { configType?: 'DEVELOPMENT' | 'PRODUCTION' }

There are other options that are difficult to document here. Please introspect the type definition for more information.

**Examples:**

Example 1 (python):
```python
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  async babel(config, { configType }) {
    if (configType === 'DEVELOPMENT') {
      // Your development configuration goes here
    }
    if (configType === 'PRODUCTION') {
      // Your production configuration goes here.
    }
    return config;
  },
};
 
export default config;
```

---

## typescript | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/main-config/main-config-typescript

**Contents:**
- typescript
- check
- checkOptions
- reactDocgen
- reactDocgenTypescriptOptions
- skipCompiler

Parent: main.js|ts configuration

Configures how Storybook handles TypeScript files.

Optionally run fork-ts-checker-webpack-plugin. Note that because this uses a Webpack plugin, it is only available when using the Webpack builder.

Options to pass to fork-ts-checker-webpack-plugin, if enabled. See docs for available options.

Type: 'react-docgen' | 'react-docgen-typescript' | false

Configures which library, if any, Storybook uses to parse React components, react-docgen or react-docgen-typescript. Set to false to disable parsing React components. react-docgen-typescript invokes the TypeScript compiler, which makes it slow but generally accurate. react-docgen performs its own analysis, which is much faster but incomplete.

Type: ReactDocgenTypescriptOptions

Configures the options to pass to react-docgen-typescript-plugin if react-docgen-typescript is enabled. See docs for available options for Webpack projects or for Vite projects.

Disable parsing of TypeScript files through the compiler, which is used for Webpack5.

**Examples:**

Example 1 (json):
```json
{
  check?: boolean;
  checkOptions?: CheckOptions;
  reactDocgen?: 'react-docgen' | 'react-docgen-typescript' | false;
  reactDocgenTypescriptOptions?: ReactDocgenTypescriptOptions;
  skipCompiler?: boolean;
}
```

Example 2 (python):
```python
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-webpack5)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  typescript: {
    check: true,
  },
};
 
export default config;
```

Example 3 (python):
```python
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-webpack5)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  typescript: {
    check: true,
    checkOptions: {
      eslint: true,
    },
  },
};
 
export default config;
```

Example 4 (python):
```python
// Replace your-framework with the framework you are using (e.g., react-webpack5, react-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  typescript: {
    reactDocgen: 'react-docgen',
  },
};
 
export default config;
```

---

## ArgTypes | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/arg-types

**Contents:**
- ArgTypes
- Automatic argType inference
- Manually specifying argTypes
- argTypes
  - control
    - control.type
    - control.accept
    - control.labels
    - control.max
    - control.min

ArgTypes specify the behavior of args. By specifying the type of an arg, you constrain the values that it can accept and provide information about args that are not explicitly set (i.e., description).

You can also use argTypes to “annotate” args with information used by addons that make use of those args. For instance, to instruct the controls addon to render a color picker, you could specify the 'color' control type.

The most concrete realization of argTypes is the ArgTypes doc block (Controls is similar). Each row in the table corresponds to a single argType and the current value of that arg.

If you are using the Storybook docs addon (installed by default as part of essentials), then Storybook will infer a set of argTypes for each story based on the component specified in the default export of the CSF file.

To do so, Storybook uses various static analysis tools depending on your framework.

The data structure of argTypes is designed to match the output of the these tools. Properties specified manually will override what is inferred.

For most Storybook projects, argTypes are automatically inferred from your components. Any argTypes specified manually will override the inferred values.

ArgTypes are most often specified at the meta (component) level, in the default export of the CSF file:

They can apply to all stories when specified at the project (global) level, in the preview.js|ts configuration file:

Or they can apply only to a specific story:

You configure argTypes using an object with keys matching the name of args. The value of each key is an object with the following properties:

Specify the behavior of the controls addon for the arg. If you specify a string, it's used as the type of the control. If you specify an object, you can provide additional configuration. Specifying false will prevent the control from rendering.

Type: ControlType | null

Default: Inferred; 'select', if options are specified; falling back to 'object'

Specifies the type of control used to change the arg value with the controls addon. Here are the available types, ControlType, grouped by the type of data they handle:

The date control will convert the date into a UNIX timestamp when the value changes. It's a known limitation that will be fixed in a future release. If you need to represent the actual date, you'll need to update the story's implementation and convert the value into a date object.

When type is 'file', you can specify the file types that are accepted. The value should be a string of comma-separated MIME types.

Type: { [option: string]: string }

Map options to labels. labels doesn't have to be exhaustive. If an option is not in the object's keys, it's used verbatim.

When type is 'number' or 'range', sets the maximum allowed value.

When type is 'number' or 'range', sets the minimum allowed value.

When type is 'color', defines the set of colors that are available in addition to the general color picker. The values in the array should be valid CSS color values.

When type is 'number' or 'range', sets the granularity allowed when incrementing/decrementing the value.

Describe the arg. (If you intend to describe the type of the arg, you should use table.type, instead.)

Conditionally render an argType based on the value of another arg or global.

Type: { [key: string]: { [option: string]: any } }

Map options to values.

When dealing with non-primitive values, you'll notice that you'll run into some limitations. The most obvious issue is that not every value can be represented as part of the args param in the URL, losing the ability to share and deeplink to such a state. Beyond that, complex values such as JSX cannot be synchronized between the manager (e.g., Controls addon) and the preview (your story).

mapping doesn't have to be exhaustive. If the currently selected option is not listed, it's used verbatim. Can be used with control.labels.

The argTypes object uses the name of the arg as the key. By default, that key is used when displaying the argType in Storybook. You can override the displayed name by specifying a name property.

Be careful renaming args in this way. Users of the component you're documenting will not be able to use the documented name as a property of your component and the actual name will not displayed.

For this reason, the name property is best used when defining an argType that is only used for documentation purposes and not an actual property of the component. For example, when providing argTypes for each property of an object.

If the arg accepts a finite set of values, you can specify them with options. If those values are complex, like JSX elements, you can use mapping to map them to string values. You can use control.labels to provide custom labels for the options.

Specify how the arg is documented in the ArgTypes doc block, Controls doc block, and Controls addon panel.

Default: Inferred, in some frameworks

Display the argType under a category heading, with the label specified by category.

Type: { detail?: string; summary: string }

The documented default value of the argType. summary is typically used for the value itself, while detail is used for additional information.

Set to true to remove the argType's row from the table.

Set to true to indicate that the argType is read-only.

Display the argType under a subcategory heading (which displays under the [category] heading), with the label specified by subcategory.

Type: { detail?: string; summary: string }

Default: Inferred from type

The documented type of the argType. summary is typically used for the type itself, while detail is used for additional information.

If you need to specify the actual, semantic type, you should use type, instead.

Type: 'boolean' | 'function' | 'number' | 'string' | 'symbol' | SBType

The full type of SBType is:

Specifies the semantic type of the argType. When an argType is inferred, the information from the various tools is summarized in this property, which is then used to infer other properties, like control and table.type.

If you only need to specify the documented type, you should use table.type, instead.

Define the default value of the argType. Deprecated in favor of defining the arg value directly.

**Examples:**

Example 1 (jsx):
```jsx
// Replace your-renderer with the renderer you are using (e.g., react, vue3, angular, etc.)
import type { Meta } from '@storybook/your-renderer';
 
import { Button } from './Button';
 
const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    // 👇 All Button stories expect a label arg
    label: {
      control: 'text',
      description: 'Overwritten description',
    },
  },
};
 
export default meta;
```

Example 2 (python):
```python
// Replace your-renderer with the renderer you are using (e.g., react, vue3, angular, etc.)
import type { Preview } from '@storybook/your-renderer';
 
const preview: Preview = {
  argTypes: {
    // 👇 All stories expect a label arg
    label: {
      control: 'text',
      description: 'Overwritten description',
    },
  },
};
 
export default preview;
```

Example 3 (typescript):
```typescript
// Replace your-renderer with the renderer you are using (e.g., react, vue3, angular, etc.)
import type { Meta, StoryObj } from '@storybook/your-renderer';
 
import { Button } from './Button';
 
const meta: Meta<typeof Button> = {
  component: Button,
};
 
export default meta;
 
type Story = StoryObj<typeof Button>;
 
export const Basic: Story = {
  argTypes: {
    // 👇 This story expects a label arg
    label: {
      control: 'text',
      description: 'Overwritten description',
    },
  },
};
```

Example 4 (json):
```json
{
  [key: string]: {
    control?: ControlType | { type: ControlType; /* See below for more */ } | false;
    description?: string;
    if?: Conditional;
    mapping?: { [key: string]: { [option: string]: any } };
    name?: string;
    options?: string[];
    table?: {
      category?: string;
      defaultValue?: { summary: string; detail?: string };
      disable?: boolean;
      subcategory?: string;
      type?: { summary?: string; detail?: string };
    },
    type?: SBType | SBScalarType['name'];
  }
}
```

---

## Portable stories in Jest | Storybook docs

**URL:** https://storybook.js.org/docs/api/portable-stories/portable-stories-jest

**Contents:**
- Portable stories in Jest
- composeStories
  - Type
  - Parameters
    - csfExports
    - projectAnnotations
  - Return
- composeStory
  - Type
  - Parameters

If you are using the experimental CSF Factories format, you don't need to use the portable stories API. Instead, you can import and use your stories directly.

Portable stories are Storybook stories which can be used in external environments, such as Jest.

Normally, Storybook composes a story and its annotations automatically, as part of the story pipeline. When using stories in Jest tests, you must handle the story pipeline yourself, which is what the composeStories and composeStory functions enable.

The API specified here is available in Storybook 8.2.7 and up. If you're using an older version of Storybook, you can upgrade to the latest version (npx storybook@latest upgrade) to use this API. If you're unable to upgrade, you can use previous API, which uses the .play() method instead of .run(), but is otherwise identical.

Using Next.js? You need to do three things differently when using portable stories in Jest with Next.js projects:

composeStories will process the component's stories you specify, compose each of them with the necessary annotations, and return an object containing the composed stories.

By default, the composed story will render the component with the args that are defined in the story. You can also pass any props to the component in your test and those props will override the values passed in the story's args.

Type: CSF file exports

Specifies which component's stories you want to compose. Pass the full set of exports from the CSF file (not the default export!). E.g. import * as stories from './Button.stories'

Type: ProjectAnnotation | ProjectAnnotation[]

Specifies the project annotations to be applied to the composed stories.

This parameter is provided for convenience. You should likely use setProjectAnnotations instead. Details about the ProjectAnnotation type can be found in that function's projectAnnotations parameter.

This parameter can be used to override the project annotations applied via setProjectAnnotations.

Type: Record<string, ComposedStoryFn>

An object where the keys are the names of the stories and the values are the composed stories.

Additionally, the composed story will have the following properties:

You can use composeStory if you wish to compose a single story for a component.

Specifies which story you want to compose.

The default export from the stories file containing the story.

Type: ProjectAnnotation | ProjectAnnotation[]

Specifies the project annotations to be applied to the composed story.

This parameter is provided for convenience. You should likely use setProjectAnnotations instead. Details about the ProjectAnnotation type can be found in that function's projectAnnotations parameter.

This parameter can be used to override the project annotations applied via setProjectAnnotations.

You probably don't need this. Because composeStory accepts a single story, it does not have access to the name of that story's export in the file (like composeStories does). If you must ensure unique story names in your tests and you cannot use composeStories, you can pass the name of the story's export here.

Type: ComposedStoryFn

A single composed story.

This API should be called once, before the tests run, typically in a setup file. This will make sure that whenever composeStories or composeStory are called, the project annotations are taken into account as well.

These are the configurations needed in the setup file:

Sometimes a story can require an addon's decorator or loader to render properly. For example, an addon can apply a decorator that wraps your story in the necessary router context. In this case, you must include that addon's preview export in the project annotations set. See addonAnnotations in the example above.

Note: If the addon doesn't automatically apply the decorator or loader itself, but instead exports them for you to apply manually in .storybook/preview.* (e.g. using withThemeFromJSXProvider from @storybook/addon-themes), then you do not need to do anything else. They are already included in the previewAnnotations in the example above.

If you need to configure Testing Library's render or use a different render function, please let us know in this discussion so we can learn more about your needs.

Type: ProjectAnnotation | ProjectAnnotation[]

A set of project annotations (those defined in .storybook/preview.*) or an array of sets of project annotations, which will be applied to all composed stories.

Annotations are the metadata applied to a story, like args, decorators, loaders, and play functions. They can be defined for a specific story, all stories for a component, or all stories in the project.

To preview your stories in Storybook, Storybook runs a story pipeline, which includes applying project annotations, loading data, rendering the story, and playing interactions. This is a simplified version of the pipeline:

When you want to reuse a story in a different environment, however, it's crucial to understand that all these steps make a story. The portable stories API provides you with the mechanism to recreate that story pipeline in your external environment:

Annotations come from the story itself, that story's component, and the project. The project-level annotations are those defined in your .storybook/preview.* file and by addons you're using. In portable stories, these annotations are not applied automatically — you must apply them yourself.

👉 For this, you use the setProjectAnnotations API.

The story is prepared by running composeStories or composeStory. The outcome is a renderable component that represents the render function of the story.

Finally, stories can prepare data they need (e.g. setting up some mocks or fetching data) before rendering by defining loaders, beforeEach or by having all the story code in the play function when using the mount. In portable stories, all of these steps will be executed when you call the run method of the composed story.

👉 For this, you use the composeStories or composeStory API. The composed story will return a run method to be called.

If your play function contains assertions (e.g. expect calls), your test will fail when those assertions fail.

If your stories behave differently based on globals (e.g. rendering text in English or Spanish), you can define those global values in portable stories by overriding project annotations when composing a story:

**Examples:**

Example 1 (jsx):
```jsx
import { test, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import { composeStories } from '@storybook/your-framework';
 
// Import all stories and the component annotations from the stories file
import * as stories from './Button.stories';
 
// Every component that is returned maps 1:1 with the stories,
// but they already contain all annotations from story, meta, and project levels
const { Primary, Secondary } = composeStories(stories);
 
test('renders primary button with default args', () => {
  render(<Primary />);
  const buttonElement = screen.getByText('Text coming from args in stories file!');
  expect(buttonElement).not.toBeNull();
});
 
test('renders primary button with overridden props', () => {
  // You can override props and they will get merged with values from the story's args
  render(<Primary>Hello world</Primary>);
  const buttonElement = screen.getByText(/Hello world/i);
  expect(buttonElement).not.toBeNull();
});
```

Example 2 (typescript):
```typescript
(
  csfExports: CSF file exports,
  projectAnnotations?: ProjectAnnotations
) => Record<string, ComposedStoryFn>
```

Example 3 (javascript):
```javascript
import { jest, test, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import { composeStory } from '@storybook/your-framework';
 
import meta, { Primary as PrimaryStory } from './Button.stories';
 
test('onclick handler is called', () => {
  // Returns a story which already contains all annotations from story, meta and global levels
  const Primary = composeStory(PrimaryStory, meta);
 
  const onClickSpy = jest.fn();
  await Primary.run({ args: { ...Primary.args, onClick: onClickSpy } });
 
  const buttonElement = screen.getByRole('button');
  buttonElement.click();
  expect(onClickSpy).toHaveBeenCalled();
});
```

Example 4 (scala):
```scala
(
  story: Story export,
  componentAnnotations: Meta,
  projectAnnotations?: ProjectAnnotations,
  exportsName?: string
) => ComposedStoryFn
```

---

## Meta | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/doc-blocks/doc-block-meta

**Contents:**
- Meta
- Meta
  - isTemplate
  - name
  - of
  - title
- Attached vs. unattached

The Meta block is used to attach a custom MDX docs page alongside a component’s list of stories. It doesn’t render any content, but serves two purposes in an MDX file:

The Meta block doesn’t render anything visible.

Meta is configured with the following props:

Determines whether the MDX file serves as an automatic docs template. When true, the MDX file is not indexed as it normally would be.

Sets the name of the attached doc entry. You can attach more than one MDX file to the same component in the sidebar by setting different names for each file's Meta.

Type: CSF file exports

Specifies which CSF file is attached to this MDX file. Pass the full set of exports from the CSF file (not the default export!).

Attaching an MDX file to a component’s stories with the of prop serves two purposes:

The of prop is optional. If you don’t want to attach a specific CSF file to this MDX file, you can either use the title prop to control the location, or emit Meta entirely, and let autotitle decide where it goes.

Sets the title of an unattached MDX file.

If you want to change the sorting of the docs entry with the component’s stories, use Story Sorting, or add specific MDX files to your stories field in main.js in order.

In Storybook, a docs entry (MDX file) is "attached" when it is associated with a stories file, via Meta's of prop. Attached docs entries display next to the stories list under the component in the sidebar.

"Unattached" docs entries are not associated with a stories file and can be displayed anywhere in the sidebar via Meta's title prop.

**Examples:**

Example 1 (jsx):
```jsx
import { Meta } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';
 
<Meta of={ButtonStories} />
```

Example 2 (sql):
```sql
import { Meta } from '@storybook/blocks';
```

Example 3 (jsx):
```jsx
import { Meta } from '@storybook/blocks';
import * as ComponentStories from './component.stories';
 
{/* This MDX file is now called "Special Docs" */}
<Meta of={ComponentStories} name="Special Docs" />
```

Example 4 (jsx):
```jsx
import { Meta, Story } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';
 
<Meta of={ButtonStories} />
```

---

## Story | Storybook docs

**URL:** https://storybook.js.org/docs/api/doc-blocks/doc-block-story

**Contents:**
- Story
- Story
  - autoplay
  - height
  - inline
  - meta
  - of

Stories are Storybook's fundamental building blocks.

In Storybook Docs, you can render any of your stories from your CSF files in the context of an MDX file with all annotations (parameters, args, loaders, decorators, play function) applied using the Story block.

Typically you want to use the Canvas block to render a story with a surrounding border and the source block, but you can use the Story block to render just the story.

ℹ️ Like most blocks, the Story block is configured with props in MDX. Many of those props derive their default value from a corresponding parameter in the block's namespace, parameters.docs.story.

The following autoplay configurations are equivalent:

The example above applied the parameter at the story level, but it could also be applied at the component (or meta) level or project level.

Default: parameters.docs.story.autoplay

Determines whether a story's play function runs.

Because all stories render simultaneously in docs entries, play functions can perform arbitrary actions that can interact with each other (such as stealing focus or scrolling the screen). For that reason, by default, stories do not run play functions in docs mode.

However, if you know your play function is “safe” to run in docs, you can use this prop to run it automatically.

If a story uses mount in its play function, it will not render in docs unless autoplay is set to true.

Default: parameters.docs.story.height

Set a minimum height (note for an iframe this is the actual height) when rendering a story in an iframe or inline. This overrides parameters.docs.story.iframeHeight for iframes.

Default: parameters.docs.story.inline or true (for supported frameworks)

Determines whether the story is rendered inline (in the same browser frame as the other docs content) or in an iframe.

Setting the inline option to false will prevent the associated controls from updating the story within the documentation page. This is a known limitation of the current implementation and will be addressed in a future release.

Type: CSF file exports

Specifies the CSF file to which the story is associated.

You can render a story from a CSF file that you haven’t attached to the MDX file (via Meta) by using the meta prop. Pass the full set of exports from the CSF file (not the default export!).

Specifies which story is rendered by the Story block. If no of is defined and the MDX file is attached, the primary (first) story will be rendered.

**Examples:**

Example 1 (jsx):
```jsx
import { Meta, Story } from '@storybook/addon-docs/blocks';
import * as ButtonStories from './Button.stories';
 
<Meta of={ButtonStories} />
 
<Story of={ButtonStories.Primary} />
```

Example 2 (sql):
```sql
import { Story } from '@storybook/addon-docs/blocks';
```

Example 3 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
} satisfies Meta<typeof Button>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Basic: Story = {
  parameters: {
    docs: {
      story: { autoplay: true },
    },
  },
};
```

Example 4 (jsx):
```jsx
<Story of={ButtonStories.Basic} autoplay />
```

---

## CLI options | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/cli-options

**Contents:**
- CLI options
- CLI commands
  - dev
  - build
  - init
  - add
  - remove
  - upgrade
  - migrate
  - automigrate

The Storybook command line interface (CLI) is the main tool you use to build and develop Storybook.

Storybook collects completely anonymous data to help us improve user experience. Participation is optional, and you may opt-out if you'd not like to share any information.

All of the following documentation is available in the CLI by running storybook --help.

Passing options to these commands works slightly differently if you're using npm instead of Yarn. You must prefix all of your options with --. For example, npm run storybook build -- -o ./path/to/build --quiet.

Compiles and serves a development build of your Storybook that reflects your source code changes in the browser in real-time. It should be run from the root of your project.

With the release of Storybook 8, the -s CLI flag was removed. We recommend using the static directory instead if you need to serve static files.

Compiles your Storybook instance so it can be deployed. It should be run from the root of your project.

We recommend create-storybook for new projects. The init command will remain available for backwards compatibility.

Installs and initializes the specified version (e.g., @latest, @8, @next) of Storybook into your project. If no version is specified, the latest version is installed. Read more in the installation guide.

For example, storybook@8.4 init will install Storybook 8.4 into your project.

Installs a Storybook addon and configures your project for it. Read more in the addon installation guide.

Deletes a Storybook addon from your project. Read more in the addon installation guide.

Upgrades your Storybook instance to the specified version (e.g., @latest, @8, @next). Read more in the upgrade guide.

For example, storybook@latest upgrade --dry-run will perform a dry run (no actual changes) of upgrading your project to the latest version of Storybook.

Runs the provided codemod to ensure your Storybook project is compatible with the specified version. Read more in the migration guide.

The command requires the codemod name (e.g., csf-2-to-3) as an argument to apply the necessary changes to your project. You can find the list of available codemods by running storybook migrate --list.

For example, storybook@latest migrate csf-2-to-3 --dry-run, checks your project to verify if the codemod can be applied without making any changes, providing you with a report of which files would be affected.

Perform standard configuration checks to determine if your Storybook project can be automatically migrated to the specified version. Read more in the migration guide.

For example, storybook@latest automigrate --dry-run scans your project for potential migrations that can be applied automatically without making any changes.

Performs a health check on your Storybook project for common issues (e.g., duplicate dependencies, incompatible addons or mismatched versions) and provides suggestions on how to fix them. Applicable when upgrading Storybook versions.

Reports useful debugging information about your environment. Helpful in providing information when opening an issue or a discussion.

Generates a local sandbox project using the specified version (e.g., @latest, @8, @next) for testing Storybook features based on the list of supported frameworks. Useful for reproducing bugs when opening an issue or a discussion.

For example, storybook@next sandbox will generated sandboxes using the newest pre-release version of Storybook.

The framework-filter argument is optional and can filter the list of available frameworks. For example, storybook@next sandbox react will only offer to generate React-based sandboxes.

If you're looking for a hosted version of the available sandboxes, see storybook.new.

To streamline the process of creating a new Storybook project, a separate CLI called create-storybook is provided. Package managers such as npm, pnpm, and Yarn will execute this command when running create storybook. You can specify a version (e.g., @latest, @8, @next) or it will default to the latest version. Read more in the installation guide.

For example, create storybook@8.6 will install Storybook 8.6 into your project.

**Examples:**

Example 1 (unknown):
```unknown
storybook dev [options]
```

Example 2 (unknown):
```unknown
storybook build [options]
```

Example 3 (elixir):
```elixir
storybook[@version] init [options]
```

Example 4 (unknown):
```unknown
storybook add [addon] [options]
```

---

## Markdown | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/doc-blocks/doc-block-markdown

**Contents:**
- Markdown
- Markdown
  - children
  - options
- Why not import markdown directly?

The Markdown block allows you to import and include plain markdown in your MDX files.

When importing markdown files, it’s important to use the ?raw suffix on the import path to ensure the content is imported as-is, and isn’t being evaluated:

Markdown is configured with the following props:

Provides the markdown-formatted string to parse and display.

Specifies the options passed to the underlying markdown-to-jsx library.

From a purely technical standpoint, we could include the imported markdown directly in the MDX file like this:

However, there are small syntactical differences between plain markdown and MDX2. MDX2 is more strict and will interpret certain content as JSX expressions. Here’s an example of a perfectly valid markdown file, that would break if it was handled directly by MDX2:

Furthermore, MDX2 wraps all strings on newlines in p tags or similar, meaning that content would render differently between a plain .md file and an .mdx file.

**Examples:**

Example 1 (sql):
```sql
# Button
 
Primary UI component for user interaction
 
```js
import { Button } from "@storybook/design-system";
```
```

Example 2 (python):
```python
// DON'T do this, will error
import ReadMe from './README.md';
// DO this, will work
import ReadMe from './README.md?raw';
 
import { Markdown } from '@storybook/blocks';
 
# A header 
 
<Markdown>{ReadMe}</Markdown>
```

Example 3 (sql):
```sql
import { Markdown } from '@storybook/blocks';
```

Example 4 (sql):
```sql
{/* THIS WON'T WORK, THIS IS TO DEMONSTRATE AN ERROR */}
 
import ReadMe from './README.md';
 
# A header 
 
{ReadMe}
```

---

## previewHead | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/main-config/main-config-preview-head

**Contents:**
- previewHead

Parent: main.js|ts configuration

Type: (head: string) => string

Programmatically adjust the preview <head> of your Storybook. Most often used by addon authors.

If you don't need to programmatically adjust the preview head, you can add scripts and styles to preview-head.html instead.

For example, you can conditionally add scripts or styles, depending on the environment:

**Examples:**

Example 1 (jsx):
```jsx
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  previewHead: (head) => `
    ${head}
    ${
      process.env.ANALYTICS_ID ? '<script src="https://cdn.example.com/analytics.js"></script>' : ''
    }
  `,
};
 
export default config;
```

---

## Main configuration | Storybook docs

**URL:** https://storybook.js.org/docs/api/main-config/main-config

**Contents:**
- Main configuration
- The main configuration file: main.js or main.ts
- config

The main configuration defines a Storybook project's behavior, including the location of stories, addons to use, feature flags, and other project-specific settings.

This file must be valid ESM. In other words, it must use import instead of require, and neither __dirname nor __filename are available.

This configuration is defined in .storybook/main.js|ts, which is located relative to the root of your project.

A typical Storybook configuration file looks like this:

An object to configure Storybook containing the following properties:

**Examples:**

Example 1 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  // Required
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  // Optional
  addons: ['@storybook/addon-docs'],
  staticDirs: ['../public'],
};
 
export default config;
```

---

## Story | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/doc-blocks/doc-block-story

**Contents:**
- Story
- Story
  - autoplay
  - height
  - inline
  - meta
  - of

Stories (component tests) are Storybook's fundamental building blocks.

In Storybook Docs, you can render any of your stories from your CSF files in the context of an MDX file with all annotations (parameters, args, loaders, decorators, play function) applied using the Story block.

Typically you want to use the Canvas block to render a story with a surrounding border and the source block, but you can use the Story block to render just the story.

ℹ️ Like most blocks, the Story block is configured with props in MDX. Many of those props derive their default value from a corresponding parameter in the block's namespace, parameters.docs.story.

The following autoplay configurations are equivalent:

The example above applied the parameter at the story level, but it could also be applied at the component (or meta) level or project level.

Default: parameters.docs.story.autoplay

Determines whether a story's play function runs.

Because all stories render simultaneously in docs entries, play functions can perform arbitrary actions that can interact with each other (such as stealing focus or scrolling the screen). For that reason, by default, stories do not run play functions in docs mode.

However, if you know your play function is “safe” to run in docs, you can use this prop to run it automatically.

If a story uses mount in its play function, it will not render in docs unless autoplay is set to true.

Default: parameters.docs.story.height

Set a minimum height (note for an iframe this is the actual height) when rendering a story in an iframe or inline. This overrides parameters.docs.story.iframeHeight for iframes.

Default: parameters.docs.story.inline or true (for supported frameworks)

Determines whether the story is rendered inline (in the same browser frame as the other docs content) or in an iframe.

Setting the inline option to false will prevent the associated controls from updating the story within the documentation page. This is a known limitation of the current implementation and will be addressed in a future release.

Type: CSF file exports

Specifies the CSF file to which the story is associated.

You can render a story from a CSF file that you haven’t attached to the MDX file (via Meta) by using the meta prop. Pass the full set of exports from the CSF file (not the default export!).

Specifies which story is rendered by the Story block. If no of is defined and the MDX file is attached, the primary (first) story will be rendered.

**Examples:**

Example 1 (jsx):
```jsx
import { Meta, Story } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';
 
<Meta of={ButtonStories} />
 
<Story of={ButtonStories.Primary} />
```

Example 2 (sql):
```sql
import { Story } from '@storybook/blocks';
```

Example 3 (typescript):
```typescript
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta: Meta<typeof Button> = {
  component: Button,
};
 
export default meta;
type Story = StoryObj<typeof Button>;
 
export const Basic: Story = {
  parameters: {
    docs: {
      story: { autoplay: true },
    },
  },
};
```

Example 4 (jsx):
```jsx
<Story of={ButtonStories.Basic} autoplay />
```

---

## env | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/main-config/main-config-env

**Contents:**
- env

Parent: main.js|ts configuration

Type: (config: { [key: string]: string }) => { [key: string]: string }

Defines custom Storybook environment variables.

**Examples:**

Example 1 (lua):
```lua
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  /*
   * 👇 The `config` argument contains all the other existing environment variables.
   * Either configured in an `.env` file or configured on the command line.
   */
  env: (config) => ({
    ...config,
    EXAMPLE_VAR: 'An environment variable configured in Storybook',
  }),
};
 
export default config;
```

---

## Frameworks | Storybook docs

**URL:** https://storybook.js.org/docs/api/new-frameworks

**Contents:**
- Frameworks
- Scaffolding a new framework
- Framework architecture
- Configuring the server
  - Package structure
  - Server options
- Configuring the client
  - Renderable objects
  - Render function
  - Package structure

Storybook is architected to support diverse web frameworks, including React, Vue, Angular, Web Components, Svelte, and over a dozen others. This guide helps you get started on adding new framework support for Storybook.

The first thing to do is to scaffold your framework support in its own repo.

We recommend adopting the same project structure as the Storybook monorepo. That structure contains the framework package (app/<framework>) and an example app (examples/<framework>-kitchen-sink) as well as other associated documentation and configuration as needed.

It may seem like a little more hierarchy than what’s necessary. But because the structure mirrors the way Storybook’s monorepo is structured, you can reuse Storybook’s tooling. It also makes it easier to move the framework into the Storybook monorepo later if that is desirable.

We recommend using @storybook/html as a starter framework since it’s the simplest and contains no framework-specific peculiarities. There is a boilerplate to get you started here.

Supporting a new framework in Storybook typically consists of two main aspects:

Configuring the server. In Storybook, the server is the node process that runs when you run storybook dev or storybook build. Configuring the server typically means configuring babel and webpack in framework-specific ways.

Configuring the client. The client is the code that runs in the browser, and configuring it, means providing a framework-specific story rendering function.

Storybook has the concept of presets, which are typically babel/webpack configurations for file loading. If your framework has its own file format (e.g., “.vue”), you might need to transform them into JavaScript files at load time. If you assume every user of your framework needs this, you should add it to the framework. So far, every framework added to Storybook has done it because Storybook’s core configuration is extremely minimal.

It's helpful to understand Storybook's package structure before adding a framework preset. Each framework typically exposes two executables in its package.json:

These scripts pass an options object to storybook/internal/server, a library that abstracts all of Storybook’s framework-independent code.

For example, here’s the boilerplate to start the dev server with storybook dev:

Thus the essence of adding framework presets is just filling in that options object.

As described above, the server options object does the heavy lifting of configuring the server.

Let’s look at the @storybook/vue’s options definition:

The value of the framework option (i.e., ‘vue’) is something that gets passed to addons and allows them to do specific tasks related to your framework.

The essence of this file is the framework presets, and these are standard Storybook presets -- you can look at framework packages in the Storybook monorepo (e.g. React, Vue, Web Components) to see examples of framework-specific customizations.

While developing your custom framework, not maintained by Storybook, you can specify the path to the location file with the frameworkPath key:

You can add a relative path to frameworkPath. Don't forget that they resolve from the Storybook configuration directory (i.e., .storybook) by default.

Make sure the frameworkPath ends up at the dist/client/index.js file within your framework app.

To configure the client, you must provide a framework-specific render function. Before diving into the details, it’s essential to understand how user-written stories relate to what renders on the screen.

Storybook stories are ES6 objects that return a “renderable object.”

Consider the following React story:

In this case, the renderable object is the React element, <Button .../>.

In most other frameworks, the renderable object is actually a plain JavaScript object.

Consider the following hypothetical example:

The design of this “renderable object” is framework-specific and should ideally match the idioms of that framework.

The framework's render function is the entity responsible for converting the renderable object into DOM nodes. It is typically of the form:

On the client side, the key file is src/client/preview.js:

The globals file typically sets up a single global variable that client-side code (such as addon-provided decorators) can refer to if needed to understand which framework it's running in:

The start function abstracts all of Storybook’s framework-independent client-side (browser) code, and it takes the render function we defined above. For examples of render functions, see React, Vue, Angular, and Web Components in the Storybook monorepo.

**Examples:**

Example 1 (json):
```json
{
  "bin": {
    "storybook": "./bin/index.js",
    "build-storybook": "./bin/build.js"
  }
}
```

Example 2 (python):
```python
import { buildDev } from '@storybook/core/server';
 
import options from './options';
 
buildDev(options);
```

Example 3 (vue):
```vue
import { readFileSync } from 'node:fs';
import * as pkg from 'empathic/package';
 
export default {
  packageJson: JSON.parse(readFileSync(pkg.up({ cwd: process.cwd() }))),
  framework: 'vue',
  frameworkPresets: [import.meta.resolve('./framework-preset-vue.js')],
};
```

Example 4 (vue):
```vue
import { readFileSync } from 'node:fs';
import * as pkg from 'empathic/package';
 
export default {
  packageJson: JSON.parse(readFileSync(pkg.up({ cwd: process.cwd() }))),
  framework: 'my-framework',
  frameworkPath: '@my-framework/storybook',
  frameworkPresets: [import.meta.resolve('./framework-preset-my-framework.js')],
};
```

---

## build | Storybook docs

**URL:** https://storybook.js.org/docs/api/main-config/main-config-build

**Contents:**
- build
- test
  - test.disableBlocks
  - test.disabledAddons
  - test.disableMDXEntries
  - test.disableAutoDocs
  - test.disableDocgen
  - test.disableSourcemaps
  - test.disableTreeShaking

Parent: main.js|ts configuration

Type: TestBuildConfig

Provides configuration options to optimize Storybook's production build output.

Configures Storybook's production builds for performance testing purposes by disabling certain features from the build. When running storybook build, this feature is enabled by setting the --test flag.

The options documented on this page are automatically enabled when the --test flag is provided to the storybook build command. We encourage you to override these options only if you need to disable a specific feature for your project or if you are debugging a build issue.

Excludes the @storybook/addon-docs/blocks module from the build, which generates automatic documentation with Docs Blocks.

Sets the list of addons that will be disabled in the build output.

Enabling this option removes user-written documentation entries in MDX format from the build.

Prevents automatic documentation generated with the autodocs feature from being included in the build.

Disables automatic argType and component property inference with any of the supported static analysis tools based on the framework you are using.

Overrides the default behavior of generating source maps for the build.

Disables tree shaking in the build.

**Examples:**

Example 1 (typescript):
```typescript
{
  disableBlocks?: boolean;
  disabledAddons?: string[];
  disableMDXEntries?: boolean;
  disableAutoDocs?: boolean;
  disableDocgen?: boolean;
  disableSourcemaps?: boolean;
  disableTreeShaking?: boolean;
 
}
```

Example 2 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  build: {
    test: {
      disableBlocks: false,
    },
  },
};
 
export default config;
```

Example 3 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-vitest'],
  build: {
    test: {
      disabledAddons: ['@storybook/addon-a11y'],
    },
  },
};
 
export default config;
```

Example 4 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  build: {
    test: {
      disableMDXEntries: false,
    },
  },
};
 
export default config;
```

---

## Component Story Format (CSF) | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/csf

**Contents:**
- Component Story Format (CSF)
- Default export
- Named story exports
- Args story inputs
- Play function
- Custom render functions
- Storybook export vs. name handling
- Non-story exports
- Upgrading from CSF 2 to CSF 3
  - Spreadable story objects

Component Story Format (CSF) is the recommended way to write stories. It's an open standard based on ES6 modules that is portable beyond Storybook.

If you have stories written in the older storiesOf() syntax, it was removed in Storybook 8.0 and is no longer maintained. We recommend migrating your stories to CSF. See the migration guide for more information.

In CSF, stories and component metadata are defined as ES Modules. Every component story file consists of a required default export and one or more named exports.

The default export defines metadata about your component, including the component itself, its title (where it will show up in the navigation UI story hierarchy), decorators, and parameters.

The component field is required and used by addons for automatic prop table generation and display of other component metadata. The title field is optional and should be unique (i.e., not re-used across files).

For more examples, see writing stories.

With CSF, every named export in the file represents a story object by default.

The exported identifiers will be converted to "start case" using Lodash's startCase function. For example:

We recommend that all export names to start with a capital letter.

Story objects can be annotated with a few different fields to define story-level decorators and parameters, and also to define the name of the story.

Storybook's name configuration element is helpful in specific circumstances. Common use cases are names with special characters or Javascript restricted words. If not specified, Storybook defaults to the named export.

Starting in SB 6.0, stories accept named inputs called Args. Args are dynamic data that are provided (and possibly updated by) Storybook and its addons.

Consider Storybook’s "Button" example of a text button that logs its click events:

Now consider the same example, re-written with args:

Not only are these versions shorter and more accessible to write than their no-args counterparts, but they are also more portable since the code doesn't depend on the actions addon specifically.

For more information on setting up Docs and Actions, see their respective documentation.

Storybook's play functions are small snippets of code executed when the story renders in the UI. They are convenient helper methods to help you test use cases that otherwise weren't possible or required user intervention.

A good use case for the play function is a form component. With previous Storybook versions, you'd write your set of stories and had to interact with the component to validate it. With Storybook's play functions, you could write the following story:

When the story renders in the UI, Storybook executes each step defined in the play function and runs the assertions without the need for user interaction.

Starting in Storybook 6.4, you can write your stories as JavaScript objects, reducing the boilerplate code you need to generate to test your components, thus improving functionality and usability. Render functions are helpful methods to give you additional control over how the story renders. For example, if you were writing a story as an object and you wanted to specify how your component should render, you could write the following:

When Storybook loads this story, it will detect the existence of a render function and adjust the component rendering accordingly based on what's defined.

Storybook handles named exports and the name option slightly differently. When should you use one vs. the other?

Storybook will always use the named export to determine the story ID and URL.

If you specify the name option, it will be used as the story display name in the UI. Otherwise, it defaults to the named export, processed through Storybook's storyNameFromExport and lodash.startCase functions.

When you want to change the name of your story, rename the CSF export. It will change the name of the story and also change the story's ID and URL.

It would be best if you used the name configuration element in the following cases:

In some cases, you may want to export a mixture of stories and non-stories (e.g., mocked data).

You can use the optional configuration fields includeStories and excludeStories in the default export to make this possible. You can define them as an array of strings or regular expressions.

Consider the following story file:

When this file renders in Storybook, it treats ComplexStory and SimpleStory as stories and ignores the data named exports.

For this particular example, you could achieve the same result in different ways, depending on what's convenient:

The first option is the recommended solution if you follow the best practice of starting story exports with an uppercase letter (i.e., use UpperCamelCase).

In CSF 2, the named exports are always functions that instantiate a component, and those functions can be annotated with configuration options. For example:

This declares a Primary story for a Button that renders itself by spreading { primary: true } into the component. The default.title metadata says where to place the story in a navigation hierarchy.

Here's the CSF 3 equivalent:

Let's go through the changes individually to understand what's going on.

In CSF 3, the named exports are objects, not functions. This allows us to reuse stories more efficiently with the JS spread operator.

Consider the following addition to the intro example, which creates a PrimaryOnDark story that renders against a dark background:

Here's the CSF 2 implementation:

Primary.bind({}) copies the story function, but it doesn't copy the annotations hanging off the function, so we must add PrimaryOnDark.args = Primary.args to inherit the args.

In CSF 3, we can spread the Primary object to carry over all its annotations:

Learn more about named story exports.

In CSF 3, you specify how a story renders through a render function. We can rewrite a CSF 2 example to CSF 3 through the following steps.

Let's start with a simple CSF 2 story function:

Now, let's rewrite it as a story object in CSF 3 with an explicit render function that tells the story how to render itself. Like CSF 2, this gives us full control of how we render a component or even a collection of components.

Learn more about render functions.

But in CSF 2, a lot of story functions are identical: take the component specified in the default export and spread args into it. What's interesting about these stories is not the function, but the args passed into the function.

CSF 3 provides default render functions for each renderer. If all you're doing is spreading args into your component—which is the most common case—you don't need to specify any render function at all:

For more information, see the section on custom render functions.

Finally, CSF 3 can automatically generate titles.

You can still specify a title like in CSF 2, but if you don't specify one, it can be inferred from the story's path on disk. For more information, see the section on configuring story loading.

**Examples:**

Example 1 (lua):
```lua
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';
 
import { MyComponent } from './MyComponent';
 
const meta: Meta<typeof MyComponent> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Path/To/MyComponent',
  component: MyComponent,
  decorators: [/* ... */],
  parameters: {/* ... */},
};
 
export default meta;
```

Example 2 (typescript):
```typescript
import type { Meta, StoryObj } from '@storybook/react';
 
import { MyComponent } from './MyComponent';
 
const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};
 
export default meta;
type Story = StoryObj<typeof MyComponent>;
 
export const Basic: Story = {};
 
export const WithProp: Story = {
  render: () => <MyComponent prop="value" />,
};
```

Example 3 (typescript):
```typescript
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { MyComponent } from './MyComponent';
 
const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};
 
export default meta;
type Story = StoryObj<typeof MyComponent>;
 
export const Simple: Story = {
  name: 'So simple!',
  // ...
};
```

Example 4 (typescript):
```typescript
import type { Meta, StoryObj } from '@storybook/react';
 
import { action } from '@storybook/addon-actions';
 
import { Button } from './Button';
 
const meta: Meta<typeof Button> = {
  component: Button,
};
 
export default meta;
type Story = StoryObj<typeof Button>;
 
export const Basic: Story = {
  render: () => <Button label="Hello" onClick={action('clicked')} />,
};
```

---

## build | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/main-config/main-config-build

**Contents:**
- build
- test
  - test.disableBlocks
  - test.disabledAddons
  - test.disableMDXEntries
  - test.disableAutoDocs
  - test.disableDocgen
  - test.disableSourcemaps
  - test.disableTreeShaking

Parent: main.js|ts configuration

Type: TestBuildConfig

Provides configuration options to optimize Storybook's production build output.

Configures Storybook's production builds for performance testing purposes by disabling certain features from the build. When running build-storybook, this feature is enabled by setting the --test flag.

The options documented on this page are automatically enabled when the --test flag is provided to the storybook build command. We encourage you to override these options only if you need to disable a specific feature for your project or if you are debugging a build issue.

Excludes the @storybook/blocks package from the build, which generates automatic documentation with Docs Blocks.

Sets the list of addons that will disabled in the build output.

Enabling this option removes user-written documentation entries in MDX format from the build.

Prevents automatic documentation generated with the autodocs feature from being included in the build.

Disables automatic argType and component property inference with any of the supported static analysis tools based on the framework you are using.

Overrides the default behavior of generating source maps for the build.

Disables tree shaking in the build.

**Examples:**

Example 1 (typescript):
```typescript
{
  disableBlocks?: boolean;
  disabledAddons?: string[];
  disableMDXEntries?: boolean;
  disableAutoDocs?: boolean;
  disableDocgen?: boolean;
  disableSourcemaps?: boolean;
  disableTreeShaking?: boolean;
 
}
```

Example 2 (python):
```python
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  build: {
    test: {
      disableBlocks: false,
    },
  },
};
 
export default config;
```

Example 3 (python):
```python
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions', '@storybook/addon-a11y'],
  build: {
    test: {
      disabledAddons: ['@storybook/addon-a11y'],
    },
  },
};
 
export default config;
```

Example 4 (python):
```python
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  build: {
    test: {
      disableMDXEntries: false,
    },
  },
};
 
export default config;
```

---

## Subtitle | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/doc-blocks/doc-block-subtitle

**Contents:**
- Subtitle
- Subtitle
  - children
  - of

The Subtitle block can serve as a secondary heading for your docs entry.

Subtitle is configured with the following props:

Type: JSX.Element | string

Default: parameters.docs.subtitle

Provides the content.

Type: CSF file exports

Specifies which meta's subtitle is displayed.

**Examples:**

Example 1 (sql):
```sql
import { Subtitle } from '@storybook/blocks';
 
<Subtitle>This is the subtitle</Subtitle>
```

Example 2 (sql):
```sql
import { Subtitle } from '@storybook/blocks';
```

---

## Primary | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/doc-blocks/doc-block-primary

**Contents:**
- Primary
- Primary
  - of

The Primary block displays the primary (first defined in the stories file) story, in a Story block. It is typically rendered immediately under the title in a docs entry.

Primary is configured with the following props:

Type: CSF file exports

Specifies which CSF file is used to find the first story, which is then rendered by this block. Pass the full set of exports from the CSF file (not the default export!).

**Examples:**

Example 1 (jsx):
```jsx
import { Meta, Primary } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';
 
<Meta of={ButtonStories} />
 
<Primary />
```

Example 2 (sql):
```sql
import { Primary } from '@storybook/blocks';
```

---

## Markdown | Storybook docs

**URL:** https://storybook.js.org/docs/api/doc-blocks/doc-block-markdown

**Contents:**
- Markdown
- Markdown
  - children
  - options
- Why not import markdown directly?

The Markdown block allows you to import and include plain markdown in your MDX files.

When importing markdown files, it’s important to use the ?raw suffix on the import path to ensure the content is imported as-is, and isn’t being evaluated:

Markdown is configured with the following props:

Provides the markdown-formatted string to parse and display.

Specifies the options passed to the underlying markdown-to-jsx library.

From a purely technical standpoint, we could include the imported markdown directly in the MDX file like this:

However, there are small syntactical differences between plain markdown and MDX2. MDX2 is more strict and will interpret certain content as JSX expressions. Here’s an example of a perfectly valid markdown file, that would break if it was handled directly by MDX2:

Furthermore, MDX2 wraps all strings on newlines in p tags or similar, meaning that content would render differently between a plain .md file and an .mdx file.

**Examples:**

Example 1 (sql):
```sql
# Button
 
Primary UI component for user interaction
 
```js
import { Button } from '@storybook/design-system';
```
```

Example 2 (python):
```python
// DON'T do this, will error
import ReadMe from './README.md';
// DO this, will work
import ReadMe from './README.md?raw';
 
import { Markdown } from '@storybook/addon-docs/blocks';
 
# A header
 
<Markdown>{ReadMe}</Markdown>
```

Example 3 (sql):
```sql
import { Markdown } from '@storybook/addon-docs/blocks';
```

Example 4 (sql):
```sql
{/* THIS WON'T WORK, THIS IS TO DEMONSTRATE AN ERROR */}
 
import ReadMe from './README.md';
 
# A header
 
{ReadMe}
```

---

## managerHead | Storybook docs

**URL:** https://storybook.js.org/docs/api/main-config/main-config-manager-head

**Contents:**
- managerHead

Parent: main.js|ts configuration

Type: (head: string) => string

Programmatically adjust the manager's <head> of your Storybook. For example, load a custom font or add a script. Most often used by addon authors.

If you don't need to programmatically adjust the manager head, you can add scripts and styles to manager-head.html instead.

For example, you can conditionally add scripts or styles, depending on the environment:

**Examples:**

Example 1 (jsx):
```jsx
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  managerHead: (head) => `
    ${head}
    <link rel="preload" href="/fonts/my-custom-manager-font.woff2" />
  `,
};
 
export default config;
```

---

## Portable stories in Playwright CT | Storybook docs

**URL:** https://storybook.js.org/docs/api/portable-stories/portable-stories-playwright

**Contents:**
- Portable stories in Playwright CT
- createTest
  - Type
  - Parameters
    - baseTest
  - Return
- setProjectAnnotations
  - Type
  - Parameters
    - projectAnnotations

The portable stories API for Playwright CT is experimental. Playwright CT itself is also experimental. Breaking changes might occur in either library in upcoming releases.

Portable stories are Storybook stories which can be used in external environments, such as Playwright Component Tests (CT).

Normally, Storybook composes a story and its annotations automatically, as part of the story pipeline. When using stories in Playwright CT, you can use the createTest function, which extends Playwright's test functionality to add a custom mount mechanism, to take care of the story pipeline for you.

Your project must be using React 18+ to use the portable stories API with Playwright CT.

Using Next.js? The portable stories API is not yet supported in Next.js with Playwright CT.

Instead of using Playwright's own test function, you can use Storybook's special createTest function to extend Playwright's base fixture and override the mount function to load, render, and play the story. This function is experimental and is subject to changes.

The code which you write in your Playwright test file is transformed and orchestrated by Playwright, where part of the code executes in Node, while other parts execute in the browser.

Because of this, you have to compose the stories in a separate file than your own test file:

You can then import the composed stories in your Playwright test file, as in the example above.

Type: PlaywrightFixture

The base test function to use, e.g. test from Playwright.

Type: PlaywrightFixture

A Storybook-specific test function with the custom mount mechanism.

This API should be called once, before the tests run, in playwright/index.ts. This will make sure that when mount is called, the project annotations are taken into account as well.

These are the configurations needed in the setup file:

Sometimes a story can require an addon's decorator or loader to render properly. For example, an addon can apply a decorator that wraps your story in the necessary router context. In this case, you must include that addon's preview export in the project annotations set. See addonAnnotations in the example above.

Note: If the addon doesn't automatically apply the decorator or loader itself, but instead exports them for you to apply manually in .storybook/preview.* (e.g. using withThemeFromJSXProvider from @storybook/addon-themes), then you do not need to do anything else. They are already included in the previewAnnotations in the example above.

Type: ProjectAnnotation | ProjectAnnotation[]

A set of project annotations (those defined in .storybook/preview.*) or an array of sets of project annotations, which will be applied to all composed stories.

Annotations are the metadata applied to a story, like args, decorators, loaders, and play functions. They can be defined for a specific story, all stories for a component, or all stories in the project.

Read more about Playwright's component testing.

To preview your stories, Storybook runs a story pipeline, which includes applying project annotations, loading data, rendering the story, and playing interactions. This is a simplified version of the pipeline:

When you want to reuse a story in a different environment, however, it's crucial to understand that all these steps make a story. The portable stories API provides you with the mechanism to recreate that story pipeline in your external environment:

Annotations come from the story itself, that story's component, and the project. The project-level annotations are those defined in your .storybook/preview.* file and by addons you're using. In portable stories, these annotations are not applied automatically — you must apply them yourself.

👉 For this, you use the setProjectAnnotations API.

The story pipeline includes preparing the story, loading data, rendering the story, and playing interactions. In portable stories within Playwright CT, the mount function takes care of these steps for you.

👉 For this, you use the createTest API.

If your play function contains assertions (e.g. expect calls), your test will fail when those assertions fail.

If your stories behave differently based on globals (e.g. rendering text in English or Spanish), you can define those global values in portable stories by overriding project annotations when composing a story:

You can then use those composed stories in your Playwright test file using the createTest function.

**Examples:**

Example 1 (javascript):
```javascript
import { createTest } from '@storybook/react/experimental-playwright';
import { test as base } from '@playwright/experimental-ct-react';
 
// See explanation below for `.portable` stories file
import stories from './Button.stories.portable';
 
const test = createTest(base);
 
test('renders primary button', async ({ mount }) => {
  // The mount function will execute all the necessary steps in the story,
  // such as loaders, render, and play function
  await mount(<stories.Primary />);
});
 
test('renders primary button with overridden props', async ({ mount }) => {
  // You can pass custom props to your component via JSX
  const component = await mount(<stories.Primary label="label from test" />);
  await expect(component).toContainText('label from test');
  await expect(component.getByRole('button')).toHaveClass(/storybook-button--primary/);
});
```

Example 2 (scala):
```scala
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import { composeStories } from '@storybook/your-framework';
 
import * as stories from './Button.stories';
 
// This function will be executed in the browser
// and compose all stories, exporting them in a single object
export default composeStories(stories);
```

Example 3 (scala):
```scala
createTest(
  baseTest: PlaywrightFixture
) => PlaywrightFixture
```

Example 4 (python):
```python
import { test } from '@playwright/experimental-ct-react';
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import { setProjectAnnotations } from '@storybook/your-framework';
// 👇 Import the exported annotations, if any, from the addons you're using; otherwise remove this
import * as addonAnnotations from 'my-addon/preview';
import * as previewAnnotations from './.storybook/preview';
 
const annotations = setProjectAnnotations([previewAnnotations, addonAnnotations]);
 
// Supports beforeAll hook from Storybook
test.beforeAll(annotations.beforeAll);
```

---

## stories | Storybook docs

**URL:** https://storybook.js.org/docs/api/main-config/main-config-stories

**Contents:**
- stories
- With an array of globs
- With a configuration object
  - StoriesSpecifier
    - StoriesSpecifier.directory
    - StoriesSpecifier.files
    - StoriesSpecifier.titlePrefix
- With a custom implementation

Parent: main.js|ts configuration

Configures Storybook to load stories from the specified locations. The intention is for you to colocate a story file along with the component it documents:

If you want to use a different naming convention, you can alter the glob using the syntax supported by picomatch.

Keep in mind that some addons may assume Storybook's default naming convention.

Storybook will load stories from your project as found by this array of globs (pattern matching strings).

Stories are loaded in the order they are defined in the array. This allows you to control the order in which stories are displayed in the sidebar:

Additionally, you can customize your Storybook configuration to load your stories based on a configuration object. This object is of the type StoriesSpecifier, defined below.

For example, if you wanted to load your stories from a packages/components directory, you could adjust your stories configuration field into the following:

When Storybook starts, it will look for any file containing the stories extension inside the packages/components directory and generate the titles for your stories.

Where to start looking for story files, relative to the root of your project.

Default: '**/*.@(mdx|stories.@(js|jsx|mjs|ts|tsx))'

A glob, relative to StoriesSpecifier.directory (with no leading ./), that matches the filenames to load.

When auto-titling, prefix used when generating the title for your stories.

Storybook now statically analyzes the configuration file to improve performance. Loading stories with a custom implementation may de-optimize or break this ability.

You can also adjust your Storybook configuration and implement custom logic to load your stories. For example, suppose you were working on a project that includes a particular pattern that the conventional ways of loading stories could not solve. In that case, you could adjust your configuration as follows:

**Examples:**

Example 1 (scala):
```scala
| (string | StoriesSpecifier)[]
| async (list: (string | StoriesSpecifier)[]) => (string | StoriesSpecifier)[]
```

Example 2 (unknown):
```unknown
•
└── components
    ├── Button.ts
    └── Button.stories.ts
```

Example 3 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
};
 
export default config;
```

Example 4 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: [
    '../src/**/*.mdx', // 👈 These will display first in the sidebar
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)', // 👈 Followed by these
  ],
};
 
export default config;
```

---

## Component Story Format (CSF) | Storybook docs

**URL:** https://storybook.js.org/docs/api/csf/

**Contents:**
- Component Story Format (CSF)
- Default export
- Named story exports
- Args story inputs
- Play function
- Custom render functions
- Storybook export vs. name handling
- Non-story exports
- Upgrading from CSF 2 to CSF 3
  - Spreadable story objects

Component Story Format (CSF) is the recommended way to write stories. It's an open standard based on ES6 modules that is portable beyond Storybook.

In CSF, stories and component metadata are defined as ES Modules. Every component story file consists of a required default export and one or more named exports.

The default export defines metadata about your component, including the component itself, its title (where it will show up in the navigation UI story hierarchy), decorators, and parameters.

The component field is required and used by addons for automatic prop table generation and display of other component metadata. The title field is optional and should be unique (i.e., not re-used across files).

For more examples, see writing stories.

With CSF, every named export in the file represents a story object by default.

The exported identifiers will be converted to "start case" using Lodash's startCase function. For example:

We recommend that all export names to start with a capital letter.

Story objects can be annotated with a few different fields to define story-level decorators and parameters, and also to define the name of the story.

Storybook's name configuration element is helpful in specific circumstances. Common use cases are names with special characters or Javascript restricted words. If not specified, Storybook defaults to the named export.

Starting in SB 6.0, stories accept named inputs called Args. Args are dynamic data that are provided (and possibly updated by) Storybook and its addons.

Consider Storybook’s "Button" example of a text button that logs its click events:

Now consider the same example, re-written with args:

Not only are these versions shorter and more accessible to write than their no-args counterparts, but they are also more portable since the code doesn't depend on the actions feature specifically.

For more information on setting up Docs and Actions, see their respective documentation.

Storybook's play functions are small snippets of code executed when the story renders in the UI. They are convenient helper methods to help you test use cases that otherwise weren't possible or required user intervention.

A good use case for the play function is a form component. With previous Storybook versions, you'd write your set of stories and had to interact with the component to validate it. With Storybook's play functions, you could write the following story:

When the story renders in the UI, Storybook executes each step defined in the play function and runs the assertions without the need for user interaction.

Starting in Storybook 6.4, you can write your stories as JavaScript objects, reducing the boilerplate code you need to generate to test your components, thus improving functionality and usability. Render functions are helpful methods to give you additional control over how the story renders. For example, if you were writing a story as an object and you wanted to specify how your component should render, you could write the following:

When Storybook loads this story, it will detect the existence of a render function and adjust the component rendering accordingly based on what's defined.

Storybook handles named exports and the name option slightly differently. When should you use one vs. the other?

Storybook will always use the named export to determine the story ID and URL.

If you specify the name option, it will be used as the story display name in the UI. Otherwise, it defaults to the named export, processed through Storybook's storyNameFromExport and lodash.startCase functions.

When you want to change the name of your story, rename the CSF export. It will change the name of the story and also change the story's ID and URL.

It would be best if you used the name configuration element in the following cases:

In some cases, you may want to export a mixture of stories and non-stories (e.g., mocked data).

You can use the optional configuration fields includeStories and excludeStories in the default export to make this possible. You can define them as an array of strings or regular expressions.

Consider the following story file:

When this file renders in Storybook, it treats ComplexStory and SimpleStory as stories and ignores the data named exports.

For this particular example, you could achieve the same result in different ways, depending on what's convenient:

The first option is the recommended solution if you follow the best practice of starting story exports with an uppercase letter (i.e., use UpperCamelCase).

Storybook provides a codemod to help you upgrade from CSF 2 to CSF 3. You can run it with the following command:

In CSF 2, the named exports are always functions that instantiate a component, and those functions can be annotated with configuration options. For example:

This declares a Primary story for a Button that renders itself by spreading { primary: true } into the component. The default.title metadata says where to place the story in a navigation hierarchy.

Here's the CSF 3 equivalent:

Let's go through the changes individually to understand what's going on.

In CSF 3, the named exports are objects, not functions. This allows us to reuse stories more efficiently with the JS spread operator.

Consider the following addition to the intro example, which creates a PrimaryOnDark story that renders against a dark background:

Here's the CSF 2 implementation:

Primary.bind({}) copies the story function, but it doesn't copy the annotations hanging off the function, so we must add PrimaryOnDark.args = Primary.args to inherit the args.

In CSF 3, we can spread the Primary object to carry over all its annotations:

Learn more about named story exports.

In CSF 3, you specify how a story renders through a render function. We can rewrite a CSF 2 example to CSF 3 through the following steps.

Let's start with a simple CSF 2 story function:

Now, let's rewrite it as a story object in CSF 3 with an explicit render function that tells the story how to render itself. Like CSF 2, this gives us full control of how we render a component or even a collection of components.

Learn more about render functions.

But in CSF 2, a lot of story functions are identical: take the component specified in the default export and spread args into it. What's interesting about these stories is not the function, but the args passed into the function.

CSF 3 provides default render functions for each renderer. If all you're doing is spreading args into your component—which is the most common case—you don't need to specify any render function at all:

For more information, see the section on custom render functions.

Finally, CSF 3 can automatically generate titles.

You can still specify a title like in CSF 2, but if you don't specify one, it can be inferred from the story's path on disk. For more information, see the section on configuring story loading.

**Examples:**

Example 1 (jsx):
```jsx
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta } from '@storybook/your-framework';
 
import { MyComponent } from './MyComponent';
 
const meta = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Path/To/MyComponent',
  component: MyComponent,
  decorators: [
    /* ... */
  ],
  parameters: {
    /* ... */
  },
} satisfies Meta<typeof MyComponent>;
 
export default meta;
```

Example 2 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { MyComponent } from './MyComponent';
 
const meta = {
  component: MyComponent,
} satisfies Meta<typeof MyComponent>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Basic: Story = {};
 
export const WithProp: Story = {
  render: () => <MyComponent prop="value" />,
};
```

Example 3 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { MyComponent } from './MyComponent';
 
const meta = {
  component: MyComponent,
} satisfies Meta<typeof MyComponent>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Simple: Story = {
  name: 'So simple!',
  // ...
};
```

Example 4 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { action } from 'storybook/actions';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
} satisfies Meta<typeof Button>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Basic: Story = {
  render: () => <Button label="Hello" onClick={action('clicked')} />,
};
```

---

## docs | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/main-config/main-config-docs

**Contents:**
- docs
- autodocs
- defaultName
- docsMode

Parent: main.js|ts configuration

Configures Storybook's auto-generated documentation.

Type: boolean | 'tag'

Enables or disables automatic documentation for stories.

Name used for generated documentation pages.

Only show documentation pages in the sidebar (usually set with the --docs CLI flag).

**Examples:**

Example 1 (json):
```json
{
  autodocs?: boolean | 'tag';
  defaultName?: string;
  docsMode?: boolean;
}
```

Example 2 (python):
```python
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  docs: {
    autodocs: 'tag',
  },
};
 
export default config;
```

Example 3 (python):
```python
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  docs: {
    defaultName: 'Documentation',
  },
};
 
export default config;
```

Example 4 (python):
```python
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  docs: {
    docsMode: true,
  },
};
 
export default config;
```

---

## Controls | Storybook docs

**URL:** https://storybook.js.org/docs/api/doc-blocks/doc-block-controls

**Contents:**
- Controls
- Controls
  - exclude
  - include
  - of
  - sort

The Controls block can be used to show a dynamic table of args for a given story, as a way to document its interface, and to allow you to change the args for a (separately) rendered story (via the Story or Canvas blocks).

If you’re looking for a static table that shows a component's arg types with no controls, see the ArgTypes block instead.

The Controls doc block will only have functioning UI controls if you haven't turned off inline stories with the inline configuration option.

ℹ️ Like most blocks, the Controls block is configured with props in MDX. Many of those props derive their default value from a corresponding parameter in the block's namespace, parameters.docs.controls.

The following exclude configurations are equivalent:

The example above applied the parameter at the component (or meta) level, but it could also be applied at the project or story level.

This API configures the Controls blocks used within docs pages. To configure the Controls panel, see the feature documentation. To configure individual controls, specify argTypes for each.

Type: string[] | RegExp

Default: parameters.docs.controls.exclude

Specifies which controls to exclude from the args table. Any controls whose names match the regex or are part of the array will be left out.

Type: string[] | RegExp

Default: parameters.docs.controls.include

Specifies which controls to include in the args table. Any controls whose names don't match the regex or are not part of the array will be left out.

Type: Story export or CSF file exports

Specifies which story to get the controls from. If a CSF file exports is provided, it will use the primary (first) story in the file.

Type: 'none' | 'alpha' | 'requiredFirst'

Default: parameters.docs.controls.sort or 'none'

Specifies how the controls are sorted.

**Examples:**

Example 1 (jsx):
```jsx
import { Meta, Canvas, Controls } from '@storybook/addon-docs/blocks';
import * as ButtonStories from './Button.stories';
 
<Meta of={ButtonStories} />
 
<Canvas of={ButtonStories.Primary} />
 
<Controls of={ButtonStories.Primary} />
```

Example 2 (sql):
```sql
import { Controls } from '@storybook/addon-docs/blocks';
```

Example 3 (jsx):
```jsx
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
  parameters: {
    docs: {
      controls: { exclude: ['style'] },
    },
  },
} satisfies Meta<typeof Button>;
 
export default meta;
```

Example 4 (jsx):
```jsx
<Controls of={ButtonStories} exclude={['style']} />
```

---

## Unstyled | Storybook docs

**URL:** https://storybook.js.org/docs/api/doc-blocks/doc-block-unstyled

**Contents:**
- Unstyled
- Unstyled
  - children

The Unstyled block is a special block that disables Storybook's default styling in MDX docs wherever it is added.

By default, most elements (like h1, p, etc.) in docs have a few default styles applied to ensure the docs look good. However, sometimes you might want some of your content to not have these styles applied. In those cases, wrap the content with the Unstyled block to remove the default styles.

The other blocks like Story and Canvas are already unstyled, so there’s no need to wrap those in the Unstyled block to ensure that Storybook’s styles don’t bleed into the stories. However, if you import your components directly in the MDX, you most likely want to wrap them in the Unstyled block.

Due to how CSS inheritance works it’s best to always add the Unstyled block to the root of your MDX, and not nested into other elements. The following example will cause some Storybook styles like color to be inherited into CustomComponent because they are applied to the root div:

Unstyled is configured with the following props:

Type: React.ReactNode

Provides the content to which you do not want to apply default docs styles.

**Examples:**

Example 1 (jsx):
```jsx
import { Meta, Unstyled } from '@storybook/addon-docs/blocks';
import { Header } from './Header.tsx';
 
<Meta title="Unstyled" />
 
> This block quote will be styled
 
... and so will this paragraph.
 
<Unstyled>
  > This block quote will not be styled
 
... neither will this paragraph, nor the following component (which contains an \<h1\>):
 
<Header />
 
</Unstyled>
```

Example 2 (jsx):
```jsx
<div>
  <Unstyled>
    <CustomComponent/>
  </Unstyled>
</div>
```

Example 3 (sql):
```sql
import { Unstyled } from '@storybook/addon-docs/blocks';
```

---

## viteFinal | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/main-config/main-config-vite-final

**Contents:**
- viteFinal
- Options

Parent: main.js|ts configuration

Type: (config: Vite.InlineConfig, options: Options) => Vite.InlineConfig | Promise<Vite.InlineConfig>

Customize Storybook's Vite setup when using the Vite builder.

Type: { configType?: 'DEVELOPMENT' | 'PRODUCTION' }

There are other options that are difficult to document here. Please introspect the type definition for more information.

**Examples:**

Example 1 (javascript):
```javascript
// Replace your-framework with the framework you are using (e.g., react-vite, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  async viteFinal(config, { configType }) {
    const { mergeConfig } = await import('vite');
 
    if (configType === 'DEVELOPMENT') {
      // Your development configuration goes here
    }
    if (configType === 'PRODUCTION') {
      // Your production configuration goes here.
    }
    return mergeConfig(config, {
      // Your environment configuration here
    });
  },
};
 
export default config;
```

---

## addons | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/main-config/main-config-addons

**Contents:**
- addons

Parent: main.js|ts configuration

Type: (string | { name: string; options?: AddonOptions })[]

Registers the addons loaded by Storybook.

For each addon's available options, see their respective documentation.

**Examples:**

Example 1 (json):
```json
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-styling-webpack',
      options: {
        rules: [
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  implementation: require.resolve('postcss'),
                },
              },
            ],
          },
        ],
      },
    },
  ],
};
 
export default config;
```

---

## Component Story Format (CSF) | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/csf/index

**Contents:**
- Component Story Format (CSF)
- Default export
- Named story exports
- Args story inputs
- Play function
- Custom render functions
- Storybook export vs. name handling
- Non-story exports
- Upgrading from CSF 2 to CSF 3
  - Spreadable story objects

Component Story Format (CSF) is the recommended way to write stories. It's an open standard based on ES6 modules that is portable beyond Storybook.

If you have stories written in the older storiesOf() syntax, it was removed in Storybook 8.0 and is no longer maintained. We recommend migrating your stories to CSF. See the migration guide for more information.

In CSF, stories and component metadata are defined as ES Modules. Every component story file consists of a required default export and one or more named exports.

The default export defines metadata about your component, including the component itself, its title (where it will show up in the navigation UI story hierarchy), decorators, and parameters.

The component field is required and used by addons for automatic prop table generation and display of other component metadata. The title field is optional and should be unique (i.e., not re-used across files).

For more examples, see writing stories.

With CSF, every named export in the file represents a story object by default.

The exported identifiers will be converted to "start case" using Lodash's startCase function. For example:

We recommend that all export names to start with a capital letter.

Story objects can be annotated with a few different fields to define story-level decorators and parameters, and also to define the name of the story.

Storybook's name configuration element is helpful in specific circumstances. Common use cases are names with special characters or Javascript restricted words. If not specified, Storybook defaults to the named export.

Starting in SB 6.0, stories accept named inputs called Args. Args are dynamic data that are provided (and possibly updated by) Storybook and its addons.

Consider Storybook’s "Button" example of a text button that logs its click events:

Now consider the same example, re-written with args:

Not only are these versions shorter and more accessible to write than their no-args counterparts, but they are also more portable since the code doesn't depend on the actions addon specifically.

For more information on setting up Docs and Actions, see their respective documentation.

Storybook's play functions are small snippets of code executed when the story renders in the UI. They are convenient helper methods to help you test use cases that otherwise weren't possible or required user intervention.

A good use case for the play function is a form component. With previous Storybook versions, you'd write your set of stories and had to interact with the component to validate it. With Storybook's play functions, you could write the following story:

When the story renders in the UI, Storybook executes each step defined in the play function and runs the assertions without the need for user interaction.

Starting in Storybook 6.4, you can write your stories as JavaScript objects, reducing the boilerplate code you need to generate to test your components, thus improving functionality and usability. Render functions are helpful methods to give you additional control over how the story renders. For example, if you were writing a story as an object and you wanted to specify how your component should render, you could write the following:

When Storybook loads this story, it will detect the existence of a render function and adjust the component rendering accordingly based on what's defined.

Storybook handles named exports and the name option slightly differently. When should you use one vs. the other?

Storybook will always use the named export to determine the story ID and URL.

If you specify the name option, it will be used as the story display name in the UI. Otherwise, it defaults to the named export, processed through Storybook's storyNameFromExport and lodash.startCase functions.

When you want to change the name of your story, rename the CSF export. It will change the name of the story and also change the story's ID and URL.

It would be best if you used the name configuration element in the following cases:

In some cases, you may want to export a mixture of stories and non-stories (e.g., mocked data).

You can use the optional configuration fields includeStories and excludeStories in the default export to make this possible. You can define them as an array of strings or regular expressions.

Consider the following story file:

When this file renders in Storybook, it treats ComplexStory and SimpleStory as stories and ignores the data named exports.

For this particular example, you could achieve the same result in different ways, depending on what's convenient:

The first option is the recommended solution if you follow the best practice of starting story exports with an uppercase letter (i.e., use UpperCamelCase).

In CSF 2, the named exports are always functions that instantiate a component, and those functions can be annotated with configuration options. For example:

This declares a Primary story for a Button that renders itself by spreading { primary: true } into the component. The default.title metadata says where to place the story in a navigation hierarchy.

Here's the CSF 3 equivalent:

Let's go through the changes individually to understand what's going on.

In CSF 3, the named exports are objects, not functions. This allows us to reuse stories more efficiently with the JS spread operator.

Consider the following addition to the intro example, which creates a PrimaryOnDark story that renders against a dark background:

Here's the CSF 2 implementation:

Primary.bind({}) copies the story function, but it doesn't copy the annotations hanging off the function, so we must add PrimaryOnDark.args = Primary.args to inherit the args.

In CSF 3, we can spread the Primary object to carry over all its annotations:

Learn more about named story exports.

In CSF 3, you specify how a story renders through a render function. We can rewrite a CSF 2 example to CSF 3 through the following steps.

Let's start with a simple CSF 2 story function:

Now, let's rewrite it as a story object in CSF 3 with an explicit render function that tells the story how to render itself. Like CSF 2, this gives us full control of how we render a component or even a collection of components.

Learn more about render functions.

But in CSF 2, a lot of story functions are identical: take the component specified in the default export and spread args into it. What's interesting about these stories is not the function, but the args passed into the function.

CSF 3 provides default render functions for each renderer. If all you're doing is spreading args into your component—which is the most common case—you don't need to specify any render function at all:

For more information, see the section on custom render functions.

Finally, CSF 3 can automatically generate titles.

You can still specify a title like in CSF 2, but if you don't specify one, it can be inferred from the story's path on disk. For more information, see the section on configuring story loading.

**Examples:**

Example 1 (lua):
```lua
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';
 
import { MyComponent } from './MyComponent';
 
const meta: Meta<typeof MyComponent> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Path/To/MyComponent',
  component: MyComponent,
  decorators: [/* ... */],
  parameters: {/* ... */},
};
 
export default meta;
```

Example 2 (typescript):
```typescript
import type { Meta, StoryObj } from '@storybook/react';
 
import { MyComponent } from './MyComponent';
 
const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};
 
export default meta;
type Story = StoryObj<typeof MyComponent>;
 
export const Basic: Story = {};
 
export const WithProp: Story = {
  render: () => <MyComponent prop="value" />,
};
```

Example 3 (typescript):
```typescript
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { MyComponent } from './MyComponent';
 
const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};
 
export default meta;
type Story = StoryObj<typeof MyComponent>;
 
export const Simple: Story = {
  name: 'So simple!',
  // ...
};
```

Example 4 (typescript):
```typescript
import type { Meta, StoryObj } from '@storybook/react';
 
import { action } from '@storybook/addon-actions';
 
import { Button } from './Button';
 
const meta: Meta<typeof Button> = {
  component: Button,
};
 
export default meta;
type Story = StoryObj<typeof Button>;
 
export const Basic: Story = {
  render: () => <Button label="Hello" onClick={action('clicked')} />,
};
```

---

## framework | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/main-config/main-config-framework

**Contents:**
- framework
- name
- options
  - options.builder

Parent: main.js|ts configuration

Type: FrameworkName | { name: FrameworkName; options?: FrameworkOptions }

Configures Storybook based on a set of framework-specific settings.

For available frameworks and their options, see their respective documentation.

Type: Record<string, any>

While many options are specific to a framework, there are some options that are shared across some frameworks, e.g. those that configure Storybook's builder.

Type: Record<string, any>

Configures Storybook's builder, Vite or Webpack.

**Examples:**

Example 1 (python):
```python
// Replace react-vite with the framework you are using (e.g., react-webpack5)
import type { StorybookConfig } from '@storybook/react-vite';
 
const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {
      legacyRootApi: true,
    },
  },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
};
 
export default config;
```

---

## Portable stories in Vitest | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/portable-stories/portable-stories-vitest

**Contents:**
- Portable stories in Vitest
- composeStories
  - Type
  - Parameters
    - csfExports
    - projectAnnotations
  - Return
- composeStory
  - Type
  - Parameters

If you are using the experimental CSF Factories format, you don't need to use the portable stories API. Instead, you can import and use your stories directly.

Portable stories are Storybook stories which can be used in external environments, such as Vitest.

Normally, Storybook composes a story and its annotations automatically, as part of the story pipeline. When using stories in Vitest tests, you must handle the story pipeline yourself, which is what the composeStories and composeStory functions enable.

The API specified here is available in Storybook 8.2.7 and up. If you're using an older version of Storybook, you can upgrade to the latest version (npx storybook@latest upgrade) to use this API. If you're unable to upgrade, you can use previous API, which uses the .play() method instead of .run(), but is otherwise identical.

Using Next.js? You can test your Next.js stories with Vitest by installing and setting up the @storybook/experimental-nextjs-vite which re-exports vite-plugin-storybook-nextjs package.

composeStories will process the component's stories you specify, compose each of them with the necessary annotations, and return an object containing the composed stories.

By default, the composed story will render the component with the args that are defined in the story. You can also pass any props to the component in your test and those props will override the values passed in the story's args.

Type: CSF file exports

Specifies which component's stories you want to compose. Pass the full set of exports from the CSF file (not the default export!). E.g. import * as stories from './Button.stories'

Type: ProjectAnnotation | ProjectAnnotation[]

Specifies the project annotations to be applied to the composed stories.

This parameter is provided for convenience. You should likely use setProjectAnnotations instead. Details about the ProjectAnnotation type can be found in that function's projectAnnotations parameter.

This parameter can be used to override the project annotations applied via setProjectAnnotations.

Type: Record<string, ComposedStoryFn>

An object where the keys are the names of the stories and the values are the composed stories.

Additionally, the composed story will have the following properties:

You can use composeStory if you wish to compose a single story for a component.

Specifies which story you want to compose.

The default export from the stories file containing the story.

Type: ProjectAnnotation | ProjectAnnotation[]

Specifies the project annotations to be applied to the composed story.

This parameter is provided for convenience. You should likely use setProjectAnnotations instead. Details about the ProjectAnnotation type can be found in that function's projectAnnotations parameter.

This parameter can be used to override the project annotations applied via setProjectAnnotations.

You probably don't need this. Because composeStory accepts a single story, it does not have access to the name of that story's export in the file (like composeStories does). If you must ensure unique story names in your tests and you cannot use composeStories, you can pass the name of the story's export here.

Type: ComposedStoryFn

A single composed story.

This API should be called once, before the tests run, typically in a setup file. This will make sure that whenever composeStories or composeStory are called, the project annotations are taken into account as well.

These are the configurations needed in the setup file:

Sometimes a story can require an addon's decorator or loader to render properly. For example, an addon can apply a decorator that wraps your story in the necessary router context. In this case, you must include that addon's preview export in the project annotations set. See addonAnnotations in the example above.

Note: If the addon doesn't automatically apply the decorator or loader itself, but instead exports them for you to apply manually in .storybook/preview.js|ts (e.g. using withThemeFromJSXProvider from @storybook/addon-themes), then you do not need to do anything else. They are already included in the previewAnnotations in the example above.

If you need to configure Testing Library's render or use a different render function, please let us know in this discussion so we can learn more about your needs.

Type: ProjectAnnotation | ProjectAnnotation[]

A set of project annotations (those defined in .storybook/preview.js|ts) or an array of sets of project annotations, which will be applied to all composed stories.

Annotations are the metadata applied to a story, like args, decorators, loaders, and play functions. They can be defined for a specific story, all stories for a component, or all stories in the project.

To preview your stories in Storybook, Storybook runs a story pipeline, which includes applying project annotations, loading data, rendering the story, and playing interactions. This is a simplified version of the pipeline:

When you want to reuse a story in a different environment, however, it's crucial to understand that all these steps make a story. The portable stories API provides you with the mechanism to recreate that story pipeline in your external environment:

Annotations come from the story itself, that story's component, and the project. The project-level annotations are those defined in your .storybook/preview.js file and by addons you're using. In portable stories, these annotations are not applied automatically — you must apply them yourself.

👉 For this, you use the setProjectAnnotations API.

The story is prepared by running composeStories or composeStory. The outcome is a renderable component that represents the render function of the story.

Finally, stories can prepare data they need (e.g. setting up some mocks or fetching data) before rendering by defining loaders, beforeEach or by having all the story code in the play function when using the mount. In portable stories, all of these steps will be executed when you call the run method of the composed story.

👉 For this, you use the composeStories or composeStory API. The composed story will return a run method to be called.

If your play function contains assertions (e.g. expect calls), your test will fail when those assertions fail.

If your stories behave differently based on globals (e.g. rendering text in English or Spanish), you can define those global values in portable stories by overriding project annotations when composing a story:

**Examples:**

Example 1 (javascript):
```javascript
import { test, expect } from 'vitest';
import { screen } from '@testing-library/react';
// 👉 Using Next.js? Import from @storybook/nextjs instead
import { composeStories } from '@storybook/react';
 
// Import all stories and the component annotations from the stories file
import * as stories from './Button.stories';
 
// Every component that is returned maps 1:1 with the stories,
// but they already contain all annotations from story, meta, and project levels
const { Primary, Secondary } = composeStories(stories);
 
test('renders primary button with default args', async () => {
  await Primary.run();
  const buttonElement = screen.getByText('Text coming from args in stories file!');
  expect(buttonElement).not.toBeNull();
});
 
test('renders primary button with overridden props', async () => {
  // You can override props by passing them in the context argument of the run function
  await Primary.run({ args: { ...Primary.args, children: 'Hello world' } });
  const buttonElement = screen.getByText(/Hello world/i);
  expect(buttonElement).not.toBeNull();
});
```

Example 2 (typescript):
```typescript
(
  csfExports: CSF file exports,
  projectAnnotations?: ProjectAnnotations
) => Record<string, ComposedStoryFn>
```

Example 3 (javascript):
```javascript
import { vi, test, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { composeStory } from '@storybook/react';
 
import meta, { Primary as PrimaryStory } from './Button.stories';
 
// Returns a story which already contains all annotations from story, meta and global levels
const Primary = composeStory(PrimaryStory, meta);
 
test('renders primary button with default args', async () => {
  await Primary.run();
 
  const buttonElement = screen.getByText('Text coming from args in stories file!');
  expect(buttonElement).not.toBeNull();
});
 
test('renders primary button with overridden props', async () => {
  await Primary.run({ args: { ...Primary.args, label: 'Hello world' } });
 
  const buttonElement = screen.getByText(/Hello world/i);
  expect(buttonElement).not.toBeNull();
});
```

Example 4 (scala):
```scala
(
  story: Story export,
  componentAnnotations: Meta,
  projectAnnotations?: ProjectAnnotations,
  exportsName?: string
) => ComposedStoryFn
```

---

## useOf | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/doc-blocks/doc-block-useof

**Contents:**
- useOf
- useOf
  - Type
  - Parameters
    - moduleExportOrType
    - validTypes
  - Return
    - EnhancedResolvedModuleExportType['type'] === 'story'
    - EnhancedResolvedModuleExportType['type'] === 'meta'
    - EnhancedResolvedModuleExportType['type'] === 'component'

The default blocks supplied by Storybook do not fit all use cases, so you might want to write your own blocks.

If your own doc blocks need to interface with annotations from Storybook—that is stories, meta or components—you can use the useOf hook. Pass in a module export of a story, meta, or component and it will return its annotated form (with applied parameters, args, loaders, decorators, play function) that you can then use for anything you like. In fact, most of the existing blocks like Description and Canvas use useOf under the hood.

Here’s an example of how theuseOf hook could be used to create a custom block that displays the name of the story:

Type: ModuleExport | 'story' | 'meta' | 'component'

Provides the story export, meta export, component export, or CSF file exports from which you get annotations.

When the custom block is in an attached doc, it’s also possible to get the primary (first) story, meta, or component by passing in a string instead. This is useful as a fallback, so the of prop can be omitted in your block. The most common pattern is using this as useOf(props.of || 'story') which will fall back to the primary story if no of prop is defined.

Type: Array<'story' | 'meta' | 'component'>

Optionally specify an array of valid types that your block accepts. Passing anything other than the valid type(s) will result in an error. For example, the Canvas block uses useOf(of, ['story']), which ensures it only accepts a reference to a story, not a meta or component.

The return value depends on the matched type:

Type: { type: 'story', story: PreparedStory }

For stories, annotated stories are returned as is. They are prepared, meaning that they are already merged with project and meta annotations.

Type: { type: 'meta', csfFile: CSFFile, preparedMeta: PreparedMeta }

For meta, the parsed CSF file is returned, along with prepared annotated meta. That is, project annotations merged with meta annotations, but no story annotations.

Type: { type: 'component', component: Component, projectAnnotations: NormalizedProjectAnnotations }

For components, the component is returned along with project annotations; no meta or story annotations.

Note that it’s often impossible for the hook to determine if a component is passed in or any other object, so it behaves like an unknown type as well.

**Examples:**

Example 1 (javascript):
```javascript
import { useOf } from '@storybook/blocks';
 
/**
 * A block that displays the story name or title from the of prop
 * - if a story reference is passed, it renders the story name
 * - if a meta reference is passed, it renders the stories' title
 * - if nothing is passed, it defaults to the primary story
 */
export const StoryName = ({ of }) => {
  const resolvedOf = useOf(of || 'story', ['story', 'meta']);
  switch (resolvedOf.type) {
    case 'story': {
      return <h1>{resolvedOf.story.name}</h1>;
    }
    case 'meta': {
      return <h1>{resolvedOf.preparedMeta.title}</h1>;
    }
  }
  return null;
};
```

Example 2 (jsx):
```jsx
import { Meta } from '@storybook/blocks';
import { StoryName } from '../.storybook/blocks/StoryName';
import * as ButtonStories from './Button.stories';
 
<Meta of={ButtonStories} />
 
{/* Renders "Secondary" */}
<StoryName of={ButtonStories.Secondary} />
 
{/* Renders "Primary" */}
<StoryName />
 
{/* Renders "Button" */}
<StoryName of={ButtonStories} />
```

Example 3 (scala):
```scala
(
  moduleExportOrType: ModuleExport | 'story' | 'meta' | 'component',
  validTypes?: Array<'story' | 'meta' | 'component'>
) => EnhancedResolvedModuleExportType
```

---

## core | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/main-config/main-config-core

**Contents:**
- core
- builder
- channelOptions
  - channelOptions.allowFunction
  - channelOptions.maxDepth
- crossOriginIsolated
- disableProjectJson
- disableTelemetry
- disableWebpackDefaults
- disableWhatsNewNotifications

Parent: main.js|ts configuration

Configures Storybook's internal features.

Configures Storybook's builder, Vite or Webpack.

With the new Framework API, framework.options.builder is now the preferred way to configure the builder.

You should only use core.builder.options if you need to configure a builder that is not part of a framework.

Configures the channel used by Storybook to communicate between the manager and preview.

Only two properties are likely to be used:

Enables serializing functions across the channel, which can be a security risk.

The maximum depth of nested objects to serialize across the channel. Larger values will be slower.

Enable CORS headings to run document in a "secure context". See SharedArrayBuffer security requirements

This enables these headers in development-mode:

Disables the generation of project.json, a file containing Storybook metadata

Disables Storybook's telemetry collection.

Disables Storybook's default Webpack configuration.

Disables the "What's New" notifications in the UI for new Storybook versions and ecosystem updates (e.g., addons, content, etc.).

Enable crash reports to be sent to Storybook telemetry.

**Examples:**

Example 1 (csharp):
```csharp
{
  builder?: string | { name: string; options?: BuilderOptions };
  channelOptions?: ChannelOptions;
  crossOriginIsolated?: boolean;
  disableProjectJson?: boolean;
  disableTelemetry?: boolean;
  disableWebpackDefaults?: boolean;
  disableWhatsNewNotifications?: boolean;
  enableCrashReports?: boolean;
  renderer?: RendererName;
}
```

Example 2 (elixir):
```elixir
| '@storybook/builder-vite' | '@storybook/builder-webpack5'
| {
    name: '@storybook/builder-vite' | '@storybook/builder-webpack5';
    options?: BuilderOptions;
  }
```

Example 3 (python):
```python
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: {
        viteConfigPath: '../../../vite.config.js',
      },
    },
  },
};
 
export default config;
```

Example 4 (css):
```css
{
  allowClass: boolean;
  allowDate: boolean;
  allowFunction: boolean;
  allowRegExp: boolean;
  allowSymbol: boolean;
  allowUndefined: boolean;
  lazyEval: boolean;
  maxDepth: number;
  space: number | undefined;
}
```

---

## babelDefault | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/main-config/main-config-babel-default

**Contents:**
- babelDefault
- Babel.Config
- Options

Parent: main.js|ts configuration

Type: (config: Babel.Config, options: Options) => Babel.Config | Promise<Babel.Config>

babelDefault allows customization of Storybook's Babel setup. It is applied to the preview config before any user presets have been applied, which makes it useful and recommended for addon authors so that the end user's babel setup can override it.

To adjust your Storybook's Babel setup directly—not via an addon—use babel instead.

The options provided by Babel are only applicable if you've enabled the @storybook/addon-webpack5-compiler-babel addon.

Type: { configType?: 'DEVELOPMENT' | 'PRODUCTION' }

There are other options that are difficult to document here. Please introspect the type definition for more information.

**Examples:**

Example 1 (csharp):
```csharp
import { TransformOptions } from '@babel/core';
 
export function babelDefault(config: TransformOptions) {
  return {
    plugins: [[require.resolve('@babel/plugin-transform-react-jsx'), {}, 'preset']],
  };
}
```

---

## indexers | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/main-config/main-config-indexers

**Contents:**
- indexers
- Indexer
  - test
  - createIndex
    - fileName
    - IndexerOptions
      - makeTitle
    - IndexInput
      - exportName
      - importPath

While this feature is experimental, it must be specified by the experimental_indexers property of StorybookConfig.

Parent: main.js|ts configuration

Type: (existingIndexers: Indexer[]) => Promise<Indexer[]>

Indexers are responsible for building Storybook's index of stories—the list of all stories and a subset of their metadata like id, title, tags, and more. The index can be read at the /index.json route of your Storybook.

The indexers API is an advanced feature that allows you to customize Storybook's indexers, which dictate how Storybook indexes and parses files into story entries. This adds more flexibility to how you can write stories, including which language stories are defined in or where to get stories from.

They are defined as a function that returns the full list of indexers, including the existing ones. This allows you to add your own indexer to the list, or to replace an existing one:

Unless your indexer is doing something relatively trivial (e.g. indexing stories with a different naming convention), in addition to indexing the file, you will likely need to transpile it to CSF so that Storybook can read them in the browser.

Specifies which files to index and how to index them as stories.

A regular expression run against file names included in the stories configuration that should match all files to be handled by this indexer.

Type: (fileName: string, options: IndexerOptions) => Promise<IndexInput[]>

Function that accepts a single CSF file and returns a list of entries to index.

The name of the CSF file used to create entries to index.

Options for indexing the file.

Type: (userTitle?: string) => string

A function that takes a user-provided title and returns a formatted title for the index entry, which is used in the sidebar. If no user title is provided, one is automatically generated based on the file name and path.

See IndexInput.title for example usage.

An object representing a story to be added to the stories index.

For each IndexInput, the indexer will add this export (from the file found at importPath) as an entry in the index.

The file to import from, e.g. the CSF file.

It is likely that the fileName being indexed is not CSF, in which you will need to transpile it to CSF so that Storybook can read it in the browser.

The raw path/package of the file that provides meta.component, if one exists.

Default: Auto-generated from title

Define the custom id for meta of the entry.

If specified, the export default (meta) in the CSF file must have a corresponding id property, to be correctly matched.

Default: Auto-generated from exportName

The name of the entry.

Tags for filtering entries in Storybook and its tools.

Default: Auto-generated from default export of importPath

Determines the location of the entry in the sidebar.

Most of the time, you should not specify a title, so that your indexer will use the default naming behavior. When specifying a title, you must use the makeTitle function provided in IndexerOptions to also use this behavior. For example, here's an indexer that merely appends a "Custom" prefix to the title derived from the file name:

Default: Auto-generated from title/metaId and exportName

Define the custom id for the story of the entry.

If specified, the story in the CSF file must have a corresponding __id property, to be correctly matched.

Only use this if you need to override the auto-generated id.

The value of importPath in an IndexInput must resolve to a CSF file. Most custom indexers, however, are only necessary because the input is not CSF. Therefore, you will likely need to transpile the input to CSF, so that Storybook can read it in the browser and render your stories.

Transpiling the custom source format to CSF is beyond the scope of this documentation. This transpilation is often done at the builder level (Vite and/or Webpack), and we recommend using unplugin to create plugins for multiple builders.

The general architecture looks something like this:

Let's look at an example of how this might work.

First, here's an example of a non-CSF source file:

The builder plugin would then:

That resulting CSF file would then be indexed by Storybook. It would look something like this:

Some example usages of custom indexers include:

This indexer generates stories for components based on JSON fixture data. It looks for *.stories.json files in the project, adds them to the index and separately converts their content to CSF.

An example input JSON file could look like this:

A builder plugin will then need to transform the JSON file into a regular CSF file. This transformation could be done with a Vite plugin similar to this:

You can use a custom indexer and builder plugin to create your API to define stories extending the CSF format. To learn more, see the following proof of concept to set up a custom indexer to generate stories dynamically. It contains everything needed to support such a feature, including the indexer, a Vite plugin, and a Webpack loader.

Custom indexers can be used for an advanced purpose: defining stories in any language, including template languages, and converting the files to CSF. To see examples of this in action, you can refer to @storybook/addon-svelte-csf for Svelte template syntax and storybook-vue-addon for Vue template syntax.

The indexer API is flexible enough to let you process arbitrary content, so long as your framework tooling can transform the exports in that content into actual stories it can run. This advanced example demonstrates how you can create a custom indexer to process a collection of URLs, extract the title and URL from each page, and render them as sidebar links in the UI. Implemented with Svelte, it can be adapted to any framework.

Start by creating the URL collection file (i.e., src/MyLinks.url.js) with a list of URLs listed as named exports. The indexer will use the export name as the story title and the value as the unique identifier.

Adjust your Vite configuration file to include a custom plugin complementing the indexer. This will allow Storybook to process and import the URL collection file as stories.

Update your Storybook configuration (i.e., .storybook/main.js|ts) to include the custom indexer.

Add a Storybook UI configuration file (i.e., .storybook/manager.js|ts) to render the indexed URLs as sidebar links in the UI:

This example's code and live demo are available on StackBlitz.

**Examples:**

Example 1 (javascript):
```javascript
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    // 👇 Make sure files to index are included in `stories`
    '../src/**/*.custom-stories.@(js|jsx|ts|tsx)',
  ],
  experimental_indexers: async (existingIndexers) => {
    const customIndexer = {
      test: /\.custom-stories\.[tj]sx?$/,
      createIndex: async (fileName) => {
        // See API and examples below...
      },
    };
    return [...existingIndexers, customIndexer];
  },
};
 
export default config;
```

Example 2 (scala):
```scala
{
  test: RegExp;
  createIndex: (fileName: string, options: IndexerOptions) => Promise<IndexInput[]>;
}
```

Example 3 (scala):
```scala
{
  makeTitle: (userTitle?: string) => string;
}
```

Example 4 (typescript):
```typescript
{
  exportName: string;
  importPath: string;
  type: 'story';
  rawComponentPath?: string;
  metaId?: string;
  name?: string;
  tags?: string[];
  title?: string;
  __id?: string;
}
```

---

## babelDefault | Storybook docs

**URL:** https://storybook.js.org/docs/api/main-config/main-config-babel-default

**Contents:**
- babelDefault
- Babel.Config
- Options

Parent: main.js|ts configuration

Type: (config: Babel.Config, options: Options) => Babel.Config | Promise<Babel.Config>

babelDefault allows customization of Storybook's Babel setup. It is applied to the preview config before any user presets have been applied, which makes it useful and recommended for addon authors so that the end user's babel setup can override it.

To adjust your Storybook's Babel setup directly—not via an addon—use babel instead.

The options provided by Babel are only applicable if you've enabled the @storybook/addon-webpack5-compiler-babel addon.

Type: { configType?: 'DEVELOPMENT' | 'PRODUCTION' }

There are other options that are difficult to document here. Please introspect the type definition for more information.

**Examples:**

Example 1 (csharp):
```csharp
import { TransformOptions } from '@babel/core';
 
export function babelDefault(config: TransformOptions) {
  return {
    plugins: [[import.meta.resolve('@babel/plugin-transform-react-jsx'), {}, 'preset']],
  };
}
```

---

## Addon API | Storybook docs

**URL:** https://storybook.js.org/docs/addons/addons-api

**Contents:**
- Addon API
- Core Addon API
  - addons.add()
  - addons.register()
  - addons.getChannel()
  - makeDecorator
- Storybook API
  - api.selectStory()
  - api.selectInCurrentKind()
  - api.setQueryParams()

Storybook's API allows developers to interact programmatically with Storybook. With the API, developers can build and deploy custom addons and other tools that enhance Storybook's functionality.

Our API is exposed via two distinct packages, each one with a different purpose:

The add method allows you to register the type of UI component associated with the addon (e.g., panels, toolbars, tabs). For a minimum viable Storybook addon, you should provide the following arguments:

The render function is called with active. The active value will be true when the panel is focused on the UI.

Serves as the entry point for all addons. It allows you to register an addon and access the Storybook API. For example:

Now you'll get an instance to our StorybookAPI. See the api docs for Storybook API regarding using that.

Get an instance to the channel to communicate with the manager and the preview. You can find this in both the addon register code and your addon’s wrapper component (where used inside a story).

It has a NodeJS EventEmitter compatible API. So, you can use it to emit events and listen to events.

Use the makeDecorator API to create decorators in the style of the official addons. Like so:

If the story's parameters include { exampleParameter: { disable: true } } (where exampleParameter is the parameterName of your addon), your decorator will not be called.

The makeDecorator API requires the following arguments:

Storybook's API allows you to access different functionalities of Storybook UI.

The selectStory API method allows you to select a single story. It accepts the following two parameters; story kind name and an optional story name. For example:

This is how you can select the above story:

Similar to the selectStory API method, but it only accepts the story as the only parameter.

This method allows you to set query string parameters. You can use that as temporary storage for addons. Here's how you define query params:

Additionally, if you need to remove a query parameter, set it as null instead of removing them from the addon. For example:

Allows retrieval of a query parameter enabled via the setQueryParams API method. For example:

This method allows you to get the application URL state, including any overridden or custom parameter values. For example:

Get the manager and preview URLs for a story. URLs are relative to the current Storybook, unless base is set, or in case of previewHref with refId set.

This method allows you to register a handler function called whenever the user navigates between stories.

Opens a file in the configured code editor. Useful for "Edit in IDE" functionality in addons.

Returns a Promise that resolves with information about whether the operation was successful.

Returns the current story's data, including its ID, kind, name, and parameters.

Toggles the fullscreen mode of the Storybook UI. Pass true to enable fullscreen, false to disable, or omit to toggle the current state.

Toggles the visibility of the addon panel. Pass true to show the panel, false to hide, or omit to toggle the current state.

Displays a notification in the Storybook UI. The notification object should contain id, content, and optionally duration and icon.

This method allows you to override the default Storybook UI configuration (e.g., set up a theme or hide UI elements):

The following table details how to use the API values:

The following options are configurable under the sidebar namespace:

The following options are configurable under the toolbar namespace:

To help streamline addon development and reduce boilerplate code, the API exposes a set of hooks to access Storybook's internals. These hooks are an extension of the storybook/manager-api module.

It allows access to Storybook's internal state. Similar to the useglobals hook, we recommend optimizing your addon to rely on React.memo, or the following hooks; useMemo, useCallback to prevent a high volume of re-render cycles.

The useStorybookApi hook is a convenient helper to allow you full access to the Storybook API methods.

Allows setting subscriptions to events and getting the emitter to emit custom events to the channel.

The messages can be listened to on both the iframe and the manager.

The useAddonState is a useful hook for addons that require data persistence, either due to Storybook's UI lifecycle or for more complex addons involving multiple types (e.g., toolbars, panels).

The useParameter retrieves the current story's parameters. If the parameter's value is not defined, it will automatically default to the second value defined.

Extremely useful hook for addons that rely on Storybook Globals. It allows you to obtain and update global values. We also recommend optimizing your addon to rely on React.memo, or the following hooks; useMemo, useCallback to prevent a high volume of re-render cycles.

Hook that allows you to retrieve or update a story's args.

Learn more about the Storybook addon ecosystem

**Examples:**

Example 1 (sql):
```sql
import { addons } from 'storybook/preview-api';
 
import { useStorybookApi } from 'storybook/manager-api';
```

Example 2 (jsx):
```jsx
import React from 'react';
 
import { addons, types } from 'storybook/manager-api';
 
import { AddonPanel } from 'storybook/internal/components';
 
const ADDON_ID = 'myaddon';
const PANEL_ID = `${ADDON_ID}/panel`;
 
addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'My Addon',
    render: ({ active }) => (
      <AddonPanel active={active}>
        <div> Storybook addon panel </div>
      </AddonPanel>
    ),
  });
});
```

Example 3 (sql):
```sql
import { addons } from 'storybook/preview-api';
 
// Register the addon with a unique name.
addons.register('my-organisation/my-addon', (api) => {});
```

Example 4 (jsx):
```jsx
import React, { useCallback } from 'react';
import { OutlineIcon } from '@storybook/icons';
import { useGlobals } from 'storybook/manager-api';
import { addons } from 'storybook/preview-api';
import { ToggleButton } from 'storybook/internal/components';
import { FORCE_RE_RENDER } from 'storybook/internal/core-events';
 
const ExampleToolbar = () => {
  const [globals, updateGlobals] = useGlobals();
 
  const isActive = globals['my-param-key'] || false;
 
  // Function that will update the global value and trigger a UI refresh.
  const refreshAndUpdateGlobal = () => {
    updateGlobals({
      ['my-param-key']: !isActive,
    });
    // Invokes Storybook's addon API method (with the FORCE_RE_RENDER) event to trigger a UI refresh
    addons.getChannel().emit(FORCE_RE_RENDER);
  };
 
  const toggleToolbarAddon = useCallback(() => refreshAndUpdateGlobal(), [isActive]);
 
  return (
    <ToggleButton
      key="Example"
      padding="small"
      variant="ghost"
      pressed={isActive}
      onClick={toggleToolbarAddon}
      ariaLabel="Addon feature"
      tooltip="Toggle addon feature"
    >
      <OutlineIcon />
    </ToggleButton>
  );
};
```

---

## swc | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/main-config/main-config-swc

**Contents:**
- swc
- SWC.Options
- Options

Parent: main.js|ts configuration

Type: (config: swc.Options, options: Options) => swc.Options | Promise<swc.Options>

Customize Storybook's SWC setup for Webpack-based projects enabled via the @storybook/addon-webpack5-compiler-swc addon based on the supported frameworks, except Angular, Create React App, Ember.js and Next.js.

The options provided by SWC are only applicable if you've enabled the @storybook/addon-webpack5-compiler-swc addon.

Type: { configType?: 'DEVELOPMENT' | 'PRODUCTION' }

There are other options that are difficult to document here. Please introspect the type definition for more information.

**Examples:**

Example 1 (lua):
```lua
import type { Options } from '@swc/core';
// Replace your-framework with the webpack-based framework you are using (e.g., react-webpack5)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: {
    name: '@storybook/your-framework',
    options: {},
  },
  swc: (config: Options, options): Options => {
    return {
      ...config,
      // Apply your custom SWC configuration
    };
  },
};
 
export default config;
```

---

## Controls | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/doc-blocks/doc-block-controls

**Contents:**
- Controls
- Controls
  - exclude
  - include
  - of
  - sort

The Controls block can be used to show a dynamic table of args for a given story, as a way to document its interface, and to allow you to change the args for a (separately) rendered story (via the Story or Canvas blocks).

If you’re looking for a static table that shows a component's arg types with no controls, see the ArgTypes block instead.

The Controls doc block will only have functioning UI controls if you have also installed and registered @storybook/addon-controls (included in @storybook/addon-essentials) and haven't turned off inline stories with the inline configuration option.

ℹ️ Like most blocks, the Controls block is configured with props in MDX. Many of those props derive their default value from a corresponding parameter in the block's namespace, parameters.docs.controls.

The following exclude configurations are equivalent:

The example above applied the parameter at the component (or meta) level, but it could also be applied at the project or story level.

This API configures Controls blocks used within docs pages. To configure the Controls addon panel, see the Controls addon docs. To configure individual controls, you can specify argTypes for each.

Type: string[] | RegExp

Default: parameters.docs.controls.exclude

Specifies which controls to exclude from the args table. Any controls whose names match the regex or are part of the array will be left out.

Type: string[] | RegExp

Default: parameters.docs.controls.include

Specifies which controls to include in the args table. Any controls whose names don't match the regex or are not part of the array will be left out.

Type: Story export or CSF file exports

Specifies which story to get the controls from. If a CSF file exports is provided, it will use the primary (first) story in the file.

Type: 'none' | 'alpha' | 'requiredFirst'

Default: parameters.docs.controls.sort or 'none'

Specifies how the controls are sorted.

**Examples:**

Example 1 (jsx):
```jsx
import { Meta, Canvas, Controls } from '@storybook/blocks';
import * as ButtonStories from './Button.stories'
 
<Meta of={ButtonStories} />
 
<Canvas of={ButtonStories.Primary} />
 
<Controls of={ButtonStories.Primary} />
```

Example 2 (sql):
```sql
import { Controls } from '@storybook/blocks';
```

Example 3 (jsx):
```jsx
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta: Meta<typeof Button> = {
  component: Button,
  parameters: {
    docs: {
      controls: { exclude: ['style'] },
    },
  },
};
 
export default meta;
```

Example 4 (jsx):
```jsx
<Controls of={ButtonStories} exclude={['style']} />
```

---

## Component Story Format (CSF) | Storybook docs

**URL:** https://storybook.js.org/docs/api/csf

**Contents:**
- Component Story Format (CSF)
- Default export
- Named story exports
- Args story inputs
- Play function
- Custom render functions
- Storybook export vs. name handling
- Non-story exports
- Upgrading from CSF 2 to CSF 3
  - Spreadable story objects

Component Story Format (CSF) is the recommended way to write stories. It's an open standard based on ES6 modules that is portable beyond Storybook.

In CSF, stories and component metadata are defined as ES Modules. Every component story file consists of a required default export and one or more named exports.

The default export defines metadata about your component, including the component itself, its title (where it will show up in the navigation UI story hierarchy), decorators, and parameters.

The component field is required and used by addons for automatic prop table generation and display of other component metadata. The title field is optional and should be unique (i.e., not re-used across files).

For more examples, see writing stories.

With CSF, every named export in the file represents a story object by default.

The exported identifiers will be converted to "start case" using Lodash's startCase function. For example:

We recommend that all export names to start with a capital letter.

Story objects can be annotated with a few different fields to define story-level decorators and parameters, and also to define the name of the story.

Storybook's name configuration element is helpful in specific circumstances. Common use cases are names with special characters or Javascript restricted words. If not specified, Storybook defaults to the named export.

Starting in SB 6.0, stories accept named inputs called Args. Args are dynamic data that are provided (and possibly updated by) Storybook and its addons.

Consider Storybook’s "Button" example of a text button that logs its click events:

Now consider the same example, re-written with args:

Not only are these versions shorter and more accessible to write than their no-args counterparts, but they are also more portable since the code doesn't depend on the actions feature specifically.

For more information on setting up Docs and Actions, see their respective documentation.

Storybook's play functions are small snippets of code executed when the story renders in the UI. They are convenient helper methods to help you test use cases that otherwise weren't possible or required user intervention.

A good use case for the play function is a form component. With previous Storybook versions, you'd write your set of stories and had to interact with the component to validate it. With Storybook's play functions, you could write the following story:

When the story renders in the UI, Storybook executes each step defined in the play function and runs the assertions without the need for user interaction.

Starting in Storybook 6.4, you can write your stories as JavaScript objects, reducing the boilerplate code you need to generate to test your components, thus improving functionality and usability. Render functions are helpful methods to give you additional control over how the story renders. For example, if you were writing a story as an object and you wanted to specify how your component should render, you could write the following:

When Storybook loads this story, it will detect the existence of a render function and adjust the component rendering accordingly based on what's defined.

Storybook handles named exports and the name option slightly differently. When should you use one vs. the other?

Storybook will always use the named export to determine the story ID and URL.

If you specify the name option, it will be used as the story display name in the UI. Otherwise, it defaults to the named export, processed through Storybook's storyNameFromExport and lodash.startCase functions.

When you want to change the name of your story, rename the CSF export. It will change the name of the story and also change the story's ID and URL.

It would be best if you used the name configuration element in the following cases:

In some cases, you may want to export a mixture of stories and non-stories (e.g., mocked data).

You can use the optional configuration fields includeStories and excludeStories in the default export to make this possible. You can define them as an array of strings or regular expressions.

Consider the following story file:

When this file renders in Storybook, it treats ComplexStory and SimpleStory as stories and ignores the data named exports.

For this particular example, you could achieve the same result in different ways, depending on what's convenient:

The first option is the recommended solution if you follow the best practice of starting story exports with an uppercase letter (i.e., use UpperCamelCase).

Storybook provides a codemod to help you upgrade from CSF 2 to CSF 3. You can run it with the following command:

In CSF 2, the named exports are always functions that instantiate a component, and those functions can be annotated with configuration options. For example:

This declares a Primary story for a Button that renders itself by spreading { primary: true } into the component. The default.title metadata says where to place the story in a navigation hierarchy.

Here's the CSF 3 equivalent:

Let's go through the changes individually to understand what's going on.

In CSF 3, the named exports are objects, not functions. This allows us to reuse stories more efficiently with the JS spread operator.

Consider the following addition to the intro example, which creates a PrimaryOnDark story that renders against a dark background:

Here's the CSF 2 implementation:

Primary.bind({}) copies the story function, but it doesn't copy the annotations hanging off the function, so we must add PrimaryOnDark.args = Primary.args to inherit the args.

In CSF 3, we can spread the Primary object to carry over all its annotations:

Learn more about named story exports.

In CSF 3, you specify how a story renders through a render function. We can rewrite a CSF 2 example to CSF 3 through the following steps.

Let's start with a simple CSF 2 story function:

Now, let's rewrite it as a story object in CSF 3 with an explicit render function that tells the story how to render itself. Like CSF 2, this gives us full control of how we render a component or even a collection of components.

Learn more about render functions.

But in CSF 2, a lot of story functions are identical: take the component specified in the default export and spread args into it. What's interesting about these stories is not the function, but the args passed into the function.

CSF 3 provides default render functions for each renderer. If all you're doing is spreading args into your component—which is the most common case—you don't need to specify any render function at all:

For more information, see the section on custom render functions.

Finally, CSF 3 can automatically generate titles.

You can still specify a title like in CSF 2, but if you don't specify one, it can be inferred from the story's path on disk. For more information, see the section on configuring story loading.

**Examples:**

Example 1 (jsx):
```jsx
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta } from '@storybook/your-framework';
 
import { MyComponent } from './MyComponent';
 
const meta = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Path/To/MyComponent',
  component: MyComponent,
  decorators: [
    /* ... */
  ],
  parameters: {
    /* ... */
  },
} satisfies Meta<typeof MyComponent>;
 
export default meta;
```

Example 2 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { MyComponent } from './MyComponent';
 
const meta = {
  component: MyComponent,
} satisfies Meta<typeof MyComponent>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Basic: Story = {};
 
export const WithProp: Story = {
  render: () => <MyComponent prop="value" />,
};
```

Example 3 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { MyComponent } from './MyComponent';
 
const meta = {
  component: MyComponent,
} satisfies Meta<typeof MyComponent>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Simple: Story = {
  name: 'So simple!',
  // ...
};
```

Example 4 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { action } from 'storybook/actions';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
} satisfies Meta<typeof Button>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Basic: Story = {
  render: () => <Button label="Hello" onClick={action('clicked')} />,
};
```

---

## Title | Storybook docs

**URL:** https://storybook.js.org/docs/api/doc-blocks/doc-block-title

**Contents:**
- Title
- Title
  - children
  - of

The Title block serves as the primary heading for your docs entry. It is typically used to provide the component or page name.

Title is configured with the following props:

Type: JSX.Element | string

Provides the content. Falls back to value of title in an attached CSF file (or value derived from autotitle), trimmed to the last segment. For example, if the title value is 'path/to/components/Button', the default content is 'Button'.

Type: CSF file exports

Specifies which meta's title is displayed.

**Examples:**

Example 1 (sql):
```sql
import { Title } from '@storybook/addon-docs/blocks';
 
<Title>This is the title</Title>
```

Example 2 (sql):
```sql
import { Title } from '@storybook/addon-docs/blocks';
```

---

## Component Story Format (CSF) | Storybook docs

**URL:** https://storybook.js.org/docs/api/csf/csf-next

**Contents:**
- Component Story Format (CSF)
- Overview
  - defineMain
  - definePreview
  - preview.meta
    - preview.type.meta
  - meta.story
    - <Story>.extend
    - <Story>.test
- Upgrade to CSF Next

This is a preview feature and (though unlikely) the API may change in future releases. We welcome feedback and contributions to help improve this feature.

CSF Next is the next evolution of Storybook's Component Story Format (CSF). This new API uses a pattern called factory functions to provide full type safety to your Storybook stories, making it easier to configure addons correctly and unlocking the full potential of Storybook's features.

This reference provides an overview of the API and a migration guide to upgrade from prior CSF versions.

The CSF Next API is composed of functions to help you write stories. Note how three of the functions operate as factories, each producing the next function in the chain (definePreview → preview.meta → meta.story), providing full type safety at each step.

With CSF Next, your main Storybook config is specified by the defineMain function. This function is type-safe and will automatically infer types for your project.

Similarly, the definePreview function specifies your project's story configuration. This function is also type-safe and will infer types throughout your project.

Importantly, by specifying addons here, their types will be available throughout your project, enabling autocompletion and type checking.

You will import the result of this function, preview, in your story files to define the component meta.

The preview configuration will be automatically updated to reference the necessary addons when installing an addon via npx storybook add <addon-name> or running storybook dev.

The meta function on the preview object is used to define the metadata for your stories. It accepts an object containing the component, title, parameters, and other story properties.

If you would like to use absolute imports instead of relative imports for your preview config, like below, you can configure that using subpath imports or an alias.

Subpath imports are a Node.js standard that allows you to define custom import paths in your project, which you can then use throughout your codebase.

To configure subpath imports, add the following to your package.json:

For more information, refer to the subpath imports documentation.

Alternatively, you can configure an alias in your builder (Vite or Webpack).

By default, preview.meta will infer the type of your component's props automatically. However, if you need to extend or modify the inferred types, you can use the preview.type function to specify custom types.

This example is for React, but the same API applies to all supported renderers.

For more information on typing your stories, refer to the writing stories in TypeScript guide.

Finally, the story function on the meta object defines the stories. This function accepts an object containing the name, args, parameters, and other story properties.

You can use the .extend method to create a new story based on an existing one, with the option to override or add new properties.

Properties are merged intelligently:

A more ergonomic way to define tests for your stories. While this API is still experimental, it is documented in the RFC to gather feedback and must be enabled via the experimentalTestSyntax feature flag.

You can upgrade your stories to CSF Next either automatically (from CSF 3) or manually (from CSF 1, 2, or 3). CSF Next is designed to be usable incrementally; you do not have to upgrade all of your story files at once. However, you cannot mix story formats within the same file.

Before proceeding, be sure you're using the latest version of Storybook. You can upgrade your Storybook automatically with this command:

You can automatically upgrade all of your project's stories from CSF 3 to CSF Next with this command:

If your project has multiple Storybook configurations, run the command with the -c flag pointing to each config directory:

It will run through each of the manual upgrade steps below on all of your story files.

You must be using CSF 3 to automatically upgrade to CSF Next. If you are using CSF 2, you can upgrade to CSF 3 first using this command:

You can also upgrade your project's story files to CSF Next manually. Before using CSF Next in a story file, you must upgrade your .storybook/main.* and .storybook/preview.* files.

1. Update your main Storybook config file

Update your .storybook/main.* file to use the new defineMain function.

2. Update your preview config file

Update your .storybook/preview.* file to use the new definePreview function.

The ability for an addon to provide annotation types (parameters, globals, etc.) is new and not all addons support it yet.

If an addon provides annotations (i.e. it distributes a ./preview export), it can be imported in two ways:

For official Storybook addons, you import the default export: import addonName from '@storybook/addon-name'

For community addons, you should import the entire module and access the addon from there: import * as addonName from 'community-addon-name'

3. Update your story files

Story files have been updated for improved usability. With the new format:

The examples below show the changes needed to upgrade a story file from CSF 3 to CSF Next. You can also upgrade from CSF 1 or 2 using similar steps.

Note that importing or manually applying the component props type to the meta or stories is no longer necessary. Thanks to the factory function pattern, the types are now inferred automatically.

If you were previously using complex types for your meta or stories, such as intersection types to add custom args, you can now use the preview.type.meta pattern to explicitly specify types.

3.1 Reusing story properties

If you are reusing story properties to create a new story based on another, the <Story>.extend method is the recommended way to do so.

Previously, story properties such as Story.args or Story.parameters were accessed directly when reusing them in another story. While accessing them like this is still supported, it is deprecated in CSF Next.

All of the story properties are now contained within a new property called composed and should be accessed from that property instead. For instance, Story.composed.args or Story.composed.parameters.

The property name "composed" was chosen because the values within are composed from the story, its component meta, and the preview configuration.

If you want to access the direct input to the story, you can use Story.input instead of Story.composed.

4. Update your Vitest setup file

If you're using Storybook's Vitest addon, you can remove your Vitest setup file (.storybook/vitest.setup.ts).

If you are using portable stories in Vitest, you may use a Vitest setup file to configure your stories. This file must be updated to use the new CSF Next format.

Note that this only applies if you use CSF Next for all your tested stories. If you use a mix of CSF 1, 2, or 3 and CSF Next, you must maintain two separate setup files.

5. Reusing stories in test files

Storybook's Vitest addon allows you to test your components directly inside Storybook. All the stories are automatically turned into Vitest tests, making integration seamless in your testing suite.

If you cannot use Storybook Test, you can still reuse the stories in your test files using portable stories. In prior story formats, you had to compose the stories before rendering them in your test files. With CSF Next, you can now reuse the stories directly.

The Story object also provides a Component property, enabling you to render the component with any method you choose, such as Testing Library. You can also access its composed properties (args, parameters, etc.) via the composed property.

Here's an example of how you can reuse a story in a test file by rendering its component:

Storybook will continue to support CSF 1, CSF 2, and CSF 3 for the foreseeable future. None of these prior formats are deprecated.

While using CSF Next, you can still use the older formats, as long as they are not mixed in the same file. If you want to migrate your existing files to the new format, refer to the upgrade section, above.

Yes, the doc blocks used to reference stories in MDX files support the CSF Next format with no changes needed.

For more information on this experimental format's original proposal, refer to its RFC on GitHub. We welcome your comments!

**Examples:**

Example 1 (sql):
```sql
// Replace your-framework with the framework you are using (e.g., react-vite, nextjs, nextjs-vite)
import { defineMain } from '@storybook/your-framework/node';
 
export default defineMain({
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
});
```

Example 2 (python):
```python
// Replace your-framework with the framework you are using (e.g., react-vite, nextjs, nextjs-vite)
import { definePreview } from '@storybook/your-framework';
import addonA11y from '@storybook/addon-a11y';
 
export default definePreview({
  // 👇 Add your addons here
  addons: [addonA11y()],
  parameters: {
    // type-safe!
    a11y: {
      options: { xpath: true },
    },
  },
});
```

Example 3 (sql):
```sql
import preview from '../.storybook/preview';
 
import { Button } from './Button';
 
const meta = preview.meta({
  component: Button,
  parameters: {
    // type-safe!
    layout: 'centered',
  },
});
```

Example 4 (sql):
```sql
// ✅ Absolute imports won't break if you move story files around
import preview from '#.storybook/preview';
 
// ❌ Relative imports can break if you move story files around
import preview from '../../../.storybook/preview';
```

---

## Stories | Storybook docs

**URL:** https://storybook.js.org/docs/api/doc-blocks/doc-block-stories

**Contents:**
- Stories
- Stories
  - includePrimary
  - title

The Stories block renders the full collection of stories in a stories file.

Stories is configured with the following props:

Determines if the collection of stories includes the primary (first) story.

If a stories file contains only one story and includePrimary={true}, the Stories block will render nothing to avoid a potentially confusing situation.

Sets the heading content preceding the collection of stories.

**Examples:**

Example 1 (jsx):
```jsx
import { Meta, Stories } from '@storybook/addon-docs/blocks';
import * as ButtonStories from './Button.stories';
 
<Meta of={ButtonStories} />
 
<Stories />
```

Example 2 (sql):
```sql
import { Stories } from '@storybook/addon-docs/blocks';
```

---

## refs | Storybook docs

**URL:** https://storybook.js.org/docs/api/main-config/main-config-refs

**Contents:**
- refs
- Using a function
- Disable a ref

Parent: main.js|ts configuration

Configures Storybook composition.

You can use a function to dynamically configure refs:

Some package dependencies automatically compose their Storybook in yours. You can disable this behavior by setting disable to true for the package name:

**Examples:**

Example 1 (json):
```json
{ [key: string]:
  | { title: string; url: string; expanded?: boolean, sourceUrl?: string }
  | (config: { title: string; url: string; expanded?: boolean, sourceUrl: string }) => { title: string; url: string; expanded?: boolean, sourceUrl?: string }
  | { disable: boolean }
}
```

Example 2 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  refs: {
    'design-system': {
      title: 'Storybook Design System',
      url: 'https://master--5ccbc373887ca40020446347.chromatic.com/',
      expanded: false, // Optional, true by default,
      sourceUrl: 'https://github.com/storybookjs/storybook', // Optional
    },
  },
};
 
export default config;
```

Example 3 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  // 👇 Retrieve the current environment from the configType argument
  refs: (config, { configType }) => {
    if (configType === 'DEVELOPMENT') {
      return {
        react: {
          title: 'Composed React Storybook running in development mode',
          url: 'http://localhost:7007',
        },
        angular: {
          title: 'Composed Angular Storybook running in development mode',
          url: 'http://localhost:7008',
        },
      };
    }
    return {
      react: {
        title: 'Composed React Storybook running in production',
        url: 'https://your-production-react-storybook-url',
      },
      angular: {
        title: 'Composed Angular Storybook running in production',
        url: 'https://your-production-angular-storybook-url',
      },
    };
  },
};
 
export default config;
```

Example 4 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  refs: {
    'package-name': { disable: true },
  },
};
 
export default config;
```

---

## env | Storybook docs

**URL:** https://storybook.js.org/docs/api/main-config/main-config-env

**Contents:**
- env

Parent: main.js|ts configuration

Type: (config: { [key: string]: string }) => { [key: string]: string }

Defines custom Storybook environment variables.

**Examples:**

Example 1 (lua):
```lua
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  /*
   * 👇 The `config` argument contains all the other existing environment variables.
   * Either configured in an `.env` file or configured on the command line.
   */
  env: (config) => ({
    ...config,
    EXAMPLE_VAR: 'An environment variable configured in Storybook',
  }),
};
 
export default config;
```

---

## staticDirs | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/main-config/main-config-static-dirs

**Contents:**
- staticDirs
- With configuration objects

Parent: main.js|ts configuration

Type: (string | { from: string; to: string })[]

Sets a list of directories of static files to be loaded by Storybook.

You can also use a configuration object to define the directories:

**Examples:**

Example 1 (python):
```python
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs: ['../public', '../static'],
};
 
export default config;
```

Example 2 (python):
```python
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs: [{ from: '../my-custom-assets/images', to: '/assets' }],
};
 
export default config;
```

---

## API references | Storybook docs

**URL:** https://storybook.js.org/docs/api

**Contents:**
- API references
- Configuration
- Stories
- Docs

An overview of all available API references for Storybook.

Storybook's primary configuration file, which specifies your Storybook project's behavior, including the location of your stories, the addons you use, feature flags and other project-specific settings.

This configuration file controls the way stories are rendered. You can also use it to run code that applies to all stories.

This configuration file controls the behavior of Storybook's UI, the manager.

Storybook is a CLI tool. You can start Storybook in development mode or build a static version of your Storybook.

Component Story Format (CSF) is the API for writing stories. It's an open standard based on ES6 modules that is portable beyond Storybook.

ArgTypes specify the behavior of args. By specifying the type of an arg, you constrain the values that it can accept and provide information about args that are not explicitly set.

Parameters are static metadata used to configure your stories addons in Storybook. They are specified at the story, meta (component), project (global) levels.

Storybook offers several doc blocks to help document your components and other aspects of your project.

---

## Unstyled | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/doc-blocks/doc-block-unstyled

**Contents:**
- Unstyled
- Unstyled
  - children

The Unstyled block is a special block that disables Storybook's default styling in MDX docs wherever it is added.

By default, most elements (like h1, p, etc.) in docs have a few default styles applied to ensure the docs look good. However, sometimes you might want some of your content to not have these styles applied. In those cases, wrap the content with the Unstyled block to remove the default styles.

The other blocks like Story and Canvas are already unstyled, so there’s no need to wrap those in the Unstyled block to ensure that Storybook’s styles don’t bleed into the stories. However, if you import your components directly in the MDX, you most likely want to wrap them in the Unstyled block.

Due to how CSS inheritance works it’s best to always add the Unstyled block to the root of your MDX, and not nested into other elements. The following example will cause some Storybook styles like color to be inherited into CustomComponent because they are applied to the root div:

Unstyled is configured with the following props:

Type: React.ReactNode

Provides the content to which you do not want to apply default docs styles.

**Examples:**

Example 1 (jsx):
```jsx
import { Meta, Unstyled } from "@storybook/blocks";
import { Header } from "./Header.tsx";
 
<Meta title="Unstyled" />
 
> This block quote will be styled
 
... and so will this paragraph.
 
<Unstyled>
  > This block quote will not be styled
 
  ... neither will this paragraph, nor the following component (which contains an \<h1\>):
 
  <Header />
 
</Unstyled>
```

Example 2 (jsx):
```jsx
<div>
  <Unstyled>
    <CustomComponent/>
  </Unstyled>
</div>
```

Example 3 (sql):
```sql
import { Unstyled } from '@storybook/blocks';
```

---

## ArgTypes | Storybook docs

**URL:** https://storybook.js.org/docs/api/arg-types

**Contents:**
- ArgTypes
- Automatic argType inference
- Manually specifying argTypes
- argTypes
  - control
    - control.type
    - control.accept
    - control.labels
    - control.max
    - control.min

ArgTypes specify the behavior of args. By specifying the type of an arg, you constrain the values that it can accept and provide information about args that are not explicitly set (i.e., description).

You can also use argTypes to “annotate” args with information used by addons that make use of those args. For instance, to instruct the controls panel to render a color picker, you could specify the 'color' control type.

The most concrete realization of argTypes is the ArgTypes doc block (Controls is similar). Each row in the table corresponds to a single argType and the current value of that arg.

If you are using the Storybook docs addon, then Storybook will infer a set of argTypes for each story based on the component specified in the meta (or default export) of the CSF file.

To do so, Storybook uses various static analysis tools depending on your framework.

The data structure of argTypes is designed to match the output of the these tools. Properties specified manually will override what is inferred.

For most Storybook projects, argTypes are automatically inferred from your components. Any argTypes specified manually will override the inferred values.

ArgTypes are most often specified at the component level, in the meta (or default export) of the CSF file:

They can apply to all stories when specified at the project (global) level, in the preview.* configuration file:

Or they can apply only to a specific story:

You configure argTypes using an object with keys matching the name of args. The value of each key is an object with the following properties:

Specify the behavior of the controls panel for the arg. If you specify a string, it's used as the type of the control. If you specify an object, you can provide additional configuration. Specifying false will prevent the control from rendering.

Type: ControlType | null

Default: Inferred; 'select', if options are specified; falling back to 'object'

Specifies the type of control used to change the arg value with the controls panel. Here are the available types, ControlType, grouped by the type of data they handle:

The date control will convert the date into a UNIX timestamp when the value changes. It's a known limitation that will be fixed in a future release. If you need to represent the actual date, you'll need to update the story's implementation and convert the value into a date object.

When type is 'file', you can specify the file types that are accepted. The value should be a string of comma-separated MIME types.

Type: { [option: string]: string }

Map options to labels. labels doesn't have to be exhaustive. If an option is not in the object's keys, it's used verbatim.

When type is 'number' or 'range', sets the maximum allowed value.

When type is 'number' or 'range', sets the minimum allowed value.

When type is 'color', defines the set of colors that are available in addition to the general color picker. The values in the array should be valid CSS color values.

When type is 'number' or 'range', sets the granularity allowed when incrementing/decrementing the value.

Describe the arg. (If you intend to describe the type of the arg, you should use table.type, instead.)

Conditionally render an argType based on the value of another arg or global.

Type: { [key: string]: { [option: string]: any } }

Map options to values.

When dealing with non-primitive values, you'll notice that you'll run into some limitations. The most obvious issue is that not every value can be represented as part of the args param in the URL, losing the ability to share and deeplink to such a state. Beyond that, complex values such as JSX cannot be synchronized between the manager (e.g., Controls panel) and the preview (your story).

mapping doesn't have to be exhaustive. If the currently selected option is not listed, it's used verbatim. Can be used with control.labels.

The argTypes object uses the name of the arg as the key. By default, that key is used when displaying the argType in Storybook. You can override the displayed name by specifying a name property.

Be careful renaming args in this way. Users of the component you're documenting will not be able to use the documented name as a property of your component and the actual name will not displayed.

For this reason, the name property is best used when defining an argType that is only used for documentation purposes and not an actual property of the component. For example, when providing argTypes for each property of an object.

If the arg accepts a finite set of values, you can specify them with options. If those values are complex, like JSX elements, you can use mapping to map them to string values. You can use control.labels to provide custom labels for the options.

Specify how the arg is documented in the ArgTypes doc block, Controls doc block, and Controls panel.

Default: Inferred, in some frameworks

Display the argType under a category heading, with the label specified by category.

Type: { detail?: string; summary: string }

The documented default value of the argType. summary is typically used for the value itself, while detail is used for additional information.

Set to true to remove the argType's row from the table.

Set to true to indicate that the argType is read-only.

Display the argType under a subcategory heading (which displays under the [category] heading), with the label specified by subcategory.

Type: { detail?: string; summary: string }

Default: Inferred from type

The documented type of the argType. summary is typically used for the type itself, while detail is used for additional information.

If you need to specify the actual, semantic type, you should use type, instead.

Type: 'boolean' | 'function' | 'number' | 'string' | 'symbol' | SBType

The full type of SBType is:

Specifies the semantic type of the argType. When an argType is inferred, the information from the various tools is summarized in this property, which is then used to infer other properties, like control and table.type.

If you only need to specify the documented type, you should use table.type, instead.

Define the default value of the argType. Deprecated in favor of defining the arg value directly.

**Examples:**

Example 1 (jsx):
```jsx
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
  argTypes: {
    // 👇 All Button stories expect a label arg
    label: {
      control: 'text',
      description: 'Overwritten description',
    },
  },
} satisfies Meta<typeof Button>;
 
export default meta;
```

Example 2 (javascript):
```javascript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Preview } from '@storybook/your-framework';
 
const preview = {
  argTypes: {
    // 👇 All stories expect a label arg
    label: {
      control: 'text',
      description: 'Overwritten description',
    },
  },
} satisfies Preview;
 
export default preview;
```

Example 3 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
} satisfies Meta<typeof Button>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Basic: Story = {
  argTypes: {
    // 👇 This story expects a label arg
    label: {
      control: 'text',
      description: 'Overwritten description',
    },
  },
} satisfies Story;
```

Example 4 (json):
```json
{
  [key: string]: {
    control?: ControlType | { type: ControlType; /* See below for more */ } | false;
    description?: string;
    if?: Conditional;
    mapping?: { [key: string]: { [option: string]: any } };
    name?: string;
    options?: string[];
    table?: {
      category?: string;
      defaultValue?: { summary: string; detail?: string };
      disable?: boolean;
      subcategory?: string;
      type?: { summary?: string; detail?: string };
    },
    type?: SBType | SBScalarType['name'];
  }
}
```

---

## Component Story Format (CSF) | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/csf/csf-factories

**Contents:**
- Component Story Format (CSF)
- Overview
  - defineMain
  - definePreview
  - preview.meta
  - meta.story
  - Subpath imports
- Upgrading from CSF 1, 2, or 3
  - 1. Add subpath import in package.json
  - 2. Update your main Storybook config file

This is an experimental feature and (though unlikely) the API may change in future releases. We welcome feedback and contributions to help improve this feature.

CSF Factories are the next evolution of Storybook's Component Story Format (CSF). This new API uses a pattern called factory functions to provide full type safety to your Storybook stories, making it easier to configure addons correctly and unlocking the full potential of Storybook's features.

This reference will provide an overview of the API and a migration guide to upgrade from CSF 3.

The CSF Factories API is composed of four main functions to help you write stories. Note how three of the functions operate as factories, each producing the next function in the chain (definePreview → preview.meta → meta.story), providing full type safety at each step.

With CSF Factories, your main Storybook config is specified by the defineMain function. This function is type-safe and will automatically infer types for your project.

Similarly, the definePreview function specifies your project's story configuration. This function is also type-safe and will infer types throughout your project.

Importantly, by specifying addons here, their types will be available throughout your project, enabling autocompletion and type checking.

You will import the result of this function, preview, in your story files to define the component meta.

The preview configuration will be automatically updated to reference the necessary addons when installing an addon via npx storybook add <addon-name> or running storybook dev.

The meta function on the preview object is used to define the metadata for your stories. It accepts an object containing the component, title, parameters, and other story properties.

Finally, the story function on the meta object defines the stories. This function accepts an object containing the name, args, parameters, and other story properties.

CSF Factories leverages subpath imports to simplify importing constructs from the preview file. While you can still use relative path imports, subpath imports offer a more convenient and maintainable approach:

See the manual migration steps for details about configuring the necessary subpath imports.

For more details, refer to the subpath imports documentation.

You can upgrade your project's story files to CSF Factories incrementally or all at once. However, before using CSF Factories in a story file, you must upgrade your .storybook/main.js|ts and .storybook/preview.js|ts files.

To be able to consistently import the preview file from any location in your project, you need to add a subpath import in your package.json. For more information, refer to the subpath imports documentation.

Update your .storybook/main.js|ts file to use the new defineMain function.

Update your .storybook/preview.js|ts file to use the new definePreview function.

The ability for an addon to provide annotation types (parameters, globals, etc.) is new and not all addons support it yet.

If an addon provides annotations (i.e. it distributes a ./preview export), it can be imported in two ways:

For official Storybook addons, you import the default export: import addonName from '@storybook/addon-name'

For community addons, you should import the entire module and access the addon from there: import * as addonName from 'community-addon-name'

Story files have been updated for improved usability. With the new format:

The examples below show the changes needed to upgrade a story file from CSF 3 to CSF Factories. You can also upgrade from CSF 1 or 2 using similar steps.

Note that importing or manually applying any type to the meta or stories is no longer necessary. Thanks to the factory function pattern, the types are now inferred automatically.

Previously, story properties such as Story.args or Story.parameters were accessed directly when reusing them in another story. While accessing them like this is still supported, it is deprecated in CSF Factories.

All of the story properties are now contained within a new property called composed and should be accessed from that property instead. For instance, Story.composed.args or Story.composed.parameters.

The property name "composed" was chosen because the values within are composed from the story, its component meta, and the preview configuration.

If you want to access the direct input to the story, you can use Story.input instead of Story.composed.

Whether you're using Storybook's Test addon or portable stories in Vitest, you may use a Vitest setup file to configure your stories. This file must be updated to use the new CSF Factories format.

Note that this only applies if you use CSF Factories for all your tested stories. If you use a mix of CSF 1, 2, or 3 and CSF Factories, you must maintain two separate setup files.

Storybook's Test addon allows you to test your components directly inside Storybook. All the stories are automatically turned into Vitest tests, making integration seamless in your testing suite.

If you cannot use Storybook Test, you can still reuse the stories in your test files using portable stories. In prior story formats, you had to compose the stories before rendering them in your test files. With CSF Factories, you can now reuse the stories directly.

The Story object also provides a Component property, enabling you to render the component with any method you choose, such as Testing Library. You can also access its composed properties (args, parameters, etc.) via the composed property.

Here's an example of how you can reuse a story in a test file by rendering its component:

Storybook will continue to support CSF 1, CSF 2, and CSF 3 for the foreseeable future. None of these prior formats are deprecated.

While using CSF Factories, you can still use the older formats, as long as they are not mixed in the same file. If you want to migrate your existing files to the new format, refer to the upgrade section, above.

Yes, the doc blocks used to reference stories in MDX files support the CSF Factories format with no changes needed.

For more information on this experimental format's original proposal, refer to its RFC on GitHub. We welcome your comments!

**Examples:**

Example 1 (sql):
```sql
// Replace your-framework with the framework you are using (e.g., react-vite, nextjs, experimental-nextjs-vite)
import { defineMain } from '@storybook/your-framework/node';
 
export default defineMain({
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
});
```

Example 2 (python):
```python
// Replace your-framework with the framework you are using (e.g., react-vite, nextjs, experimental-nextjs-vite)
import { definePreview } from '@storybook/your-framework';
import addonA11y from '@storybook/addon-a11y';
 
export default definePreview({
  // 👇 Add your addons here
  addons: [addonA11y()],
  parameters: {
    // type-safe!
    a11y: {
      options: { xpath: true },
    },
  },
});
```

Example 3 (javascript):
```javascript
// Learn about the # subpath import: https://storybook.js.org/docs/api/csf/csf-factories#subpath-imports
import preview from '#.storybook/preview';
 
import { Button } from './Button';
 
const meta = preview.meta({
  component: Button,
  parameters: {
    // type-safe!
    layout: 'centered',
  }
});
export default meta;
```

Example 4 (lua):
```lua
// ...from above
const meta = preview.meta({ /* ... */ });
 
export const Primary = meta.story({
  args: {
    // type-safe!
    primary: true,
  },
});
```

---

## ColorPalette | Storybook docs

**URL:** https://storybook.js.org/docs/api/doc-blocks/doc-block-colorpalette

**Contents:**
- ColorPalette
- ColorPalette
  - children
- ColorItem
  - colors
  - subtitle
  - title

The ColorPalette block allows you to document all color-related items (e.g., swatches) used throughout your project.

ColorPalette is configured with the following props:

Type: React.ReactNode

ColorPalette expects only ColorItem children.

ColorItem is configured with the following props:

Type: string[] | { [key: string]: string }

Provides the list of colors to be displayed. Accepts any valid CSS color format (hex, RGB, HSL, etc.). When an object is provided, the keys will be displayed above the values. Additionally, it supports gradients such as 'linear-gradient(to right, white, black)' or 'linear-gradient(65deg, white, black)', etc.

Provides an additional description of the color.

Sets the name of the color to be displayed.

**Examples:**

Example 1 (jsx):
```jsx
import { Meta, ColorPalette, ColorItem } from '@storybook/addon-docs/blocks';
 
<Meta title="Colors" />
 
<ColorPalette>
  <ColorItem
    title="theme.color.greyscale"
    subtitle="Some of the greys"
    colors={{ White: '#FFFFFF', Alabaster: '#F8F8F8', Concrete: '#F3F3F3' }}
  />
  <ColorItem
    title="theme.color.primary"
    subtitle="Coral"
    colors={{ WildWatermelon: '#FF4785' }}
  />
  <ColorItem
    title="theme.color.secondary"
    subtitle="Ocean"
    colors={{ DodgerBlue: '#1EA7FD' }}
  />
  <ColorItem
    title="theme.color.positive"
    subtitle="Green"
    colors={{
      Apple: 'rgba(102,191,60,1)',
      Apple80: 'rgba(102,191,60,.8)',
      Apple60: 'rgba(102,191,60,.6)',
      Apple30: 'rgba(102,191,60,.3)',
    }}
  />
  <ColorItem
    title="gradient"
    subtitle="Grayscale"
    colors={{
      Gradient: 'linear-gradient(to right,white,black)',
    }}
  />
  <ColorItem
    title="gradient"
    subtitle="Grayscale"
    colors={['linear-gradient(65deg,white,black)']}
  />
</ColorPalette>
```

Example 2 (sql):
```sql
import { ColorPalette } from '@storybook/addon-docs/blocks';
```

Example 3 (sql):
```sql
import { ColorItem } from '@storybook/addon-docs/blocks';
```

---

## IconGallery | Storybook docs

**URL:** https://storybook.js.org/docs/api/doc-blocks/doc-block-icongallery

**Contents:**
- IconGallery
- Documenting icons
  - Automate icon documentation
- IconGallery
  - children
- IconItem
  - name
  - children

The IconGallery block enables you to easily document React icon components associated with your project, displayed in a neat grid.

To document a set of icons, use the IconGallery block to display them in a grid. Each icon is wrapped in an IconItem block, enabling you to specify its properties, such as the name and the icon itself.

If you're working on a project that contains a large number of icons that you want to document, you can extend the IconGallery block, wrap IconItem in a loop, and iterate over the icons you want to document, including their properties. For example:

IconGallery is configured with the following props:

Type: React.ReactNode

IconGallery expects only IconItem children.

IconItem is configured with the following props:

Sets the name of the icon.

Type: React.ReactNode

Provides the icon to be displayed.

**Examples:**

Example 1 (typescript):
```typescript
import { Meta, IconGallery, IconItem } from '@storybook/addon-docs/blocks';
 
import { Icon as IconExample } from './Icon';
 
<Meta title="Iconography" />
 
# Iconography
 
<IconGallery>
  <IconItem name="mobile">
    <IconExample name="mobile" />
  </IconItem>
  <IconItem name="user">
    <IconExample name="user" />
  </IconItem>
  <IconItem name="browser">
    <IconExample name="browser" />
  </IconItem>
  <IconItem name="component">
    <IconExample name="component" />
  </IconItem>
  <IconItem name="calendar">
    <IconExample name="calendar" />
  </IconItem>
  <IconItem name="paintbrush">
    <IconExample name="paintbrush" />
  </IconItem>
  <IconItem name="add">
    <IconExample name="add" />
  </IconItem>
  <IconItem name="subtract">
    <IconExample name="subtract" />
  </IconItem>
  <IconItem name="document">
    <IconExample name="document" />
  </IconItem>
  <IconItem name="graphline">
    <IconExample name="graphline" />
  </IconItem>
</IconGallery>
```

Example 2 (typescript):
```typescript
import { Meta, IconGallery, IconItem } from '@storybook/addon-docs/blocks';
 
import { Icon as IconExample } from './Icon';
import * as icons from './icons';
 
# Iconography
 
<IconGallery>
  {Object.keys(icons).map((icon) => (
    <IconItem name={icon}>
      <IconExample icon={icon} />
    </IconItem>
  ))}
</IconGallery>
```

Example 3 (sql):
```sql
import { IconGallery } from '@storybook/addon-docs/blocks';
```

Example 4 (sql):
```sql
import { IconItem } from '@storybook/addon-docs/blocks';
```

---

## Portable stories in Vitest | Storybook docs

**URL:** https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest

**Contents:**
- Portable stories in Vitest
- composeStories
  - Type
  - Parameters
    - csfExports
    - projectAnnotations
  - Return
- composeStory
  - Type
  - Parameters

Storybook now recommends testing your stories in Vitest with the Vitest addon, which automatically transforms stories into real Vitest tests (using this API under the hood).

This API is still available for those who prefer to use portable stories directly, but we recommend using the Vitest addon for a more streamlined testing experience.

Portable stories are Storybook stories which can be used in external environments, such as Vitest.

Normally, Storybook composes a story and its annotations automatically, as part of the story pipeline. When using stories in Vitest tests, you must handle the story pipeline yourself, which is what the composeStories and composeStory functions enable.

Using Next.js? You can test your Next.js stories with Vitest by installing and setting up the @storybook/nextjs-vite which re-exports vite-plugin-storybook-nextjs package.

composeStories will process the component's stories you specify, compose each of them with the necessary annotations, and return an object containing the composed stories.

By default, the composed story will render the component with the args that are defined in the story. You can also pass any props to the component in your test and those props will override the values passed in the story's args.

Type: CSF file exports

Specifies which component's stories you want to compose. Pass the full set of exports from the CSF file (not the default export!). E.g. import * as stories from './Button.stories'

Type: ProjectAnnotation | ProjectAnnotation[]

Specifies the project annotations to be applied to the composed stories.

This parameter is provided for convenience. You should likely use setProjectAnnotations instead. Details about the ProjectAnnotation type can be found in that function's projectAnnotations parameter.

This parameter can be used to override the project annotations applied via setProjectAnnotations.

Type: Record<string, ComposedStoryFn>

An object where the keys are the names of the stories and the values are the composed stories.

Additionally, the composed story will have the following properties:

You can use composeStory if you wish to compose a single story for a component.

Specifies which story you want to compose.

The default export from the stories file containing the story.

Type: ProjectAnnotation | ProjectAnnotation[]

Specifies the project annotations to be applied to the composed story.

This parameter is provided for convenience. You should likely use setProjectAnnotations instead. Details about the ProjectAnnotation type can be found in that function's projectAnnotations parameter.

This parameter can be used to override the project annotations applied via setProjectAnnotations.

You probably don't need this. Because composeStory accepts a single story, it does not have access to the name of that story's export in the file (like composeStories does). If you must ensure unique story names in your tests and you cannot use composeStories, you can pass the name of the story's export here.

Type: ComposedStoryFn

A single composed story.

This API should be called once, before the tests run, typically in a setup file. This will make sure that whenever composeStories or composeStory are called, the project annotations are taken into account as well.

These are the configurations needed in the setup file:

Sometimes a story can require an addon's decorator or loader to render properly. For example, an addon can apply a decorator that wraps your story in the necessary router context. In this case, you must include that addon's preview export in the project annotations set. See addonAnnotations in the example above.

Note: If the addon doesn't automatically apply the decorator or loader itself, but instead exports them for you to apply manually in .storybook/preview.* (e.g. using withThemeFromJSXProvider from @storybook/addon-themes), then you do not need to do anything else. They are already included in the previewAnnotations in the example above.

If you need to configure Testing Library's render or use a different render function, please let us know in this discussion so we can learn more about your needs.

Type: ProjectAnnotation | ProjectAnnotation[]

A set of project annotations (those defined in .storybook/preview.*) or an array of sets of project annotations, which will be applied to all composed stories.

Annotations are the metadata applied to a story, like args, decorators, loaders, and play functions. They can be defined for a specific story, all stories for a component, or all stories in the project.

To preview your stories in Storybook, Storybook runs a story pipeline, which includes applying project annotations, loading data, rendering the story, and playing interactions. This is a simplified version of the pipeline:

When you want to reuse a story in a different environment, however, it's crucial to understand that all these steps make a story. The portable stories API provides you with the mechanism to recreate that story pipeline in your external environment:

Annotations come from the story itself, that story's component, and the project. The project-level annotations are those defined in your .storybook/preview.* file and by addons you're using. In portable stories, these annotations are not applied automatically — you must apply them yourself.

👉 For this, you use the setProjectAnnotations API.

The story is prepared by running composeStories or composeStory. The outcome is a renderable component that represents the render function of the story.

Finally, stories can prepare data they need (e.g. setting up some mocks or fetching data) before rendering by defining loaders, beforeEach or by having all the story code in the play function when using the mount. In portable stories, all of these steps will be executed when you call the run method of the composed story.

👉 For this, you use the composeStories or composeStory API. The composed story will return a run method to be called.

If your play function contains assertions (e.g. expect calls), your test will fail when those assertions fail.

If your stories behave differently based on globals (e.g. rendering text in English or Spanish), you can define those global values in portable stories by overriding project annotations when composing a story:

**Examples:**

Example 1 (javascript):
```javascript
import { test, expect } from 'vitest';
import { screen } from '@testing-library/react';
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import { composeStories } from '@storybook/your-framework';
 
// Import all stories and the component annotations from the stories file
import * as stories from './Button.stories';
 
// Every component that is returned maps 1:1 with the stories,
// but they already contain all annotations from story, meta, and project levels
const { Primary, Secondary } = composeStories(stories);
 
test('renders primary button with default args', async () => {
  await Primary.run();
  const buttonElement = screen.getByText('Text coming from args in stories file!');
  expect(buttonElement).not.toBeNull();
});
 
test('renders primary button with overridden props', async () => {
  // You can override props by passing them in the context argument of the run function
  await Primary.run({ args: { ...Primary.args, children: 'Hello world' } });
  const buttonElement = screen.getByText(/Hello world/i);
  expect(buttonElement).not.toBeNull();
});
```

Example 2 (typescript):
```typescript
(
  csfExports: CSF file exports,
  projectAnnotations?: ProjectAnnotations
) => Record<string, ComposedStoryFn>
```

Example 3 (javascript):
```javascript
import { vi, test, expect } from 'vitest';
import { screen } from '@testing-library/react';
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import { composeStory } from '@storybook/your-framework';
 
import meta, { Primary as PrimaryStory } from './Button.stories';
 
// Returns a story which already contains all annotations from story, meta and global levels
const Primary = composeStory(PrimaryStory, meta);
 
test('renders primary button with default args', async () => {
  await Primary.run();
 
  const buttonElement = screen.getByText('Text coming from args in stories file!');
  expect(buttonElement).not.toBeNull();
});
 
test('renders primary button with overridden props', async () => {
  await Primary.run({ args: { ...Primary.args, label: 'Hello world' } });
 
  const buttonElement = screen.getByText(/Hello world/i);
  expect(buttonElement).not.toBeNull();
});
```

Example 4 (scala):
```scala
(
  story: Story export,
  componentAnnotations: Meta,
  projectAnnotations?: ProjectAnnotations,
  exportsName?: string
) => ComposedStoryFn
```

---

## previewBody | Storybook docs

**URL:** https://storybook.js.org/docs/api/main-config/main-config-preview-body

**Contents:**
- previewBody

Parent: main.js|ts configuration

Type: (body: string) => string

Programmatically adjust the preview <body> of your Storybook. Most often used by addon authors.

If you don't need to programmatically adjust the preview body, you can add scripts and styles to preview-body.html instead.

For example, you can conditionally add scripts or styles, depending on the environment:

**Examples:**

Example 1 (jsx):
```jsx
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  previewBody: (body) => `
    ${body}
    ${
      process.env.ANALYTICS_ID ? '<script src="https://cdn.example.com/analytics.js"></script>' : ''
    }
  `,
};
 
export default config;
```

---

## previewBody | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/main-config/main-config-preview-body

**Contents:**
- previewBody

Parent: main.js|ts configuration

Type: (body: string) => string

Programmatically adjust the preview <body> of your Storybook. Most often used by addon authors.

If you don't need to programmatically adjust the preview body, you can add scripts and styles to preview-body.html instead.

For example, you can conditionally add scripts or styles, depending on the environment:

**Examples:**

Example 1 (jsx):
```jsx
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  previewBody: (body) => `
    ${body}
    ${
      process.env.ANALYTICS_ID ? '<script src="https://cdn.example.com/analytics.js"></script>' : ''
    }
  `,
};
 
export default config;
```

---

## Primary | Storybook docs

**URL:** https://storybook.js.org/docs/api/doc-blocks/doc-block-primary

**Contents:**
- Primary
- Primary
  - of

The Primary block displays the primary (first defined in the stories file) story, in a Story block. It is typically rendered immediately under the title in a docs entry.

Primary is configured with the following props:

Type: CSF file exports

Specifies which CSF file is used to find the first story, which is then rendered by this block. Pass the full set of exports from the CSF file (not the default export!).

**Examples:**

Example 1 (jsx):
```jsx
import { Meta, Primary } from '@storybook/addon-docs/blocks';
import * as ButtonStories from './Button.stories';
 
<Meta of={ButtonStories} />
 
<Primary />
```

Example 2 (sql):
```sql
import { Primary } from '@storybook/addon-docs/blocks';
```

---

## Builder API | Storybook docs

**URL:** https://storybook.js.org/docs/builders/builder-api

**Contents:**
- Builder API
- How do builders work?
- Builder API
- Implementation
  - Import stories
  - Provide configuration options
  - Handle preview.js exports
  - MDX support
  - Generate source code snippets
  - Generate a static build

Storybook is architected to support multiple builders, including Webpack, Vite, and ESBuild. The builder API is the set of interfaces you can use to add a new builder to Storybook.

In Storybook, a builder is responsible for compiling your components and stories into JS bundles that run in the browser. A builder also provides a development server for interactive development and a production mode for optimized bundles.

To opt into a builder, the user must add it as a dependency and then edit their configuration file (.storybook/main.js) to enable it. For example, with the Vite builder:

In Storybook, every builder must implement the following API, exposing the following configuration options and entry points:

In development mode, the start API call is responsible for initializing the development server to monitor the file system for changes (for example, components and stories) then execute a hot module reload in the browser. It also provides a bail function to allow the running process to end gracefully, either via user input or error.

In production, the build API call is responsible for generating a static Storybook build, storing it by default in the storybook-static directory if no additional configuration is provided. The generated output should contain everything the user needs to view its Storybook by opening either the index.html or iframe.html in a browser with no other processes running.

Under the hood, a builder is responsible for serving/building the preview iframe, which has its own set of requirements. To fully support Storybook, including the essential features that ship with Storybook, it must consider the following.

The stories configuration field enables story loading in Storybook. It defines an array of file globs containing the physical location of the component's stories. The builder must be able to load those files and monitor them for changes and update the UI accordingly.

By default, Storybook's configuration is handled in a dedicated file (storybook/main.js|ts), giving the user the option to customize it to suit its needs. The builder should also provide its own configuration support through additional fields or some other builder-appropriate mechanism. For example:

The preview.js configuration file allows users to control how the story renders in the UI. This is provided via the decorators named export. When Storybook starts, it converts these named exports into internal API calls via virtual module entry, for example, addDecorator(). The builder must also provide a similar implementation. For example:

Storybook's Docs includes the ability to author stories/documentation in MDX using a Webpack loader. The builder must also know how to interpret MDX and invoke Storybook's special extensions. For example:

Storybook annotates components and stories with additional metadata related to their inputs to automatically generate interactive controls and documentation. Currently, this is provided via Webpack loaders/plugins. The builder must re-implement this to support those features.

One of Storybook's core features it's the ability to generate a static build that can be published to a web hosting service. The builder must also be able to provide a similar mechanism. For example:

By default, when Storybook starts in development mode, it relies on its internal development server. The builder needs to be able to integrate with it. For example:

The builder must provide a way to stop the development server once the process terminates; this can be via user input or error. For example:

While running in development mode, the builder's development server must be able to reload the page once a change happens, either in a story, component, or helper function.

This area is under rapid development, and the associated documentation is still in progress and subject to change. If you are interested in creating a builder, you can learn more about implementing a builder in Storybook by checking the source code for Vite, Webpack, or Modern Web's dev-server-storybook. When you're ready, open an RFC to discuss your proposal with the Storybook community and maintainers.

Learn more about builders

**Examples:**

Example 1 (elixir):
```elixir
npm install @storybook/builder-vite --save-dev
```

Example 2 (python):
```python
// Replace your-framework with the framework you are using (e.g., react-vite, nextjs-vite, vue3-vite, etc.)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  core: {
    builder: '@storybook/builder-vite', // 👈 The builder enabled here.
  },
};
 
export default config;
```

Example 3 (typescript):
```typescript
export interface Builder<Config, BuilderStats extends Stats = Stats> {
  getConfig: (options: Options) => Promise<Config>;
  start: (args: {
    options: Options;
    startTime: ReturnType<typeof process.hrtime>;
    router: ServerApp;
    server: HttpServer;
    channel: ServerChannel;
  }) => Promise<void | {
    stats?: BuilderStats;
    totalTime: ReturnType<typeof process.hrtime>;
    bail: (e?: Error) => Promise<void>;
  }>;
  build: (arg: {
    options: Options;
    startTime: ReturnType<typeof process.hrtime>;
  }) => Promise<void | BuilderStats>;
  bail: (e?: Error) => Promise<void>;
  corePresets?: string[];
  overridePresets?: string[];
}
```

Example 4 (javascript):
```javascript
import { stringifyProcessEnvs } from './envs';
import { getOptimizeDeps } from './optimizeDeps';
import { commonConfig } from './vite-config';
 
import type { EnvsRaw, ExtendedOptions } from './types';
 
export async function createViteServer(options: ExtendedOptions, devServer: Server) {
  const { port, presets } = options;
 
  // Defines the baseline config.
  const baseConfig = await commonConfig(options, 'development');
  const defaultConfig = {
    ...baseConfig,
    server: {
      middlewareMode: true,
      hmr: {
        port,
        server: devServer,
      },
      fs: {
        strict: true,
      },
    },
    optimizeDeps: await getOptimizeDeps(baseConfig, options),
  };
 
  const finalConfig = await presets.apply('viteFinal', defaultConfig, options);
 
  const envsRaw = await presets.apply<Promise<EnvsRaw>>('env');
 
  // Remainder implementation
}
```

---

## useOf | Storybook docs

**URL:** https://storybook.js.org/docs/api/doc-blocks/doc-block-useof

**Contents:**
- useOf
- useOf
  - Type
  - Parameters
    - moduleExportOrType
    - validTypes
  - Return
    - EnhancedResolvedModuleExportType['type'] === 'story'
    - EnhancedResolvedModuleExportType['type'] === 'meta'
    - EnhancedResolvedModuleExportType['type'] === 'component'

The default blocks supplied by Storybook do not fit all use cases, so you might want to write your own blocks.

If your own doc blocks need to interface with annotations from Storybook—that is stories, meta or components—you can use the useOf hook. Pass in a module export of a story, meta, or component and it will return its annotated form (with applied parameters, args, loaders, decorators, play function) that you can then use for anything you like. In fact, most of the existing blocks like Description and Canvas use useOf under the hood.

Here’s an example of how theuseOf hook could be used to create a custom block that displays the name of the story:

Type: ModuleExport | 'story' | 'meta' | 'component'

Provides the story export, meta export, component export, or CSF file exports from which you get annotations.

When the custom block is in an attached doc, it’s also possible to get the primary (first) story, meta, or component by passing in a string instead. This is useful as a fallback, so the of prop can be omitted in your block. The most common pattern is using this as useOf(props.of || 'story') which will fall back to the primary story if no of prop is defined.

Type: Array<'story' | 'meta' | 'component'>

Optionally specify an array of valid types that your block accepts. Passing anything other than the valid type(s) will result in an error. For example, the Canvas block uses useOf(of, ['story']), which ensures it only accepts a reference to a story, not a meta or component.

The return value depends on the matched type:

Type: { type: 'story', story: PreparedStory }

For stories, annotated stories are returned as is. They are prepared, meaning that they are already merged with project and meta annotations.

Type: { type: 'meta', csfFile: CSFFile, preparedMeta: PreparedMeta }

For meta, the parsed CSF file is returned, along with prepared annotated meta. That is, project annotations merged with meta annotations, but no story annotations.

Type: { type: 'component', component: Component, projectAnnotations: NormalizedProjectAnnotations }

For components, the component is returned along with project annotations; no meta or story annotations.

Note that it’s often impossible for the hook to determine if a component is passed in or any other object, so it behaves like an unknown type as well.

**Examples:**

Example 1 (javascript):
```javascript
import { useOf } from '@storybook/addon-docs/blocks';
 
/**
 * A block that displays the story name or title from the of prop
 * - if a story reference is passed, it renders the story name
 * - if a meta reference is passed, it renders the stories' title
 * - if nothing is passed, it defaults to the primary story
 */
export const StoryName = ({ of }) => {
  const resolvedOf = useOf(of || 'story', ['story', 'meta']);
  switch (resolvedOf.type) {
    case 'story': {
      return <h1>{resolvedOf.story.name}</h1>;
    }
    case 'meta': {
      return <h1>{resolvedOf.preparedMeta.title}</h1>;
    }
  }
  return null;
};
```

Example 2 (jsx):
```jsx
import { Meta } from '@storybook/addon-docs/blocks';
import { StoryName } from '../.storybook/blocks/StoryName';
import * as ButtonStories from './Button.stories';
 
<Meta of={ButtonStories} />
 
{/* Renders "Secondary" */}
<StoryName of={ButtonStories.Secondary} />
 
{/* Renders "Primary" */}
<StoryName />
 
{/* Renders "Button" */}
<StoryName of={ButtonStories} />
```

Example 3 (scala):
```scala
(
  moduleExportOrType: ModuleExport | 'story' | 'meta' | 'component',
  validTypes?: Array<'story' | 'meta' | 'component'>,
) => EnhancedResolvedModuleExportType;
```

---

## swc | Storybook docs

**URL:** https://storybook.js.org/docs/api/main-config/main-config-swc

**Contents:**
- swc
- SWC.Options
- Options

Parent: main.js|ts configuration

Type: (config: swc.Options, options: Options) => swc.Options | Promise<swc.Options>

Customize Storybook's SWC setup for Webpack-based projects enabled via the @storybook/addon-webpack5-compiler-swc addon based on the supported frameworks, except Angular, Create React App, Ember.js and Next.js.

The options provided by SWC are only applicable if you've enabled the @storybook/addon-webpack5-compiler-swc addon.

Type: { configType?: 'DEVELOPMENT' | 'PRODUCTION' }

There are other options that are difficult to document here. Please introspect the type definition for more information.

**Examples:**

Example 1 (lua):
```lua
import type { Options } from '@swc/core';
 
// Replace your-framework with the webpack-based framework you are using (e.g., react-webpack5)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: {
    name: '@storybook/your-framework',
    options: {},
  },
  swc: (config: Options, options): Options => {
    return {
      ...config,
      // Apply your custom SWC configuration
    };
  },
};
 
export default config;
```

---

## addons | Storybook docs

**URL:** https://storybook.js.org/docs/api/main-config/main-config-addons

**Contents:**
- addons

Parent: main.js|ts configuration

Type: (string | { name: string; options?: AddonOptions })[]

Registers the addons loaded by Storybook.

For each addon's available options, see their respective documentation.

**Examples:**

Example 1 (json):
```json
import { fileURLToPath } from 'node:url';
 
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    {
      name: '@storybook/addon-styling-webpack',
      options: {
        rules: [
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  implementation: fileURLToPath(import.meta.resolve('postcss')),
                },
              },
            ],
          },
        ],
      },
    },
  ],
};
 
export default config;
```

---

## Builder API | Storybook docs

**URL:** https://storybook.js.org/docs/8/builders/builder-api

**Contents:**
- Builder API
- How do builders work?
- Builder API
- Implementation
  - Import stories
  - Provide configuration options
  - Handle preview.js exports
  - MDX support
  - Generate source code snippets
  - Generate a static build

Storybook is architected to support multiple builders, including Webpack, Vite, and ESBuild. The builder API is the set of interfaces you can use to add a new builder to Storybook.

In Storybook, a builder is responsible for compiling your components and stories into JS bundles that run in the browser. A builder also provides a development server for interactive development and a production mode for optimized bundles.

To opt into a builder, the user must add it as a dependency and then edit their configuration file (.storybook/main.js) to enable it. For example, with the Vite builder:

In Storybook, every builder must implement the following API, exposing the following configuration options and entry points:

In development mode, the start API call is responsible for initializing the development server to monitor the file system for changes (for example, components and stories) then execute a hot module reload in the browser. It also provides a bail function to allow the running process to end gracefully, either via user input or error.

In production, the build API call is responsible for generating a static Storybook build, storing it by default in the storybook-static directory if no additional configuration is provided. The generated output should contain everything the user needs to view its Storybook by opening either the index.html or iframe.html in a browser with no other processes running.

Under the hood, a builder is responsible for serving/building the preview iframe, which has its own set of requirements. To fully support Storybook, including the Essential addons that ship with Storybook, it must consider the following.

The stories configuration field enables story loading in Storybook. It defines an array of file globs containing the physical location of the component's stories. The builder must be able to load those files and monitor them for changes and update the UI accordingly.

By default, Storybook's configuration is handled in a dedicated file (storybook/main.js|ts), giving the user the option to customize it to suit its needs. The builder should also provide its own configuration support through additional fields or some other builder-appropriate mechanism. For example:

The preview.js configuration file allows users to control how the story renders in the UI. This is provided via the decorators named export. When Storybook starts, it converts these named exports into internal API calls via virtual module entry, for example, addDecorator(). The builder must also provide a similar implementation. For example:

Storybook's Docs includes the ability to author stories/documentation in MDX using a Webpack loader. The builder must also know how to interpret MDX and invoke Storybook's special extensions. For example:

Storybook annotates components and stories with additional metadata related to their inputs to automatically generate interactive controls and documentation. Currently, this is provided via Webpack loaders/plugins. The builder must re-implement this to support those features.

One of Storybook's core features it's the ability to generate a static build that can be published to a web hosting service. The builder must also be able to provide a similar mechanism. For example:

By default, when Storybook starts in development mode, it relies on its internal development server. The builder needs to be able to integrate with it. For example:

The builder must provide a way to stop the development server once the process terminates; this can be via user input or error. For example:

While running in development mode, the builder's development server must be able to reload the page once a change happens, either in a story, component, or helper function.

This area is under rapid development, and the associated documentation is still in progress and subject to change. If you are interested in creating a builder, you can learn more about implementing a builder in Storybook by checking the source code for Vite, Webpack, or Modern Web's dev-server-storybook. When you're ready, open an RFC to discuss your proposal with the Storybook community and maintainers.

Learn more about builders

**Examples:**

Example 1 (elixir):
```elixir
npm install @storybook/builder-vite --save-dev
```

Example 2 (vue):
```vue
export default {
  stories: ['../src/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  core: {
    builder: '@storybook/builder-vite', // 👈 The builder enabled here.
  },
};
```

Example 3 (typescript):
```typescript
export interface Builder<Config, Stats> {
  start: (args: {
    options: Options;
    startTime: ReturnType<typeof process.hrtime>;
    router: Router;
    server: Server;
  }) => Promise<void | {
    stats?: Stats;
    totalTime: ReturnType<typeof process.hrtime>;
    bail: (e?: Error) => Promise<void>;
  }>;
  build: (arg: {
    options: Options;
    startTime: ReturnType<typeof process.hrtime>;
  }) => Promise<void | Stats>;
  bail: (e?: Error) => Promise<void>;
  getConfig: (options: Options) => Promise<Config>;
  corePresets?: string[];
  overridePresets?: string[];
}
```

Example 4 (javascript):
```javascript
import { stringifyProcessEnvs } from './envs';
import { getOptimizeDeps } from './optimizeDeps';
import { commonConfig } from './vite-config';
 
import type { EnvsRaw, ExtendedOptions } from './types';
 
export async function createViteServer(options: ExtendedOptions, devServer: Server) {
  const { port, presets } = options;
 
  // Defines the baseline config.
  const baseConfig = await commonConfig(options, 'development');
  const defaultConfig = {
    ...baseConfig,
    server: {
      middlewareMode: true,
      hmr: {
        port,
        server: devServer,
      },
      fs: {
        strict: true,
      },
    },
    optimizeDeps: await getOptimizeDeps(baseConfig, options),
  };
 
  const finalConfig = await presets.apply('viteFinal', defaultConfig, options);
 
  const envsRaw = await presets.apply<Promise<EnvsRaw>>('env');
 
  // Remainder implementation
}
```

---

## CLI options | Storybook docs

**URL:** https://storybook.js.org/docs/api/cli-options

**Contents:**
- CLI options
- CLI commands
  - dev
  - build
  - init
  - add
  - remove
  - upgrade
  - migrate
  - automigrate

The Storybook command line interface (CLI) is the main tool you use to build and develop Storybook.

Storybook collects completely anonymous data to help us improve user experience. Participation is optional, and you may opt-out if you'd not like to share any information.

All of the following documentation is available in the CLI by running storybook --help.

Passing options to these commands works slightly differently if you're using npm instead of Yarn. You must prefix all of your options with --. For example, npm run storybook build -- -o ./path/to/build --quiet.

Compiles and serves a development build of your Storybook that reflects your source code changes in the browser in real-time. It should be run from the root of your project.

With the release of Storybook 8, the -s CLI flag was removed. We recommend using the static directory instead if you need to serve static files.

Compiles your Storybook instance so it can be deployed. It should be run from the root of your project.

We recommend create-storybook for new projects. The init command will remain available for backwards compatibility.

Installs and initializes the specified version (e.g., @latest, @8, @next) of Storybook into your project. If no version is specified, the latest version is installed. Read more in the installation guide.

For example, storybook@8.4 init will install Storybook 8.4 into your project.

Installs a Storybook addon and configures your project for it. Read more in the addon installation guide.

Deletes a Storybook addon from your project. Read more in the addon installation guide.

Upgrades your Storybook instance to the specified version (e.g., @latest, @8, @next). Read more in the upgrade guide.

For example, storybook@latest upgrade --dry-run will perform a dry run (no actual changes) of upgrading your project to the latest version of Storybook.

Runs the provided codemod to ensure your Storybook project is compatible with the specified version. Read more in the migration guide.

The command requires the codemod name (e.g., csf-2-to-3) as an argument to apply the necessary changes to your project. You can find the list of available codemods by running storybook migrate --list.

For example, storybook@latest migrate csf-2-to-3 --dry-run, checks your project to verify if the codemod can be applied without making any changes, providing you with a report of which files would be affected.

Perform standard configuration checks to determine if your Storybook project can be automatically migrated to the specified version. Read more in the migration guide.

For example, storybook@latest automigrate --dry-run scans your project for potential migrations that can be applied automatically without making any changes.

Performs a health check on your Storybook project for common issues (e.g., duplicate dependencies, incompatible addons or mismatched versions) and provides suggestions on how to fix them. Applicable when upgrading Storybook versions.

Helpers for AI agents. The ai command exposes subcommands that generate AI-friendly instructions for automating Storybook tasks. See the agentic setup docs for a full walkthrough.

Generates a detailed, project-aware Markdown prompt that instructs an AI agent to configure Storybook in your project and write initial stories for real components. The prompt is built from your detected Storybook configuration (framework, renderer, builder, language, addons) and covers analyzing the codebase, configuring the preview, mocking side effects, writing stories, and verifying them with Vitest.

storybook ai setup is currently only available for projects using the React renderer with the Vite builder.

When run without --output, the generated prompt is printed to stdout. This is how AI agents typically consume it, by running the command directly and reading the result. When run with --output, the prompt is written to the given file path so you can paste or attach it to an agent that doesn't have shell access.

Reports useful debugging information about your environment. Helpful in providing information when opening an issue or a discussion.

Build an index.json that lists all stories and docs entries in your Storybook.

Generates a local sandbox project using the specified version (e.g., @latest, @8, @next) for testing Storybook features based on the list of supported frameworks. Useful for reproducing bugs when opening an issue or a discussion.

For example, storybook@next sandbox will generated sandboxes using the newest pre-release version of Storybook.

The framework-filter argument is optional and can filter the list of available frameworks. For example, storybook@next sandbox react will only offer to generate React-based sandboxes.

If you're looking for a hosted version of the available sandboxes, see storybook.new.

To streamline the process of creating a new Storybook project, a separate CLI called create-storybook is provided. Package managers such as npm, pnpm, and Yarn will execute this command when running create storybook. You can specify a version (e.g., @latest, @8, @next) or it will default to the latest version. Read more in the installation guide.

For example, create storybook@8.6 will install Storybook 8.6 into your project.

**Examples:**

Example 1 (unknown):
```unknown
storybook dev [options]
```

Example 2 (unknown):
```unknown
storybook build [options]
```

Example 3 (elixir):
```elixir
storybook[@version] init [options]
```

Example 4 (unknown):
```unknown
storybook add [addon] [options]
```

---

## Stories | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/doc-blocks/doc-block-stories

**Contents:**
- Stories
- Stories
  - includePrimary
  - title

The Stories block renders the full collection of stories in a stories file.

Stories is configured with the following props:

Determines if the collection of stories includes the primary (first) story.

If a stories file contains only one story and includePrimary={true}, the Stories block will render nothing to avoid a potentially confusing situation.

Sets the heading content preceding the collection of stories.

**Examples:**

Example 1 (jsx):
```jsx
import { Meta, Stories } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';
 
<Meta of={ButtonStories} />
 
<Stories />
```

Example 2 (sql):
```sql
import { Stories } from '@storybook/blocks';
```

---

## Frameworks | Storybook docs

**URL:** https://storybook.js.org/docs/8/api/new-frameworks

**Contents:**
- Frameworks
- Scaffolding a new framework
- Framework architecture
- Configuring the server
  - Package structure
  - Server options
- Configuring the client
  - Renderable objects
  - Render function
  - Package structure

Storybook is architected to support diverse web frameworks, including React, Vue, Angular, Web Components, Svelte, and over a dozen others. This guide helps you get started on adding new framework support for Storybook.

The first thing to do is to scaffold your framework support in its own repo.

We recommend adopting the same project structure as the Storybook monorepo. That structure contains the framework package (app/<framework>) and an example app (examples/<framework>-kitchen-sink) as well as other associated documentation and configuration as needed.

It may seem like a little more hierarchy than what’s necessary. But because the structure mirrors the way Storybook’s monorepo is structured, you can reuse Storybook’s tooling. It also makes it easier to move the framework into the Storybook monorepo later if that is desirable.

We recommend using @storybook/html as a starter framework since it’s the simplest and contains no framework-specific peculiarities. There is a boilerplate to get you started here.

Supporting a new framework in Storybook typically consists of two main aspects:

Configuring the server. In Storybook, the server is the node process that runs when you run storybook dev or storybook build. Configuring the server typically means configuring babel and webpack in framework-specific ways.

Configuring the client. The client is the code that runs in the browser, and configuring it, means providing a framework-specific story rendering function.

Storybook has the concept of presets, which are typically babel/webpack configurations for file loading. If your framework has its own file format (e.g., “.vue”), you might need to transform them into JavaScript files at load time. If you assume every user of your framework needs this, you should add it to the framework. So far, every framework added to Storybook has done it because Storybook’s core configuration is extremely minimal.

It's helpful to understand Storybook's package structure before adding a framework preset. Each framework typically exposes two executables in its package.json:

These scripts pass an options object to @storybook/core/server, a library that abstracts all of Storybook’s framework-independent code.

For example, here’s the boilerplate to start the dev server with storybook dev:

Thus the essence of adding framework presets is just filling in that options object.

As described above, the server options object does the heavy lifting of configuring the server.

Let’s look at the @storybook/vue’s options definition:

The value of the framework option (i.e., ‘vue’) is something that gets passed to addons and allows them to do specific tasks related to your framework.

The essence of this file is the framework presets, and these are standard Storybook presets -- you can look at framework packages in the Storybook monorepo (e.g. React, Vue, Web Components) to see examples of framework-specific customizations.

While developing your custom framework, not maintained by Storybook, you can specify the path to the location file with the frameworkPath key:

You can add a relative path to frameworkPath. Don't forget that they resolve from the Storybook configuration directory (i.e., .storybook) by default.

Make sure the frameworkPath ends up at the dist/client/index.js file within your framework app.

To configure the client, you must provide a framework-specific render function. Before diving into the details, it’s essential to understand how user-written stories relate to what renders on the screen.

Storybook stories are ES6 objects that return a “renderable object.”

Consider the following React story:

In this case, the renderable object is the React element, <Button .../>.

In most other frameworks, the renderable object is actually a plain JavaScript object.

Consider the following hypothetical example:

The design of this “renderable object” is framework-specific and should ideally match the idioms of that framework.

The framework's render function is the entity responsible for converting the renderable object into DOM nodes. It is typically of the form:

On the client side, the key file is src/client/preview.js:

The globals file typically sets up a single global variable that client-side code (such as addon-provided decorators) can refer to if needed to understand which framework it's running in:

The start function abstracts all of Storybook’s framework-independent client-side (browser) code, and it takes the render function we defined above. For examples of render functions, see React, Vue, Angular, and Web Components in the Storybook monorepo.

**Examples:**

Example 1 (json):
```json
{
  "bin": {
    "storybook": "./bin/index.js",
    "build-storybook": "./bin/build.js"
  }
}
```

Example 2 (python):
```python
import { buildDev } from '@storybook/core/server';
 
import options from './options';
 
buildDev(options);
```

Example 3 (vue):
```vue
import { sync } from 'read-pkg-up';
 
export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'vue',
  frameworkPresets: [require.resolve('./framework-preset-vue.js')],
};
```

Example 4 (vue):
```vue
import { sync } from 'read-pkg-up';
 
export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'my-framework',
  frameworkPath: '@my-framework/storybook',
  frameworkPresets: [require.resolve('./framework-preset-my-framework.js')],
};
```

---
