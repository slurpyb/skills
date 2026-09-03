# Storybook - Writing-Stories

**Pages:** 15

---

## Args | Storybook docs

**URL:** https://storybook.js.org/docs/writing-stories/args

**Contents:**
- Args
- Args object
- Story args
- Component args
- Global args
- Args composition
- Args can modify any aspect of your component
- Setting args through the URL
- Setting args from within a story
- Mapping to complex arg values

A story is a component with a set of arguments that define how the component should render. “Args” are Storybook’s mechanism for defining those arguments in a single JavaScript object. Args can be used to dynamically change props, slots, styles, inputs, etc. It allows Storybook and its addons to live edit components. You do not need to modify your underlying component code to use args.

When an arg’s value changes, the component re-renders, allowing you to interact with components in Storybook’s UI via addons that affect args.

Learn how and why to write stories in the introduction. For details on how args work, read on.

The args object can be defined at the story, component and global level. It is a JSON serializable object composed of string keys with matching valid value types that can be passed into a component for your framework.

To define the args of a single story, use the args CSF story key:

These args will only apply to the story for which they are attached, although you can reuse them via JavaScript object reuse:

In the above example, we use the object spread feature of ES 2015.

You can also define args at the component level; they will apply to all the component's stories unless you overwrite them. To do so, use the args key on the default CSF export:

You can also define args at the global level; they will apply to every component's stories unless you overwrite them. To do so, define the args property in the default export of preview.*:

For most uses of global args, globals are a better tool for defining globally-applied settings, such as a theme. Using globals enables users to change the value with the toolbar menu.

You can separate the arguments to a story to compose in other stories. Here's how you can combine args for multiple stories of the same component.

If you find yourself re-using the same args for most of a component's stories, you should consider using component-level args.

Args are useful when writing stories for composite components that are assembled from other components. Composite components often pass their arguments unchanged to their child components, and similarly, their stories can be compositions of their child components stories. With args, you can directly compose the arguments:

You can use args in your stories to configure the component's appearance, similar to what you would do in an application. For example, here's how you could use a footer arg to populate a child component:

You can also override the set of initial args for the active story by adding an args query parameter to the URL. Typically, you would use Controls to handle this. For example, here's how you could set a size and style arg in the Storybook's URL:

As a safeguard against XSS attacks, the arg's keys and values provided in the URL are limited to alphanumeric characters, spaces, underscores, and dashes. Any other types will be ignored and removed from the URL, but you can still use them with the Controls panel and within your story.

The args param is always a set of key: value pairs delimited with a semicolon ;. Values will be coerced (cast) to their respective argTypes (which may have been automatically inferred). Objects and arrays are supported. Special values null and undefined can be set by prefixing with a bang !. For example, args=obj.key:val;arr[0]:one;arr[1]:two;nil:!null will be interpreted as:

Similarly, special formats are available for dates and colors. Date objects will be encoded as !date(value) with value represented as an ISO date string. Colors are encoded as !hex(value), !rgba(value) or !hsla(value). Note that rgb(a) and hsl(a) should not contain spaces or percentage signs in the URL.

Args specified through the URL will extend and override any default values of args set on the story.

Interactive components often need to be controlled by their containing component or page to respond to events, modify their state and reflect those changes in the UI. For example, when a user toggles a switch component, the switch should be checked, and the arg shown in Storybook should reflect the change. To enable this, you can use the useArgs API exported by storybook/preview-api:

If you're using Storybook's hooks API in the story's render function, do not mix them with React's hooks such as useState, useEffect, or useRef. This is because side effects and re-rendering triggered by React's hooks do not run through Storybook's hook context, which can cause an error on re-render. To manage state and side effects within a story, you must use Storybook's equivalent hooks, such as useState, useEffect, and useRef from storybook/preview-api.

Complex values such as JSX elements cannot be serialized to the manager (e.g., the Controls panel) or synced with the URL. Arg values can be "mapped" from a simple string to a complex type using the mapping property in argTypes to work around this limitation. It works in any arg but makes the most sense when used with the select control type.

Note that mapping does not have to be exhaustive. If the arg value is not a property of mapping, the value will be used directly. Keys in mapping always correspond to arg values, not their index in the options array.

If you are writing an addon that wants to read or update args, use the useArgs hook exported by storybook/manager-api:

**Examples:**

Example 1 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
} satisfies Meta<typeof Button>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};
```

Example 2 (typescript):
```typescript
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
} satisfies Meta<typeof Button>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};
 
export const PrimaryLongName: Story = {
  args: {
    ...Primary.args,
    label: 'Primary with a really long name',
  },
};
```

Example 3 (jsx):
```jsx
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
  //👇 Creates specific argTypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  args: {
    //👇 Now all Button stories will be primary.
    primary: true,
  },
} satisfies Meta<typeof Button>;
 
export default meta;
```

Example 4 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Preview } from '@storybook/your-framework';
 
const preview: Preview = {
  // The default value of the theme arg for all stories
  args: { theme: 'light' },
};
 
export default preview;
```

---

## Mocking network requests | Storybook docs

**URL:** https://storybook.js.org/docs/writing-stories/mocking-data-and-modules/mocking-network-requests

**Contents:**
- Mocking network requests
- Set up the MSW addon
- Mocking REST requests
- Mocking GraphQL requests
- Configuring MSW for stories

For components that make network requests (e.g. fetching data from a REST or GraphQL API), you can mock those requests using a tool like Mock Service Worker (MSW). MSW is an API mocking library, which relies on service workers to capture network requests and provides mocked data in response.

The MSW addon brings this functionality into Storybook, allowing you to mock API requests in your stories. Below is an overview of how to set up and use the addon.

First, if necessary, run this command to install MSW and the MSW addon:

If you're not already using MSW, generate the service worker file necessary for MSW to work:

Then ensure the staticDirs property in your Storybook configuration will include the generated service worker file (in /public, by default):

Finally, initialize the addon and apply it to all stories with a project-level loader:

If your component fetches data from a REST API, you can use MSW to mock those requests in Storybook. As an example, consider this document screen component:

This example uses the fetch API to make network requests. If you're using a different library (e.g. axios), you can apply the same principles to mock network requests in Storybook.

With the MSW addon, we can write stories that use MSW to mock the REST requests. Here's an example of two stories for the document screen component: one that fetches data successfully and another that fails.

GraphQL is another common way to fetch data in components. You can use MSW to mock GraphQL requests in Storybook. Here's an example of a document screen component that fetches data from a GraphQL API:

This example uses GraphQL with Apollo Client to make network requests. If you're using a different library (e.g. URQL or React Query), you can apply the same principles to mock network requests in Storybook.

The MSW addon allows you to write stories that use MSW to mock the GraphQL requests. Here's an example demonstrating two stories for the document screen component. The first story fetches data successfully, while the second story fails.

In the examples above, note how each story is configured with parameters.msw to define the request handlers for the mock server. Because it uses parameters in this way, it can also be configured at the component or even project level, allowing you to share the same mock server configuration across multiple stories.

**Examples:**

Example 1 (unknown):
```unknown
npm install msw msw-storybook-addon --save-dev
```

Example 2 (unknown):
```unknown
npx msw init public/
```

Example 3 (python):
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

Example 4 (swift):
```swift
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Preview } from '@storybook/your-framework';
 
import { initialize, mswLoader } from 'msw-storybook-addon';
 
/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize();
 
const preview: Preview = {
  loaders: [mswLoader], // 👈 Add the MSW loader to all stories
};
 
export default preview;
```

---

## Mocking modules | Storybook docs

**URL:** https://storybook.js.org/docs/writing-stories/mocking-data-and-modules/mocking-modules

**Contents:**
- Mocking modules
- Automocking
  - Registering modules to mock
    - Spy-only
    - Fully automocked modules
    - Mock files
  - Using automocked modules in stories
  - How it works
    - Comparison to Vitest mocking
- Alternative methods

Components often depend on other modules, such as other components, utility functions, or libraries. These can be from external packages or internal to your project. When rendering those components in Storybook or testing them, you may want to mock those modules to control their behavior and isolate the component's functionality.

For example, this simple component depends on two modules, a local utility function to access the user's browser session and an external package to generate a unique ID:

The above example is written with React, but the same principles apply to other renderers like Vue, Svelte, or Web Components. The important part is the usage of the two module dependencies.

When writing stories or tests for this component, you may want to mock the getUserFromSession function to control the user data returned, or mock the uuidv4 function to return a predictable ID. This allows you to test the component's behavior without relying on the actual implementations of these modules.

For maximum flexibility, Storybook provides three ways to mock modules for your stories. Let's walk through each of them, starting with the most straightforward approach.

Automocking is the most straightforward way to mock modules in Storybook, and we recommend it for all projects using the Vite and Webpack builders (other builders must use one of the other techniques, below). This approach requires minimal configuration while allowing for flexible mocking of modules.

It works with two steps. First, register the modules you want to mock in your Storybook configuration. Then, control the behavior and make assertions about the mocked modules in your stories.

When automocking, you use the sb.mock utility function to register modules you want to mock. There are three ways to register modules: as spy-only, fully automocked, or with a mock file. Each method has its use cases and benefits.

There are some key details to keep in mind when using the sb.mock utility:

For most cases, you should register a mocked module as spy-only, by setting the spy option to true. This leaves the original module's functionality intact, while still allowing you to modify the behavior if needed and make assertions in your tests.

For example, if you want to spy on the getUserFromSession function and the uuidv4 function from the uuid package, you can call the sb.mock utility function in your .storybook/preview.* file:

If you need to mock an external module that has a deeper import path (e.g. lodash-es/add), register the mock with that path.

You can then control the behavior of these modules and make assertions about them in your stories, such as checking if a function was called or what arguments it was called with.

For cases where you need to prevent the original module's functionality from executing, set the spy option to false (or omit it, because that is the default value). This will automatically replace all exports from the module with Vitest mock functions, allowing you to control their behavior and make assertions while being certain that the original functionality never runs.

Fully automocked modules do not execute their exported functions, but the module is still evaluated, along with its dependencies. This means that if the module has side effects (e.g., modifying global state, logging to the console, etc.), those side effects will still occur. Similarly, a module written to run on the server will attempt to be evaluated in the browser. If you want to prevent the original module's code from running entirely, you should use a mock file instead.

You can then control the behavior of these modules and make assertions about them in your stories, just like with the spy-only approach.

If you want to mock a module with more complex behavior or reuse a mock's behavior across multiple stories, you can create a mock file. This file should be placed in a __mocks__ directory next to the module you want to mock, and it should export the same named exports as the original module.

For example, to mock the session module in the lib directory, create a file named session.js|ts in the lib/__mocks__ directory:

For packages in your node_modules, create a __mocks__ directory in the root of your project and create the mock file there. For example, to mock the uuid package, create a file named uuid.js in the __mocks__ directory:

If you need to mock an external module that has a deeper import path (e.g. lodash-es/add), create a corresponding mock file (e.g. __mocks__/lodash-es/add.js) in the root of your project.

The root of your project is determined differently depending on your builder:

The root __mocks__ directory should be placed in the root directory, as defined in your project's Vite configuration (typically process.cwd()) If that is unavailable, it defaults to the directory containing your .storybook directory.

The root __mocks__ directory should be placed in the context directory, as defined in your project's Webpack configuration (typically process.cwd()). If that is unavailable, it defaults to the root of your repository.

Mock files must be written with JavaScript (not TypeScript) using ESModules (not CJS).

They must export the same named exports as the original module. If you want to mock a default export, you can use export default in the mock file.

You can then use the sb.mock utility to register these mock files in your preview.* file:

Note that the API for registering automatically mocked modules and mock files is the same. The only difference is that sb.mock will first look for a mock file in the appropriate directory before automatically mocking the module.

All registered automocked modules are used the same way within your stories. You can control the behavior, such as defining what it returns, and make assertions about the modules.

Mocked functions created with the sb.mock utility are full Vitest mock functions, which means you can use all the methods available on them. Some of the most useful methods include:

If you are writing your stories in TypeScript, you can use the mocked utility from storybook/test to ensure that the mocked functions are correctly typed in your stories. This utility is a type-safe wrapper around the Vitest vi.mocked function.

Storybook's automocking is built on Vitest's mocking engine. The behavior adjusts depending on whether you're in development mode or build mode:

In dev mode, mocking relies on Vite's module graph invalidation. When a mock is added, changed, or removed (either in .storybook/preview.* or the __mocks__ directory), the plugin intelligently invalidates all affected modules and triggers a hot reload. This provides a fast and interactive development experience.

While this feature uses Vitest's mocking engine, the implementation within Storybook has some key differences:

If automocking is not suitable for your project, there are two alternative methods to mock modules in Storybook: subpath imports and builder aliases. These methods require a bit more setup but provide similar functionality to automocking, allowing you to control the behavior of modules in your stories.

You can use subpath imports, a Node feature, to mock modules. Subpath imports allow you to define custom paths for modules in your project, which can be used to replace the original module with a mock file. They work with both the Vite and Webpack builders.

To mock a module, create a file with the same name and in the same directory as the module you want to mock. For example, to mock a module named session, create a file next to it named session.mock.js|ts, with a few characteristics:

Here's an example of a mock file for a module named session:

When you use the fn utility to mock a module, you create full Vitest mock functions. See below for examples of how you can use a mocked module in your stories.

Mock files for external modules

You can't directly mock an external module like uuid or node:fs. Instead, you must wrap it in your own module, which you can mock like any other internal one. For example, with uuid, you could do the following:

And create a mock for the wrapper:

To configure subpath imports, you define the imports property in your project's package.json file. This property maps the subpath to the actual file path. The example below configures subpath imports for four internal modules:

There are three aspects to this configuration worth noting:

First, each subpath must begin with #, to differentiate it from a regular module path. The #* entry is a catch-all that maps all subpaths to the root directory.

Second, the order of the keys is important. The default key should come last.

Third, note the storybook, test, and default keys in each module's entry. The storybook value is used to import the mock file when loaded in Storybook, while the default value is used to import the original module when loaded in your project. The test condition is also used within Storybook, which allows you to use the same configuration in Storybook and your other tests.

With the package configuration in place, you can then update your component file to use the subpath import:

Subpath imports will only be correctly resolved and typed when the moduleResolution property is set to 'Bundler', 'NodeNext', or 'Node16' in your TypeScript configuration.

If you are currently using 'node', that is intended for projects using a Node.js version older than v10. Projects written with modern code likely do not need to use 'node'.

Storybook recommends the TSConfig Cheat Sheet for guidance on setting up your TypeScript configuration.

When you use the fn utility to mock a module, you create full Vitest mock functions, which have many methods available. Some of the most useful methods include:

Here, we define beforeEach on a story (which will run before the story is rendered) to set a mocked return value for the getUserFromSession function used by the Page component:

If you are writing your stories in TypeScript, you must import your mock modules using the full mocked file name to have the functions correctly typed in your stories. You do not need to do this in your component files. That's what the subpath import or builder alias is for.

The fn utility also spies on the original module's functions, which you can use to assert their behavior in your tests. For example, you can use interaction tests to verify that a function was called with specific arguments.

For example, this story checks that the saveNote function was called when the user clicks the save button:

If your project is unable to use automocking or subpath imports, you can configure your Storybook builder to alias the module to the mock file. This will instruct the builder to replace the module with the mock file when bundling your Storybook stories.

Usage of the aliased module in stories is similar to when using subpath imports in stories, but you import the module using the alias instead of the subpath.

Before the story renders, you can use the asynchronous beforeEach function to perform any setup you need (e.g., configure the mock behavior). This function can be defined at the story, component (which will run for all stories in the file), or project (defined in .storybook/preview.*, which will run for all stories in the project).

You can also return a cleanup function from beforeEach which will be called after your story unmounts. This is useful for tasks like unsubscribing observers, etc.

It is not necessary to restore fn() mocks with the cleanup function, as Storybook will already do that automatically before rendering a story. See the parameters.test.restoreMocks API for more information.

Here's an example of using the mockdate package to mock the Date and reset it when the story unmounts.

Webpack projects may encounter an exports is not defined error when using automocking. This is usually caused by attempting to mock a module with CommonJS (CJS) entry points. Automocking with Webpack only works with modules that have ESModules (ESM) entry points exclusively, so you must use a mock file to mock CJS modules.

If you've already set up mocking with other testing tools (e.g., Jest), you may encounter conflicts when using Storybook's mocking system. These conflicts can cause unexpected behavior, errors, or incorrect mocks when both tools try to mock the same module. This is a known issue when sharing mock files or configurations between Storybook and other testing tools. To address this situation, we recommend that you verify which tool is responsible for mocking a particular module and make sure the configurations do not overlap to avoid any conflicts.

**Examples:**

Example 1 (javascript):
```javascript
import { v4 as uuidv4 } from 'uuid';
import { getUserFromSession } from '../lib/session';
 
export function AuthButton() {
  const user = getUserFromSession();
  const id = uuidv4();
 
  return (
    <button
      onClick={() => {
        console.log(`User: ${user.name}, ID: ${id}`);
      }}
    >
      {user ? `Welcome, ${user.name}` : 'Sign in'}
    </button>
  );
}
```

Example 2 (lua):
```lua
// Replace your-framework with the framework you are using (e.g., react-vite, nextjs, vue3-vite, sveltekit)
import type { Preview } from '@storybook/your-framework';
import { sb } from 'storybook/test';
 
// 👇 Automatically spies on all exports from the `lib/session` local module
sb.mock(import('../lib/session.ts'), { spy: true });
// 👇 Automatically spies on all exports from the `uuid` package in `node_modules`
sb.mock(import('uuid'), { spy: true });
 
const preview: Preview = {
  // ...
};
 
export default preview;
```

Example 3 (lua):
```lua
// Replace your-framework with the framework you are using (e.g., react-vite, nextjs, vue3-vite, sveltekit)
import type { Preview } from '@storybook/your-framework';
import { sb } from 'storybook/test';
 
// 👇 Automatically replaces all exports from the `lib/session` local module with mock functions
sb.mock(import('../lib/session.ts'));
// 👇 Automatically replaces all exports from the `uuid` package in `node_modules` with mock functions
sb.mock(import('uuid'));
 
const preview: Preview = {
  // ...
};
 
export default preview;
```

Example 4 (javascript):
```javascript
export function getUserFromSession() {
  return { name: 'Mocked User' };
}
```

---

## Stories for multiple components | Storybook docs

**URL:** https://storybook.js.org/docs/writing-stories/stories-for-multiple-components

**Contents:**
- Stories for multiple components
- Subcomponents
- Reusing story definitions
- Using children as an arg
- Creating a Template Component

It's useful to write stories that render two or more components at once if those components are designed to work together. For example, ButtonGroup, List, and Page components.

When the components you're documenting have a parent-child relationship, you can use the subcomponents property to document them together. This is especially useful when the child component is not meant to be used on its own, but only as part of the parent component.

Here's an example with List and ListItem components:

Note that by adding a subcomponents property to the meta (or default export), we get an extra panel on the ArgTypes and Controls tables, listing the props of ListItem:

Subcomponents are only intended for documentation purposes and have some limitations:

Let's talk about some techniques you can use to mitigate the above, which are especially useful in more complicated situations.

We can also reduce repetition in our stories by reusing story definitions. Here, we can reuse the ListItem stories' args in the story for List:

By rendering the Unchecked story with its args, we are able to reuse the input data from the ListItem stories in the List.

However, we still aren’t using args to control the ListItem stories, which means we cannot change them with controls and we cannot reuse them in other, more complex component stories.

One way we improve that situation is by pulling the rendered subcomponent out into a children arg:

Now that children is an arg, we can potentially reuse it in another story.

However, there are some caveats when using this approach that you should be aware of.

The children arg, just like all args, needs to be JSON serializable. To avoid errors with your Storybook, you should:

We're currently working on improving the overall experience for the children arg and allow you to edit children arg in a control and allow you to use other types of components in the near future. But for now you need to factor in this caveat when you're implementing your stories.

Another option that is more “data”-based is to create a special “story-generating” template component:

This approach requires more setup, but it means you can reuse the args to each story in a composite component. It also means you can alter the args to the component with the Controls panel.

**Examples:**

Example 1 (typescript):
```typescript
import * as React from 'react';
 
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { List } from './List';
import { ListItem } from './ListItem';
 
const meta = {
  component: List,
  subcomponents: { ListItem }, //👈 Adds the ListItem component as a subcomponent
} satisfies Meta<typeof List>;
export default meta;
 
type Story = StoryObj<typeof meta>;
 
export const Empty: Story = {};
 
export const OneItem: Story = {
  render: (args) => (
    <List {...args}>
      <ListItem />
    </List>
  ),
};
```

Example 2 (typescript):
```typescript
import * as React from 'react';
 
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { List } from './List';
import { ListItem } from './ListItem';
 
//👇 We're importing the necessary stories from ListItem
import { Selected, Unselected } from './ListItem.stories';
 
const meta = {
  component: List,
} satisfies Meta<typeof List>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const ManyItems: Story = {
  render: (args) => (
    <List {...args}>
      <ListItem {...Selected.args} />
      <ListItem {...Unselected.args} />
      <ListItem {...Unselected.args} />
    </List>
  ),
};
```

Example 3 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { List } from './List';
 
//👇 Instead of importing ListItem, we import the stories
import { Unchecked } from './ListItem.stories';
 
const meta = {
  component: List,
} satisfies Meta<typeof List>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const OneItem: Story = {
  args: {
    children: <Unchecked {...Unchecked.args} />,
  },
};
```

Example 4 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { List } from './List';
import { ListItem } from './ListItem';
 
//👇 Imports a specific story from ListItem stories
import { Unchecked } from './ListItem.stories';
 
const meta = {
  component: List,
} satisfies Meta<typeof List>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
//👇 The ListTemplate construct will be spread to the existing stories.
const ListTemplate: Story = {
  render: ({ items, ...args }) => {
    return (
      <List>
        {items.map((item) => (
          <ListItem {...item} />
        ))}
      </List>
    );
  },
};
 
export const Empty = {
  ...ListTemplate,
  args: {
    items: [],
  },
};
 
export const OneItem = {
  ...ListTemplate,
  args: {
    items: [{ ...Unchecked.args }],
  },
};
```

---

## Loaders | Storybook docs

**URL:** https://storybook.js.org/docs/writing-stories/loaders

**Contents:**
- Loaders
- Fetching API data
- Global loaders
- Loader inheritance

Loaders are asynchronous functions that load data for a story and its decorators. A story's loaders run before the story renders, and the loaded data injected into the story via its render context.

Loaders can be used to load any asset, lazy load components, or fetch data from a remote API. This feature was designed as a performance optimization to handle large story imports. However, args is the recommended way to manage story data. We're building up an ecosystem of tools and techniques around Args that might not be compatible with loaded data.

They are an advanced feature (i.e., escape hatch), and we only recommend using them if you have a specific need that other means can't fulfill.

Stories are isolated component examples that render internal data defined as part of the story or alongside the story as args.

Loaders are helpful when you need to load story data externally (e.g., from a remote API). Consider the following example that fetches a todo item to display in a todo list:

The response obtained from the remote API call is combined into a loaded field on the story context, which is the second argument to a story function. For example, in React, the story's args were spread first to prioritize them over the static data provided by the loader. With other frameworks (e.g., Angular), you can write your stories as you'd usually do.

We can also set a loader for all stories via the loaders export of your .storybook/preview.js file (this is the file where you configure all stories):

In this example, we load a "current user" available as loaded.currentUser for all stories.

Like parameters, loaders can be defined globally, at the component level, and for a single story (as we’ve seen).

All loaders, defined at all levels that apply to a story, run before the story renders in Storybook's canvas.

**Examples:**

Example 1 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { TodoItem } from './TodoItem';
 
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
const meta = {
  component: TodoItem,
  render: (args, { loaded: { todo } }) => <TodoItem {...args} {...todo} />,
} satisfies Meta<typeof TodoItem>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Primary: Story = {
  loaders: [
    async () => ({
      todo: await (await fetch('https://jsonplaceholder.typicode.com/todos/1')).json(),
    }),
  ],
};
```

Example 2 (javascript):
```javascript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Preview } from '@storybook/your-framework';
 
const preview: Preview = {
  loaders: [
    async () => ({
      currentUser: await (await fetch('https://jsonplaceholder.typicode.com/users/1')).json(),
    }),
  ],
};
 
export default preview;
```

---

## Writing stories in TypeScript | Storybook docs

**URL:** https://storybook.js.org/docs/writing-stories/typescript

**Contents:**
- Writing stories in TypeScript
- Typing stories with Meta and StoryObj
  - Props type parameter
  - Using satisfies for better type safety
- Typing custom args

Writing your stories in TypeScript makes you more productive. You don't have to jump between files to look up component props. Your code editor will alert you about missing required props and even autocomplete prop values, just like when using your components within your app. Plus, Storybook infers those component types to auto-generate the Controls table.

Storybook has built-in TypeScript support, so you can get started with zero configuration required.

CSF Next (currently in preview) provides significantly improved TypeScript support, which infers component types automatically and requires no explicit typing for most cases. We recommend using CSF Next for all new TypeScript stories.

You only need to add types when using custom args.

When writing stories, there are two aspects that are helpful to type. The first is the component meta, which describes and configures the component and its stories. In a CSF file, this is the default export. The second is the stories themselves.

Storybook provides utility types for each of these, named Meta and StoryObj. Here's an example CSF file using those types:

Meta and StoryObj types are both generics, so you can provide them with an optional prop type parameter for the component type or the component's props type (e.g., the typeof Button portion of Meta<typeof Button>). By doing so, TypeScript will prevent you from defining an invalid arg, and all decorators, play functions, or loaders will type their function arguments.

The example above passes a component type. See Typing custom args for an example of passing a props type.

If you are using TypeScript 4.9+, you can take advantage of the new satisfies operator to get stricter type checking. Now you will receive type errors for missing required args, not just invalid ones.

Using satisfies to apply a story's type helps maintain type safety when sharing a play function across stories. Without it, TypeScript will throw an error that the play function may be undefined. The satisfies operator enables TypeScript to infer whether the play function is defined or not.

Finally, use of satisfies allows you to pass typeof meta to the StoryObj generic. This informs TypeScript of the connection between the meta and StoryObj types, which allows it to infer the args type from the meta type. In other words, TypeScript will understand that args can be defined both at the story and meta level and won't throw an error when a required arg is defined at the meta level, but not at the story level.

Sometimes stories need to define args that aren’t included in the component's props. For this case, you can use an intersection type to combine a component's props type and your custom args' type. For example, here's how you could use a footer arg to populate a child component:

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
 
export const Basic = {} satisfies Story;
 
export const Primary = {
  args: {
    primary: true,
  },
} satisfies Story;
```

Example 2 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { Page } from './Page';
 
type PagePropsAndCustomArgs = React.ComponentProps<typeof Page> & { footer?: string };
 
const meta = {
  component: Page,
  render: ({ footer, ...args }) => (
    <Page {...args}>
      <footer>{footer}</footer>
    </Page>
  ),
} satisfies Meta<PagePropsAndCustomArgs>;
export default meta;
 
type Story = StoryObj<typeof meta>;
 
export const CustomFooter = {
  args: {
    footer: 'Built with Storybook',
  },
} satisfies Story;
```

---

## Naming components and hierarchy | Storybook docs

**URL:** https://storybook.js.org/docs/writing-stories/naming-components-and-hierarchy

**Contents:**
- Naming components and hierarchy
- Structure and hierarchy
- Naming stories
- Grouping
- Roots
- Single-story hoisting
- Sorting stories

Storybook provides a powerful way to organize your stories, giving you the necessary tools to categorize, search, and filter your stories based on your organization's needs and preferences.

When organizing your Storybook, there are two methods of structuring your stories: implicit and explicit. The implicit method involves relying upon the physical location of your stories to position them in the sidebar, while the explicit method involves utilizing the title parameter to place the story.

Based on how you structure your Storybook, you can see that the story hierarchy is made up of various parts:

When creating your stories, you can explicitly use the title parameter to define the story's position in the sidebar. It can also be used to group related components together in an expandable interface to help with Storybook organization providing a more intuitive experience for your users. For example:

It is also possible to group related components in an expandable interface to help with Storybook organization. To do so, use the / as a separator:

By default, the top-level grouping will be displayed as “root” in the Storybook UI (i.e., the uppercased, non-expandable items). If you need, you can configure Storybook and disable this behavior. Useful if you need to provide a streamlined experience for your users; nevertheless, if you have a large Storybook composed of multiple component stories, we recommend naming your components according to the file hierarchy.

Single-story components (i.e., component stories without siblings) whose display name exactly matches the component's name (last part of title) are automatically hoisted up to replace their parent component in the UI. For example:

Because story exports are automatically "start cased" (myStory becomes "My Story"), your component name should match that. Alternatively, you can override the story name using myStory.storyName = '...' to match the component name.

Out of the box, Storybook sorts stories based on the order in which they are imported. However, you can customize this pattern to suit your needs and provide a more intuitive experience by adding storySort to the options parameter in your preview.js file.

Asides from the unique story identifier, you can also use the title, name, and import path to sort your stories using the storySort function.

The storySort can also accept a configuration object.

To sort your stories alphabetically, set method to 'alphabetical' and optionally set the locales string. To sort your stories using a custom list, use the order array; stories that don't match an item in the order list will appear after the items in the list.

The order array can accept a nested array to sort 2nd-level story kinds. For example:

Which would result in this story ordering:

If you want specific categories to sort to the end of the list, you can insert a * into your order array to indicate where "all other stories" should go:

In this example, the WIP category would be displayed at the end of the list.

Note that the order option is independent of the method option; stories are sorted first by the order array and then by either the method: 'alphabetical' or the default configure() import order.

**Examples:**

Example 1 (jsx):
```jsx
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
  component: Button,
} satisfies Meta<typeof Button>;
 
export default meta;
```

Example 2 (jsx):
```jsx
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Design System/Atoms/Button',
  component: Button,
} satisfies Meta<typeof Button>;
 
export default meta;
```

Example 3 (jsx):
```jsx
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta } from '@storybook/your-framework';
 
import { Checkbox } from './Checkbox';
 
const meta = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Design System/Atoms/Checkbox',
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;
 
export default meta;
```

Example 4 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { Button as ButtonComponent } from './Button';
 
const meta = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Design System/Atoms/Button',
  component: ButtonComponent,
} satisfies Meta<typeof ButtonComponent>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
// This is the only named export in the file, and it matches the component name
export const Button: Story = {};
```

---

## Building pages with Storybook | Storybook docs

**URL:** https://storybook.js.org/docs/writing-stories/build-pages-with-storybook

**Contents:**
- Building pages with Storybook
- Pure presentational pages
  - Args composition for presentational screens
- Mocking connected components
  - Mocking imports
  - Mocking API Services
  - Mocking providers
  - Avoiding mocking dependencies
    - Mocking containers in Storybook
    - Providing containers to your application

Storybook helps you build any component, from small “atomic” components to composed pages. But as you move up the component hierarchy toward the page level, you deal with more complexity.

There are many ways to build pages in Storybook. Here are common patterns and solutions.

Teams at the BBC, The Guardian, and the Storybook maintainers themselves build pure presentational pages. If you take this approach, you don't need to do anything special to render your pages in Storybook.

It's straightforward to write components to be fully presentational up to the screen level. That makes it easy to show in Storybook. The idea is that you do all the messy “connected” logic in a single wrapper component in your app outside of Storybook. You can see an example of this approach in the Data chapter of the Intro to Storybook tutorial.

Your existing app may not be structured in this way, and it may be difficult to change it.

Fetching data in one place means that you need to drill it down to the components that use it. This can be natural in a page that composes one big GraphQL query (for instance), but other data fetching approaches may make this less appropriate.

It's less flexible if you want to load data incrementally in different places on the screen.

When you are building screens in this way, it is typical that the inputs of a composite component are a combination of the inputs of the various sub-components it renders. For instance, if your screen renders a page layout (containing details of the current user), a header (describing the document you are looking at), and a list (of the subdocuments), the inputs of the screen may consist of the user, document and subdocuments.

In such cases, it is natural to use args composition to build the stories for the page based on the stories of the sub-components:

This approach is beneficial when the various subcomponents export a complex list of different stories. You can pick and choose to build realistic scenarios for your screen-level stories without repeating yourself. Your story maintenance burden is minimal by reusing the data and taking a Don't-Repeat-Yourself(DRY) philosophy.

Connected components are components that depend on external data or services. For example, a full page component is often a connected component. When you render a connected component in Storybook, you need to mock the data or modules that the component depends on. There are various layers in which you can do that.

Components can depend on modules that are imported into the component file. These can be from external packages or internal to your project. When rendering those components in Storybook or testing them, you may want to mock those modules to control their behavior.

For components that make network requests (e.g., fetching data from a REST or GraphQL API), you can mock those requests in your stories.

Components can receive data or configuration from context providers. For example, a styled component might access its theme from a ThemeProvider or Redux uses React context to provide components access to app data. You can mock a provider and the value it's providing and wrap your component with it in your stories.

It's possible to avoid mocking the dependencies of connected "container" components entirely by passing them around via props or React context. However, it requires a strict split of the container and presentational component logic. For example, if you have a component responsible for data fetching logic and rendering DOM, it will need to be mocked as previously described.

It’s common to import and embed container components amongst presentational components. However, as we discovered earlier, we’ll likely have to mock their dependencies or the imports to render them within Storybook.

Not only can this quickly grow to become a tedious task, but it’s also challenging to mock container components that use local states. So, instead of importing containers directly, a solution to this problem is to create a React context that provides the container components. It allows you to freely embed container components as usual, at any level in the component hierarchy without worrying about subsequently mocking their dependencies; since we can swap out the containers themselves with their mocked presentational counterpart.

We recommend dividing context containers up over specific pages or views in your app. For example, if you had a ProfilePage component, you might set up a file structure as follows:

It’s also often helpful to set up a “global” container context (perhaps named GlobalContainerContext) for container components that may be rendered on every page of your app and add them to the top level of your application. While it’s possible to place every container within this global context, it should only provide globally required containers.

Let’s look at an example implementation of this approach.

First, create a React context, and name it ProfilePageContext. It does nothing more than export a React context:

ProfilePage is our presentational component. It will use the useContext hook to retrieve the container components from ProfilePageContext:

In the context of Storybook, instead of providing container components through context, we’ll instead provide their mocked counterparts. In most cases, the mocked versions of these components can often be borrowed directly from their associated stories.

If the same context applies to all ProfilePage stories, we can use a decorator.

Now, in the context of your application, you’ll need to provide ProfilePage with all of the container components it requires by wrapping it with ProfilePageContext.Provider:

For example, in Next.js, this would be your pages/profile.js component.

If you’ve set up GlobalContainerContext, you’ll need to set up a decorator within Storybook’s preview.js to provide context to all stories. For example:

**Examples:**

Example 1 (typescript):
```typescript
import PageLayout from './PageLayout';
import Document from './Document';
import SubDocuments from './SubDocuments';
import DocumentHeader from './DocumentHeader';
import DocumentList from './DocumentList';
 
export interface DocumentScreenProps {
  user?: {};
  document?: Document;
  subdocuments?: SubDocuments[];
}
 
export function DocumentScreen({ user, document, subdocuments }: DocumentScreenProps) {
  return (
    <PageLayout user={user}>
      <DocumentHeader document={document} />
      <DocumentList documents={subdocuments} />
    </PageLayout>
  );
}
```

Example 2 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { DocumentScreen } from './YourPage';
 
// 👇 Imports the required stories
import * as PageLayout from './PageLayout.stories';
import * as DocumentHeader from './DocumentHeader.stories';
import * as DocumentList from './DocumentList.stories';
 
const meta = {
  component: DocumentScreen,
} satisfies Meta<typeof DocumentScreen>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Simple: Story = {
  args: {
    user: PageLayout.Simple.args.user,
    document: DocumentHeader.Simple.args.document,
    subdocuments: DocumentList.Simple.args.documents,
  },
};
```

Example 3 (unknown):
```unknown
ProfilePage.js
ProfilePage.stories.js
ProfilePageContainer.js
ProfilePageContext.js
```

Example 4 (javascript):
```javascript
import { createContext } from 'react';
 
const ProfilePageContext = createContext();
 
export default ProfilePageContext;
```

---

## How to write stories | Storybook docs

**URL:** https://storybook.js.org/docs/writing-stories

**Contents:**
- How to write stories
- Where to put stories
- Component Story Format
  - Default export
  - Defining stories
    - Custom rendering
    - Working with React Hooks
  - Rename stories
- How to write stories
  - Using the play function

A story captures the rendered state of a UI component. It's an object with annotations that describe the component's behavior and appearance given a set of arguments.

Storybook uses the generic term arguments (args for short) when talking about React’s props, Vue’s props, Angular’s @Input, and other similar concepts.

A component’s stories are defined in a story file that lives alongside the component file. The story file is for development-only, and it won't be included in your production bundle. In your filesystem, it looks something like this:

We define stories according to the Component Story Format (CSF), an ES6 module-based standard that is easy to write and portable between tools.

The key ingredients are the meta (or default export) that describes the component, and named exports that describe the stories.

The default export metadata controls how Storybook lists your stories and provides information used by addons. For example, here’s the meta (or default export) for a story file Button.stories.js|ts:

Starting with Storybook version 7.0, story titles are analyzed statically as part of the build process. The default export must contain a title property that can be read statically or a component property from which an automatic title can be computed. Using the id property to customize your story URL must also be statically readable.

Use the named exports of a CSF file to define your component’s stories. We recommend you use UpperCamelCase for your story exports. Here’s how to render Button in the “primary” state and export a story called Primary.

By default, stories will render the component defined in the meta (or default export), with the args passed to it. If you need to render something else, you can provide a function to the render property that returns the desired output.

For example, if you want to render a Button inside an Alert, you can define a custom render function like this:

Note how the render function spreads args onto the Button component. This ensures that features like Controls will work as expected, allowing you to dynamically change the Button's properties in the Storybook UI.

You can re-use the same render function across stories by applying it at the meta level:

Whatever you define at the meta level can be overridden at the story level, so you can still customize the rendering of individual stories if needed.

Finally, render functions receive a second context argument, which contains all other details for the story, including parameters, globals, and more.

React Hooks are convenient helper methods to create components using a more streamlined approach. You can use them while creating your component's stories if you need them, although you should treat them as an advanced use case. We recommend args as much as possible when writing your own stories. As an example, here’s a story that uses React Hooks to change the button's state:

By default, Storybook uses the name of the story export as the basis for the story name. However, you can customize the name of your story by adding a name property to the story object. This is useful when you want to provide a more descriptive or user-friendly name for your story.

Your story will now be shown in the sidebar with the given text.

A story is an object that describes how to render a component. You can have multiple stories per component, and those stories can build upon one another. For example, we can add Secondary and Tertiary stories based on our Primary story from above.

What’s more, you can import args to reuse when writing stories for other components, and it's helpful when you’re building composite components. For example, if we make a ButtonGroup story, we might remix two stories from its child component Button.

When Button’s signature changes, you only need to change Button’s stories to reflect the new schema, and ButtonGroup’s stories will automatically be updated. This pattern allows you to reuse your data definitions across the component hierarchy, making your stories more maintainable.

That’s not all! Each of the args from the story function are live editable using Storybook’s Controls panel. It means your team can dynamically change components in Storybook to stress test and find edge cases.

You can also use the Controls panel to edit or save a new story after adjusting its control values.

Addons can enhance args. For instance, Actions auto-detects which args are callbacks and appends a logging function to them. That way, interactions (like clicks) get logged in the actions panel.

Storybook's play function is a convenient helper methods to test component scenarios that otherwise require user intervention. They're small code snippets that execute once your story renders. For example, suppose you wanted to validate a form component, you could write the following story using the play function to check how the component responds when filling in the inputs with information:

You can interact with and debug your story's play function in the interactions panel.

Parameters are Storybook’s method of defining static metadata for stories. A story’s parameters can be used to provide configuration to various addons at the level of a story or group of stories.

For instance, suppose you wanted to test your Button component against a different set of backgrounds than the other components in your app. You might add a component-level backgrounds parameter:

This parameter would instruct the backgrounds feature to reconfigure itself whenever a Button story is selected. Most features and addons are configured via a parameter-based API and can be influenced at a global, component, and story level.

Decorators are a mechanism to wrap a component in arbitrary markup when rendering a story. Components are often created with assumptions about ‘where’ they render. Your styles might expect a theme or layout wrapper, or your UI might expect specific context or data providers.

A simple example is adding padding to a component’s stories. Accomplish this using a decorator that wraps the stories in a div with padding, like so:

Decorators can be more complex and are often provided by addons. You can also configure decorators at the story, component and global level.

Sometimes you may have two or more components created to work together. For instance, if you have a parent List component, it may require child ListItem components.

In such cases, it makes sense to customize the rendering to output the List component with different numbers of ListItem children.

You can also reuse story data from the child ListItem in your List component. That’s easier to maintain because you don’t have to update it in multiple places.

Note that there are disadvantages in writing stories like this as you cannot take full advantage of the args mechanism and composing args as you build even more complex composite components. For more discussion, see the multi component stories workflow documentation.

**Examples:**

Example 1 (unknown):
```unknown
components/
├─ Button/
│  ├─ Button.js | ts | jsx | tsx | vue | svelte
│  ├─ Button.stories.js | ts | jsx | tsx | svelte
```

Example 2 (jsx):
```jsx
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
} satisfies Meta<typeof Button>;
 
export default meta;
```

Example 3 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
} satisfies Meta<typeof Button>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};
```

Example 4 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import { Meta, StoryObj } from '@storybook/your-framework';
 
import { Alert } from './Alert';
import { Button } from './Button';
 
const meta = {
  component: Button,
} satisfies Meta<typeof Button>;
export default meta;
 
type Story = StoryObj<typeof meta>;
 
export const PrimaryInAlert: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
  render: (args) => (
    <Alert>
      Alert text
      <Button {...args} />
    </Alert>
  ),
};
```

---

## Play function | Storybook docs

**URL:** https://storybook.js.org/docs/writing-stories/play-function

**Contents:**
- Play function
- Writing stories with the play function
- Working with the canvas
- Composing stories

Play functions are small snippets of code executed after the story renders. They enable you to interact with your components and test scenarios that otherwise require user intervention.

Storybook's play functions are small code snippets that run once the story finishes rendering. Aided by the interactions panel, it allows you to build component interactions and test scenarios that were impossible without user intervention. For example, if you were working on a registration form and wanted to validate it, you could write the following story with the play function:

See the interaction testing documentation for an overview of the available API events.

When Storybook finishes rendering the story, it executes the steps defined within the play function, interacting with the component and filling the form's information. All of this without the need for user intervention. If you check your Interactions panel, you'll see the step-by-step flow.

Part of the context passed to the play function is a canvas object. This object allows you to query the DOM of the rendered story. It provides a scoped version of the Testing Library queries, so you can use them as you would in a regular test.

If you need to query outside of the canvas (for example, to test a dialog that appears outside of the story root), you can use the screen object available from storybook/test.

Thanks to the Component Story Format, an ES6 module based file format, you can also combine your play functions, similar to other existing Storybook features (e.g., args). For example, if you wanted to verify a specific workflow for your component, you could write the following stories:

By combining the stories, you're recreating the entire component workflow and can spot potential issues while reducing the boilerplate code you need to write.

**Examples:**

Example 1 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { RegistrationForm } from './RegistrationForm';
 
const meta = {
  component: RegistrationForm,
} satisfies Meta<typeof RegistrationForm>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvas to query the DOM
 */
export const FilledForm: Story = {
  play: async ({ canvas, userEvent }) => {
    const emailInput = canvas.getByLabelText('email', {
      selector: 'input',
    });
 
    await userEvent.type(emailInput, 'example-email@email.com', {
      delay: 100,
    });
 
    const passwordInput = canvas.getByLabelText('password', {
      selector: 'input',
    });
 
    await userEvent.type(passwordInput, 'ExamplePassword', {
      delay: 100,
    });
 
    const submitButton = canvas.getByRole('button');
    await userEvent.click(submitButton);
  },
};
```

Example 2 (typescript):
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
  play: async ({ canvas, userEvent }) => {
    // Starts querying from the component's root element
    await userEvent.type(canvas.getByTestId('example-element'), 'something');
    await userEvent.click(canvas.getByRole('button'));
  },
};
```

Example 3 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
import { screen } from 'storybook/test';
 
import { Dialog } from './Dialog';
 
const meta = {
  component: Dialog,
} satisfies Meta<typeof Dialog>;
export default meta;
 
type Story = StoryObj<typeof meta>;
 
export const Open: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open dialog' }));
 
    // Starts querying from the document
    const dialog = screen.getByRole('dialog');
    await expect(dialog).toBeVisible();
  },
};
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
 
/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvas to query the DOM
 */
export const FirstStory: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByTestId('an-element'), 'example-value');
  },
};
 
export const SecondStory: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByTestId('other-element'), 'another value');
  },
};
 
export const CombinedStories: Story = {
  play: async ({ context, canvas, userEvent }) => {
    // Runs the FirstStory and Second story play function before running this story's play function
    await FirstStory.play(context);
    await SecondStory.play(context);
    await userEvent.type(canvas.getByTestId('another-element'), 'random value');
  },
};
```

---

## Decorators | Storybook docs

**URL:** https://storybook.js.org/docs/writing-stories/decorators

**Contents:**
- Decorators
- Wrap stories with extra markup
- “Context” for mocking
  - Using decorators to provide data
- Story decorators
- Component decorators
- Global decorators
- Decorator inheritance

A decorator is a way to wrap a story in extra “rendering” functionality. Many addons define decorators to augment your stories with extra rendering or gather details about how your story renders.

When writing stories, decorators are typically used to wrap stories with extra markup or context mocking.

Some components require a “harness” to render in a useful way. For instance, if a component runs right up to its edges, you might want to space it inside Storybook. Use a decorator to add spacing for all stories of the component.

The second argument to a decorator function is the story context which contains the properties:

This context can be used to adjust the behavior of your decorator based on the story's arguments or other metadata. For example, you could create a decorator that allows you to optionally apply a layout to the story, by defining parameters.pageLayout = 'page' (or 'page-mobile'): :

For another example, see the section on configuring the mock provider, which demonstrates how to use the same technique to change which theme is provided to the component.

If your components are “connected” and require side-loaded data to render, you can use decorators to provide that data in a mocked way without having to refactor your components to take that data as an arg. There are several techniques to achieve this. Depending on exactly how you are loading that data. Read more in the building pages in Storybook section.

To define a decorator for a single story, use the decorators key on a named export:

It is useful to ensure that the story remains a “pure” rendering of the component under test and that any extra HTML or components are used only as decorators. In particular the Source Doc Block works best when you do this.

To define a decorator for all stories of a component, use the decorators key of the default CSF export:

We can also set a decorator for all stories via the decorators export of your .storybook/preview.ts|tsx file (this is the file where you configure all stories):

Like parameters, decorators can be defined globally, at the component level, and for a single story (as we’ve seen).

All decorators relevant to a story will run in the following order once the story renders:

**Examples:**

Example 1 (jsx):
```jsx
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta } from '@storybook/your-framework';
 
import { YourComponent } from './YourComponent';
 
const meta = {
  component: YourComponent,
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof YourComponent>;
 
export default meta;
```

Example 2 (jsx):
```jsx
import React from 'react';
 
// Replace your-framework with the framework you are using (e.g., react-vite, nextjs, nextjs-vite)
import type { Preview } from '@storybook/your-framework';
 
const preview: Preview = {
  decorators: [
    // 👇 Defining the decorator in the preview file applies it to all stories
    (Story, { parameters }) => {
      // 👇 Make it configurable by reading from parameters
      const { pageLayout } = parameters;
      switch (pageLayout) {
        case 'page':
          return (
            // Your page layout is probably a little more complex than this
            <div className="page-layout">
              <Story />
            </div>
          );
        case 'page-mobile':
          return (
            <div className="page-mobile-layout">
              <Story />
            </div>
          );
        default:
          // In the default case, don't apply a layout
          return <Story />;
      }
    },
  ],
};
 
export default preview;
```

Example 3 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
} satisfies Meta<typeof Button>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Primary: Story = {
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
};
```

Example 4 (jsx):
```jsx
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>;
 
export default meta;
```

---

## Parameters | Storybook docs

**URL:** https://storybook.js.org/docs/writing-stories/parameters

**Contents:**
- Parameters
- Story parameters
- Component parameters
- Global parameters
- Rules of parameter inheritance

Parameters are a set of static, named metadata about a story, typically used to control the behavior of Storybook features and addons.

Available parameters are listed in the parameters API reference.

For example, let’s customize the backgrounds feature via a parameter. We’ll use parameters.backgrounds to define which backgrounds appear in the backgrounds toolbar when a story is selected.

We can set a parameter for a single story with the parameters key on a CSF export:

We can set the parameters for all stories of a component using the parameters key on the default CSF export:

We can also set the parameters for all stories via the parameters export of your .storybook/preview.ts|tsx file (this is the file where you configure all stories):

Setting a global parameter is a common way to configure addons. With backgrounds, you configure the list of backgrounds that every story can render in.

The way the global, component and story parameters are combined is:

The merging of parameters is important. This means it is possible to override a single specific sub-parameter on a per-story basis while retaining most of the parameters defined globally.

If you are defining an API that relies on parameters (e.g., an addon) it is a good idea to take this behavior into account.

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

---

## How to write stories | Storybook docs

**URL:** https://storybook.js.org/docs/writing-stories/index

**Contents:**
- How to write stories
- Where to put stories
- Component Story Format
  - Default export
  - Defining stories
    - Custom rendering
    - Working with React Hooks
  - Rename stories
- How to write stories
  - Using the play function

A story captures the rendered state of a UI component. It's an object with annotations that describe the component's behavior and appearance given a set of arguments.

Storybook uses the generic term arguments (args for short) when talking about React’s props, Vue’s props, Angular’s @Input, and other similar concepts.

A component’s stories are defined in a story file that lives alongside the component file. The story file is for development-only, and it won't be included in your production bundle. In your filesystem, it looks something like this:

We define stories according to the Component Story Format (CSF), an ES6 module-based standard that is easy to write and portable between tools.

The key ingredients are the meta (or default export) that describes the component, and named exports that describe the stories.

The default export metadata controls how Storybook lists your stories and provides information used by addons. For example, here’s the meta (or default export) for a story file Button.stories.js|ts:

Starting with Storybook version 7.0, story titles are analyzed statically as part of the build process. The default export must contain a title property that can be read statically or a component property from which an automatic title can be computed. Using the id property to customize your story URL must also be statically readable.

Use the named exports of a CSF file to define your component’s stories. We recommend you use UpperCamelCase for your story exports. Here’s how to render Button in the “primary” state and export a story called Primary.

By default, stories will render the component defined in the meta (or default export), with the args passed to it. If you need to render something else, you can provide a function to the render property that returns the desired output.

For example, if you want to render a Button inside an Alert, you can define a custom render function like this:

Note how the render function spreads args onto the Button component. This ensures that features like Controls will work as expected, allowing you to dynamically change the Button's properties in the Storybook UI.

You can re-use the same render function across stories by applying it at the meta level:

Whatever you define at the meta level can be overridden at the story level, so you can still customize the rendering of individual stories if needed.

Finally, render functions receive a second context argument, which contains all other details for the story, including parameters, globals, and more.

React Hooks are convenient helper methods to create components using a more streamlined approach. You can use them while creating your component's stories if you need them, although you should treat them as an advanced use case. We recommend args as much as possible when writing your own stories. As an example, here’s a story that uses React Hooks to change the button's state:

By default, Storybook uses the name of the story export as the basis for the story name. However, you can customize the name of your story by adding a name property to the story object. This is useful when you want to provide a more descriptive or user-friendly name for your story.

Your story will now be shown in the sidebar with the given text.

A story is an object that describes how to render a component. You can have multiple stories per component, and those stories can build upon one another. For example, we can add Secondary and Tertiary stories based on our Primary story from above.

What’s more, you can import args to reuse when writing stories for other components, and it's helpful when you’re building composite components. For example, if we make a ButtonGroup story, we might remix two stories from its child component Button.

When Button’s signature changes, you only need to change Button’s stories to reflect the new schema, and ButtonGroup’s stories will automatically be updated. This pattern allows you to reuse your data definitions across the component hierarchy, making your stories more maintainable.

That’s not all! Each of the args from the story function are live editable using Storybook’s Controls panel. It means your team can dynamically change components in Storybook to stress test and find edge cases.

You can also use the Controls panel to edit or save a new story after adjusting its control values.

Addons can enhance args. For instance, Actions auto-detects which args are callbacks and appends a logging function to them. That way, interactions (like clicks) get logged in the actions panel.

Storybook's play function is a convenient helper methods to test component scenarios that otherwise require user intervention. They're small code snippets that execute once your story renders. For example, suppose you wanted to validate a form component, you could write the following story using the play function to check how the component responds when filling in the inputs with information:

You can interact with and debug your story's play function in the interactions panel.

Parameters are Storybook’s method of defining static metadata for stories. A story’s parameters can be used to provide configuration to various addons at the level of a story or group of stories.

For instance, suppose you wanted to test your Button component against a different set of backgrounds than the other components in your app. You might add a component-level backgrounds parameter:

This parameter would instruct the backgrounds feature to reconfigure itself whenever a Button story is selected. Most features and addons are configured via a parameter-based API and can be influenced at a global, component, and story level.

Decorators are a mechanism to wrap a component in arbitrary markup when rendering a story. Components are often created with assumptions about ‘where’ they render. Your styles might expect a theme or layout wrapper, or your UI might expect specific context or data providers.

A simple example is adding padding to a component’s stories. Accomplish this using a decorator that wraps the stories in a div with padding, like so:

Decorators can be more complex and are often provided by addons. You can also configure decorators at the story, component and global level.

Sometimes you may have two or more components created to work together. For instance, if you have a parent List component, it may require child ListItem components.

In such cases, it makes sense to customize the rendering to output the List component with different numbers of ListItem children.

You can also reuse story data from the child ListItem in your List component. That’s easier to maintain because you don’t have to update it in multiple places.

Note that there are disadvantages in writing stories like this as you cannot take full advantage of the args mechanism and composing args as you build even more complex composite components. For more discussion, see the multi component stories workflow documentation.

**Examples:**

Example 1 (unknown):
```unknown
components/
├─ Button/
│  ├─ Button.js | ts | jsx | tsx | vue | svelte
│  ├─ Button.stories.js | ts | jsx | tsx | svelte
```

Example 2 (jsx):
```jsx
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
} satisfies Meta<typeof Button>;
 
export default meta;
```

Example 3 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
} satisfies Meta<typeof Button>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};
```

Example 4 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import { Meta, StoryObj } from '@storybook/your-framework';
 
import { Alert } from './Alert';
import { Button } from './Button';
 
const meta = {
  component: Button,
} satisfies Meta<typeof Button>;
export default meta;
 
type Story = StoryObj<typeof meta>;
 
export const PrimaryInAlert: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
  render: (args) => (
    <Alert>
      Alert text
      <Button {...args} />
    </Alert>
  ),
};
```

---

## Tags | Storybook docs

**URL:** https://storybook.js.org/docs/writing-stories/tags

**Contents:**
- Tags
- Built-in tags
- Custom tags
- Applying tags
- Removing tags
- Filtering the sidebar by tags
- Recipes
  - Docs-only stories
  - Combo stories, still tested individually
  - Test cases that don't clutter the sidebar

Tags allow you to control which stories are included in your Storybook, enabling many different uses of the same total set of stories. For example, you can use tags to include/exclude tests from the test runner. For more complex use cases, see the recipes section, below.

The following tags are available in every Storybook project:

The dev, manifest, and test tags are automatically, implicitly applied to every story in your Storybook project.

You're not limited to the built-in tags. Custom tags enable a flexible layer of categorization on top of Storybook's sidebar hierarchy. Sample uses might include:

There are two ways to create a custom tag:

For example, to define an "experimental" tag that is excluded by default in the sidebar, you can add this to your Storybook config:

If defaultFilterSelection is set to include, stories with this tag are selected as included in the filter menu. If set to exclude, stories with this tag are selected as excluded, and must be explicitly included by selecting the tag in the sidebar filter menu. If not set, the tag has no default selection.

You can also use the tags configuration to alter the configuration of built-in tags.

A tag can be any static (i.e. not created dynamically) string, either the built-in tags or custom tags of your own design. To apply tags to a story, assign an array of strings to the tags property. Tags may be applied at the project, component (meta), or story levels.

For example, to apply the autodocs tag to all stories in your project, you can use .storybook/preview.*:

Within a component stories file, you apply tags like so:

To remove a tag from a story, prefix it with !. For example:

Tags can be removed for all stories in your project (in .storybook/preview.*), all stories for a component (in the CSF file meta), or a single story (as above).

Both built-in and custom tags are available as filters in Storybook's sidebar. Selecting a tag in the filter causes the sidebar to only show stories with that tag. Selecting multiple tags shows stories that contain any of those tags.

Pressing the Exclude button for a tag in the filter menu excludes stories with that tag from the sidebar. You can exclude multiple tags, and stories with any of those tags will be excluded. You can also mix inclusion and exclusion.

When no tags are selected, all stories are shown.

In this example, the experimental tag has been excluded and the Documentation tag (autodocs) has been included, so only stories tagged with autodocs but not experimental are shown.

Filtering by tags is a powerful way to focus on a subset of stories, especially in large Storybook projects. When searching, the filter is applied first, so search results are limited to the currently filtered tags.

It can sometimes be helpful to provide example stories for documentation purposes, but you want to keep the sidebar navigation more focused on stories useful for development. By enabling the autodocs tag and removing the dev tag, a story becomes docs-only: appearing only in the docs page and not in Storybook's sidebar.

For a component with many variants, like a Button, a grid of those variants all together can be a helpful way to visualize it. But you may wish to test the variants individually. You can accomplish this with tags like so:

(⚠️ Experimental: While this API is available for all tags, the built-in _test tag is experimental)

If you're using the experimental .test method on CSF Factories, you can alter the default behavior of the _test tag to exclude tests from the sidebar by default. This reduces clutter in the sidebar while still allowing you to run tests for all stories, or adjust the filter to show tests when needed.

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

Example 2 (python):
```python
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Preview } from '@storybook/your-framework';
 
const preview: Preview = {
  /*
   * All stories in your project will have these tags applied:
   * - autodocs
   * - dev (implicit default)
   * - test (implicit default)
   */
  tags: ['autodocs'],
};
 
export default preview;
```

Example 3 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
  /*
   * All stories in this file will have these tags applied:
   * - autodocs
   * - dev (implicit default, inherited from preview)
   * - test (implicit default, inherited from preview)
   */
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const ExperimentalFeatureStory: Story = {
  /*
   * This particular story will have these tags applied:
   * - experimental
   * - autodocs (inherited from meta)
   * - dev (inherited from meta)
   * - test (inherited from meta)
   */
  tags: ['experimental'],
};
```

Example 4 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
  // 👇 Applies to all stories in this file
  tags: ['stable'],
} satisfies Meta<typeof Button>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const ExperimentalFeatureStory: Story = {
  //👇 For this particular story, remove the inherited `stable` tag and apply the `experimental` tag
  tags: ['!stable', 'experimental'],
};
```

---

## Mocking providers | Storybook docs

**URL:** https://storybook.js.org/docs/writing-stories/mocking-data-and-modules/mocking-providers

**Contents:**
- Mocking providers
- Configuring the mock provider

Components can receive data or configuration from context providers. For example, a styled component might access its theme from a ThemeProvider or Redux uses React context to provide components access to app data. To mock a provider, you can wrap your component in a decorator that includes the necessary context.

Note the file extension above (.tsx or .jsx). You may need to adjust your preview file's extension to allow use of JSX, depending on your project's settings.

For another example, reference the Screens chapter of the Intro to Storybook tutorial, where we mock a Redux provider with mock data.

When mocking a provider, it may be necessary to configure the provider to supply a different value for individual stories. For example, you might want to test a component with different themes or user roles.

One way to do this is to define the decorator for each story individually. But if you imagine a scenario where you wish to create stories for each of your components in both light and dark themes, this approach can quickly become cumbersome.

For a better way, with much less repetition, you can use the decorator function's second "context" argument to access a story's parameters and adjust the provided value. This way, you can define the provider once and adjust its value for each story.

For example, we can adjust the decorator from above to read from parameters.theme to determine which theme to provide:

Now, you can define a theme parameter in your stories to adjust the theme provided by the decorator:

This powerful approach allows you to provide any value (theme, user role, mock data, etc.) to your components in a way that is both flexible and maintainable.

**Examples:**

Example 1 (jsx):
```jsx
import React from 'react';
 
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Preview } from '@storybook/your-framework';
 
import { ThemeProvider } from 'styled-components';
 
const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme="default">
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </ThemeProvider>
    ),
  ],
};
 
export default preview;
```

Example 2 (jsx):
```jsx
import React from 'react';
 
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Preview } from '@storybook/your-framework';
 
import { ThemeProvider } from 'styled-components';
 
// themes = { light, dark }
import * as themes from '../src/themes';
 
const preview: Preview = {
  decorators: [
    // 👇 Defining the decorator in the preview file applies it to all stories
    (Story, { parameters }) => {
      // 👇 Make it configurable by reading the theme value from parameters
      const { theme = 'light' } = parameters;
      return (
        <ThemeProvider theme={themes[theme]}>
          <Story />
        </ThemeProvider>
      );
    },
  ],
};
 
export default preview;
```

Example 3 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { Button } from './Button';
 
const meta = {
  component: Button,
} satisfies Meta<typeof Button>;
export default meta;
 
type Story = StoryObj<typeof meta>;
 
// Wrapped in light theme
export const Basic: Story = {};
 
// Wrapped in dark theme
export const Dark: Story = {
  parameters: {
    theme: 'dark',
  },
};
```

---
