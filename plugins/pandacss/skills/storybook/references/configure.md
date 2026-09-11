# Storybook - Configure

**Pages:** 20

---

## Configure Storybook | Storybook docs

**URL:** https://storybook.js.org/docs/configure/index

**Contents:**
- Configure Storybook
- Configure your Storybook project
- Configure story loading
  - With a configuration object
  - With a directory
  - With a custom implementation
    - Known limitations
- Configure story rendering
- Configure Storybook’s UI

Storybook is configured via a folder called .storybook, which contains various configuration files.

Note that you can change the folder that Storybook uses by setting the -c flag to your storybook dev and storybook build CLI commands.

Storybook's main configuration (i.e., the main.js|ts) defines your Storybook project's behavior, including the location of your stories, the addons you use, feature flags and other project-specific settings. This file should be in the .storybook folder in your project's root directory. You can author this file in either JavaScript or TypeScript. Listed below are the available options and examples of how to use them.

This configuration file is a preset and, as such, has a powerful interface, which can be further customized. Read our documentation on writing presets to learn more.

By default, Storybook will load stories from your project based on a glob (pattern matching string) in .storybook/main.js|ts that matches all files in your project with extension .stories.*. The intention is for you to colocate a story file along with the component it documents.

If you want to use a different naming convention, you can alter the glob using the syntax supported by picomatch.

For example, if you wanted to pull both .md and .js files from the my-project/src/components directory, you could write:

Additionally, you can customize your Storybook configuration to load your stories based on a configuration object. For example, if you wanted to load your stories from a packages/components directory, you could adjust your stories configuration field into the following:

When Storybook starts, it will look for any file containing the stories extension inside the packages/components directory and generate the titles for your stories.

You can also simplify your Storybook configuration and load the stories using a directory. For example, if you want to load all the stories inside a packages/MyStories, you can adjust the configuration as such:

You can also adjust your Storybook configuration and implement custom logic to load your stories. For example, suppose you were working on a project that includes a particular pattern that the conventional ways of loading stories could not solve. In that case, you could adjust your configuration as follows:

Because of the way stories are currently indexed in Storybook, loading stories on demand has a couple of minor limitations at the moment:

To control the way stories are rendered and add global decorators and parameters, create a .storybook/preview.js file. This is loaded in the Canvas UI, the “preview” iframe that renders your components in isolation. Use preview.js for global code (such as CSS imports or JavaScript mocks) that applies to all stories.

The preview.js file can be an ES module and export the following keys:

If you’re looking to change how to order your stories, read about sorting stories.

To control the behavior of Storybook’s UI (the “manager”), you can create a .storybook/manager.js file.

This file does not have a specific API but is the place to set UI options and to configure Storybook’s theme.

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

Example 2 (unknown):
```unknown
•
└── components
    ├── Button.js
    └── Button.stories.js
```

Example 3 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../my-project/src/components/*.@(js|md)'],
};
 
export default config;
```

Example 4 (json):
```json
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: [
    {
      // 👇 Sets the directory containing your stories
      directory: '../packages/components',
      // 👇 Storybook will load all files that match this glob
      files: '*.stories.*',
      // 👇 Used when generating automatic titles for your stories
      titlePrefix: 'MyComponents',
    },
  ],
};
 
export default config;
```

---

## Story rendering | Storybook docs

**URL:** https://storybook.js.org/docs/configure/story-rendering

**Contents:**
- Story rendering
- Running code for every story
- Adding to <head>
- Adding to <body>

In Storybook, your stories render in a particular “preview” iframe (also called the Canvas) inside the larger Storybook web application. The JavaScript build configuration of the preview is controlled by a builder config, but you also may want to run some code for every story or directly control the rendered HTML to help your stories render correctly.

Code executed in the preview file (.storybook/preview.ts|tsx) runs for every story in your Storybook. This is useful for setting up global styles, initializing libraries, or anything else required to render your components.

Here's an example of how you might use the preview file to initialize a library that must run before your components render:

If you need to add extra elements to the head of the preview iframe, for instance, to load static stylesheets, font files, or similar, you can create a file called .storybook/preview-head.html and add tags like this:

Storybook will inject these tags into the preview iframe where your components render, not the Storybook application UI.

However, it's also possible to modify the preview head HTML programmatically using a preset defined in the main.js file. Read the presets documentation for more information.

Sometimes, you may need to add different tags to the <body>. Helpful for adding some custom content roots.

You can accomplish this by creating a file called preview-body.html inside your .storybook directory and adding tags like this:

If using relative sizing in your project (like rem or em), you may update the base font-size by adding a style tag to preview-body.html:

Storybook will inject these tags into the preview iframe where your components render, not the Storybook application UI.

Just like how you have the ability to customize the preview head HTML tag, you can also follow the same steps to customize the preview body with a preset. To obtain more information on how to do this, refer to the presets documentation.

**Examples:**

Example 1 (lua):
```lua
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Preview } from '@storybook/your-framework';
 
import { initialize } from '../lib/your-library';
 
initialize();
 
const preview: Preview = {
  // ...
};
 
export default preview;
```

Example 2 (jsx):
```jsx
<!--
Pull in static files served from your Static directory or the internet
Example:
`main.js|ts` is configured with staticDirs: ['../public'] and your font is located in the `fonts`
directory inside your `public` directory
-->
<link rel="preload" href="/fonts/my-font.woff2" />
 
<!-- Or you can load custom head-tag JavaScript: -->
<script src="https://use.typekit.net/xxxyyy.js"></script>
<script>
  try {
    Typekit.load();
  } catch (e) {}
</script>
```

Example 3 (jsx):
```jsx
<div id="custom-root"></div>
```

Example 4 (css):
```css
<style>
  html {
    font-size: 15px;
  }
</style>
```

---

## Configure Storybook | Storybook docs

**URL:** https://storybook.js.org/docs/configure/

**Contents:**
- Configure Storybook
- Configure your Storybook project
- Configure story loading
  - With a configuration object
  - With a directory
  - With a custom implementation
    - Known limitations
- Configure story rendering
- Configure Storybook’s UI

Storybook is configured via a folder called .storybook, which contains various configuration files.

Note that you can change the folder that Storybook uses by setting the -c flag to your storybook dev and storybook build CLI commands.

Storybook's main configuration (i.e., the main.js|ts) defines your Storybook project's behavior, including the location of your stories, the addons you use, feature flags and other project-specific settings. This file should be in the .storybook folder in your project's root directory. You can author this file in either JavaScript or TypeScript. Listed below are the available options and examples of how to use them.

This configuration file is a preset and, as such, has a powerful interface, which can be further customized. Read our documentation on writing presets to learn more.

By default, Storybook will load stories from your project based on a glob (pattern matching string) in .storybook/main.js|ts that matches all files in your project with extension .stories.*. The intention is for you to colocate a story file along with the component it documents.

If you want to use a different naming convention, you can alter the glob using the syntax supported by picomatch.

For example, if you wanted to pull both .md and .js files from the my-project/src/components directory, you could write:

Additionally, you can customize your Storybook configuration to load your stories based on a configuration object. For example, if you wanted to load your stories from a packages/components directory, you could adjust your stories configuration field into the following:

When Storybook starts, it will look for any file containing the stories extension inside the packages/components directory and generate the titles for your stories.

You can also simplify your Storybook configuration and load the stories using a directory. For example, if you want to load all the stories inside a packages/MyStories, you can adjust the configuration as such:

You can also adjust your Storybook configuration and implement custom logic to load your stories. For example, suppose you were working on a project that includes a particular pattern that the conventional ways of loading stories could not solve. In that case, you could adjust your configuration as follows:

Because of the way stories are currently indexed in Storybook, loading stories on demand has a couple of minor limitations at the moment:

To control the way stories are rendered and add global decorators and parameters, create a .storybook/preview.js file. This is loaded in the Canvas UI, the “preview” iframe that renders your components in isolation. Use preview.js for global code (such as CSS imports or JavaScript mocks) that applies to all stories.

The preview.js file can be an ES module and export the following keys:

If you’re looking to change how to order your stories, read about sorting stories.

To control the behavior of Storybook’s UI (the “manager”), you can create a .storybook/manager.js file.

This file does not have a specific API but is the place to set UI options and to configure Storybook’s theme.

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

Example 2 (unknown):
```unknown
•
└── components
    ├── Button.js
    └── Button.stories.js
```

Example 3 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../my-project/src/components/*.@(js|md)'],
};
 
export default config;
```

Example 4 (json):
```json
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: [
    {
      // 👇 Sets the directory containing your stories
      directory: '../packages/components',
      // 👇 Storybook will load all files that match this glob
      files: '*.stories.*',
      // 👇 Used when generating automatic titles for your stories
      titlePrefix: 'MyComponents',
    },
  ],
};
 
export default config;
```

---

## Change detection | Storybook docs

**URL:** https://storybook.js.org/docs/configure/user-interface/change-detection

**Contents:**
- Change detection
- Requirements
- Status indicators
- Reviewing changes
- Filtering
- Configuration
- Troubleshooting
  - Workspace sibling packages not tracked in monorepos
  - Many unrelated stories marked as related after a single change
  - Debugging the dependency graph

Change detection is currently in preview.

The experience may change in future releases. We welcome feedback and contributions to help improve this feature.

During development, Storybook monitors your git working tree and the builder's module graph to identify which stories are related to your changes. A Review button at the top of the sidebar announces new and modified stories and lets you filter the tree to just those entries with one click. Status icons appear next to new stories and modified components so you can spot them at a glance.

Change detection is a development-only feature. It is active when running storybook dev and is not available in static builds (storybook build).

The following are required for change detection to work:

If change detection status indicators never appear in your sidebar, check that both requirements above are met and that the feature has not been disabled.

When a change is detected, Storybook shows one of the following status icons next to the relevant stories in the sidebar:

When multiple statuses apply to the same story, the highest priority wins: new > modified > related.

Change detection statuses are displayed alongside test statuses in the sidebar.

A Review button appears between the search bar and the story tree whenever you have at least one new or modified story. The button toggles both the new and modified filters together with one click.

Why are change detection filters off by default?

The heuristics that Storybook uses to determine modified and related stories are designed to be fast and work without any configuration, but they aren't perfect. They can produce false positives (marking stories as modified or related when they aren't), which can be distracting if you have a large repository with many shared dependencies. For example, if you change a widely used utility function, Storybook might mark dozens of stories as related even if the change doesn't actually affect them. To avoid overwhelming you with status icons, Storybook keeps the change detection filters off by default, so you only see these statuses when you choose to review your changes.

For more granular control (e.g., to view only new stories) open the filter menu next to the search bar and check or uncheck the individual statuses.

Change detection is enabled by default. To disable it, set features.changeDetection to false in your Storybook configuration:

If status icons don't appear in your sidebar, check the following:

In a monorepo, when a story imports a workspace sibling package (e.g., @myorg/ui declared as "workspace:*" in package.json), the dependency may not be tracked, meaning changes to that sibling won't trigger a story reload. There are two root causes:

Built output missing at dev time. Workspace packages typically point their exports or main fields to compiled output (./dist/index.js, ./esm/index.mjs, etc.) that doesn't exist until the package is built. Storybook's resolver finds the symlink in node_modules but can't resolve the entry file, so it treats the import as untrackable. Even when the package has been built, its output directories are usually .gitignored, meaning the resolved files are outside the set of watched source files and changes to them would never trigger a story reload.

Per-package tsconfig.json blocking root paths. Many monorepos define workspace path aliases in the root tsconfig.json (e.g., "@myorg/*": ["./packages/@myorg/*/src"]) so that bundlers resolve imports directly to source. If a package has its own tsconfig.json that doesn't extend root, Storybook's resolver finds that file first during its directory walk-up and never sees the root-level path mappings.

To ensure cross-workspace dependencies are tracked correctly, add paths entries to your root tsconfig.json pointing to the source directories of your workspace packages:

Storybook uses these mappings as a fallback when per-file resolution does not find the module.

If a change to one component (e.g., Breadcrumb) causes every story that imports from a shared package (e.g., @myorg/ui) to be marked as related, the package is likely using a barrel file — a single index.ts that re-exports everything.

Storybook performs barrel-aware named import resolution: when a story does import { Button } from '@myorg/ui', Storybook traces through the barrel to find the actual source file (Button.tsx) and tracks that file instead of the barrel itself. This means a change to Breadcrumb.tsx will only mark stories that actually import Breadcrumb as related, not every story that imports from the barrel.

Supported barrel patterns (Storybook resolves these to the underlying source file):

Patterns not fully supported (Storybook falls back to tracking the barrel file itself):

If your barrel uses unsupported patterns, or if you need the most precise tracking possible, you can still import components from their direct source paths:

Whether this is practical depends on the library. Libraries that publish deep-import paths (or that you own and can restructure) support this; libraries that intentionally expose only a barrel do not.

Set the STORYBOOK_CHANGE_DETECTION_DEBUG environment variable to dump a JSON snapshot of the dependency graph when Storybook starts:

The snapshot includes:

This is useful for diagnosing why a specific story is or is not being marked as modified when you change a file.

When you run storybook dev, Storybook builds its own dependency graph by parsing each story file (and its imports) with oxc and resolves module specifiers through the builder's resolve config. The builder ships a small change-detection adapter that forwards file-system events into Storybook so the graph stays current. A git diff provider watches your working tree for changes and runs git diff to identify modified or new files. Storybook then traces each changed file through the dependency graph to find all story files that depend on it — directly or transitively. Stories with the shortest import distance are marked modified; those at greater distance are marked related. New untracked files are marked new.

**Examples:**

Example 1 (python):
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

Example 2 (json):
```json
{
  "compilerOptions": {
    "paths": {
      "@myorg/*": ["./packages/@myorg/*/src"]
    }
  }
}
```

Example 3 (python):
```python
// Instead of the barrel import:
import { Button } from '@myorg/ui';
 
// Import directly from the component's source:
import { Button } from '@myorg/ui/Button';
```

---

## Images, fonts, and assets | Storybook docs

**URL:** https://storybook.js.org/docs/configure/integration/images-and-assets

**Contents:**
- Images, fonts, and assets
- Import assets into stories
- Serving static files via Storybook Configuration
- Reference assets from a CDN
- Absolute versus relative paths
- Referencing Fonts in Stories

Components often rely on images, videos, fonts, and other assets to render as the user expects. There are many ways to use these assets in your story files.

You can import any media assets by importing (or requiring) them. It works out of the box with our default config. But, if you are using a custom webpack config, you’ll need to add the file loader to handle the required files.

Afterward, you can use any asset in your stories:

We recommend serving static files via Storybook to ensure that your components always have the assets they need to load. We recommend this technique for assets that your components often use, like logos, fonts, and icons.

Configure a directory (or a list of directories) where your assets live when starting Storybook. Use the staticDirs configuration element in your main Storybook configuration file (i.e., .storybook/main.js|ts) to specify the directories:

Here ../public is your static directory. Now use it in a component or story like this.

You can also pass a list of directories separated by commas without spaces instead of a single directory.

Or even use a configuration object to define the directories:

When using Vite-based frameworks, additional directories may be copied to your build directory because of Vite's own static asset handling. You can set Vite's publicDir option to false to disable this behavior.

Upload your files to an online CDN and reference them. In this example, we’re using a placeholder image service.

Sometimes, you may want to deploy your Storybook into a subpath, like https://example.com/storybook.

In this case, you need to have all your images and media files with relative paths. Otherwise, the browser cannot locate those files.

If you load static content via importing, this is automatic, and you do not have to do anything.

Suppose you are serving assets in a static directory along with your Storybook. In that case, you need to use relative paths to load images or use the base element.

After configuring Storybook to serve assets from your static folder, you can reference those assets in Storybook. For example, you can reference and apply a custom font to your stories. To do this, create a preview-head.html file inside the configuration directory (i.e., .storybook) and add a <link /> tag to reference your font.

**Examples:**

Example 1 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import imageFile from './static/image.png';
 
import { MyComponent } from './MyComponent';
 
const meta = {
  component: MyComponent,
} satisfies Meta<typeof MyComponent>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
const image = {
  src: imageFile,
  alt: 'my image',
};
 
export const WithAnImage: Story = {
  render: () => <img src={image.src} alt={image.alt} />,
};
```

Example 2 (python):
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

Example 3 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { MyComponent } from './MyComponent';
 
const meta = {
  component: MyComponent,
} satisfies Meta<typeof MyComponent>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
// Assume image.png is located in the "public" directory.
export const WithAnImage: Story = {
  render: () => <img src="/image.png" alt="my image" />,
};
```

Example 4 (python):
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

---

## Configure and communicate with an addon | Storybook docs

**URL:** https://storybook.js.org/docs/addons/configure-addons

**Contents:**
- Configure and communicate with an addon
- Preset
- Parameters
- Channels

The addon API is designed for customization. It offers addon authors different ways to configure and communicate with their users' Storybook. Let's look at what these are and their suggested use cases.

Presets offload the burden of configuration from the user to the addon. Preset options are global and are accessible from NodeJS. They're ideal for pre-configuring Webpack loaders, Babel plugins, and other library or framework-specific configurations.

For example, many libraries require that the app be wrapped by a Provider which provides data to components down the tree. Presets can describe behavior like adding wrappers automatically, without users having to do any manual configuration. If a user installs an addon that has Presets, the addon can instruct Storybook to wrap all stories in Provider. This allows folks to start using your library with Storybook with a single line of config.

For more on presets, see: Write a preset addon

The mechanism for wrapping each story is referred to as a Storybook decorator. They allow you to augment stories with extra rendering functionality or by providing data.

Parameters are available in the browser and are great for configuring addon behavior globally, at the component level, or at the story level.

For example, the Pseudo States addon uses parameters to enable the various pseudo-states. Users can provide global defaults and then override them at the story level.

Use the useParameter hook to access the parameter values within your addon.

Channels enable two-way communication between the manager and the preview pane, using a NodeJS EventEmitter compatible API. Your addons can plug into specific channels and respond to these events.

For example, Actions captures user events and displays their data in a panel.

Use the useChannel hook to access the channel data within your addon.

For a complete example, check out storybookjs/addon-kit/withRoundTrip.ts

**Examples:**

Example 1 (javascript):
```javascript
export const Hover = {
  render: () => <Button>Label</Button>,
  parameters: { pseudo: { hover: true } },
};
```

---

## Story layout | Storybook docs

**URL:** https://storybook.js.org/docs/configure/story-layout

**Contents:**
- Story layout
- Global layout
- Component layout
- Story layout

The layout parameter allows you to configure how stories are positioned in Storybook's Canvas tab.

You can add the parameter to your ./storybook/preview.js, like so:

In the example above, Storybook will center all stories in the UI. layout accepts these options:

You can also set it at a component level like so:

Or even apply it to specific stories like so:

**Examples:**

Example 1 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Preview } from '@storybook/your-framework';
 
const preview: Preview = {
  parameters: {
    layout: 'centered',
  },
};
 
export default preview;
```

Example 2 (jsx):
```jsx
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
  // Sets the layout parameter component wide.
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Button>;
 
export default meta;
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
 
export const WithLayout: Story = {
  parameters: {
    layout: 'centered',
  },
};
```

---

## TypeScript | Storybook docs

**URL:** https://storybook.js.org/docs/configure/integration/typescript

**Contents:**
- TypeScript
- Configure Storybook with TypeScript
  - Extending the default configuration
- Write stories with TypeScript
  - TypeScript 4.9 support
- Troubleshooting
  - The satisfies operator is not working as expected
  - Storybook doesn't create the required types for external packages
  - Inherited args are missing for components from workspace packages
  - The types are not being generated for my component

Storybook provides an integrated TypeScript experience, including zero-configuration setup and built-in types for APIs, addons, and stories.

Storybook's configuration file (i.e., main.ts) is defined as an ESM module written in TypeScript, providing you with the baseline configuration to support your existing framework while enabling you stricter type-checking and autocompletion in your editor. Below is an abridged configuration file.

See the main configuration API reference for more details and additional properties.

See the Vite builder TypeScript documentation if using @storybook/builder-vite.

Out of the box, Storybook is built to work with a wide range of third-party libraries, enabling you to safely access and document metadata (e.g., props) for your components without any additional configuration. It relies on react-docgen, a fast and highly customizable parser to process TypeScript files to infer the component's metadata and generate types automatically for improved performance and type safety. If you need to customize the default configuration for a specific use case scenario, you can adjust your Storybook configuration file and provide the required options. Listed below are the available options and examples of how to use them.

Additional options are available for the typescript configuration option. See the config.typescript API reference for more information.

Storybook provides zero-config TypeScript support, allowing you to write stories using this language without additional configuration. You can use this format for improved type safety and code completion. For example, if you're testing a Button component, you could do the following in your story file:

The example above uses the power of TypeScript in combination with the exported generic types (Meta and StoryObj) to tell Storybook how to infer the component's metadata and the type of the component's inputs (e.g., props). This can greatly improve the developer experience by letting your IDE show you what properties are injected by Storybook.

Assuming that you're working on a project that uses TypeScript 4.9+, you can update your component stories to use the new satisfies operator to ensure stricter type checking for your component stories. For example:

Now, when you define a story or update an existing one, you'll automatically get notified that you're missing a required arg. However, you're not limited to using the satisfies operator at the component level. If you need, you can also use it at the story level. For example:

Out of the box, Storybook supports the satisfies operator for almost every framework already using TypeScript version 4.9 or higher. However, due to the constraints of the Angular and Web Components framework, you might run into issues when applying this operator for additional type safety. This is primarily due to how both frameworks are currently implemented, making it almost impossible for Storybook to determine if the component property is required. If you encounter this issue, please open up a support request on GitHub Discussions.

If your project relies on a third-party library and the expected types are not being generated, preventing you from accurately documenting your components, you can adjust the reactDocgen configuration option in your Storybook configuration file to use react-docgen-typescript instead and include the required options. For example:

If you're using react-docgen-typescript in a monorepo with npm/yarn/pnpm workspaces, you may find that components imported from a workspace package are missing inherited args (e.g., MUI's ButtonProps), while the same component imported locally works fine.

This happens because the underlying Vite plugin creates a TypeScript program from files matching its include glob (default: **/**.tsx), resolved from the Storybook project's directory. Workspace package files are outside that directory and aren't included in the program, so inherited types can't be resolved.

To fix this, add your workspace package source files to the include option:

Adjust the path (../../packages/ui/src/**/*.tsx) to match your monorepo layout. You might expect that pointing tsconfigPath to a tsconfig that includes your workspace packages would solve this, but tsconfigPath only affects which compiler options are used. It does not change which files are included in the TypeScript program.

If you're working with a React project, type inference is automatically enabled for your components using the react-docgen library for improved build times and type safety. However, you may run into a situation where some options may not work as expected (e.g., Enums, React's forwardRef). This is primarily due to how the react-docgen package is implemented, making it difficult for Storybook to infer the component's metadata and generate types automatically. To solve this, you can update the typescript configuration option in your Storybook configuration file to use react-docgen-typescript instead. For example:

If you're still encountering issues, we recommend reaching out to the community using the default communication channels (e.g., GitHub discussions).

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

Example 2 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  typescript: {
    check: false,
    checkOptions: {},
    skipCompiler: false,
  },
};
 
export default config;
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
 
//👇 Throws a type error if the args don't match the component props
export const Primary: Story = {
  args: {
    primary: true,
  },
};
```

Example 4 (jsx):
```jsx
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
} satisfies Meta<typeof Button>; // 👈 Satisfies operator being used for stricter type checking.
 
export default meta;
```

---

## Features and behavior | Storybook docs

**URL:** https://storybook.js.org/docs/configure/user-interface/features-and-behavior

**Contents:**
- Features and behavior
- Customize the UI
  - Override sidebar visibility
  - Configure the addon panel
  - Configure the toolbar
- Change detection
- Configuring through URL parameters

To control the layout of Storybook’s UI you can use addons.setConfig in your .storybook/manager.js:

The following table details how to use the API values:

The following options are configurable under the sidebar namespace:

The following options are configurable under the toolbar namespace:

The following options are configurable under the layoutCustomisations namespace:

The showSidebar and showToolbar functions let you hide parts of the UI that are essential to Storybook's functionality. If misused, they can make navigation impossible. When hiding the sidebar, ensure the displayed page provides an alternative means of navigation.

Storybook's UI is highly customizable. Its API and configuration options, available via the showSidebar, showPanel and showToolbar functions, allow you to control how the sidebar, addon panel and toolbar elements are displayed. Each function will enable you to include some default behavior and can be overridden to customize the UI to your needs.

The sidebar, present on the left of the screen, contains the search function and navigation menu. Users may show or hide it with a keyboard shortcut. If you want to force the sidebar to be visible or hidden in certain places, you can define a showSidebar function in layoutCustomisations. Below are the available parameters passed to this function and an overview of how to use them.

If you're hiding the sidebar through showSidebar, ensure the displayed page provides an alternative means of navigation.

When viewing a story, Storybook displays the addon panel on the bottom or right of the UI. The panel shows UIs for available addons (e.g., the interactions panel, accessibility tests panel or controls panel). If you want to customize when the addon panel appears, you can use the showPanel function. Listed below are the available options and an overview of how to use them.

By default, Storybook displays a toolbar at the top of the UI, allowing you to access menus from addons (e.g., viewport, background), or custom defined menus. However, if you want to customize the toolbar's behavior, you can use the showToolbar function. Listed below are the available options and an overview of how to use them.

Storybook can show status icons in the sidebar to highlight new and modified stories. See change detection for setup and details.

You can use URL parameters to configure some of the available features:

**Examples:**

Example 1 (sql):
```sql
import { addons, type State } from 'storybook/manager-api';
 
addons.setConfig({
  navSize: 300,
  bottomPanelHeight: 300,
  rightPanelWidth: 300,
  panelPosition: 'bottom',
  enableShortcuts: true,
  showToolbar: true,
  theme: undefined,
  selectedPanel: undefined,
  initialActive: 'sidebar',
  layoutCustomisations: {
    showSidebar(state: State, defaultValue: boolean) {
      return state.storyId === 'landing' ? false : defaultValue;
    },
    showToolbar(state: State, defaultValue: boolean) {
      return state.viewMode === 'docs' ? false : defaultValue;
    },
  },
  sidebar: {
    showRoots: false,
    collapsedRoots: ['other'],
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
});
```

Example 2 (sql):
```sql
import { addons, type State } from 'storybook/manager-api';
 
addons.setConfig({
  layoutCustomisations: {
    // Hide the sidebar on the landing page, which has its own nav links to other pages.
    showSidebar(state: State, defaultValue: boolean) {
      if (state.storyId === 'landing' && state.viewMode === 'docs') {
        return false;
      }
 
      return defaultValue;
    },
  },
});
```

Example 3 (swift):
```swift
import { addons, type State } from 'storybook/manager-api';
 
addons.setConfig({
  layoutCustomisations: {
    showPanel(state: State, defaultValue: boolean) {
      const tags = state.index?.[state.storyId]?.tags ?? [];
 
      // Hide the panel on stories designed to showcase multiple variants or usage examples.
      if (tags.includes('showcase') || tags.includes('kitchensink')) {
        return false;
      }
 
      return defaultValue;
    },
  },
});
```

Example 4 (sql):
```sql
import { addons, type State } from 'storybook/manager-api';
 
addons.setConfig({
  layoutCustomisations: {
    // Always hide the toolbar on docs pages, and respect user preferences elsewhere.
    showToolbar(state: State, defaultValue: boolean) {
      if (state.viewMode === 'docs') {
        return false;
      }
 
      return defaultValue;
    },
  },
});
```

---

## Framework support | Storybook docs

**URL:** https://storybook.js.org/docs/configure/integration/frameworks

**Contents:**
- Framework support
- How do frameworks work in Storybook?
- Which frameworks are supported?
  - What about feature support?
- Configure
- Troubleshooting
  - NextJS 13 doesn't work with Storybook
  - My framework doesn't work with Storybook
  - How do I build a Storybook framework?
  - Legacy framework support

Frameworks are packages that auto-configure Storybook to work with most common environment setups. They simplify the setup process and reduce boilerplate by mirroring your framework's conventions to create applications.

You start by installing Storybook into an existing project. Then, it tries to detect the framework you're using and automatically configures Storybook to work with it. That means adding the necessary libraries as dependencies and adjusting the configuration. Finally, starting Storybook will automatically load the framework configuration before loading any existing addons to match your application environment.

Storybook provides support for the leading industry builders and frameworks. However, that doesn't mean you can't use Storybook with other frameworks. Below is a list of currently supported frameworks divided by their builders.

In addition to supporting the most popular frameworks in the industry, Storybook also tries to retain the same level of feature support for each framework, including the addon ecosystem. For more information, see Framework support for a comprehensive list of which features and addons are currently maintained with the community's help.

Every modern web application has unique requirements and relies on various tools and frameworks. By default, with Storybook, you get an out-of-the-box configuration generated to work with most frameworks. However, you can extend your existing configuration file (i.e., ./storybook/main.js|ts|cjs) and provide additional options. Below is an abridged table with available options and examples of configuring Storybook for your framework.

With the release of Next.js version 13, it introduced breaking changes (e.g., TurboPack, Server Components) that are not yet fully supported by Storybook. The Storybook team is working on adding support for these features. In the meantime, you can still use Storybook alongside your Next.js 13 project if you're not relying on them.

Out of the box, most frameworks work seamlessly with Storybook. However, some frameworks (e.g., CRACO) provide their own configuration that Storybook isn't prepared to handle without additional steps, either via addon or integration. To learn more, read our addons guide.

Storybook is a framework-agnostic tool. It can be used with any framework. However, to make it easier for you to get started, we provide instructions that you can use to build your framework. To learn more, read our frameworks guide.

We're deprecating support for several frameworks, including Aurelia, Marionette, Mithril, Rax, and Riot. Nevertheless, we're always looking for help maintaining these frameworks. If you're working with one of them and you want to continue supporting them, visit the dedicated Storybook End-of-Life repository. To learn more about the sunsetting process and view instructions on how to contribute, read our documentation.

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

## Feature support for frameworks | Storybook docs

**URL:** https://storybook.js.org/docs/configure/integration/frameworks-feature-support

**Contents:**
- Feature support for frameworks
- Core frameworks
- Community frameworks
- Deprecated

Storybook integrates with many popular frontend frameworks. We do our best to keep feature parity amongst frameworks, but it’s tricky for our modest team to support every framework.

Below is a comprehensive table of what’s supported in which framework integration. If you’d like a certain feature supported in your framework, we welcome pull requests.

Core frameworks have dedicated maintainers or contributors who are responsible for maintaining the integration. As such, you can use most Storybook features in these frameworks.

Community frameworks have fewer contributors which means they may not be as up to date as core frameworks. If you use one of these frameworks for your job, please consider contributing to its integration with Storybook.

To align the Storybook ecosystem with the current state of frontend development, the following features and addons are now deprecated, no longer maintained, and will be removed in future versions of Storybook

---

## Storybook Addons | Storybook docs

**URL:** https://storybook.js.org/docs/configure/user-interface/storybook-addons

**Contents:**
- Storybook Addons
- Addon features
- Essential, core and community addons

A key strength of Storybook is its extensibility. Use addons to extend and customize Storybook to fit your team’s development workflow.

Addons are integral to the way Storybook works. Many of Storybook's core features are implemented as addons, such as addon-docs.

The most obvious thing addons affect in Storybook is the UI of Storybook itself. Within the UI the toolbar and addons panel are the two chief places addons will appear.

Addons can also hook into the rendering of your story in the preview pane via injecting their own decorators.

Finally, addons can affect the build setup of Storybook by injecting their own webpack configuration to allow the use of other tools in Storybook. Addons that do only this are often referred to as presets.

There are many, many Storybook addons, but they can be roughly categorized into two areas:

---

## Sidebar & URLS | Storybook docs

**URL:** https://storybook.js.org/docs/configure/user-interface/sidebar-and-urls

**Contents:**
- Sidebar & URLS
- Roots
- Permalink to stories
- CSF 3.0 auto-titles
  - Auto-title filename case
  - Auto-title redundant filenames
  - Auto-title prefixes
  - Story Indexers
- Change detection

Storybook’s sidebar lists all your stories grouped by component. When you have many components, you may also wish to group those components. To do so, you can add the / separator to the title of your CSF file, and Storybook will group the stories into groups based on common prefixes:

We recommend using a nesting scheme that mirrors the filesystem path of the components. For example, if you have a file components/modals/Alert.js, name the CSF file components/modals/Alert.stories.js and title it Components/Modals/Alert.

By default, Storybook will treat your top-level nodes as “roots”. Roots are displayed in the UI as “sections” of the hierarchy. Lower level groups will show up as folders:

If you’d prefer to show top-level nodes as folders rather than roots, you can set the sidebar.showRoots option to false in ./storybook/manager.js:

By default, Storybook generates an id for each story based on the component title and the story name. This id in particular is used in the URL for each story, and that URL can serve as a permalink (primarily when you publish your Storybook).

Consider the following story:

Storybook's ID-generation logic will give this the id foo-bar--baz, so the link would be ?path=/story/foo-bar--baz.

It is possible to manually set the story's id, which is helpful if you want to rename stories without breaking permalinks. Suppose you want to change the position in the hierarchy to OtherFoo/Bar and the story name to Moo. Here's how to do that:

Storybook will prioritize the id over the title for ID generation if provided and prioritize the story.name over the export key for display.

Storybook 6.4 introduced CSF 3.0 as an experimental feature, allowing you to write stories more compactly. Suppose you're already using this format to write your stories. In that case, you can omit the title element from the meta (or default export) and allow Storybook automatically infer it based on the file's physical location. For example, given the following configuration and story:

When Storybook loads, the story can show up in the sidebar as components/My Component.

Auto-titles work with explicit titling options like the component's title and the story's name:

Starting with Storybook 6.5, story titles generated automatically no longer rely on Lodash's startCase. Instead, the file name casing is preserved, allowing additional control over the story title. For example, components/My Component will be defined as components/MyComponent.

If you need, you can revert to the previous pattern by adding the following configuration:

In addition to improvements to the story file name casing, a new heuristic was introduced, removing redundant names in case the filename has the same name as the directory name, or if it's called index.stories.js|ts. For example, before components/MyComponent/MyComponent.stories.js was defined as Components/MyComponent/MyComponent in the sidebar. Now it will be defined as Components/MyComponent.

If you need to preserve the naming scheme, you can add the title element to the meta (or default export). For example:

Additionally, if you customize your Storybook to load your stories based on a configuration object, including a titlePrefix, Storybook automatically prefixes all titles to matching stories. For example, assuming you have the following configuration:

When Storybook generates the titles for all matching stories, they'll retain the Custom prefix.

Story Indexers are a set of heuristics used by Storybook to crawl your filesystem based on a given glob pattern searching for matching stories, which is then used to generate an index.json (formerly stories.json) file responsible for populating the sidebar with the necessary information. By default, this heuristic will look for files that contain the following scheme *.stories.@(js|jsx|mjs|ts|tsx).

You can provide your own indexer to include stories with a different naming convention, adjust the automatic title generation beyond a prefix, and many other use cases. For more information, see the Story Indexers API reference.

Storybook can show status icons in the sidebar to highlight new and modified stories. See change detection for setup and details.

**Examples:**

Example 1 (sql):
```sql
import { addons } from 'storybook/manager-api';
 
addons.setConfig({
  sidebar: {
    showRoots: false,
  },
});
```

Example 2 (typescript):
```typescript
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { Foo } from './Foo';
 
const meta = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Foo/Bar',
  component: Foo,
} satisfies Meta<typeof Foo>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Baz: Story = {};
```

Example 3 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { Foo } from './Foo';
 
const meta = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'OtherFoo/Bar',
  component: Foo,
  id: 'Foo/Bar', // Or 'foo-bar' if you prefer
} satisfies Meta<typeof Foo>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Baz: Story = {
  name: 'Insert name here',
};
```

Example 4 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src'],
};
 
export default config;
```

---

## Compiler support | Storybook docs

**URL:** https://storybook.js.org/docs/configure/integration/compilers

**Contents:**
- Compiler support
- SWC
- Babel
  - Configure
  - Working with Create React App
- Troubleshooting
  - The SWC compiler doesn't work with React
  - Babel configuration not working

Javascript compilers are essential in optimizing and transforming code, enhancing performance, and ensuring compatibility across different environments. Storybook provides support for the leading compilers, ensuring lightning-fast build time and execution with SWC or leveraging Babel with its extensive ecosystem of plugins and presets to allow you to use the latest features of the ecosystem with minimal configuration required for your Webpack-based project.

SWC is a fast, highly extensible tool for compiling and bundling modern JavaScript applications. Powered by Rust, it improves performance and reduces build times. Storybook includes a built-in integration with SWC, allowing zero-configuration setup and built-in types for APIs. If you've initialized Storybook in a Webpack-based project with any of the supported frameworks, except Angular, Create React App, Ember.js and Next.js, it will automatically use SWC as its default, providing you with faster loading time.

Support for the SWC builder is currently experimental for Next.js projects, and it's not enabled by default. It requires you to opt in to use it. For more information on configuring SWC with the supported frameworks, see the SWC API documentation.

Babel is a widely adopted JavaScript compiler providing a modular architecture and extensive plugin system to support a wide range of use cases, enabling access to the cutting-edge features of the tooling ecosystem. Storybook provides a seamless integration with Babel, allowing you to share a standard setup between your project and Storybook without any additional configuration.

If you're not using Storybook 7, please reference the previous documentation for guidance on configuring your Babel setup.

By default, Babel provides an opinionated configuration that works for most projects, relying on two distinct methods for configuring projects with the tool:

Storybook relies on an agnostic approach to configuring Babel, enabling you to provide the necessary configuration for your project, and it will use it. Based on the supported frameworks, builders, and addons, it may include minor adjustments to ensure compatibility with Storybook's features.

For custom project configurations such as monorepos, where you have multiple Storybook configurations, creating a .babelrc.json file in your project's current working directory may not be sufficient. In those cases, you can create a babel.config.js file to override Babel's configuration, and Storybook will automatically detect and use it. See the Babel documentation for more information.

If you're working with a project that was initialized with Create React App, Storybook will automatically detect and use the Babel configuration provided by the tool enabled via the @storybook/preset-create-react-app preset, allowing to use Storybook without any additional configuration.

If you have enabled the SWC builder option in a React-based project and you are not explicitly importing React in your jsx|tsx files, it can cause Storybook to fail to load. SWC does not automatically import the jsx-runtime module when using the SWC builder. To resolve this issue, you need to adjust your Storybook configuration file (i.e., .storybook/main.js|ts) and configure the swc option as follows:

Out of the box, Storybook can detect and apply any Babel configuration you provided in your project. However, if you're running into a situation where your configuration is not being used, you configure the BABEL_SHOW_CONFIG_FOR environment variable and set it to the file you want to inspect. For example:

When the command runs, it will output the Babel configuration applied to the file you specified despite showing a transpilation error in the console and preventing Storybook from loading. This is a known issue with Babel unrelated to Storybook, which you address by turning off the environment variable after inspecting the configuration and restarting Storybook.

**Examples:**

Example 1 (csharp):
```csharp
// Replace your-framework with the webpack-based framework you are using (e.g., react-webpack5)
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: {
    name: '@storybook/your-framework',
    options: {},
  },
  swc: (config, options) => ({
    jsc: {
      transform: {
        react: {
          runtime: 'automatic',
        },
      },
    },
  }),
};
 
export default config;
```

Example 2 (unknown):
```unknown
BABEL_SHOW_CONFIG_FOR=.storybook/preview.js yarn storybook
```

---

## Environment variables | Storybook docs

**URL:** https://storybook.js.org/docs/configure/environment-variables

**Contents:**
- Environment variables
- Using .env files
  - With Vite
- Using Storybook configuration
- Using environment variables to choose the browser
- Troubleshooting
  - Environment variables are not working

You can use environment variables in Storybook to change its behavior in different “modes”. If you supply an environment variable prefixed with STORYBOOK_, it will be available in process.env when using Webpack, or import.meta.env when using the Vite builder:

Do not store any secrets (e.g., private API keys) or other types of sensitive information in your Storybook. Environment variables are embedded into the build, meaning anyone can view them by inspecting your files.

Then we can access these environment variables anywhere inside our preview JavaScript code like below:

You can also access these variables in your custom <head>/<body> using the substitution %STORYBOOK_X%, for example: %STORYBOOK_THEME% will become red.

If using the environment variables as attributes or values in JavaScript, you may need to add quotes, as the value will be inserted directly, for example: <link rel="stylesheet" href="%STORYBOOK_STYLE_URL%" />.

You can also use .env files to change Storybook's behavior in different modes. For example, if you add a .env file to your project with the following:

Then you can access this environment variable anywhere, even within your stories:

Out of the box, Storybook provides a Vite builder, which does not output Node.js globals like process.env. To access environment variables in Storybook (e.g., STORYBOOK_, VITE_), you can use import.meta.env. For example:

You can also use specific files for specific modes. Add a .env.development or .env.production to apply different values to your environment variables.

You can also pass these environment variables when you are building your Storybook with build-storybook.

Then they'll be hardcoded to the static version of your Storybook.

Additionally, you can extend your Storybook configuration file (i.e., .storybook/main.js|.ts) and provide a configuration field that you can use to define specific variables (e.g., API URLs). For example:

When Storybook loads, it will enable you to access them in your stories similar as you would do if you were working with an env file:

Storybook allows you to choose the browser you want to preview your stories. Either through a .env file entry or directly in your storybook script.

The table below lists the available options:

By default, Storybook will open a new Chrome window as part of its startup process. If you don't have Chrome installed, make sure to include one of the following options, or set your default browser accordingly.

If you're trying to use framework-specific environment variables (e.g.,VUE_APP_), you may run into issues primarily due to the fact that Storybook and your framework may have specific configurations and may not be able to recognize and use those environment variables. If you run into a similar situation, you may need to adjust your framework configuration to make sure that it can recognize and use those environment variables. For example, if you're working with a Vite-based framework, you can extend the configuration file and enable the envPrefix option. Other frameworks may require a similar approach.

**Examples:**

Example 1 (sass):
```sass
STORYBOOK_THEME=red STORYBOOK_DATA_KEY=12345 npm run storybook
```

Example 2 (javascript):
```javascript
console.log(process.env.STORYBOOK_THEME);
console.log(process.env.STORYBOOK_DATA_KEY);
```

Example 3 (sass):
```sass
STORYBOOK_DATA_KEY=12345
```

Example 4 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { MyComponent } from './MyComponent';
 
const meta = {
  component: MyComponent,
} satisfies Meta<typeof MyComponent>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const ExampleStory: Story = {
  args: {
    propertyA: process.env.STORYBOOK_DATA_KEY,
  },
};
```

---

## Theming | Storybook docs

**URL:** https://storybook.js.org/docs/configure/user-interface/theming

**Contents:**
- Theming
- Global theming
- Theming docs
- Create a theme quickstart
- CSS escape hatches
- MDX component overrides
- Addons and theme creation
- Using the theme for addon authors

Storybook is theme-able using a lightweight theming API.

It's possible to theme Storybook globally.

Storybook includes a set of built-in themes that you can use to customize the appearance of your Storybook UI. The built-in themes are light, dark, and the "normal" theme that matches your preferred color scheme. Unless you specify otherwise, Storybook uses the normal theme by default.

As an example, you can tell Storybook to use the "dark" theme by modifying .storybook/manager.js:

When setting a theme, set a complete theme object. The theme is replaced, not combined.

Storybook Docs uses the same theme system as Storybook’s UI but is themed independently from the main UI. The default theme for Docs is always the "light" theme, regardless of the main UI theme.

Supposing you have a Storybook theme defined for the main UI in .storybook/manager.js:

Here's how you'd specify the same theme for docs in .storybook/preview.js:

Continue to read if you want to learn how to create your theme.

The easiest way to customize Storybook is to generate a new theme using the create() function from storybook/theming. This function includes shorthands for the most common theme variables. Here's how to use it:

Inside your .storybook directory, create a new file called YourTheme.js and add the following:

If you're using brandImage to add your custom logo, you can use any of the most common image formats.

Above, we're creating a new theme that will:

Finally, we'll need to import the theme into Storybook. Create a new file called manager.js in your .storybook directory and add the following:

Now your custom theme will replace Storybook's default theme, and you'll see a similar set of changes in the UI.

Let's take a look at a more complex example. Copy the code below and paste it in .storybook/YourTheme.js.

Above, we're updating the theme with the following changes:

With the new changes introduced, the custom theme should yield a similar result.

Many theme variables are optional, the base property is NOT.

The storybook/theming module is built using TypeScript, which should help create a valid theme for TypeScript users. The types are part of the package itself.

The Storybook theme API is narrow by design. If you want to have fine-grained control over the CSS, all UI and Docs components are tagged with class names to make this possible. Use at your own risk as this is an advanced feature.

To style these elements, insert style tags into:

The same way as you can adjust your preview’s head tag, Storybook allows you to modify the code on the manager's side, through .storybook/manager-head.html. It can be helpful when adding theme styles that target Storybook's HTML, but it comes with a cost as Storybook's inner HTML can change at any time through the release cycle.

If you're using MDX for docs, there's one more level of "themability". MDX allows you to completely override the rendered components from Markdown using a components parameter. It's an advanced usage that we don't officially support in Storybook, but it's a powerful construct if you need it.

Here's how you might insert a custom code renderer for code blocks on the page, in .storybook/preview.js:

You can even override a Storybook block component.

Here's how you might insert a custom <Canvas /> block:

Some addons require specific theme variables that a Storybook user must add. If you share your theme with the community, make sure to support the official API and other popular addons, so your users have a consistent experience.

For example, the popular Actions feature uses react-inspector, which has themes of its own. Supply additional theme variables to style it like so:

Reuse the theme variables above for a native Storybook developer experience. The theming engine relies on emotion, a CSS-in-JS library.

Use the theme variables in object notation:

Or with template literals:

**Examples:**

Example 1 (sql):
```sql
import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';
 
addons.setConfig({
  theme: themes.dark,
});
```

Example 2 (sql):
```sql
import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';
 
addons.setConfig({
  theme: themes.dark,
});
```

Example 3 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Preview } from '@storybook/your-framework';
 
import { themes } from 'storybook/theming';
 
const preview: Preview = {
  parameters: {
    docs: {
      theme: themes.dark,
    },
  },
};
 
export default preview;
```

Example 4 (sql):
```sql
import { create } from 'storybook/theming';
 
export default create({
  base: 'light',
  brandTitle: 'My custom Storybook',
  brandUrl: 'https://example.com',
  brandImage: 'https://storybook.js.org/images/placeholders/350x150.png',
  brandTarget: '_self',
});
```

---

## Styling and CSS | Storybook docs

**URL:** https://storybook.js.org/docs/configure/styling-and-css

**Contents:**
- Styling and CSS
- CSS
  - Import bundled CSS (recommended)
  - Include static CSS
- CSS modules
  - Vite
  - Webpack
- PostCSS
  - Vite
  - Webpack

There are many ways to include CSS in a web application, and correspondingly there are many ways to include CSS in Storybook. Usually, it is best to try and replicate what your application does with styling in Storybook’s configuration.

Storybook supports importing CSS files in a few different ways. Storybook will inject these tags into the preview iframe where your components render, not the Storybook Manager UI. The best way to import CSS depends on your project's configuration and your preferences.

All Storybooks are pre-configured to recognize imports for CSS files. To add global CSS for all your stories, import it in .storybook/preview.ts|tsx. These files will be subject to HMR, so you can see your changes without restarting your Storybook server.

If your component files import their CSS files, this will work too. However, if you're using CSS processor tools like Sass or Postcss, you may need some more configuration.

If you have a global CSS file that you want to include in all your stories, you can import it in .storybook/preview-head.html. However, these files will not be subject to HMR, so you'll need to restart your Storybook server to see your changes.

Vite comes with CSS modules support out-of-the-box. If you have customized the CSS modules configuration in your vite.config.js this will automatically be applied to your Storybook as well. Read more about Vite's CSS modules support.

Storybook recreates your Next.js configuration, so you can use CSS modules in your stories without any extra configuration.

If you're using Webpack and want to use CSS modules, you'll need some extra configuration. We recommend installing @storybook/addon-styling-webpack to help you configure these tools.

Vite comes with PostCSS support out-of-the-box. If you have customized the PostCSS configuration in your vite.config.js this will automatically be applied to your Storybook as well. Read more about Vite's PostCSS support.

Storybook recreates your Next.js configuration, so you can use PostCSS in your stories without any extra configuration.

If you're using Webpack and want to use PostCSS, you'll need some extra configuration. We recommend installing @storybook/addon-styling-webpack to help you configure these tools.

Vite comes with Sass, Less, and Stylus support out-of-the-box. Read more about Vite's CSS Pre-processor support.

Storybook recreates your Next.js configuration, so you can use Sass in your stories without any extra configuration.

If you're using Webpack and want to use Sass or Less, you'll need some extra configuration. We recommend installing @storybook/addon-styling-webpack to help you configure these tools. Or if you'd prefer, you can customize Storybook's webpack configuration yourself to include the appropriate loader(s).

CSS-in-JS libraries are designed to use basic JavaScript, and they often work in Storybook without any extra configuration. Some libraries expect components to render in a specific rendering “context” (for example, to provide themes), which can be accomplished with @storybook/addon-themes's withThemeFromJSXProvider decorator.

If you need webfonts to be available, you may need to add some code to the .storybook/preview-head.html file. We recommend including any assets with your Storybook if possible, in which case you likely want to configure the static file location.

If you're using something like fontsource for your fonts, you can import the needed css files in your .storybook/preview.ts|tsx file.

**Examples:**

Example 1 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Preview } from '@storybook/your-framework';
 
import '../src/styles/global.css';
 
const preview: Preview = {
  parameters: {},
};
 
export default preview;
```

Example 2 (sass):
```sass
<!-- Loads a font from a CDN -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
  rel="stylesheet"
/>
<!-- Load your CSS file -->
<link rel="stylesheet" href="path/to/your/styles.css" />
```

---

## Configure Storybook | Storybook docs

**URL:** https://storybook.js.org/docs/configure

**Contents:**
- Configure Storybook
- Configure your Storybook project
- Configure story loading
  - With a configuration object
  - With a directory
  - With a custom implementation
    - Known limitations
- Configure story rendering
- Configure Storybook’s UI

Storybook is configured via a folder called .storybook, which contains various configuration files.

Note that you can change the folder that Storybook uses by setting the -c flag to your storybook dev and storybook build CLI commands.

Storybook's main configuration (i.e., the main.js|ts) defines your Storybook project's behavior, including the location of your stories, the addons you use, feature flags and other project-specific settings. This file should be in the .storybook folder in your project's root directory. You can author this file in either JavaScript or TypeScript. Listed below are the available options and examples of how to use them.

This configuration file is a preset and, as such, has a powerful interface, which can be further customized. Read our documentation on writing presets to learn more.

By default, Storybook will load stories from your project based on a glob (pattern matching string) in .storybook/main.js|ts that matches all files in your project with extension .stories.*. The intention is for you to colocate a story file along with the component it documents.

If you want to use a different naming convention, you can alter the glob using the syntax supported by picomatch.

For example, if you wanted to pull both .md and .js files from the my-project/src/components directory, you could write:

Additionally, you can customize your Storybook configuration to load your stories based on a configuration object. For example, if you wanted to load your stories from a packages/components directory, you could adjust your stories configuration field into the following:

When Storybook starts, it will look for any file containing the stories extension inside the packages/components directory and generate the titles for your stories.

You can also simplify your Storybook configuration and load the stories using a directory. For example, if you want to load all the stories inside a packages/MyStories, you can adjust the configuration as such:

You can also adjust your Storybook configuration and implement custom logic to load your stories. For example, suppose you were working on a project that includes a particular pattern that the conventional ways of loading stories could not solve. In that case, you could adjust your configuration as follows:

Because of the way stories are currently indexed in Storybook, loading stories on demand has a couple of minor limitations at the moment:

To control the way stories are rendered and add global decorators and parameters, create a .storybook/preview.js file. This is loaded in the Canvas UI, the “preview” iframe that renders your components in isolation. Use preview.js for global code (such as CSS imports or JavaScript mocks) that applies to all stories.

The preview.js file can be an ES module and export the following keys:

If you’re looking to change how to order your stories, read about sorting stories.

To control the behavior of Storybook’s UI (the “manager”), you can create a .storybook/manager.js file.

This file does not have a specific API but is the place to set UI options and to configure Storybook’s theme.

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

Example 2 (unknown):
```unknown
•
└── components
    ├── Button.js
    └── Button.stories.js
```

Example 3 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../my-project/src/components/*.@(js|md)'],
};
 
export default config;
```

Example 4 (json):
```json
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: [
    {
      // 👇 Sets the directory containing your stories
      directory: '../packages/components',
      // 👇 Storybook will load all files that match this glob
      files: '*.stories.*',
      // 👇 Used when generating automatic titles for your stories
      titlePrefix: 'MyComponents',
    },
  ],
};
 
export default config;
```

---

## Telemetry | Storybook docs

**URL:** https://storybook.js.org/docs/configure/telemetry

**Contents:**
- Telemetry
- Why is telemetry collected?
- What is being collected?
- What about sensitive information?
- Will this data be shared?
- How to opt-out
- Crash reports (disabled by default)

Storybook collects completely anonymous data to help us improve user experience. Participation in this anonymous program is optional, and you may opt-out if you'd not like to share any information.

Hundreds of thousands of developers use Storybook daily to build, test, and document components. Storybook is framework agnostic and integrates with the front-end ecosystem:

In the past, our improvement process relied on manually gathering feedback. But with a growing userbase and the need to support a wide variety of integrations, we need a more accurate method for gauging Storybook usage and pain points.

These telemetry data help us (the maintainers) to prioritize the highest impact projects. That allows us to keep up with trends in the front-end ecosystem and verify that our community's hard work achieves the intended result.

We collect general usage details, including command invocation, Storybook version, addons, and the view layer.

Specifically, we track the following information in our telemetry events:

Access to the raw data is highly controlled, limited to select members of Storybook's core team who maintain the telemetry. We cannot identify individual users from the dataset: it is anonymized and untraceable back to the user.

We take your privacy and our security very seriously. We perform additional steps to ensure that secure data (e.g., environment variables or other forms of sensitive data) do not make their way into our analytics. You can view all the information we collect by setting the STORYBOOK_TELEMETRY_DEBUG to 1 to print out the information gathered. For example:

Will generate the following output:

Additionally, if Storybook's guided tour is enabled, it will generate the following output:

The data we collect is anonymous, not traceable to the source, and only meaningful in aggregate form. No data we collect is personally identifiable. In the future, we plan to share relevant data with the community through public dashboards (or similar data representation formats).

You may opt out of the telemetry within your Storybook configuration by setting the disableTelemetry configuration element to true.

If necessary, you can also turn off telemetry via the command line with the --disable-telemetry flag.

Or via the STORYBOOK_DISABLE_TELEMETRY environment variable.

There is a boot event containing no metadata (used to ensure the telemetry is working). It is sent prior to evaluating your Storybook configuration file (i.e., main.js|ts), so it is unaffected by the disableTelemetry option. If you want to ensure that the event is not sent, use the STORYBOOK_DISABLE_TELEMETRY environment variable.

In addition to general usage telemetry, you may also choose to share crash reports. Storybook will then sanitize the error object (removing all user paths) and append it to the telemetry event. To enable crash reporting, you can set the enableCrashReports configuration element to true.

You can also enable crash reporting via the command line with the --enable-crash-reports flag.

Or by setting the STORYBOOK_ENABLE_CRASH_REPORTS environment variable to 1.

Enabling any of the options will generate the following item in the telemetry event:

**Examples:**

Example 1 (sass):
```sass
STORYBOOK_TELEMETRY_DEBUG=1 npm run storybook
```

Example 2 (json):
```json
{
  "anonymousId": "8bcfdfd5f9616a1923dd92adf89714331b2d18693c722e05152a47f8093392bb",
  "eventType": "dev",
  "context": {
    "isTTY": true,
    "platform": "macOS",
    "nodeVersion": "24.11.0",
    "storybookVersion": "10.3.0-alpha.9",
    "cliVersion": "10.3.0-alpha.9",
    "projectSince": 1717334400000
  },
  "payload": {
    "versionStatus": "cached",
    "storyIndex": {
      "storyCount": 0,
      "componentCount": 0,
      "pageStoryCount": 0,
      "playStoryCount": 0,
      "autodocsCount": 0,
      "mdxCount": 0,
      "exampleStoryCount": 8,
      "exampleDocsCount": 3,
      "onboardingStoryCount": 0,
      "onboardingDocsCount": 0,
      "version": 5
    },
    "storyStats": {
      "factory": 0,
      "play": 0,
      "render": 1,
      "loaders": 0,
      "beforeEach": 0,
      "globals": 0,
      "storyFn": 5,
      "mount": 0,
      "moduleMock": 0,
      "tags": 0
    }
  },
  "metadata": {
    "generatedAt": 1689007841223,
    "settingsCreatedAt": 1689007841223,
    "hasCustomBabel": false,
    "hasCustomWebpack": false,
    "hasStaticDirs": false,
    "hasStorybookEslint": false,
    "refCount": 0,
    "portableStoriesFileCount": 0,
    "packageManager": {
      "type": "yarn",
      "version": "3.1.1"
    },
    "monorepo": "Nx",
    "framework": {
      "name": "@storybook/react-vite",
      "options": {}
    },
    "builder": "@storybook/builder-vite",
    "renderer": "@storybook/react",
    "storybookVersion": "9.0.0",
    "storybookVersionSpecifier": "^9.0.0",
    "language": "typescript",
    "storybookPackages": {
      "@storybook/addon-docs/blocks": {
        "version": "9.0.0"
      },
      "@storybook/react": {
        "version": "9.0.0"
      },
      "@storybook/react-vite": {
        "version": "9.0.0"
      },
      "storybook": {
        "version": "9.0.0"
      }
    },
    "addons": {
      "@storybook/addon-onboarding": {
        "version": "1.0.6"
      }
    }
  }
}
```

Example 3 (json):
```json
{
  "eventType": "addon-onboarding",
  "payload": {
    "step": "1:Welcome",
    "addonVersion": "1.0.6"
  },
  "metadata": {
    // See above for metadata that's collected.
  }
}
```

Example 4 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';
 
const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  core: {
    disableTelemetry: true, // 👈 Disables telemetry
  },
};
 
export default config;
```

---

## ESLint plugin | Storybook docs

**URL:** https://storybook.js.org/docs/configure/integration/eslint-plugin

**Contents:**
- ESLint plugin
- Installation
- ESLint compatibility
- Usage
  - Configuration (.eslintrc)
    - Overriding/disabling rules
  - Configuration (flat config format)
    - Overriding/disabling rules
  - MDX Support
- Supported Rules and configurations

Storybook provides a dedicated ESLint plugin to help you write stories and components aligned with the latest Storybook and frontend development best practices.

You'll first need to install ESLint:

Next, install eslint-plugin-storybook:

Then add plugin:storybook/recommended to the extends section of your .eslintrc configuration file. Note that we can omit the eslint-plugin- prefix:

And finally, add this to your .eslintignore file:

This ensures that the plugin will also lint your configuration files inside the .storybook directory, so that you always have a correct configuration. For example, it can catch mistyped addon names in your main.js|ts file.

For more details on why this line is required in the .eslintignore file, refer to the ESLint documentation.

If you are using flat config style, add this to your configuration file:

Depending on the version of ESLint you are using, you may need to install a specific version of the Storybook plugin. Use the table below to match the plugin version to your ESLint version.

Use .eslintrc.* file to configure rules in ESLint < v9. ESLint docs.

This plugin will only be applied to files following the *.stories.* (recommended) or *.story.* pattern. This is an automatic configuration, so no action is required.

Optionally, you can override, add to, or disable individual rules. You likely don't want these settings to be applied in every file, so make sure that you add a overrides section in your .eslintrc.* file that applies the overrides only to your story files.

Use the eslint.config.js file to configure rules using the flat config style. This is the default in ESLint v9, but can be used starting from ESLint v8.57.0. ESLint docs.

In case you are using utility functions from tools like tseslint, you might need to register the plugin a little differently:

Optionally, you can override, add, or disable individual rules. You likely don't want these settings to be applied to every file, so ensure that you add a flat config section in your eslint.config.js file that applies the overrides only to your story files.

This plugin does not support MDX files.

Configurations: csf, csf-strict, addon-interactions, recommended

**Examples:**

Example 1 (unknown):
```unknown
npm install --save-dev eslint
```

Example 2 (unknown):
```unknown
npm install --save-dev eslint-plugin-storybook
```

Example 3 (json):
```json
{
  // extend plugin:storybook/<configuration>, such as:
  "extends": ["plugin:storybook/recommended"]
}
```

Example 4 (unknown):
```unknown
!.storybook
```

---
