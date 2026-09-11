# Storybook - Get-Started

**Pages:** 31

---

## Storybook for SvelteKit | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/frameworks/sveltekit

**Contents:**
- Storybook for SvelteKit
- Install
  - Requirements
- Run Storybook
- Configure
  - Supported features
  - How to mock
    - Mocking links
- Writing native Svelte stories
  - Setup

Storybook for SvelteKit is a framework that makes it easy to develop and test UI components in isolation for SvelteKit applications.

To install Storybook in an existing SvelteKit project, run this command in your project's root directory:

You can then get started writing stories, running tests and documenting your components. For more control over the installation process, refer to the installation guide.

To run Storybook for a particular project, run the following:

To build Storybook, run:

You will find the output in the configured outputDir (default is storybook-static).

This section covers SvelteKit support and configuration options.

All Svelte language features are supported out of the box, as the Storybook framework uses the Svelte compiler directly. However, SvelteKit has some Kit-specific modules that aren't supported. Here's a breakdown of what will and will not work within Storybook:

To mock a SvelteKit import you can define it within parameters.sveltekit_experimental:

The available parameters are documented in the API section, below.

The default link-handling behavior (e.g., when clicking an <a href="..." /> element) is to log an action to the Actions panel.

You can override this by assigning an object to parameters.sveltekit_experimental.hrefs, where the keys are strings representing an href, and the values define your mock. For example:

See the API reference for more information.

Storybook provides a Svelte addon maintained by the community, enabling you to write stories for your Svelte components using the template syntax.

The community actively maintains the Svelte CSF addon but still lacks some features currently available in the official Storybook Svelte framework support. For more information, see the addon's documentation.

If you initialized your project with the Sveltekit framework, the addon has already been installed and configured for you. However, if you're migrating from a previous version, you'll need to take additional steps to enable this feature.

Run the following command to install the addon.

The CLI's add command automates the addon's installation and setup. To install it manually, see our documentation on how to install addons.

Update your Storybook configuration file (i.e., .storybook/main.js|ts) to enable support for this format.

By default, the Svelte addon addon offers zero-config support for Storybook's SvelteKit framework. However, you can extend your Storybook configuration file (i.e., .storybook/main.js|ts) and provide additional addon options. Listed below are the available options and examples of how to use them.

Enabling the legacyTemplate option can introduce a performance overhead and should be used cautiously. For more information, refer to the addon's documentation.

With the Svelte 5 release, Storybook's Svelte CSF addon has been updated to support the new features. This guide will help you migrate to the latest version of the addon. Below is an overview of the major changes in version 5.0 and the steps needed to upgrade your project.

If you are using the Meta component or the meta named export to define the story's metadata (e.g., parameters), you'll need to update your stories to use the new defineMeta function. This function returns an object with the required information, including a Story component that you must use to define your component stories.

If you used the Template component to control how the component renders in the Storybook, this feature was replaced with built-in children support in the Story component, enabling you to compose components and define the UI structure directly in the story.

If you need support for the Template component, the addon provides a feature flag for backward compatibility. For more information, see the configuration options.

With Svelte's slot deprecation and the introduction of reusable snippets, the addon also introduced support for this feature allowing you to extend the Story component and provide a custom snippet to provide dynamic content to your stories. Story accepts a template snippet, allowing you to create dynamic stories without losing reactivity.

If you enabled automatic documentation generation with the autodocs story property, you must replace it with tags. This property allows you to categorize and filter stories based on specific criteria and generate documentation based on the tags applied to the stories.

First, install the framework:

Then, update your .storybook/main.js|ts to change the framework property:

Finally, these packages are now either obsolete or part of @storybook/sveltekit, so you no longer need to depend on them directly. You can remove them (npm uninstall, yarn remove, pnpm remove) from your project:

This framework contributes the following parameters to Storybook, under the sveltekit_experimental namespace:

Type: { enhance: () => void }

Provides mocks for the $app/forms module.

A callback that will be called when a form with use:enhance is submitted.

Type: Record<[path: string], (to: string, event: MouseEvent) => void | { callback: (to: string, event: MouseEvent) => void, asRegex?: boolean }>

If you have an <a /> tag inside your code with the href attribute that matches one or more of the links defined (treated as regex based if the asRegex property is true) the corresponding callback will be called. If no matching hrefs are defined, an action will be logged to the Actions panel. See Mocking links for an example.

Type: See SvelteKit docs

Provides mocks for the $app/navigation module.

Type: See SvelteKit docs

A callback that will be called whenever goto is called. If no function is provided, an action will be logged to the Actions panel.

Type: See SvelteKit docs

A callback that will be called whenever pushState is called. If no function is provided, an action will be logged to the Actions panel.

Type: See SvelteKit docs

A callback that will be called whenever replaceState is called. If no function is provided, an action will be logged to the Actions panel.

Type: See SvelteKit docs

A callback that will be called whenever invalidate is called. If no function is provided, an action will be logged to the Actions panel.

Type: See SvelteKit docs

A callback that will be called whenever invalidateAll is called. If no function is provided, an action will be logged to the Actions panel.

Type: See SvelteKit docs

An object that will be passed to the afterNavigate function, which will be invoked when the onMount event fires.

Type: See SvelteKit docs

Provides mocks for the $app/stores module.

Type: See SvelteKit docs

A partial version of the navigating store.

Type: See SvelteKit docs

A partial version of the page store.

A boolean representing the value of updated (you can also access updated.check() which will be a no-op).

Type: See SvelteKit docs

Provides mocks for the $app/state module.

Type: See SvelteKit docs

A partial version of the navigating store.

Type: See SvelteKit docs

A partial version of the page store.

Type: { current: boolean }

An object representing the current value of updated. You can also access updated.check(), which will be a no-op.

You can pass an options object for additional configuration if needed:

The available options are:

Type: Record<string, any>

Configure options for the framework's builder. For Sveltekit, available options can be found in the Vite builder docs.

Enables or disables automatic documentation generation for component properties. When disabled, Storybook will skip the docgen processing step during build, which can improve build performance.

Disabling docgen can improve build performance for large projects, but argTypes won't be inferred automatically, which will prevent features like Controls and docs from working as expected. To use those features, you will need to define argTypes manually.

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

Example 2 (unknown):
```unknown
npm run storybook
```

Example 3 (unknown):
```unknown
npm run build-storybook
```

Example 4 (jsx):
```jsx
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
 
  import MyComponent from './MyComponent.svelte';
 
  const { Story } = defineMeta({
    component: MyComponent,
  });
</script>
 
<Story
  name="MyStory"
  parameters={{
    sveltekit_experimental: {
      state: {
        page: {
          data: {
            test: 'passed',
          },
        },
        navigating: {
          to: {
            route: { id: '/storybook' },
            params: {},
            url: new URL('http://localhost/storybook'),
          },
        },
        updated: {
          current: true,
        },
      },
    },
  }}
/>
```

---

## Storybook for TanStack React | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/frameworks/tanstack-react/?renderer=react

**Contents:**
- Storybook for TanStack React
- Install
  - Requirements
- Run Storybook
- Configure
  - Routing
    - Rendering a Route
      - Handling dynamic params (e.g., /$id)
    - Rendering nested routes
    - Using router parameters with a non-Route component

Storybook for TanStack React is Storybook's framework integration for TanStack Router and TanStack Start applications built with React and Vite.

It builds on @storybook/react-vite to add router-aware story rendering, automatic router mocking, and mocked TanStack Start server functions. Components that depend on routing or server functions can render inside Storybook without booting your full app runtime.

To install Storybook in an existing TanStack Router or TanStack Start project, run this command in your project's root directory:

You can then get started writing stories, running tests, and documenting your components. For more control over the installation process, refer to the installation guide.

This integration expects a TanStack Router application with @tanstack/react-router available in your project. If your app uses TanStack Start APIs such as server functions, keep the matching TanStack Start packages installed as well.

To run Storybook for a particular project, run the following:

To build Storybook, run:

You will find the output in the configured outputDir (default is storybook-static).

Storybook for TanStack React uses Vite through @storybook/builder-vite and automatically wraps each story in a memory-backed TanStack Router. This gives you a working router context in Storybook without having to boot your full application shell.

Out of the box, it supports these workflows:

Supply a TanStack Route object via parameters.tanstack.router.route. Storybook extracts the route's React component from the route and keeps the route available for typed router configuration.

Supply params alongside routeOverrides under parameters.tanstack.router. The params object is interpolated into the URL, and routeOverrides lets you stub the loader without touching the original route.

For the full set of properties, see Parameters.

When route is a file route connected to your app's route tree, Storybook automatically includes parent layout routes so the story renders inside the same nested hierarchy as the real app. You can also pass the routeTree export from routeTree.gen.ts directly.

Use path to navigate to the specific route, and routeOverrides to stub guards or loaders on ancestor routes so the story can render independently.

If your story renders a regular React component instead of a route object, you can still provide routing context through parameters.tanstack.router.

This is useful when your component reads from hooks such as useRouterState, useSearch, useParams, or useLoaderData, but you do not want to make the route itself the story component.

Use query for search params (e.g., ?tab=details&page=2) and path for a URL fragment (e.g., #section-name) under parameters.tanstack.router:

When a route has a loader or beforeLoad that calls real APIs, you can override those options per story without modifying the original route object. Pass routeOverrides under parameters.tanstack.router. Each key is a route ID and the value can override loader, beforeLoad, validateSearch, loaderDeps, and context.

Use '__root__' as the key to target the root route.

This framework automatically redirects @tanstack/react-router imports to a Storybook-compatible mock layer. That mock re-exports TanStack Router APIs, keeps hooks such as useNavigate(), useSearch(), and useParams() available in stories, and wires navigation attempts into Storybook spies.

For TanStack Start apps, the integration also stubs TanStack Start server and runtime entry points. This is what allows components that depend on server functions or Start-specific runtime modules to render in Storybook without a running Start server.

In practice, this means you can usually render TanStack Start components directly, and createServerFn() handlers are replaced with mock functions that you can observe and override in stories and tests.

If your component imports a TanStack Start server function, Storybook turns that createServerFn().handler(...) result into a mock function. That means you can override it per story with standard mock APIs.

For example, imagine your application code exports a server function like this:

In Storybook, you can override that function for each story:

This is useful for documenting loading, success, and error states without changing your application code.

TanStack Start apps often import server-only packages (e.g. database clients, auth libraries) at module scope inside route files. When Storybook loads the route tree, those imports can crash the browser. The integration handles this at three layers:

The preset already intercepts @tanstack/react-start, @tanstack/react-start/server, @tanstack/start-storage-context, and related TanStack modules. It also replaces createServerFn() handlers with mock functions. You do not need to do anything for these.

When your routes import app-specific server code (e.g. ~/db/client, ~/auth/index.server), use Storybook's mocking with a __mocks__ file to prevent the real module (and its Node.js dependencies) from loading in the browser.

Step 1: Register the mock in .storybook/preview.ts:

Step 2: Create src/db/__mocks__/client.ts next to the real module. Use only import type so no server packages are pulled in:

Why a __mocks__ file instead of automocking?

Storybook's automocking replaces functions but still evaluates the original module and its imports. For modules that import postgres, pg, or other Node.js-only packages, the original module must never be evaluated, because it would crash the browser. A __mocks__ file is the only approach that completely prevents evaluation of the original module and its dependency chain.

Errors like does not provide an export named 'default' or AsyncLocalStorage is not defined mean a server-only module reached the browser.

The fix is to mock the server module itself, not the component or route that uses it. For example, if Dashboard.tsx imports ~/auth/session, and ~/auth/session imports ~/db/client, and ~/db/client imports postgres — mock ~/db/client. The Node.js dependency (postgres) is the smoking gun; mock the closest module to it that you control.

To find that module, walk the error stack trace from top to bottom and stop at the first import you wrote yourself. Then add a __mocks__ file for it.

Two cases where you do not need a mock:

You can use this framework together with TanStack Query to provide a working QueryClient in Storybook and seed query data per story.

TanStack Query is not automatically set up. The recommended approach is to create a single QueryClient in your preview file, clear it between stories via beforeEach, and share the same instance through both parameters.tanstack.router.context and a QueryClientProvider decorator.

In individual stories, use beforeEach to call setQueryData on the shared QueryClient before the component renders. Access it from parameters.tanstack.router.context:

Storybook provides a migration tool for migrating to this framework from the React (Vite) framework, @storybook/react-vite. To migrate, run this command:

This automigration tool performs the following actions:

@storybook/tanstack-react already wraps every story in a TanStack Router automatically, so any manual RouterProvider / createRouter / createMemoryHistory / createRootRoute decorator should be removed after running the automigration. For stories that need a specific route, use parameters.tanstack.router instead.

First, install the framework:

Then, update your .storybook/main.js|ts to change the framework property:

Then similarly update your .storybook/preview.* to import from @storybook/tanstack-react:

@storybook/tanstack-react already wraps every story in a TanStack Router automatically, so any manual RouterProvider / createRouter / createMemoryHistory / createRootRoute decorator should be removed after running the automigration. For stories that need a specific route, use parameters.tanstack.router instead.

Use @storybook/tanstack-react when your components rely on TanStack Router or TanStack Start APIs and you want Storybook to provide router context, typed route parameters, automatic router mocking, and mocked TanStack Start server-function behavior.

Use @storybook/react-vite when your app is a standard React and Vite project without TanStack Router.

Import your application CSS in .storybook/preview.* so it is bundled with the preview:

For more information, see the styling documentation.

Add project-level decorators to apply providers to all stories.

You can also add component-level decorators to apply providers to all stories for a specific component, or story-level decorators to apply providers to a single story.

No. @storybook/tanstack-react runs stories in the browser using a memory-backed router. React Server Components require a server runtime and are not supported. If your component is a Server Component, extract the client-side parts into a Client Component and write stories for that instead.

This usually means a server-only module is being imported in the browser. Check the error stack trace to find the module and add a Storybook mock for it as described in Handling server-only dependencies.

The package exports these additional modules:

TanStack Router-compatible mock implementations used by the framework to provide router behavior in stories. Import from this module when you need direct access to the mock APIs (for example, to assert against navigation spies in tests).

TanStack Start-compatible mock implementations, including a mocked createServerFn() implementation. Import from this module when a story or test needs to interact directly with the Start mock layer.

You can pass an options object for additional configuration if needed:

The available options are:

Type: Record<string, any>

Configure options for the framework's builder. Available options can be found in the Vite builder docs.

This framework contributes the following parameters to Storybook under the tanstack.router namespace:

When route is supplied as a plain object, it may also include TanStack route options such as head, search, and params.parse.

Type: Record<string, unknown>

Router context values injected into the story router.

Type: ResolveParams<Path>

Interpolates route params into the current path. When route is a typed file route, the type is constrained to the param names declared in that route's path (for example, { id: string } for /$id).

Sets the initial URL path for the story router.

Type: Record<string, unknown>

Appends search params to the initial URL.

Type: AnyRoute | route options object

Supplies a route instance directly or creates a temporary story route from route options. Storybook extracts the route's React component automatically from the route.

Type: Partial<Record<string, RouteOverrideOptions>>

Per-route overrides keyed by route ID, applied to the story's route and root route. Use '__root__' to target the root route. Each entry can override loader, beforeLoad, validateSearch, loaderDeps, and context.

Type: ({ storyContext }) => RouterContext

Dynamically computes the router context from the story context. Use this when the router context depends on values that are already available in the story (for example, a QueryClient that is loaded by a story loader).

This is an alternative to context for cases where the router context needs a React context provider (e.g., TanStack Query's QueryClientProvider) that must be rendered in the story before the context value can be accessed.

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

Example 2 (unknown):
```unknown
npm run storybook
```

Example 3 (unknown):
```unknown
npm run build-storybook
```

Example 4 (typescript):
```typescript
import type { Meta, StoryObj } from '@storybook/tanstack-react';
 
import { Route } from './Page';
 
const meta = {
  parameters: {
    layout: 'fullscreen',
    tanstack: {
      router: {
        route: Route, // 👈 Supply the Route here
        // 👇 Rest of these properties are type-safe
        params: { id: '42' },
        query: { tab: 'details' },
      },
    },
  },
} satisfies Meta<typeof Route>;
 
export default meta;
 
type Story = StoryObj<typeof meta>;
 
export const Default: Story = {};
 
export const WithCustomLoader: Story = {
  parameters: {
    tanstack: {
      router: {
        route: Route, // 👈 Supply the Route here
        // 👇 Rest of these properties are type-safe
        params: { id: '42' },
        routeOverrides: {
          '/items/$id': {
            loader: async () => ({
              item: { id: '42', name: 'Loaded inside Storybook' },
            }),
          },
        },
      },
    },
  },
};
```

---

## Storybook for Angular | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/frameworks/angular/?renderer=angular

**Contents:**
- Storybook for Angular
- Install
  - Requirements
- Run Storybook
- Configure
  - Compodoc
    - Automatic setup
    - Manual setup
  - Application-wide providers
  - Angular dependencies

Storybook for Angular is a framework that makes it easy to develop and test UI components in isolation for Angular applications. It uses Angular builders and integrates with Compodoc to provide automatic documentation generation.

To install Storybook in an existing Angular project, run this command in your project's root directory:

You can then get started writing stories, running tests and documenting your components. For more control over the installation process, refer to the installation guide.

Angular ≥ 18.0 < 22.0

To run Storybook for a particular project, run the following:

To build Storybook, run:

You will find the output in the configured outputDir (default is dist/storybook/<your-project>).

To make the most out of Storybook in your Angular project, you can set up Compodoc integration and Storybook decorators based on your project needs.

You can include JSDoc comments above components, directives, and other parts of your Angular code to include documentation for those elements. Compodoc uses these comments to generate documentation for your application. In Storybook, it is useful to add explanatory comments above @Inputs and @Outputs, since these are the main elements that Storybook displays in its user interface. The @Inputs and @Outputs are elements you can interact with in Storybook, such as controls.

When installing Storybook via npx storybook@latest init, you can set up Compodoc automatically.

If you have already installed Storybook, you can set up Compodoc manually.

Install the following dependencies:

Add the following option to your Storybook Builder:

Go to your .storybook/preview.ts and add the following:

If your component relies on application-wide providers, like the ones defined by BrowserAnimationsModule or any other modules that use the forRoot pattern to provide a ModuleWithProviders, you can apply the applicationConfig decorator to all stories for that component. This will provide them with the bootstrapApplication function, used to bootstrap the component in Storybook.

If your component has dependencies on other Angular directives and modules, these can be supplied using the moduleMetadata decorator either for all stories of a component or for individual stories.

The easiest way to install the Angular framework is to run the upgrade command, but you can also set it up manually. First, install the framework:

Then, update your .storybook/main.js|ts to change the framework property:

Finally, update your angular.json to include the Storybook builder:

The Storybook Angular builder is a way to run Storybook in an Angular workspace. It is a drop-in replacement for running storybook dev and storybook build directly.

You can run npx storybook@latest automigrate to let Storybook detect and automatically fix your configuration. Otherwise, you can follow the next steps to adjust your configuration manually.

Go to your angular.json and add storybook and build-storybook entries in your project's architect section, as shown above.

Then, adjust your package.json script section, to replace the existing Storybook scripts with the Angular CLI commands:

Note that compodoc is now built into @storybook/angular; you don't have to call it explicitly. If you were running compodoc in your package.json scripts, you can remove the related script:

In case you have multiple projects, you will have to adjust your angular.json and package.json as described above for each project you want to use Storybook with. Please note that each project should have a dedicated .storybook folder placed at the project's root directory.

You can run npx storybook@latest init sequentially for each project to set up Storybook for each of them to automatically create the .storybook folder and create the necessary configuration in your angular.json.

You can then combine multiple Storybooks with Storybook composition.

These are common options you may need for the Angular builder:

The full list of options can be found in the Angular builder schemas:

You can pass an options object for additional configuration if needed:

The available options are:

Type: Record<string, any>

Configure options for the framework's builder. For this framework, available options can be found in the Webpack builder docs.

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

Example 2 (unknown):
```unknown
ng run <your-project>:storybook
```

Example 3 (unknown):
```unknown
ng run <your-project>:build-storybook
```

Example 4 (elixir):
```elixir
npm install --save-dev @compodoc/compodoc
```

---

## Storybook for SvelteKit | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/frameworks/sveltekit/?renderer=svelte

**Contents:**
- Storybook for SvelteKit
- Install
  - Requirements
- Run Storybook
- Configure
  - Supported features
  - How to mock
    - Mocking links
- Writing native Svelte stories
  - Setup

Storybook for SvelteKit is a framework that makes it easy to develop and test UI components in isolation for SvelteKit applications.

To install Storybook in an existing SvelteKit project, run this command in your project's root directory:

You can then get started writing stories, running tests and documenting your components. For more control over the installation process, refer to the installation guide.

To run Storybook for a particular project, run the following:

To build Storybook, run:

You will find the output in the configured outputDir (default is storybook-static).

This section covers SvelteKit support and configuration options.

All Svelte language features are supported out of the box, as the Storybook framework uses the Svelte compiler directly. However, SvelteKit has some Kit-specific modules that aren't supported. Here's a breakdown of what will and will not work within Storybook:

To mock a SvelteKit import you can define it within parameters.sveltekit_experimental:

The available parameters are documented in the API section, below.

The default link-handling behavior (e.g., when clicking an <a href="..." /> element) is to log an action to the Actions panel.

You can override this by assigning an object to parameters.sveltekit_experimental.hrefs, where the keys are strings representing an href, and the values define your mock. For example:

See the API reference for more information.

Storybook provides a Svelte addon maintained by the community, enabling you to write stories for your Svelte components using the template syntax.

The community actively maintains the Svelte CSF addon but still lacks some features currently available in the official Storybook Svelte framework support. For more information, see the addon's documentation.

If you initialized your project with the Sveltekit framework, the addon has already been installed and configured for you. However, if you're migrating from a previous version, you'll need to take additional steps to enable this feature.

Run the following command to install the addon.

The CLI's add command automates the addon's installation and setup. To install it manually, see our documentation on how to install addons.

Update your Storybook configuration file (i.e., .storybook/main.js|ts) to enable support for this format.

By default, the Svelte addon addon offers zero-config support for Storybook's SvelteKit framework. However, you can extend your Storybook configuration file (i.e., .storybook/main.js|ts) and provide additional addon options. Listed below are the available options and examples of how to use them.

Enabling the legacyTemplate option can introduce a performance overhead and should be used cautiously. For more information, refer to the addon's documentation.

With the Svelte 5 release, Storybook's Svelte CSF addon has been updated to support the new features. This guide will help you migrate to the latest version of the addon. Below is an overview of the major changes in version 5.0 and the steps needed to upgrade your project.

If you are using the Meta component or the meta named export to define the story's metadata (e.g., parameters), you'll need to update your stories to use the new defineMeta function. This function returns an object with the required information, including a Story component that you must use to define your component stories.

If you used the Template component to control how the component renders in the Storybook, this feature was replaced with built-in children support in the Story component, enabling you to compose components and define the UI structure directly in the story.

If you need support for the Template component, the addon provides a feature flag for backward compatibility. For more information, see the configuration options.

With Svelte's slot deprecation and the introduction of reusable snippets, the addon also introduced support for this feature allowing you to extend the Story component and provide a custom snippet to provide dynamic content to your stories. Story accepts a template snippet, allowing you to create dynamic stories without losing reactivity.

If you enabled automatic documentation generation with the autodocs story property, you must replace it with tags. This property allows you to categorize and filter stories based on specific criteria and generate documentation based on the tags applied to the stories.

First, install the framework:

Then, update your .storybook/main.js|ts to change the framework property:

Finally, these packages are now either obsolete or part of @storybook/sveltekit, so you no longer need to depend on them directly. You can remove them (npm uninstall, yarn remove, pnpm remove) from your project:

This framework contributes the following parameters to Storybook, under the sveltekit_experimental namespace:

Type: { enhance: () => void }

Provides mocks for the $app/forms module.

A callback that will be called when a form with use:enhance is submitted.

Type: Record<[path: string], (to: string, event: MouseEvent) => void | { callback: (to: string, event: MouseEvent) => void, asRegex?: boolean }>

If you have an <a /> tag inside your code with the href attribute that matches one or more of the links defined (treated as regex based if the asRegex property is true) the corresponding callback will be called. If no matching hrefs are defined, an action will be logged to the Actions panel. See Mocking links for an example.

Type: See SvelteKit docs

Provides mocks for the $app/navigation module.

Type: See SvelteKit docs

A callback that will be called whenever goto is called. If no function is provided, an action will be logged to the Actions panel.

Type: See SvelteKit docs

A callback that will be called whenever pushState is called. If no function is provided, an action will be logged to the Actions panel.

Type: See SvelteKit docs

A callback that will be called whenever replaceState is called. If no function is provided, an action will be logged to the Actions panel.

Type: See SvelteKit docs

A callback that will be called whenever invalidate is called. If no function is provided, an action will be logged to the Actions panel.

Type: See SvelteKit docs

A callback that will be called whenever invalidateAll is called. If no function is provided, an action will be logged to the Actions panel.

Type: See SvelteKit docs

An object that will be passed to the afterNavigate function, which will be invoked when the onMount event fires.

Type: See SvelteKit docs

Provides mocks for the $app/stores module.

Type: See SvelteKit docs

A partial version of the navigating store.

Type: See SvelteKit docs

A partial version of the page store.

A boolean representing the value of updated (you can also access updated.check() which will be a no-op).

Type: See SvelteKit docs

Provides mocks for the $app/state module.

Type: See SvelteKit docs

A partial version of the navigating store.

Type: See SvelteKit docs

A partial version of the page store.

Type: { current: boolean }

An object representing the current value of updated. You can also access updated.check(), which will be a no-op.

You can pass an options object for additional configuration if needed:

The available options are:

Type: Record<string, any>

Configure options for the framework's builder. For Sveltekit, available options can be found in the Vite builder docs.

Enables or disables automatic documentation generation for component properties. When disabled, Storybook will skip the docgen processing step during build, which can improve build performance.

Disabling docgen can improve build performance for large projects, but argTypes won't be inferred automatically, which will prevent features like Controls and docs from working as expected. To use those features, you will need to define argTypes manually.

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

Example 2 (unknown):
```unknown
npm run storybook
```

Example 3 (unknown):
```unknown
npm run build-storybook
```

Example 4 (jsx):
```jsx
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
 
  import MyComponent from './MyComponent.svelte';
 
  const { Story } = defineMeta({
    component: MyComponent,
  });
</script>
 
<Story
  name="MyStory"
  parameters={{
    sveltekit_experimental: {
      state: {
        page: {
          data: {
            test: 'passed',
          },
        },
        navigating: {
          to: {
            route: { id: '/storybook' },
            params: {},
            url: new URL('http://localhost/storybook'),
          },
        },
        updated: {
          current: true,
        },
      },
    },
  }}
/>
```

---

## Storybook for Vue with Vite | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/frameworks/vue3-vite

**Contents:**
- Storybook for Vue with Vite
- Install
  - Requirements
- Run Storybook
- Configure
  - Extending the Vue application
  - Using vue-component-meta
    - Support for multiple component types
    - Prop description and JSDoc tag annotations
    - Events types extraction

Storybook for Vue & Vite is a framework that makes it easy to develop and test UI components in isolation for Vue applications built with Vite.

To install Storybook in an existing Vue project, run this command in your project's root directory:

You can then get started writing stories, running tests and documenting your components. For more control over the installation process, refer to the installation guide.

To run Storybook for a particular project, run the following:

To build Storybook, run:

You will find the output in the configured outputDir (default is storybook-static).

Storybook for Vue 3 with Vite is designed to work out of the box with minimal configuration. This section covers configuration options for the framework.

Storybook creates a Vue 3 application for your component preview. When using global custom components (app.component), directives (app.directive), extensions (app.use), or other application methods, you will need to configure those in the ./storybook/preview.ts file.

Therefore, Storybook provides you with a setup function exported from this package. This function receives your Storybook instance as a callback, which you can interact with and add your custom configuration.

vue-component-meta is only available in Storybook ≥ 8. It is currently an opt-in, but it will become the default in a future version of Storybook.

vue-component-meta is a tool maintained by the Vue team that extracts metadata from Vue components. Storybook can use it to generate the controls for your stories and documentation. It's a more full-featured alternative to vue-docgen-api and is recommended for most projects.

If you want to use vue-component-meta, you can configure it in your .storybook/main.js|ts file:

vue-component-meta comes with many benefits and enables more documentation features, such as:

vue-component-meta supports all types of Vue components (including SFC, functional, composition/options API components) from .vue, .ts, .tsx, .js, and .jsx files.

It also supports both default and named component exports.

To describe a prop, including tags, you can use JSDoc comments in your component's props definition:

The props definition above will generate the following controls:

To provide a type for an emitted event, you can use TypeScript types (including JSDoc comments) in your component's defineEmits call:

Which will generate the following controls:

The slot types are automatically extracted from your component definition and displayed in the controls panel.

If you use defineSlots, you can describe each slot using JSDoc comments in your component's slots definition:

The definition above will generate the following controls:

The properties and methods exposed by your component are automatically extracted and displayed in the Controls panel.

The definition above will generate the following controls:

If you're working with a project that relies on tsconfig references to link to other existing configuration files (e.g., tsconfig.app.json, tsconfig.node.json), we recommend that you update your .storybook/main.js|ts configuration file and add the following:

This is not a limitation of Storybook, but how vue-component-meta works. For more information, refer to the appropriate GitHub issue.

Otherwise, you might face missing component types/descriptions or unresolvable import aliases like @/some/import.

First, install the framework:

Then, update your .storybook/main.js|ts to change the framework property:

Vue 2 entered End of Life (EOL) on December 31st, 2023, and is no longer maintained by the Vue team. As a result, Storybook no longer supports Vue 2. We recommend you upgrade your project to Vue 3, which Storybook fully supports. If that's not an option, you can still use Storybook with Vue 2 by installing the latest version of Storybook 7 with the following command:

You can pass an options object for additional configuration if needed:

Type: Record<string, any>

Configure options for the framework's builder. For this framework, available options can be found in the Vite builder docs.

Type: 'vue-docgen-api' | 'vue-component-meta' | boolean

Default: 'vue-docgen-api'

Choose which docgen tool to use when generating controls for your components. See Using vue-component-meta for more information.

Set to false to disable docgen processing entirely for improved build performance.

Disabling docgen can improve build performance for large projects, but argTypes won't be inferred automatically, which will prevent features like Controls and docs from working as expected. To use those features, you will need to define argTypes manually.

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

Example 2 (unknown):
```unknown
npm run storybook
```

Example 3 (unknown):
```unknown
npm run build-storybook
```

Example 4 (vue):
```vue
import { setup } from '@storybook/vue3-vite';
 
setup((app) => {
  app.use(MyPlugin);
  app.component('my-component', MyComponent);
  app.mixin({
    // My mixin
  });
});
```

---

## Storybook for React Native Web | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/frameworks/react-native-web-vite/?renderer=react-native-web

**Contents:**
- Storybook for React Native Web
- Install
  - Requirements
- Run Storybook
- React Native vs React Native Web
  - Comparison
  - Using both React Native and React Native Web
- FAQ
  - How do I migrate from the React Native Web addon?
- API

Storybook for React Native Web is a framework that makes it easy to develop and test UI components in isolation for React Native. It uses Vite to build your components for web browsers.

In addition to React Native Web, Storybook supports on-device React Native development. If you're unsure what's right for you, read our comparison.

To install Storybook in an existing React Native project, run this command in your project's root directory:

You can then get started writing stories, running tests and documenting your components. For more control over the installation process, refer to the installation guide.

React Native Web ≥ 0.19

To run Storybook for a particular project, run the following:

To build Storybook, run:

You will find the output in the configured outputDir (default is storybook-static).

If you’re building React Native (RN) components, Storybook has two options: Native and Web.

Both options provide a catalog of your stories that hot refreshes as you edit the code in your favorite editor. However, their implementations are quite different:

So, which option is right for you?

Native. You should choose this option if you want:

Web. You should choose this option if you want:

Both. It’s also possible to use both options together. This increases Storybook’s install footprint but is a good option if you want native fidelity in addition to all of the web features. Learn more below.

The easiest way to use React Native and React Native Web is to select the "Both" option when installing Storybook. This will install and create configurations for both environments, allowing you to run Storybook for both in the same project.

When you select "Both", the installation will:

After installation, you'll see instructions for both environments:

However, you can install them separately if one version is installed. You can add a React Native Web Storybook alongside an existing React Native Storybook by running the install command and selecting "React Native Web" in the setup wizard, and vice versa.

The React Native Web addon was a Webpack-based precursor to the React Native Web Vite framework (i.e., @storybook/react-native-web-vite). If you're using the addon, you should migrate to the framework, which is faster, more stable, maintained, and better documented. To do so, follow the steps below.

Run the following command to upgrade Storybook to the latest version:

This framework is designed to work with Storybook 8.5 and above for the best experience. We won't be able to provide support if you're using an older Storybook version.

Install the framework and its peer dependencies:

Update your .storybook/main.js|ts to change the framework property and remove the @storybook/addon-react-native-web addon:

Finally, remove the addon and similar packages (i.e., @storybook/react-webpack5 and @storybook/addon-react-native-web) from your project.

You can pass an options object for additional configuration if needed:

Let's say you need to transpile a library called my-library that is not transpiled for web by default. You can add it to the modulesToTranspile option.

Type: Record<string, any>

Configure options for the framework's builder. For this framework, available options can be found in the Vite builder docs.

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

Example 2 (unknown):
```unknown
npm run storybook
```

Example 3 (unknown):
```unknown
npm run build-storybook
```

Example 4 (elixir):
```elixir
npx storybook@latest upgrade
```

---

## Storybook for Next.js with Vite | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/frameworks/nextjs-vite

**Contents:**
- Storybook for Next.js with Vite
- Install
  - Requirements
- Choose between Vite and Webpack
- Run Storybook
- Configure
  - Next.js's Image component
    - Local images
    - Remote images
  - Next.js font optimization

Storybook for Next.js (Vite) is the recommended framework for developing and testing UI components in isolation for Next.js applications. It uses Vite for faster builds, better performance and Storybook Testing support.

To install Storybook in an existing Next.js project, run this command in your project's root directory:

You can then get started writing stories, running tests and documenting your components. For more control over the installation process, refer to the installation guide.

This Vite-based framework offers several advantages over the Webpack-based @storybook/nextjs framework, and is the recommended option:

Storybook will automatically detect your project and select the nextjs-vite framework unless your project has custom Webpack or Babel configurations. If you have custom configurations, Storybook will ask you which framework to install.

Choose nextjs-vite if you're willing to migrate existing Babel or Webpack configurations to Vite. Choose nextjs (Webpack 5) if you need to keep your existing Webpack/Babel setup.

To run Storybook for a particular project, run the following:

To build Storybook, run:

You will find the output in the configured outputDir (default is storybook-static).

Storybook for Next.js with Vite supports many Next.js features including:

This framework allows you to use Next.js's next/image with no configuration.

Local images are supported.

Remote images are also supported.

next/font is partially supported in Storybook. The packages next/font/google and next/font/local are supported.

You don't have to do anything. next/font/google is supported out of the box.

For local fonts you have to define the src property. The path is relative to the directory where the font loader function is called.

If the following component defines your localFont like this:

The Vite-based framework automatically handles font path mapping, so you don't need to configure staticDirs for fonts like you would with the Webpack-based framework.

The following features are not supported (yet). Support for these features might be planned for the future:

Occasionally fetching fonts from Google may fail as part of your Storybook build step. It is highly recommended to mock these requests, as those failures can cause your pipeline to fail as well. Next.js supports mocking fonts via a JavaScript module located where the env var NEXT_FONT_GOOGLE_MOCKED_RESPONSES references.

For example, using GitHub Actions:

Your mocked fonts will look something like this:

Next.js's router is automatically stubbed for you so that when the router is interacted with, all of its interactions are automatically logged to the Actions panel.

You should only use next/router in the pages directory. In the app directory, it is necessary to use next/navigation.

Per-story overrides can be done by adding a nextjs.router property onto the story parameters. The framework will shallowly merge whatever you put here into the router.

These overrides can also be applied to all stories for a component or all stories in your project. Standard parameter inheritance rules apply.

The default values on the stubbed router are as follows (see globals for more details on how globals work).

Additionally, the router object contains all of the original methods (such as push(), replace(), etc.) as mock functions that can be manipulated and asserted on using regular mock APIs.

To override these defaults, you can use parameters and beforeEach:

Please note that next/navigation can only be used in components/pages in the app directory.

If your story imports components that use next/navigation, you need to set the parameter nextjs.appDirectory to true in for that component's stories:

If your Next.js project uses the app directory for every page (in other words, it does not have a pages directory), you can set the parameter nextjs.appDirectory to true in the .storybook/preview.tsx file to apply it to all stories.

Per-story overrides can be done by adding a nextjs.navigation property onto the story parameters. The framework will shallowly merge whatever you put here into the router.

These overrides can also be applied to all stories for a component or all stories in your project. Standard parameter inheritance rules apply.

The useSelectedLayoutSegment, useSelectedLayoutSegments, and useParams hooks are supported in Storybook. You have to set the nextjs.navigation.segments parameter to return the segments or the params you want to use.

With the above configuration, the component rendered in the stories would receive the following values from the hooks:

To use useParams, you have to use a segments array where each element is an array containing two strings. The first string is the param key and the second string is the param value.

With the above configuration, the component rendered in the stories would receive the following values from the hooks:

These overrides can also be applied to a single story or all stories in your project. Standard parameter inheritance rules apply.

The default value of nextjs.navigation.segments is [] if not set.

The default values on the stubbed navigation context are as follows:

Additionally, the router object contains all of the original methods (such as push(), replace(), etc.) as mock functions that can be manipulated and asserted on using regular mock APIs.

To override these defaults, you can use parameters and beforeEach:

next/head is supported out of the box. You can use it in your stories like you would in your Next.js application. Please keep in mind, that the Head children are placed into the head element of the iframe that Storybook uses to render your stories.

Global Sass/SCSS stylesheets are also supported without any additional configuration. Just import them into the preview config file.

This will automatically include any of your custom Sass configurations in your Next.js config file.

CSS modules work as expected.

The built-in CSS-in-JS solution for Next.js is styled-jsx, and this framework supports that out of the box, too, with zero config.

Tailwind in Next.js is supported via PostCSS. Storybook will automatically handle the PostCSS config for you, including any custom PostCSS configuration, so that you can import your global CSS directly into the preview config file:

Next.js lets you customize PostCSS config. Thus this framework will automatically handle your PostCSS config for you.

Absolute imports from the root directory are supported.

Also OK for global styles in .storybook/preview.tsx!

Absolute imports cannot be mocked in stories/tests. See the Mocking modules section for more information.

Module aliases are also supported.

As an alternative to module aliases, you can use subpath imports to import modules. This follows Node package standards and has benefits when mocking modules.

To configure subpath imports, you define the imports property in your project's package.json file. This property maps the subpath to the actual file path. The example below configures subpath imports for all modules in the project:

Because subpath imports replace module aliases, you can remove the path aliases from your TypeScript configuration.

Which can then be used like this:

Components often depend on modules that are imported into the component file. These can be from external packages or internal to your project. When rendering those components in Storybook or testing them, you may want to mock those modules to control and assert their behavior.

This framework provides mocks for many of Next.js' internal modules:

To mock other modules, use automocking or one of the alternative methods documented in the mocking modules guide.

Next.js allows for Runtime Configuration which lets you import a handy getConfig function to get certain configuration defined in your next.config.js file at runtime.

In the context of Storybook with this framework, you can expect Next.js's Runtime Configuration feature to work just fine.

Note, because Storybook doesn't server render your components, your components will only see what they normally see on the client side (i.e. they won't see serverRuntimeConfig but will see publicRuntimeConfig).

For example, consider the following Next.js config:

Calls to getConfig would return the following object when called within Storybook:

You can customize the Vite configuration used by Storybook in your .storybook/main.js|ts file. By default, Storybook's configuration extends the Vite configuration used by your project, but you can configure it to not do so.

Not all Vite modifications are copy/paste-able between next.config.js and .storybook/main.js|ts. It is recommended to do your research on how to properly make your modification to Storybook's Vite config and on how Vite works.

Storybook handles most Typescript configurations, but this framework adds additional support for Next.js's support for Absolute Imports and Module path aliases. In short, it takes into account your tsconfig.json's baseUrl and paths. Thus, a tsconfig.json like the one below would work out of the box.

If your app uses React Server Components (RSC), Storybook can render them in stories in the browser.

To enable this set the experimentalRSC feature flag in your .storybook/main.js|ts config:

Setting this flag automatically wraps your story in a Suspense wrapper, which is able to render asynchronous components in NextJS's version of React.

If this wrapper causes problems in any of your existing stories, you can selectively disable it using the react.rsc parameter at the global/component/story level:

Note that wrapping your server components in Suspense does not help if your server components access server-side resources like the file system or Node-specific libraries. To work around this, you'll need to mock out your data access layer using Vite aliases or an addon like storybook-addon-module-mock.

If your server components access data via the network, we recommend using the MSW Storybook Addon to mock network requests.

In the future we will provide better mocking support in Storybook and support for Server Actions.

Storybook provides a migration tool for migrating to this framework from the Webpack-based Next.js framework, @storybook/nextjs. To migrate, run this command:

This automigration tool performs the following actions:

If your project has custom Webpack configurations in .storybook/main.js|ts (via webpackFinal), you'll need to migrate those to Vite configuration (via viteFinal) after running this automigration. See the Vite builder documentation for more information.

First, install the framework:

Then, update your .storybook/main.js|ts to change the framework property:

If your Storybook configuration contains custom Webpack operations in webpackFinal, you will likely need to create equivalents in viteFinal.

For more information, see the Vite builder documentation.

Finally, if you were using Storybook plugins to integrate with Next.js, those are no longer necessary when using this framework and can be removed:

Next.js pages can fetch data directly within server components in the app directory, which often include module imports that only run in a node environment. This does not (currently) work within Storybook, because if you import from a Next.js page file containing those node module imports in your stories, your Storybook's Vite build will crash because those modules will not run in a browser. To get around this, you can extract the component in your page file into a separate file and import that pure component in your stories. Or, if that's not feasible for some reason, you can configure Vite to handle those modules in your Storybook's viteFinal configuration.

Make sure you are treating image imports the same way you treat them when using next/image in normal development.

Before using this framework, image imports would import the raw path to the image (e.g. 'static/media/stories/assets/logo.svg'). Now image imports work the "Next.js way", meaning that you now get an object when importing an image. For example:

Therefore, if something in Storybook isn't showing the image properly, make sure you expect the object to be returned from an import instead of only the asset path.

See local images for more detail on how Next.js treats static image imports.

sharp is a dependency of Next.js's image optimization feature. If you see this error, you need to install sharp in your project.

You can refer to the Install sharp to Use Built-In Image Optimization in the Next.js documentation for more information.

We recommend using @storybook/nextjs-vite (this framework) for most projects because it offers:

However, if your project has custom Webpack configurations that are incompatible with Vite, or you need specific Webpack features, you should use @storybook/nextjs (Webpack 5) instead.

The @storybook/nextjs-vite package exports several modules that enable you to mock Next.js's internal behavior.

Type: typeof import('next/cache')

This module exports mocked implementations of the next/cache module's exports. You can use it to create your own mock implementations or assert on mock calls in a story's play function.

Type: cookies, headers and draftMode from Next.js

This module exports writable mocked implementations of the next/headers module's exports. You can use it to set up cookies or headers that are read in your story, and to later assert that they have been called.

Next.js's default headers() export is read-only, but this module exposes methods allowing you to write to the headers:

For cookies, you can use the existing API to write them. E.g., cookies().set('firstName', 'Jane').

Because headers(), cookies() and their sub-functions are all mocks you can use any mock utilities in your stories, like headers().getAll.mock.calls.

Type: typeof import('next/navigation') & getRouter: () => ReturnType<typeof import('next/navigation')['useRouter']>

This module exports mocked implementations of the next/navigation module's exports. It also exports a getRouter function that returns a mocked version of Next.js's router object from useRouter, allowing the properties to be manipulated and asserted on. You can use it mock implementations or assert on mock calls in a story's play function.

Type: typeof import('next/router') & getRouter: () => ReturnType<typeof import('next/router')['useRouter']>

This module exports mocked implementations of the next/router module's exports. It also exports a getRouter function that returns a mocked version of Next.js's router object from useRouter, allowing the properties to be manipulated and asserted on. You can use it mock implementations or assert on mock calls in a story's play function.

You can pass an options object for additional configuration if needed:

The available options are:

Type: Record<string, any>

Configure options for the framework's builder. For Next.js with Vite, available options can be found in the Vite builder docs.

Props to pass to every instance of next/image. See next/image docs for more details.

The absolute path to the next.config.js file. This is necessary if you have a custom next.config.js file that is not in the root directory of your project.

This framework contributes the following parameters to Storybook, under the nextjs namespace:

If your story imports components that use next/navigation, you need to set the parameter nextjs.appDirectory to true. Because this is a parameter, you can apply it to a single story, all stories for a component, or every story in your Storybook. See Next.js Navigation for more details.

The router object that is passed to the next/navigation context. See Next.js's navigation docs for more details.

The router object that is passed to the next/router context. See Next.js's router docs for more details.

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

Example 2 (unknown):
```unknown
npm run storybook
```

Example 3 (unknown):
```unknown
npm run build-storybook
```

Example 4 (jsx):
```jsx
import Image from 'next/image';
import profilePic from '../public/me.png';
 
function Home() {
  return (
    <>
      <h1>My Homepage</h1>
      <Image
        src={profilePic}
        alt="Picture of the author"
        // width={500} automatically provided
        // height={500} automatically provided
        // blurDataURL="../public/me.png" set to equal the image itself (for this framework)
        // placeholder="blur" // Optional blur-up while loading
      />
      <p>Welcome to my homepage!</p>
    </>
  );
}
```

---

## Storybook for React with Vite | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/frameworks/react-vite/?renderer=react

**Contents:**
- Storybook for React with Vite
- Install
  - Requirements
- Run Storybook
- FAQ
  - How do I migrate from the React Webpack framework?
  - How do I manually install the React framework?
- API
  - Options
    - builder

Storybook for React & Vite is a framework that makes it easy to develop and test UI components in isolation for React applications built with Vite.

To install Storybook in an existing React project, run this command in your project's root directory:

You can then get started writing stories, running tests and documenting your components. For more control over the installation process, refer to the installation guide.

To run Storybook for a particular project, run the following:

To build Storybook, run:

You will find the output in the configured outputDir (default is storybook-static).

The upgrade command should prompt you to migrate to @storybook/react-vite when you run it:

In case that auto-migration does not work for your project, refer to the manual installation instructions below.

First, install the framework:

Then, update your .storybook/main.js|ts to change the framework property:

You can pass an options object for additional configuration if needed:

Type: Record<string, any>

Configure options for the framework's builder. For this framework, available options can be found in the Vite builder docs.

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

Example 2 (unknown):
```unknown
npm run storybook
```

Example 3 (unknown):
```unknown
npm run build-storybook
```

Example 4 (elixir):
```elixir
npx storybook@latest upgrade
```

---

## Storybook for Preact with Vite | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/frameworks/preact-vite

**Contents:**
- Storybook for Preact with Vite
- Install
  - Requirements
- Run Storybook
- FAQ
  - How do I manually install the Preact framework?
- API
  - Options
    - builder

Storybook for Preact & Vite is a framework that makes it easy to develop and test UI components in isolation for Preact applications built with Vite.

To install Storybook in an existing Preact project, run this command in your project's root directory:

You can then get started writing stories, running tests and documenting your components. For more control over the installation process, refer to the installation guide.

To run Storybook for a particular project, run the following:

To build Storybook, run:

You will find the output in the configured outputDir (default is storybook-static).

First, install the framework:

Then, update your .storybook/main.js|ts to change the framework property:

You can pass an options object for additional configuration if needed:

Type: Record<string, any>

Configure options for the framework's builder. For this framework, available options can be found in the Vite builder docs.

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

Example 2 (unknown):
```unknown
npm run storybook
```

Example 3 (unknown):
```unknown
npm run build-storybook
```

Example 4 (elixir):
```elixir
npm install --save-dev @storybook/preact-vite
```

---

## Storybook for React with Webpack | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/frameworks/react-webpack5/?renderer=react

**Contents:**
- Storybook for React with Webpack
- Install
  - Requirements
- Run Storybook
- Configure
  - Create React App (CRA)
  - Manually initialized apps
- FAQ
  - How do I manually install the React Webpack framework?
  - How do I migrate to the React Vite framework?

Storybook for React & Webpack is a framework that makes it easy to develop and test UI components in isolation for React applications built with Webpack.

We recommend using @storybook/react-vite for most React projects. The Vite-based framework is faster, more modern, and offers better support for testing features.

Use this Webpack-based framework (@storybook/react-webpack5) only if you need specific Webpack features not available in Vite.

To install Storybook in an existing React project, run this command in your project's root directory:

You can then get started writing stories, running tests and documenting your components. For more control over the installation process, refer to the installation guide.

To run Storybook for a particular project, run the following:

To build Storybook, run:

You will find the output in the configured outputDir (default is storybook-static).

Support for Create React App is handled by @storybook/preset-create-react-app.

This preset enables support for all CRA features, including Sass/SCSS and TypeScript.

If you're working on an app that was initialized manually (i.e., without the use of CRA), ensure that your app has react-dom included as a dependency. Failing to do so can lead to unforeseen issues with Storybook and your project.

First, install the framework:

Next, install and register your appropriate compiler addon, depending on whether you're using SWC (recommended) or Babel:

If your project is using Create React App, you can skip this step.

More details can be found in the Webpack builder docs.

Finally, update your .storybook/main.js|ts to change the framework property:

Please refer to the migration instructions for @storybook/react-vite.

You can pass an options object for additional configuration if needed:

Type: Record<string, any>

Configure options for the framework's builder. For this framework, available options can be found in the Webpack builder docs.

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

Example 2 (unknown):
```unknown
npm run storybook
```

Example 3 (unknown):
```unknown
npm run build-storybook
```

Example 4 (elixir):
```elixir
npm install --save-dev @storybook/react-webpack5
```

---

## Storybook for Vue with Vite | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/frameworks/vue3-vite/?renderer=vue

**Contents:**
- Storybook for Vue with Vite
- Install
  - Requirements
- Run Storybook
- Configure
  - Extending the Vue application
  - Using vue-component-meta
    - Support for multiple component types
    - Prop description and JSDoc tag annotations
    - Events types extraction

Storybook for Vue & Vite is a framework that makes it easy to develop and test UI components in isolation for Vue applications built with Vite.

To install Storybook in an existing Vue project, run this command in your project's root directory:

You can then get started writing stories, running tests and documenting your components. For more control over the installation process, refer to the installation guide.

To run Storybook for a particular project, run the following:

To build Storybook, run:

You will find the output in the configured outputDir (default is storybook-static).

Storybook for Vue 3 with Vite is designed to work out of the box with minimal configuration. This section covers configuration options for the framework.

Storybook creates a Vue 3 application for your component preview. When using global custom components (app.component), directives (app.directive), extensions (app.use), or other application methods, you will need to configure those in the ./storybook/preview.ts file.

Therefore, Storybook provides you with a setup function exported from this package. This function receives your Storybook instance as a callback, which you can interact with and add your custom configuration.

vue-component-meta is only available in Storybook ≥ 8. It is currently an opt-in, but it will become the default in a future version of Storybook.

vue-component-meta is a tool maintained by the Vue team that extracts metadata from Vue components. Storybook can use it to generate the controls for your stories and documentation. It's a more full-featured alternative to vue-docgen-api and is recommended for most projects.

If you want to use vue-component-meta, you can configure it in your .storybook/main.js|ts file:

vue-component-meta comes with many benefits and enables more documentation features, such as:

vue-component-meta supports all types of Vue components (including SFC, functional, composition/options API components) from .vue, .ts, .tsx, .js, and .jsx files.

It also supports both default and named component exports.

To describe a prop, including tags, you can use JSDoc comments in your component's props definition:

The props definition above will generate the following controls:

To provide a type for an emitted event, you can use TypeScript types (including JSDoc comments) in your component's defineEmits call:

Which will generate the following controls:

The slot types are automatically extracted from your component definition and displayed in the controls panel.

If you use defineSlots, you can describe each slot using JSDoc comments in your component's slots definition:

The definition above will generate the following controls:

The properties and methods exposed by your component are automatically extracted and displayed in the Controls panel.

The definition above will generate the following controls:

If you're working with a project that relies on tsconfig references to link to other existing configuration files (e.g., tsconfig.app.json, tsconfig.node.json), we recommend that you update your .storybook/main.js|ts configuration file and add the following:

This is not a limitation of Storybook, but how vue-component-meta works. For more information, refer to the appropriate GitHub issue.

Otherwise, you might face missing component types/descriptions or unresolvable import aliases like @/some/import.

First, install the framework:

Then, update your .storybook/main.js|ts to change the framework property:

Vue 2 entered End of Life (EOL) on December 31st, 2023, and is no longer maintained by the Vue team. As a result, Storybook no longer supports Vue 2. We recommend you upgrade your project to Vue 3, which Storybook fully supports. If that's not an option, you can still use Storybook with Vue 2 by installing the latest version of Storybook 7 with the following command:

You can pass an options object for additional configuration if needed:

Type: Record<string, any>

Configure options for the framework's builder. For this framework, available options can be found in the Vite builder docs.

Type: 'vue-docgen-api' | 'vue-component-meta' | boolean

Default: 'vue-docgen-api'

Choose which docgen tool to use when generating controls for your components. See Using vue-component-meta for more information.

Set to false to disable docgen processing entirely for improved build performance.

Disabling docgen can improve build performance for large projects, but argTypes won't be inferred automatically, which will prevent features like Controls and docs from working as expected. To use those features, you will need to define argTypes manually.

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

Example 2 (unknown):
```unknown
npm run storybook
```

Example 3 (unknown):
```unknown
npm run build-storybook
```

Example 4 (vue):
```vue
import { setup } from '@storybook/vue3-vite';
 
setup((app) => {
  app.use(MyPlugin);
  app.component('my-component', MyComponent);
  app.mixin({
    // My mixin
  });
});
```

---

## Browse Stories | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/browse-stories

**Contents:**
- Browse Stories
- Sidebar and Preview
- Toolbar
- Addons
- Use stories to build UIs

Last chapter, we learned that stories correspond with discrete component states. This chapter demonstrates how to use Storybook as a workshop for building components.

A *.stories.js|ts|svelte file defines all the stories for a component. Each story has a corresponding sidebar item. When you click on a story, it renders in an isolated preview iframe.

The sidebar contains three areas: sidebar search, story explorer, and testing widget. Try the sidebar search to find a story by name. Navigate between stories by clicking on them in the explorer. Run component tests for all stories using the widget at the bottom of the sidebar.

Or use keyboard shortcuts. Click on the Storybook menu to see a list of available shortcuts.

Storybook supports fast keyboard navigation between landmark regions. Press F6 and Shift+F6 to navigate between the sidebar, toolbar, preview, and addons panel.

Storybook ships with time-saving tools built-in. The toolbar contains tools that allow you to adjust how the story renders in the Canvas:

The “Docs” page displays auto-generated documentation for components (inferred from the source code). Usage documentation is helpful when sharing reusable components with your team, for example, in an application.

The toolbar is customizable. You can use globals to quickly toggle themes and languages. Or install Storybook toolbar addons from the community to enable advanced workflows.

Addons are plugins that extend Storybook's core functionality. You can find them in the addons panel, a reserved place in the Storybook UI below the Canvas. Each tab shows the generated metadata, logs, or static analysis for the selected story by the addon.

Storybook is extensible. Our rich ecosystem of addons helps you test, document, and optimize your stories. You can also create an addon to satisfy your workflow requirements. Read more in the addons section.

In the next chapter, we'll get your components rendering in Storybook so you can use it to supercharge component development.

When building apps, one of the biggest challenges is to figure out if a piece of UI already exists in your codebase and how to use it for the new feature you're building.

Storybook catalogues all your components and their use cases. Therefore, you can quickly browse it to find what you're looking for.

Here's what the workflow looks like:

You can access the story definition from the stories file or make it available in your published Storybook using the Docs addon.

---

## Storybook for Next.js with Webpack | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/frameworks/nextjs

**Contents:**
- Storybook for Next.js with Webpack
- Install
  - Requirements
- Run Storybook
- Configure
  - Next.js's Image component
    - Local images
    - Remote images
  - Next.js font optimization
    - next/font/google

Storybook for Next.js (Webpack) is a framework that makes it easy to develop and test UI components in isolation for Next.js applications using Webpack 5.

We recommend using @storybook/nextjs-vite for most Next.js projects. The Vite-based framework is faster, more modern, and offers better support for testing features.

Use this Webpack-based framework (@storybook/nextjs) only if:

To install Storybook in an existing Next.js project, run this command in your project's root directory:

The command will prompt you to choose between this framework and @storybook/nextjs-vite. We recommend the Vite-based framework (learn why).

You can then get started writing stories, running tests and documenting your components. For more control over the installation process, refer to the installation guide.

To run Storybook for a particular project, run the following:

To build Storybook, run:

You will find the output in the configured outputDir (default is storybook-static).

Storybook for Next.js supports many Next.js features including:

This framework allows you to use Next.js's next/image with no configuration.

Local images are supported.

Remote images are also supported.

next/font is partially supported in Storybook. The packages next/font/google and next/font/local are supported.

You don't have to do anything. next/font/google is supported out of the box.

For local fonts you have to define the src property. The path is relative to the directory where the font loader function is called.

If the following component defines your localFont like this:

You have to tell Storybook where the fonts directory is located, via the staticDirs configuration. The from value is relative to the .storybook directory. The to value is relative to the execution context of Storybook. Very likely it is the root of your project.

The following features are not supported (yet). Support for these features might be planned for the future:

Occasionally fetching fonts from Google may fail as part of your Storybook build step. It is highly recommended to mock these requests, as those failures can cause your pipeline to fail as well. Next.js supports mocking fonts via a JavaScript module located where the env var NEXT_FONT_GOOGLE_MOCKED_RESPONSES references.

For example, using GitHub Actions:

Your mocked fonts will look something like this:

Next.js's router is automatically stubbed for you so that when the router is interacted with, all of its interactions are automatically logged to the Actions panel.

You should only use next/router in the pages directory. In the app directory, it is necessary to use next/navigation.

Per-story overrides can be done by adding a nextjs.router property onto the story parameters. The framework will shallowly merge whatever you put here into the router.

These overrides can also be applied to all stories for a component or all stories in your project. Standard parameter inheritance rules apply.

The default values on the stubbed router are as follows (see globals for more details on how globals work).

Additionally, the router object contains all of the original methods (such as push(), replace(), etc.) as mock functions that can be manipulated and asserted on using regular mock APIs.

To override these defaults, you can use parameters and beforeEach:

Please note that next/navigation can only be used in components/pages in the app directory.

If your story imports components that use next/navigation, you need to set the parameter nextjs.appDirectory to true in for that component's stories:

If your Next.js project uses the app directory for every page (in other words, it does not have a pages directory), you can set the parameter nextjs.appDirectory to true in the .storybook/preview.tsx file to apply it to all stories.

Per-story overrides can be done by adding a nextjs.navigation property onto the story parameters. The framework will shallowly merge whatever you put here into the router.

These overrides can also be applied to all stories for a component or all stories in your project. Standard parameter inheritance rules apply.

The useSelectedLayoutSegment, useSelectedLayoutSegments, and useParams hooks are supported in Storybook. You have to set the nextjs.navigation.segments parameter to return the segments or the params you want to use.

With the above configuration, the component rendered in the stories would receive the following values from the hooks:

To use useParams, you have to use a segments array where each element is an array containing two strings. The first string is the param key and the second string is the param value.

With the above configuration, the component rendered in the stories would receive the following values from the hooks:

These overrides can also be applied to a single story or all stories in your project. Standard parameter inheritance rules apply.

The default value of nextjs.navigation.segments is [] if not set.

The default values on the stubbed navigation context are as follows:

Additionally, the router object contains all of the original methods (such as push(), replace(), etc.) as mock functions that can be manipulated and asserted on using regular mock APIs.

To override these defaults, you can use parameters and beforeEach:

next/head is supported out of the box. You can use it in your stories like you would in your Next.js application. Please keep in mind, that the Head children are placed into the head element of the iframe that Storybook uses to render your stories.

Global Sass/SCSS stylesheets are also supported without any additional configuration. Just import them into the preview config file.

This will automatically include any of your custom Sass configurations in your Next.js config file.

CSS modules work as expected.

The built-in CSS-in-JS solution for Next.js is styled-jsx, and this framework supports that out of the box, too, with zero config.

You can use your own Babel config, too. This is an example of how you can customize styled-jsx.

Tailwind in Next.js is supported via PostCSS. Storybook will automatically handle the PostCSS config for you, including any custom PostCSS configuration, so that you can import your global CSS directly into the preview config file:

Next.js lets you customize PostCSS config. Thus this framework will automatically handle your PostCSS config for you.

Absolute imports from the root directory are supported.

Also OK for global styles in .storybook/preview.tsx!

Absolute imports cannot be mocked in stories/tests. See the Mocking modules section for more information.

Module aliases are also supported.

As an alternative to module aliases, you can use subpath imports to import modules. This follows Node package standards and has benefits when mocking modules.

To configure subpath imports, you define the imports property in your project's package.json file. This property maps the subpath to the actual file path. The example below configures subpath imports for all modules in the project:

Because subpath imports replace module aliases, you can remove the path aliases from your TypeScript configuration.

Which can then be used like this:

Components often depend on modules that are imported into the component file. These can be from external packages or internal to your project. When rendering those components in Storybook or testing them, you may want to mock those modules to control and assert their behavior.

This framework provides mocks for many of Next.js' internal modules:

To mock other modules, use automocking or one of the alternative methods documented in the mocking modules guide.

Next.js allows for Runtime Configuration which lets you import a handy getConfig function to get certain configuration defined in your next.config.js file at runtime.

In the context of Storybook with this framework, you can expect Next.js's Runtime Configuration feature to work just fine.

Note, because Storybook doesn't server render your components, your components will only see what they normally see on the client side (i.e. they won't see serverRuntimeConfig but will see publicRuntimeConfig).

For example, consider the following Next.js config:

Calls to getConfig would return the following object when called within Storybook:

Next.js comes with a lot of things for free out of the box like Sass support, but sometimes you add custom Webpack config modifications to Next.js. This framework takes care of most of the Webpack modifications you would want to add. If Next.js supports a feature out of the box, then that feature will work out of the box in Storybook. If Next.js doesn't support something out of the box, but makes it easy to configure, then this framework will do the same for that thing for Storybook.

Any Webpack modifications desired for Storybook should be made in .storybook/main.js|ts.

Note: Not all Webpack modifications are copy/paste-able between next.config.js and .storybook/main.js|ts. It is recommended to do your research on how to properly make your modification to Storybook's Webpack config and on how Webpack works.

Below is an example of how to add SVGR support to Storybook with this framework.

Storybook handles most Typescript configurations, but this framework adds additional support for Next.js's support for Absolute Imports and Module path aliases. In short, it takes into account your tsconfig.json's baseUrl and paths. Thus, a tsconfig.json like the one below would work out of the box.

If your app uses React Server Components (RSC), Storybook can render them in stories in the browser.

To enable this set the experimentalRSC feature flag in your .storybook/main.js|ts config:

Setting this flag automatically wraps your story in a Suspense wrapper, which is able to render asynchronous components in NextJS's version of React.

If this wrapper causes problems in any of your existing stories, you can selectively disable it using the react.rsc parameter at the global/component/story level:

Note that wrapping your server components in Suspense does not help if your server components access server-side resources like the file system or Node-specific libraries. To work around this, you'll need to mock out your data access layer using Webpack aliases or an addon like storybook-addon-module-mock.

If your server components access data via the network, we recommend using the MSW Storybook Addon to mock network requests.

In the future we will provide better mocking support in Storybook and support for Server Actions.

If you're using Yarn v2 or v3, you may run into issues where Storybook can't resolve style-loader or css-loader. For example, you might get errors like:

This is because those versions of Yarn have different package resolution rules than Yarn v1.x. If this is the case for you, please install the package directly.

First, install the framework:

Then, update your .storybook/main.js|ts to change the framework property:

Finally, if you were using Storybook plugins to integrate with Next.js, those are no longer necessary when using this framework and can be removed:

Please refer to the migration instructions for @storybook/nextjs-vite.

Next.js pages can fetch data directly within server components in the app directory, which often include module imports that only run in a Node.js environment. This does not (currently) work within Storybook, because if you import from a Next.js page file containing those node module imports in your stories, your Storybook's Webpack will crash because those modules will not run in a browser. To get around this, you can extract the component in your page file into a separate file and import that pure component in your stories. Or, if that's not feasible for some reason, you can polyfill those modules in your Storybook's webpackFinal configuration.

Make sure you are treating image imports the same way you treat them when using next/image in normal development.

Before using this framework, image imports would import the raw path to the image (e.g. 'static/media/stories/assets/logo.svg'). Now image imports work the "Next.js way", meaning that you now get an object when importing an image. For example:

Therefore, if something in Storybook isn't showing the image properly, make sure you expect the object to be returned from an import instead of only the asset path.

See local images for more detail on how Next.js treats static image imports.

You might get this if you're using Yarn v2 or v3. See Notes for Yarn v2 and v3 users for more details.

We recommend using @storybook/nextjs-vite (Vite-based) for most projects because it offers faster builds, better test support, and a simpler configuration. However, if your project has custom Webpack configurations that are incompatible with Vite, use this framework instead.

sharp is a dependency of Next.js's image optimization feature. If you see this error, you need to install sharp in your project.

You can refer to the Install sharp to Use Built-In Image Optimization in the Next.js documentation for more information.

The @storybook/nextjs package exports several modules that enable you to mock Next.js's internal behavior.

Type: { getPackageAliases: ({ useESM?: boolean }) => void }

getPackageAliases is a helper for generating the aliases needed to set up portable stories.

Type: typeof import('next/cache')

This module exports mocked implementations of the next/cache module's exports. You can use it to create your own mock implementations or assert on mock calls in a story's play function.

Type: cookies, headers and draftMode from Next.js

This module exports writable mocked implementations of the next/headers module's exports. You can use it to set up cookies or headers that are read in your story, and to later assert that they have been called.

Next.js's default headers() export is read-only, but this module exposes methods allowing you to write to the headers:

For cookies, you can use the existing API to write them. E.g., cookies().set('firstName', 'Jane').

Because headers(), cookies() and their sub-functions are all mocks you can use any mock utilities in your stories, like headers().getAll.mock.calls.

Type: typeof import('next/navigation') & getRouter: () => ReturnType<typeof import('next/navigation')['useRouter']>

This module exports mocked implementations of the next/navigation module's exports. It also exports a getRouter function that returns a mocked version of Next.js's router object from useRouter, allowing the properties to be manipulated and asserted on. You can use it mock implementations or assert on mock calls in a story's play function.

Type: typeof import('next/router') & getRouter: () => ReturnType<typeof import('next/router')['useRouter']>

This module exports mocked implementations of the next/router module's exports. It also exports a getRouter function that returns a mocked version of Next.js's router object from useRouter, allowing the properties to be manipulated and asserted on. You can use it mock implementations or assert on mock calls in a story's play function.

You can pass an options object for additional configuration if needed:

The available options are:

Type: Record<string, any>

Configure options for the framework's builder. For Next.js, available options can be found in the Webpack builder docs.

The absolute path to the next.config.js file. This is necessary if you have a custom next.config.js file that is not in the root directory of your project.

This framework contributes the following parameters to Storybook, under the nextjs namespace:

Props to pass to every instance of next/image. See next/image docs for more details.

If your story imports components that use next/navigation, you need to set the parameter nextjs.appDirectory to true. Because this is a parameter, you can apply it to a single story, all stories for a component, or every story in your Storybook. See Next.js Navigation for more details.

The router object that is passed to the next/navigation context. See Next.js's navigation docs for more details.

The router object that is passed to the next/router context. See Next.js's router docs for more details.

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

Example 2 (unknown):
```unknown
npm run storybook
```

Example 3 (unknown):
```unknown
npm run build-storybook
```

Example 4 (jsx):
```jsx
import Image from 'next/image';
import profilePic from '../public/me.png';
 
function Home() {
  return (
    <>
      <h1>My Homepage</h1>
      <Image
        src={profilePic}
        alt="Picture of the author"
        // width={500} automatically provided
        // height={500} automatically provided
        // blurDataURL="../public/me.png" set to equal the image itself (for this framework)
        // placeholder="blur" // Optional blur-up while loading
      />
      <p>Welcome to my homepage!</p>
    </>
  );
}
```

---

## Storybook for React with Webpack | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/frameworks/react-webpack5

**Contents:**
- Storybook for React with Webpack
- Install
  - Requirements
- Run Storybook
- Configure
  - Create React App (CRA)
  - Manually initialized apps
- FAQ
  - How do I manually install the React Webpack framework?
  - How do I migrate to the React Vite framework?

Storybook for React & Webpack is a framework that makes it easy to develop and test UI components in isolation for React applications built with Webpack.

We recommend using @storybook/react-vite for most React projects. The Vite-based framework is faster, more modern, and offers better support for testing features.

Use this Webpack-based framework (@storybook/react-webpack5) only if you need specific Webpack features not available in Vite.

To install Storybook in an existing React project, run this command in your project's root directory:

You can then get started writing stories, running tests and documenting your components. For more control over the installation process, refer to the installation guide.

To run Storybook for a particular project, run the following:

To build Storybook, run:

You will find the output in the configured outputDir (default is storybook-static).

Support for Create React App is handled by @storybook/preset-create-react-app.

This preset enables support for all CRA features, including Sass/SCSS and TypeScript.

If you're working on an app that was initialized manually (i.e., without the use of CRA), ensure that your app has react-dom included as a dependency. Failing to do so can lead to unforeseen issues with Storybook and your project.

First, install the framework:

Next, install and register your appropriate compiler addon, depending on whether you're using SWC (recommended) or Babel:

If your project is using Create React App, you can skip this step.

More details can be found in the Webpack builder docs.

Finally, update your .storybook/main.js|ts to change the framework property:

Please refer to the migration instructions for @storybook/react-vite.

You can pass an options object for additional configuration if needed:

Type: Record<string, any>

Configure options for the framework's builder. For this framework, available options can be found in the Webpack builder docs.

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

Example 2 (unknown):
```unknown
npm run storybook
```

Example 3 (unknown):
```unknown
npm run build-storybook
```

Example 4 (elixir):
```elixir
npm install --save-dev @storybook/react-webpack5
```

---

## Storybook for Web components with Vite | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/frameworks/web-components-vite

**Contents:**
- Storybook for Web components with Vite
- Install
  - Requirements
- Run Storybook
- FAQ
  - How do I manually install the Web Components framework?
- API
  - Options
    - builder

Storybook for Web components & Vite is a framework that makes it easy to develop and test UI components in isolation for applications using Web components built with Vite.

To install Storybook in an existing project, run this command in your project's root directory:

You can then get started writing stories, running tests and documenting your components. For more control over the installation process, refer to the installation guide.

To run Storybook for a particular project, run the following:

To build Storybook, run:

You will find the output in the configured outputDir (default is storybook-static).

First, install the framework:

Then, update your .storybook/main.js|ts to change the framework property:

You can pass an options object for additional configuration if needed:

The available options are:

Type: Record<string, any>

Configure options for the framework's builder. For this framework, available options can be found in the Vite builder docs.

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

Example 2 (unknown):
```unknown
npm run storybook
```

Example 3 (unknown):
```unknown
npm run build-storybook
```

Example 4 (elixir):
```elixir
npm install --save-dev @storybook/web-components-vite
```

---

## Storybook for Angular | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/frameworks/angular

**Contents:**
- Storybook for Angular
- Install
  - Requirements
- Run Storybook
- Configure
  - Compodoc
    - Automatic setup
    - Manual setup
  - Application-wide providers
  - Angular dependencies

Storybook for Angular is a framework that makes it easy to develop and test UI components in isolation for Angular applications. It uses Angular builders and integrates with Compodoc to provide automatic documentation generation.

To install Storybook in an existing Angular project, run this command in your project's root directory:

You can then get started writing stories, running tests and documenting your components. For more control over the installation process, refer to the installation guide.

Angular ≥ 18.0 < 22.0

To run Storybook for a particular project, run the following:

To build Storybook, run:

You will find the output in the configured outputDir (default is dist/storybook/<your-project>).

To make the most out of Storybook in your Angular project, you can set up Compodoc integration and Storybook decorators based on your project needs.

You can include JSDoc comments above components, directives, and other parts of your Angular code to include documentation for those elements. Compodoc uses these comments to generate documentation for your application. In Storybook, it is useful to add explanatory comments above @Inputs and @Outputs, since these are the main elements that Storybook displays in its user interface. The @Inputs and @Outputs are elements you can interact with in Storybook, such as controls.

When installing Storybook via npx storybook@latest init, you can set up Compodoc automatically.

If you have already installed Storybook, you can set up Compodoc manually.

Install the following dependencies:

Add the following option to your Storybook Builder:

Go to your .storybook/preview.ts and add the following:

If your component relies on application-wide providers, like the ones defined by BrowserAnimationsModule or any other modules that use the forRoot pattern to provide a ModuleWithProviders, you can apply the applicationConfig decorator to all stories for that component. This will provide them with the bootstrapApplication function, used to bootstrap the component in Storybook.

If your component has dependencies on other Angular directives and modules, these can be supplied using the moduleMetadata decorator either for all stories of a component or for individual stories.

The easiest way to install the Angular framework is to run the upgrade command, but you can also set it up manually. First, install the framework:

Then, update your .storybook/main.js|ts to change the framework property:

Finally, update your angular.json to include the Storybook builder:

The Storybook Angular builder is a way to run Storybook in an Angular workspace. It is a drop-in replacement for running storybook dev and storybook build directly.

You can run npx storybook@latest automigrate to let Storybook detect and automatically fix your configuration. Otherwise, you can follow the next steps to adjust your configuration manually.

Go to your angular.json and add storybook and build-storybook entries in your project's architect section, as shown above.

Then, adjust your package.json script section, to replace the existing Storybook scripts with the Angular CLI commands:

Note that compodoc is now built into @storybook/angular; you don't have to call it explicitly. If you were running compodoc in your package.json scripts, you can remove the related script:

In case you have multiple projects, you will have to adjust your angular.json and package.json as described above for each project you want to use Storybook with. Please note that each project should have a dedicated .storybook folder placed at the project's root directory.

You can run npx storybook@latest init sequentially for each project to set up Storybook for each of them to automatically create the .storybook folder and create the necessary configuration in your angular.json.

You can then combine multiple Storybooks with Storybook composition.

These are common options you may need for the Angular builder:

The full list of options can be found in the Angular builder schemas:

You can pass an options object for additional configuration if needed:

The available options are:

Type: Record<string, any>

Configure options for the framework's builder. For this framework, available options can be found in the Webpack builder docs.

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

Example 2 (unknown):
```unknown
ng run <your-project>:storybook
```

Example 3 (unknown):
```unknown
ng run <your-project>:build-storybook
```

Example 4 (elixir):
```elixir
npm install --save-dev @compodoc/compodoc
```

---

## Get started with Storybook | Storybook docs

**URL:** https://storybook.js.org/docs/get-started

**Contents:**
- Get started with Storybook
- Install Storybook
- Supported frameworks
- Community-maintained frameworks
- Main concepts
- Additional resources

Storybook is a frontend workshop for building UI components and pages in isolation. It helps you develop and share hard-to-reach states and edge cases without needing to run your whole app. Thousands of teams use it for UI development, testing, and documentation. It's open source and free.

Run this command to install Storybook into an existing project or create a new one from scratch:

Ask your AI agent to set up Storybook for you.

Want to know more about installing Storybook? Check out the installation guide.

with Vite (in browser)

Storybook includes an active community that supports additional frameworks and libraries. These community-maintained frameworks are actively developed and maintained by community contributors.

with Rspack / Rsbuild

with Rspack / Rsbuild

with Rspack / Rsbuild

Storybook is a powerful tool that can help you with many aspects of your UI development workflow. Here are some of the main concepts to get you started.

A story captures the rendered state of a UI component. Each component can have multiple stories, where each story describes a different component state.

Storybook can analyze your components to automatically create documentation alongside your stories. This automatic documentation makes it easier for you to create UI library usage guidelines, design system sites, and more.

Stories are a pragmatic starting point for your UI testing strategy. You already write stories as a natural part of UI development, so testing those stories is a low-effort way to prevent UI bugs over time.

Publishing your Storybook allows you to share your work with others. You can also embed your stories in places like Notion or Figma.

Once you've learned the basics, explore these other ways to get the most out of Storybook.

Latest product updates

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

---

## What's a story? | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/whats-a-story

**Contents:**
- What's a story?
- Working with stories
  - Create a new story
  - Edit a story

A story captures the rendered state of a UI component. Developers write multiple stories per component that describe all the “interesting” states a component can support.

When you installed Storybook, the CLI created example components that demonstrate the types of components you can build with Storybook: Button, Header, and Page.

Each example component has a set of stories that show the states it supports. You can browse the stories in the UI and see the code behind them in files that end with .stories.js|ts. The stories are written in Component Story Format (CSF), an ES6 modules-based standard for writing component examples.

Let’s start with the Button component. A story is an object that describes how to render the component in question. Here’s how to render Button in the “primary” state and export a story called Primary.

View the rendered Button by clicking on it in the Storybook sidebar. Note how the values specified in args are used to render the component and match those represented in the Controls panel. Using args in your stories has additional benefits:

Storybook makes it easy to work on one component in one state (aka a story) at a time. When you edit a component's code or its stories, Storybook will instantly re-render in the browser. No need to refresh manually.

If you're working on a component that does not yet have any stories, you can click the ➕ button in the sidebar to search for your component and have a basic story created for you.

You can also create a story file for your new story. We recommend copy/pasting an existing story file next to the component source file, then adjusting it for your component.

If you're working on a component that already has other stories, you can use the Controls panel to adjust the value of a control and then save those changes as a new story.

Or, if you prefer, edit the story file's code to add a new named export for your story:

Using the Controls panel, update a control's value for a story. You can then save the changes to the story and the story file's code will be updated for you.

Of course, you can always update the story's code directly too:

Stories are also helpful for checking that the UI continues to look correct as you make changes. The Button component has four stories that show it in different use cases. View those stories now to confirm that your change to Primary didn’t introduce unintentional bugs in the other stories.

Checking component’s stories as you develop helps prevent accidental regressions. Tools that integrate with Storybook can automate this for you.

Now that we’ve seen the basic anatomy of a story let’s see how we use Storybook’s UI to develop stories.

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

---

## Storybook for Next.js with Vite | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/frameworks/nextjs-vite/?renderer=react

**Contents:**
- Storybook for Next.js with Vite
- Install
  - Requirements
- Choose between Vite and Webpack
- Run Storybook
- Configure
  - Next.js's Image component
    - Local images
    - Remote images
  - Next.js font optimization

Storybook for Next.js (Vite) is the recommended framework for developing and testing UI components in isolation for Next.js applications. It uses Vite for faster builds, better performance and Storybook Testing support.

To install Storybook in an existing Next.js project, run this command in your project's root directory:

You can then get started writing stories, running tests and documenting your components. For more control over the installation process, refer to the installation guide.

This Vite-based framework offers several advantages over the Webpack-based @storybook/nextjs framework, and is the recommended option:

Storybook will automatically detect your project and select the nextjs-vite framework unless your project has custom Webpack or Babel configurations. If you have custom configurations, Storybook will ask you which framework to install.

Choose nextjs-vite if you're willing to migrate existing Babel or Webpack configurations to Vite. Choose nextjs (Webpack 5) if you need to keep your existing Webpack/Babel setup.

To run Storybook for a particular project, run the following:

To build Storybook, run:

You will find the output in the configured outputDir (default is storybook-static).

Storybook for Next.js with Vite supports many Next.js features including:

This framework allows you to use Next.js's next/image with no configuration.

Local images are supported.

Remote images are also supported.

next/font is partially supported in Storybook. The packages next/font/google and next/font/local are supported.

You don't have to do anything. next/font/google is supported out of the box.

For local fonts you have to define the src property. The path is relative to the directory where the font loader function is called.

If the following component defines your localFont like this:

The Vite-based framework automatically handles font path mapping, so you don't need to configure staticDirs for fonts like you would with the Webpack-based framework.

The following features are not supported (yet). Support for these features might be planned for the future:

Occasionally fetching fonts from Google may fail as part of your Storybook build step. It is highly recommended to mock these requests, as those failures can cause your pipeline to fail as well. Next.js supports mocking fonts via a JavaScript module located where the env var NEXT_FONT_GOOGLE_MOCKED_RESPONSES references.

For example, using GitHub Actions:

Your mocked fonts will look something like this:

Next.js's router is automatically stubbed for you so that when the router is interacted with, all of its interactions are automatically logged to the Actions panel.

You should only use next/router in the pages directory. In the app directory, it is necessary to use next/navigation.

Per-story overrides can be done by adding a nextjs.router property onto the story parameters. The framework will shallowly merge whatever you put here into the router.

These overrides can also be applied to all stories for a component or all stories in your project. Standard parameter inheritance rules apply.

The default values on the stubbed router are as follows (see globals for more details on how globals work).

Additionally, the router object contains all of the original methods (such as push(), replace(), etc.) as mock functions that can be manipulated and asserted on using regular mock APIs.

To override these defaults, you can use parameters and beforeEach:

Please note that next/navigation can only be used in components/pages in the app directory.

If your story imports components that use next/navigation, you need to set the parameter nextjs.appDirectory to true in for that component's stories:

If your Next.js project uses the app directory for every page (in other words, it does not have a pages directory), you can set the parameter nextjs.appDirectory to true in the .storybook/preview.tsx file to apply it to all stories.

Per-story overrides can be done by adding a nextjs.navigation property onto the story parameters. The framework will shallowly merge whatever you put here into the router.

These overrides can also be applied to all stories for a component or all stories in your project. Standard parameter inheritance rules apply.

The useSelectedLayoutSegment, useSelectedLayoutSegments, and useParams hooks are supported in Storybook. You have to set the nextjs.navigation.segments parameter to return the segments or the params you want to use.

With the above configuration, the component rendered in the stories would receive the following values from the hooks:

To use useParams, you have to use a segments array where each element is an array containing two strings. The first string is the param key and the second string is the param value.

With the above configuration, the component rendered in the stories would receive the following values from the hooks:

These overrides can also be applied to a single story or all stories in your project. Standard parameter inheritance rules apply.

The default value of nextjs.navigation.segments is [] if not set.

The default values on the stubbed navigation context are as follows:

Additionally, the router object contains all of the original methods (such as push(), replace(), etc.) as mock functions that can be manipulated and asserted on using regular mock APIs.

To override these defaults, you can use parameters and beforeEach:

next/head is supported out of the box. You can use it in your stories like you would in your Next.js application. Please keep in mind, that the Head children are placed into the head element of the iframe that Storybook uses to render your stories.

Global Sass/SCSS stylesheets are also supported without any additional configuration. Just import them into the preview config file.

This will automatically include any of your custom Sass configurations in your Next.js config file.

CSS modules work as expected.

The built-in CSS-in-JS solution for Next.js is styled-jsx, and this framework supports that out of the box, too, with zero config.

Tailwind in Next.js is supported via PostCSS. Storybook will automatically handle the PostCSS config for you, including any custom PostCSS configuration, so that you can import your global CSS directly into the preview config file:

Next.js lets you customize PostCSS config. Thus this framework will automatically handle your PostCSS config for you.

Absolute imports from the root directory are supported.

Also OK for global styles in .storybook/preview.tsx!

Absolute imports cannot be mocked in stories/tests. See the Mocking modules section for more information.

Module aliases are also supported.

As an alternative to module aliases, you can use subpath imports to import modules. This follows Node package standards and has benefits when mocking modules.

To configure subpath imports, you define the imports property in your project's package.json file. This property maps the subpath to the actual file path. The example below configures subpath imports for all modules in the project:

Because subpath imports replace module aliases, you can remove the path aliases from your TypeScript configuration.

Which can then be used like this:

Components often depend on modules that are imported into the component file. These can be from external packages or internal to your project. When rendering those components in Storybook or testing them, you may want to mock those modules to control and assert their behavior.

This framework provides mocks for many of Next.js' internal modules:

To mock other modules, use automocking or one of the alternative methods documented in the mocking modules guide.

Next.js allows for Runtime Configuration which lets you import a handy getConfig function to get certain configuration defined in your next.config.js file at runtime.

In the context of Storybook with this framework, you can expect Next.js's Runtime Configuration feature to work just fine.

Note, because Storybook doesn't server render your components, your components will only see what they normally see on the client side (i.e. they won't see serverRuntimeConfig but will see publicRuntimeConfig).

For example, consider the following Next.js config:

Calls to getConfig would return the following object when called within Storybook:

You can customize the Vite configuration used by Storybook in your .storybook/main.js|ts file. By default, Storybook's configuration extends the Vite configuration used by your project, but you can configure it to not do so.

Not all Vite modifications are copy/paste-able between next.config.js and .storybook/main.js|ts. It is recommended to do your research on how to properly make your modification to Storybook's Vite config and on how Vite works.

Storybook handles most Typescript configurations, but this framework adds additional support for Next.js's support for Absolute Imports and Module path aliases. In short, it takes into account your tsconfig.json's baseUrl and paths. Thus, a tsconfig.json like the one below would work out of the box.

If your app uses React Server Components (RSC), Storybook can render them in stories in the browser.

To enable this set the experimentalRSC feature flag in your .storybook/main.js|ts config:

Setting this flag automatically wraps your story in a Suspense wrapper, which is able to render asynchronous components in NextJS's version of React.

If this wrapper causes problems in any of your existing stories, you can selectively disable it using the react.rsc parameter at the global/component/story level:

Note that wrapping your server components in Suspense does not help if your server components access server-side resources like the file system or Node-specific libraries. To work around this, you'll need to mock out your data access layer using Vite aliases or an addon like storybook-addon-module-mock.

If your server components access data via the network, we recommend using the MSW Storybook Addon to mock network requests.

In the future we will provide better mocking support in Storybook and support for Server Actions.

Storybook provides a migration tool for migrating to this framework from the Webpack-based Next.js framework, @storybook/nextjs. To migrate, run this command:

This automigration tool performs the following actions:

If your project has custom Webpack configurations in .storybook/main.js|ts (via webpackFinal), you'll need to migrate those to Vite configuration (via viteFinal) after running this automigration. See the Vite builder documentation for more information.

First, install the framework:

Then, update your .storybook/main.js|ts to change the framework property:

If your Storybook configuration contains custom Webpack operations in webpackFinal, you will likely need to create equivalents in viteFinal.

For more information, see the Vite builder documentation.

Finally, if you were using Storybook plugins to integrate with Next.js, those are no longer necessary when using this framework and can be removed:

Next.js pages can fetch data directly within server components in the app directory, which often include module imports that only run in a node environment. This does not (currently) work within Storybook, because if you import from a Next.js page file containing those node module imports in your stories, your Storybook's Vite build will crash because those modules will not run in a browser. To get around this, you can extract the component in your page file into a separate file and import that pure component in your stories. Or, if that's not feasible for some reason, you can configure Vite to handle those modules in your Storybook's viteFinal configuration.

Make sure you are treating image imports the same way you treat them when using next/image in normal development.

Before using this framework, image imports would import the raw path to the image (e.g. 'static/media/stories/assets/logo.svg'). Now image imports work the "Next.js way", meaning that you now get an object when importing an image. For example:

Therefore, if something in Storybook isn't showing the image properly, make sure you expect the object to be returned from an import instead of only the asset path.

See local images for more detail on how Next.js treats static image imports.

sharp is a dependency of Next.js's image optimization feature. If you see this error, you need to install sharp in your project.

You can refer to the Install sharp to Use Built-In Image Optimization in the Next.js documentation for more information.

We recommend using @storybook/nextjs-vite (this framework) for most projects because it offers:

However, if your project has custom Webpack configurations that are incompatible with Vite, or you need specific Webpack features, you should use @storybook/nextjs (Webpack 5) instead.

The @storybook/nextjs-vite package exports several modules that enable you to mock Next.js's internal behavior.

Type: typeof import('next/cache')

This module exports mocked implementations of the next/cache module's exports. You can use it to create your own mock implementations or assert on mock calls in a story's play function.

Type: cookies, headers and draftMode from Next.js

This module exports writable mocked implementations of the next/headers module's exports. You can use it to set up cookies or headers that are read in your story, and to later assert that they have been called.

Next.js's default headers() export is read-only, but this module exposes methods allowing you to write to the headers:

For cookies, you can use the existing API to write them. E.g., cookies().set('firstName', 'Jane').

Because headers(), cookies() and their sub-functions are all mocks you can use any mock utilities in your stories, like headers().getAll.mock.calls.

Type: typeof import('next/navigation') & getRouter: () => ReturnType<typeof import('next/navigation')['useRouter']>

This module exports mocked implementations of the next/navigation module's exports. It also exports a getRouter function that returns a mocked version of Next.js's router object from useRouter, allowing the properties to be manipulated and asserted on. You can use it mock implementations or assert on mock calls in a story's play function.

Type: typeof import('next/router') & getRouter: () => ReturnType<typeof import('next/router')['useRouter']>

This module exports mocked implementations of the next/router module's exports. It also exports a getRouter function that returns a mocked version of Next.js's router object from useRouter, allowing the properties to be manipulated and asserted on. You can use it mock implementations or assert on mock calls in a story's play function.

You can pass an options object for additional configuration if needed:

The available options are:

Type: Record<string, any>

Configure options for the framework's builder. For Next.js with Vite, available options can be found in the Vite builder docs.

Props to pass to every instance of next/image. See next/image docs for more details.

The absolute path to the next.config.js file. This is necessary if you have a custom next.config.js file that is not in the root directory of your project.

This framework contributes the following parameters to Storybook, under the nextjs namespace:

If your story imports components that use next/navigation, you need to set the parameter nextjs.appDirectory to true. Because this is a parameter, you can apply it to a single story, all stories for a component, or every story in your Storybook. See Next.js Navigation for more details.

The router object that is passed to the next/navigation context. See Next.js's navigation docs for more details.

The router object that is passed to the next/router context. See Next.js's router docs for more details.

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

Example 2 (unknown):
```unknown
npm run storybook
```

Example 3 (unknown):
```unknown
npm run build-storybook
```

Example 4 (jsx):
```jsx
import Image from 'next/image';
import profilePic from '../public/me.png';
 
function Home() {
  return (
    <>
      <h1>My Homepage</h1>
      <Image
        src={profilePic}
        alt="Picture of the author"
        // width={500} automatically provided
        // height={500} automatically provided
        // blurDataURL="../public/me.png" set to equal the image itself (for this framework)
        // placeholder="blur" // Optional blur-up while loading
      />
      <p>Welcome to my homepage!</p>
    </>
  );
}
```

---

## Storybook for React Native Web | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/frameworks/react-native-web-vite

**Contents:**
- Storybook for React Native Web
- Install
  - Requirements
- Run Storybook
- React Native vs React Native Web
  - Comparison
  - Using both React Native and React Native Web
- FAQ
  - How do I migrate from the React Native Web addon?
- API

Storybook for React Native Web is a framework that makes it easy to develop and test UI components in isolation for React Native. It uses Vite to build your components for web browsers.

In addition to React Native Web, Storybook supports on-device React Native development. If you're unsure what's right for you, read our comparison.

To install Storybook in an existing React Native project, run this command in your project's root directory:

You can then get started writing stories, running tests and documenting your components. For more control over the installation process, refer to the installation guide.

React Native Web ≥ 0.19

To run Storybook for a particular project, run the following:

To build Storybook, run:

You will find the output in the configured outputDir (default is storybook-static).

If you’re building React Native (RN) components, Storybook has two options: Native and Web.

Both options provide a catalog of your stories that hot refreshes as you edit the code in your favorite editor. However, their implementations are quite different:

So, which option is right for you?

Native. You should choose this option if you want:

Web. You should choose this option if you want:

Both. It’s also possible to use both options together. This increases Storybook’s install footprint but is a good option if you want native fidelity in addition to all of the web features. Learn more below.

The easiest way to use React Native and React Native Web is to select the "Both" option when installing Storybook. This will install and create configurations for both environments, allowing you to run Storybook for both in the same project.

When you select "Both", the installation will:

After installation, you'll see instructions for both environments:

However, you can install them separately if one version is installed. You can add a React Native Web Storybook alongside an existing React Native Storybook by running the install command and selecting "React Native Web" in the setup wizard, and vice versa.

The React Native Web addon was a Webpack-based precursor to the React Native Web Vite framework (i.e., @storybook/react-native-web-vite). If you're using the addon, you should migrate to the framework, which is faster, more stable, maintained, and better documented. To do so, follow the steps below.

Run the following command to upgrade Storybook to the latest version:

This framework is designed to work with Storybook 8.5 and above for the best experience. We won't be able to provide support if you're using an older Storybook version.

Install the framework and its peer dependencies:

Update your .storybook/main.js|ts to change the framework property and remove the @storybook/addon-react-native-web addon:

Finally, remove the addon and similar packages (i.e., @storybook/react-webpack5 and @storybook/addon-react-native-web) from your project.

You can pass an options object for additional configuration if needed:

Let's say you need to transpile a library called my-library that is not transpiled for web by default. You can add it to the modulesToTranspile option.

Type: Record<string, any>

Configure options for the framework's builder. For this framework, available options can be found in the Vite builder docs.

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

Example 2 (unknown):
```unknown
npm run storybook
```

Example 3 (unknown):
```unknown
npm run build-storybook
```

Example 4 (elixir):
```elixir
npx storybook@latest upgrade
```

---

## Install Storybook | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/install

**Contents:**
- Install Storybook
- Project requirements
- Installation
- Run the Setup Wizard
- Start Storybook
  - Troubleshooting
    - Run Storybook with other package managers
    - The CLI doesn't detect my framework
    - Yarn Plug'n'Play (PnP) support with Storybook
    - Run Storybook with Webpack 4

Use the Storybook CLI to install it in a single command. Run this inside your project’s root directory:

Ask your AI agent to set up Storybook for you.

Storybook will look into your project's dependencies during its install process and provide you with the best configuration available.

Storybook is designed to work with a variety of frameworks and environments. If your project is using one of the packages listed here, please ensure that you have the following versions installed:

Additionally, the Storybook app supports the following browsers:

You can use Storybook with older browsers in two ways:

Run this command inside your project's root directory to install the latest version of Storybook:

To install Storybook 8.3 or newer, you can use the create command with a specific version:

To install a Storybook version prior to 8.3, you must use the init command:

For either command, you can specify either an npm tag such as latest or next, or a (partial) version number. For example:

When installing, Storybook will present you with a series of interactive prompts to help customize your installation:

Storybook will ask if you're new to Storybook. If you select "Yes":

If you're experienced with Storybook, you can skip the onboarding to get a minimal setup.

What configuration should we install?

Storybook will ask what type of configuration you want to install:

You can also manually select these features using the --features flag. For example:

After completing the prompts, the command above will make the following changes to your local environment:

If all goes well, you should see a setup wizard that will help you get started with Storybook introducing you to the main concepts and features, including how the UI is organized, how to write your first story, and how to test your components' response to various inputs utilizing controls.

If you skipped the wizard, you can always run it again by adding the ?path=/onboarding query parameter to the URL of your Storybook instance, provided that the example stories are still available.

Storybook comes with a built-in development server featuring everything you need for project development. Depending on your system configuration, running the storybook command will start the local development server, output the address for you, and automatically open the address in a new browser tab where a welcome screen greets you.

Storybook collects completely anonymous data to help us improve user experience. Participation is optional, and you may opt-out if you'd not like to share any information.

There are some noteworthy items here:

The Storybook CLI includes support for the industry's popular package managers (e.g., Yarn, npm, and pnpm) automatically detecting the one you are using when you initialize Storybook. However, if you want to use a specific package manager as the default, add the --package-manager flag to the installation command. For example:

If auto‑detection fails or you’re using a custom setup, pass the project type explicitly with --type when running the initializer. The allowed values are:

If you've enabled Storybook in a project running on a new version of Yarn with Plug'n'Play (PnP) enabled, you may notice that it will generate node_modules with some additional files and folders. This is a known constraint as Storybook relies on some directories (e.g., .cache) to store cache files and other data to improve performance and faster builds. You can safely ignore these files and folders, adjusting your .gitignore file to exclude them from the version control you're using.

If you previously installed Storybook in a project that uses Webpack 4, it will no longer work. This is because Storybook now uses Webpack 5 by default. To solve this issue, we recommend you upgrade your project to Webpack 5 and then run the following command to migrate your project to the latest version of Storybook:

By default, Storybook is configured to detect whether you're initializing it on an empty directory or an existing project. However, if you attempt to initialize Storybook, select a Vite-based framework (e.g., React) in a directory that only contains a package.json file, you may run into issues with Yarn Modern. This is due to how Yarn handles peer dependencies and how Storybook is set up to work with Vite-based frameworks, as it requires the Vite package to be installed. To solve this issue, you must install Vite manually and initialize Storybook.

If you're still running into some issues during the installation process, we encourage you to check out the following resources:

Now that you have successfully installed Storybook and understood how it works, let's continue where you left off in the setup wizard and delve deeper into writing stories.

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

Example 2 (elixir):
```elixir
npm create storybook@latest
```

Example 3 (elixir):
```elixir
npm create storybook@8.3
```

Example 4 (elixir):
```elixir
npx storybook@8.2 init
```

---

## Storybook for React with Vite | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/frameworks/react-vite

**Contents:**
- Storybook for React with Vite
- Install
  - Requirements
- Run Storybook
- FAQ
  - How do I migrate from the React Webpack framework?
  - How do I manually install the React framework?
- API
  - Options
    - builder

Storybook for React & Vite is a framework that makes it easy to develop and test UI components in isolation for React applications built with Vite.

To install Storybook in an existing React project, run this command in your project's root directory:

You can then get started writing stories, running tests and documenting your components. For more control over the installation process, refer to the installation guide.

To run Storybook for a particular project, run the following:

To build Storybook, run:

You will find the output in the configured outputDir (default is storybook-static).

The upgrade command should prompt you to migrate to @storybook/react-vite when you run it:

In case that auto-migration does not work for your project, refer to the manual installation instructions below.

First, install the framework:

Then, update your .storybook/main.js|ts to change the framework property:

You can pass an options object for additional configuration if needed:

Type: Record<string, any>

Configure options for the framework's builder. For this framework, available options can be found in the Vite builder docs.

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

Example 2 (unknown):
```unknown
npm run storybook
```

Example 3 (unknown):
```unknown
npm run build-storybook
```

Example 4 (elixir):
```elixir
npx storybook@latest upgrade
```

---

## Storybook for Next.js with Webpack | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/frameworks/nextjs/?renderer=react

**Contents:**
- Storybook for Next.js with Webpack
- Install
  - Requirements
- Run Storybook
- Configure
  - Next.js's Image component
    - Local images
    - Remote images
  - Next.js font optimization
    - next/font/google

Storybook for Next.js (Webpack) is a framework that makes it easy to develop and test UI components in isolation for Next.js applications using Webpack 5.

We recommend using @storybook/nextjs-vite for most Next.js projects. The Vite-based framework is faster, more modern, and offers better support for testing features.

Use this Webpack-based framework (@storybook/nextjs) only if:

To install Storybook in an existing Next.js project, run this command in your project's root directory:

The command will prompt you to choose between this framework and @storybook/nextjs-vite. We recommend the Vite-based framework (learn why).

You can then get started writing stories, running tests and documenting your components. For more control over the installation process, refer to the installation guide.

To run Storybook for a particular project, run the following:

To build Storybook, run:

You will find the output in the configured outputDir (default is storybook-static).

Storybook for Next.js supports many Next.js features including:

This framework allows you to use Next.js's next/image with no configuration.

Local images are supported.

Remote images are also supported.

next/font is partially supported in Storybook. The packages next/font/google and next/font/local are supported.

You don't have to do anything. next/font/google is supported out of the box.

For local fonts you have to define the src property. The path is relative to the directory where the font loader function is called.

If the following component defines your localFont like this:

You have to tell Storybook where the fonts directory is located, via the staticDirs configuration. The from value is relative to the .storybook directory. The to value is relative to the execution context of Storybook. Very likely it is the root of your project.

The following features are not supported (yet). Support for these features might be planned for the future:

Occasionally fetching fonts from Google may fail as part of your Storybook build step. It is highly recommended to mock these requests, as those failures can cause your pipeline to fail as well. Next.js supports mocking fonts via a JavaScript module located where the env var NEXT_FONT_GOOGLE_MOCKED_RESPONSES references.

For example, using GitHub Actions:

Your mocked fonts will look something like this:

Next.js's router is automatically stubbed for you so that when the router is interacted with, all of its interactions are automatically logged to the Actions panel.

You should only use next/router in the pages directory. In the app directory, it is necessary to use next/navigation.

Per-story overrides can be done by adding a nextjs.router property onto the story parameters. The framework will shallowly merge whatever you put here into the router.

These overrides can also be applied to all stories for a component or all stories in your project. Standard parameter inheritance rules apply.

The default values on the stubbed router are as follows (see globals for more details on how globals work).

Additionally, the router object contains all of the original methods (such as push(), replace(), etc.) as mock functions that can be manipulated and asserted on using regular mock APIs.

To override these defaults, you can use parameters and beforeEach:

Please note that next/navigation can only be used in components/pages in the app directory.

If your story imports components that use next/navigation, you need to set the parameter nextjs.appDirectory to true in for that component's stories:

If your Next.js project uses the app directory for every page (in other words, it does not have a pages directory), you can set the parameter nextjs.appDirectory to true in the .storybook/preview.tsx file to apply it to all stories.

Per-story overrides can be done by adding a nextjs.navigation property onto the story parameters. The framework will shallowly merge whatever you put here into the router.

These overrides can also be applied to all stories for a component or all stories in your project. Standard parameter inheritance rules apply.

The useSelectedLayoutSegment, useSelectedLayoutSegments, and useParams hooks are supported in Storybook. You have to set the nextjs.navigation.segments parameter to return the segments or the params you want to use.

With the above configuration, the component rendered in the stories would receive the following values from the hooks:

To use useParams, you have to use a segments array where each element is an array containing two strings. The first string is the param key and the second string is the param value.

With the above configuration, the component rendered in the stories would receive the following values from the hooks:

These overrides can also be applied to a single story or all stories in your project. Standard parameter inheritance rules apply.

The default value of nextjs.navigation.segments is [] if not set.

The default values on the stubbed navigation context are as follows:

Additionally, the router object contains all of the original methods (such as push(), replace(), etc.) as mock functions that can be manipulated and asserted on using regular mock APIs.

To override these defaults, you can use parameters and beforeEach:

next/head is supported out of the box. You can use it in your stories like you would in your Next.js application. Please keep in mind, that the Head children are placed into the head element of the iframe that Storybook uses to render your stories.

Global Sass/SCSS stylesheets are also supported without any additional configuration. Just import them into the preview config file.

This will automatically include any of your custom Sass configurations in your Next.js config file.

CSS modules work as expected.

The built-in CSS-in-JS solution for Next.js is styled-jsx, and this framework supports that out of the box, too, with zero config.

You can use your own Babel config, too. This is an example of how you can customize styled-jsx.

Tailwind in Next.js is supported via PostCSS. Storybook will automatically handle the PostCSS config for you, including any custom PostCSS configuration, so that you can import your global CSS directly into the preview config file:

Next.js lets you customize PostCSS config. Thus this framework will automatically handle your PostCSS config for you.

Absolute imports from the root directory are supported.

Also OK for global styles in .storybook/preview.tsx!

Absolute imports cannot be mocked in stories/tests. See the Mocking modules section for more information.

Module aliases are also supported.

As an alternative to module aliases, you can use subpath imports to import modules. This follows Node package standards and has benefits when mocking modules.

To configure subpath imports, you define the imports property in your project's package.json file. This property maps the subpath to the actual file path. The example below configures subpath imports for all modules in the project:

Because subpath imports replace module aliases, you can remove the path aliases from your TypeScript configuration.

Which can then be used like this:

Components often depend on modules that are imported into the component file. These can be from external packages or internal to your project. When rendering those components in Storybook or testing them, you may want to mock those modules to control and assert their behavior.

This framework provides mocks for many of Next.js' internal modules:

To mock other modules, use automocking or one of the alternative methods documented in the mocking modules guide.

Next.js allows for Runtime Configuration which lets you import a handy getConfig function to get certain configuration defined in your next.config.js file at runtime.

In the context of Storybook with this framework, you can expect Next.js's Runtime Configuration feature to work just fine.

Note, because Storybook doesn't server render your components, your components will only see what they normally see on the client side (i.e. they won't see serverRuntimeConfig but will see publicRuntimeConfig).

For example, consider the following Next.js config:

Calls to getConfig would return the following object when called within Storybook:

Next.js comes with a lot of things for free out of the box like Sass support, but sometimes you add custom Webpack config modifications to Next.js. This framework takes care of most of the Webpack modifications you would want to add. If Next.js supports a feature out of the box, then that feature will work out of the box in Storybook. If Next.js doesn't support something out of the box, but makes it easy to configure, then this framework will do the same for that thing for Storybook.

Any Webpack modifications desired for Storybook should be made in .storybook/main.js|ts.

Note: Not all Webpack modifications are copy/paste-able between next.config.js and .storybook/main.js|ts. It is recommended to do your research on how to properly make your modification to Storybook's Webpack config and on how Webpack works.

Below is an example of how to add SVGR support to Storybook with this framework.

Storybook handles most Typescript configurations, but this framework adds additional support for Next.js's support for Absolute Imports and Module path aliases. In short, it takes into account your tsconfig.json's baseUrl and paths. Thus, a tsconfig.json like the one below would work out of the box.

If your app uses React Server Components (RSC), Storybook can render them in stories in the browser.

To enable this set the experimentalRSC feature flag in your .storybook/main.js|ts config:

Setting this flag automatically wraps your story in a Suspense wrapper, which is able to render asynchronous components in NextJS's version of React.

If this wrapper causes problems in any of your existing stories, you can selectively disable it using the react.rsc parameter at the global/component/story level:

Note that wrapping your server components in Suspense does not help if your server components access server-side resources like the file system or Node-specific libraries. To work around this, you'll need to mock out your data access layer using Webpack aliases or an addon like storybook-addon-module-mock.

If your server components access data via the network, we recommend using the MSW Storybook Addon to mock network requests.

In the future we will provide better mocking support in Storybook and support for Server Actions.

If you're using Yarn v2 or v3, you may run into issues where Storybook can't resolve style-loader or css-loader. For example, you might get errors like:

This is because those versions of Yarn have different package resolution rules than Yarn v1.x. If this is the case for you, please install the package directly.

First, install the framework:

Then, update your .storybook/main.js|ts to change the framework property:

Finally, if you were using Storybook plugins to integrate with Next.js, those are no longer necessary when using this framework and can be removed:

Please refer to the migration instructions for @storybook/nextjs-vite.

Next.js pages can fetch data directly within server components in the app directory, which often include module imports that only run in a Node.js environment. This does not (currently) work within Storybook, because if you import from a Next.js page file containing those node module imports in your stories, your Storybook's Webpack will crash because those modules will not run in a browser. To get around this, you can extract the component in your page file into a separate file and import that pure component in your stories. Or, if that's not feasible for some reason, you can polyfill those modules in your Storybook's webpackFinal configuration.

Make sure you are treating image imports the same way you treat them when using next/image in normal development.

Before using this framework, image imports would import the raw path to the image (e.g. 'static/media/stories/assets/logo.svg'). Now image imports work the "Next.js way", meaning that you now get an object when importing an image. For example:

Therefore, if something in Storybook isn't showing the image properly, make sure you expect the object to be returned from an import instead of only the asset path.

See local images for more detail on how Next.js treats static image imports.

You might get this if you're using Yarn v2 or v3. See Notes for Yarn v2 and v3 users for more details.

We recommend using @storybook/nextjs-vite (Vite-based) for most projects because it offers faster builds, better test support, and a simpler configuration. However, if your project has custom Webpack configurations that are incompatible with Vite, use this framework instead.

sharp is a dependency of Next.js's image optimization feature. If you see this error, you need to install sharp in your project.

You can refer to the Install sharp to Use Built-In Image Optimization in the Next.js documentation for more information.

The @storybook/nextjs package exports several modules that enable you to mock Next.js's internal behavior.

Type: { getPackageAliases: ({ useESM?: boolean }) => void }

getPackageAliases is a helper for generating the aliases needed to set up portable stories.

Type: typeof import('next/cache')

This module exports mocked implementations of the next/cache module's exports. You can use it to create your own mock implementations or assert on mock calls in a story's play function.

Type: cookies, headers and draftMode from Next.js

This module exports writable mocked implementations of the next/headers module's exports. You can use it to set up cookies or headers that are read in your story, and to later assert that they have been called.

Next.js's default headers() export is read-only, but this module exposes methods allowing you to write to the headers:

For cookies, you can use the existing API to write them. E.g., cookies().set('firstName', 'Jane').

Because headers(), cookies() and their sub-functions are all mocks you can use any mock utilities in your stories, like headers().getAll.mock.calls.

Type: typeof import('next/navigation') & getRouter: () => ReturnType<typeof import('next/navigation')['useRouter']>

This module exports mocked implementations of the next/navigation module's exports. It also exports a getRouter function that returns a mocked version of Next.js's router object from useRouter, allowing the properties to be manipulated and asserted on. You can use it mock implementations or assert on mock calls in a story's play function.

Type: typeof import('next/router') & getRouter: () => ReturnType<typeof import('next/router')['useRouter']>

This module exports mocked implementations of the next/router module's exports. It also exports a getRouter function that returns a mocked version of Next.js's router object from useRouter, allowing the properties to be manipulated and asserted on. You can use it mock implementations or assert on mock calls in a story's play function.

You can pass an options object for additional configuration if needed:

The available options are:

Type: Record<string, any>

Configure options for the framework's builder. For Next.js, available options can be found in the Webpack builder docs.

The absolute path to the next.config.js file. This is necessary if you have a custom next.config.js file that is not in the root directory of your project.

This framework contributes the following parameters to Storybook, under the nextjs namespace:

Props to pass to every instance of next/image. See next/image docs for more details.

If your story imports components that use next/navigation, you need to set the parameter nextjs.appDirectory to true. Because this is a parameter, you can apply it to a single story, all stories for a component, or every story in your Storybook. See Next.js Navigation for more details.

The router object that is passed to the next/navigation context. See Next.js's navigation docs for more details.

The router object that is passed to the next/router context. See Next.js's router docs for more details.

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

Example 2 (unknown):
```unknown
npm run storybook
```

Example 3 (unknown):
```unknown
npm run build-storybook
```

Example 4 (jsx):
```jsx
import Image from 'next/image';
import profilePic from '../public/me.png';
 
function Home() {
  return (
    <>
      <h1>My Homepage</h1>
      <Image
        src={profilePic}
        alt="Picture of the author"
        // width={500} automatically provided
        // height={500} automatically provided
        // blurDataURL="../public/me.png" set to equal the image itself (for this framework)
        // placeholder="blur" // Optional blur-up while loading
      />
      <p>Welcome to my homepage!</p>
    </>
  );
}
```

---

## Storybook for Preact with Vite | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/frameworks/preact-vite?renderer=preact

**Contents:**
- Storybook for Preact with Vite
- Install
  - Requirements
- Run Storybook
- FAQ
  - How do I manually install the Preact framework?
- API
  - Options
    - builder

Storybook for Preact & Vite is a framework that makes it easy to develop and test UI components in isolation for Preact applications built with Vite.

To install Storybook in an existing Preact project, run this command in your project's root directory:

You can then get started writing stories, running tests and documenting your components. For more control over the installation process, refer to the installation guide.

To run Storybook for a particular project, run the following:

To build Storybook, run:

You will find the output in the configured outputDir (default is storybook-static).

First, install the framework:

Then, update your .storybook/main.js|ts to change the framework property:

You can pass an options object for additional configuration if needed:

Type: Record<string, any>

Configure options for the framework's builder. For this framework, available options can be found in the Vite builder docs.

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

Example 2 (unknown):
```unknown
npm run storybook
```

Example 3 (unknown):
```unknown
npm run build-storybook
```

Example 4 (elixir):
```elixir
npm install --save-dev @storybook/preact-vite
```

---

## Storybook for Svelte with Vite | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/frameworks/svelte-vite

**Contents:**
- Storybook for Svelte with Vite
- Install
  - Requirements
- Run Storybook
- Writing native Svelte stories
  - Setup
  - Configure
  - Upgrade to Svelte CSF addon v5
    - Simplified story API
    - Story templates

Storybook for Svelte & Vite is a framework that makes it easy to develop and test UI components in isolation for applications using Svelte built with Vite.

To install Storybook in an existing Svelte project, run this command in your project's root directory:

You can then get started writing stories, running tests and documenting your components. For more control over the installation process, refer to the installation guide.

To run Storybook for a particular project, run the following:

To build Storybook, run:

You will find the output in the configured outputDir (default is storybook-static).

Storybook provides a Svelte addon maintained by the community, enabling you to write stories for your Svelte components using the template syntax.

The community actively maintains the Svelte CSF addon but still lacks some features currently available in the official Storybook Svelte framework support. For more information, see the addon's documentation.

If you initialized your project with the Svelte framework, the addon has already been installed and configured for you. However, if you're migrating from a previous version, you'll need to take additional steps to enable this feature.

Run the following command to install the addon.

The CLI's add command automates the addon's installation and setup. To install it manually, see our documentation on how to install addons.

Update your Storybook configuration file (i.e., .storybook/main.js|ts) to enable support for this format.

By default, the Svelte addon offers zero-config support for Storybook's Svelte framework. However, you can extend your Storybook configuration file (i.e., .storybook/main.js|ts) and provide additional addon options. Listed below are the available options and examples of how to use them.

Enabling the legacyTemplate option can introduce a performance overhead and should be used cautiously. For more information, refer to the addon's documentation.

With the Svelte 5 release, Storybook's Svelte CSF addon has been updated to support the new features. This guide will help you migrate to the latest version of the addon. Below is an overview of the major changes in version 5.0 and the steps needed to upgrade your project.

If you are using the Meta component or the meta named export to define the story's metadata (e.g., parameters), you'll need to update your stories to use the new defineMeta function. This function returns an object with the required information, including a Story component that you must use to define your component stories.

If you used the Template component to control how the component renders in the Storybook, this feature was replaced with built-in children support in the Story component, enabling you to compose components and define the UI structure directly in the story.

If you need support for the Template component, the addon provides a feature flag for backward compatibility. For more information, see the configuration options.

With Svelte's slot deprecation and the introduction of reusable snippets, the addon also introduced support for this feature allowing you to extend the Story component and provide a custom snippet to provide dynamic content to your stories. Story accepts a template snippet, allowing you to create dynamic stories without losing reactivity.

If you enabled automatic documentation generation with the autodocs story property, you must replace it with tags. This property allows you to categorize and filter stories based on specific criteria and generate documentation based on the tags applied to the stories.

First, install the framework:

Then, update your .storybook/main.js|ts to change the framework property:

You can pass an options object for additional configuration if needed:

The available options are:

Type: Record<string, any>

Configure options for the framework's builder. For this framework, available options can be found in the Vite builder docs.

Enables or disables automatic documentation generation for component properties. When disabled, Storybook will skip the docgen processing step during build, which can improve build performance.

Disabling docgen can improve build performance for large projects, but argTypes won't be inferred automatically, which will prevent features like Controls and docs from working as expected. To use those features, you will need to define argTypes manually.

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

Example 2 (unknown):
```unknown
npm run storybook
```

Example 3 (unknown):
```unknown
npm run build-storybook
```

Example 4 (elixir):
```elixir
npx storybook@latest add @storybook/addon-svelte-csf
```

---

## Why Storybook? | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/why-storybook

**Contents:**
- Why Storybook?
- The problem
- The solution
  - Build UIs in isolation
  - Capture UI variations as “stories”
  - Storybook keeps track of every story
- Benefits
- Write stories once, reuse everywhere

The web’s universality is pushing more complexity into the frontend. It began with responsive web design, which turned every user interface from one to 10, 100, 1000 different user interfaces. Over time, additional requirements piled on like devices, browsers, accessibility, performance, and async states.

Component-driven tools like React, Vue 3, and Angular help break down complex UIs into simple components but they’re not silver bullets. As frontends grow, the number of components swells. Mature projects can contain hundreds of components that yield thousands of discrete variations.

To complicate matters further, those UIs are painful to debug because they’re entangled in business logic, interactive states, and app context.

The breadth of modern frontends overwhelm existing workflows. Developers must consider countless UI variations, yet aren’t equipped to develop or organize them all. You end up in a situation where UIs are tougher to build, less satisfying to work on, and brittle.

Every piece of UI is now a component. The superpower of components is that you don't need to spin up the whole app just to see how they render. You can render a specific variation in isolation by passing in props, mocking data, or faking events.

Storybook is packaged as a small, development-only, workshop that lives alongside your app. It provides an isolated iframe to render components without interference from app business logic and context. That helps you focus development on each variation of a component, even the hard-to-reach edge cases.

When developing a component variation in isolation, save it as a story. Stories are a declarative syntax for supplying props and mock data to simulate component variations. Each component can have multiple stories. Each story allows you to demonstrate a specific variation of that component to verify appearance and behavior.

You write stories for granular UI component variation and then use those stories in development, testing, and documentation.

Storybook is an interactive directory of your UI components and their stories. In the past, you'd have to spin up the app, navigate to a page, and contort the UI into the right state. This is a huge waste of time and bogs down frontend development. With Storybook, you can skip all those steps and jump straight to working on a UI component in a specific state.

Storybook is packaged as a small, development-only, workshop that lives alongside your app. Install it by running a command.

During development, run it in a separate node process. If you’re working on UI in isolation, the only thing you’ll need to run is Storybook.

Storybook aims to integrate with industry-standard tools and platforms to simplify setup. Thanks to our ambitious developer community, we’ve made significant progress. There are hundreds of addons and tutorials that walk through how to set up Storybook in all types of projects.

If you’re using a niche framework or a recently launched tool, we might not have an integration for it yet. Consider creating a proof of concept yourself first to lead the way for the rest of the community.

Every team is different and so is their workflow. Storybook is designed to be incrementally adoptable. Teams can gradually try features to see what works best for them.

Most community members choose a Component-Driven workflow. UIs are developed in isolation from the “bottom up” starting with basic components then progressively combined to assemble pages.

When you write stories for components, you get a bunch of additional benefits for free.

📝 Develop UIs that are more durable

Isolate components and pages and track their use cases as stories. Verify hard-to-reach edge cases of UI. Use addons to mock everything a component needs—context, API requests, device features, etc.

✅ Test UIs with less effort and no flakes

Stories are a pragmatic, reproducible way of tracking UI states. Use them to spot-test the UI during development. Storybook offers built-in workflows for automated Interaction, Accessibility, and Visual testing. Or use stories as test cases by importing them into other JavaScript testing tools.

📚 Document UI for your team to reuse

Storybook is the single source of truth for your UI. Stories index all your components and their various states, making it easy for your team to find and reuse existing UI patterns. Storybook also auto-generates documentation from those stories.

📤 Share how the UI actually works

Stories show how UIs actually work, not just a picture of how they're supposed to work. That keeps everyone aligned on what's currently in production. Publish Storybook to get sign-off from teammates. Or embed them in wikis, Markdown, and Figma to streamline collaboration.

🚦Automate UI workflows

Storybook is compatible with your continuous integration workflow. Add it as a CI step to automate user interface testing, review implementation with teammates, and get signoff from stakeholders.

Storybook is powered by Component Story Format, an open standard based on JavaScript ES6 modules. This enables stories to interoperate between development, testing, and design tools. Each story is exported as a JavaScript function enabling you to reuse it with other tools. No vendor lock-in.

Reuse stories with Jest or Vitest and Testing Library to verify interactions. Put them in Chromatic for visual testing. Audit story accessibility with Axe. Or test user flows with Playwright and Cypress. Reuse unlocks more workflows at no extra cost.

Storybook is purpose-built to help you develop complex UIs faster with greater durability and lower maintenance. It’s used by 100s of leading companies and thousands of developers.

**Examples:**

Example 1 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { Histogram } from './Histogram';
 
const meta = {
  component: Histogram,
} satisfies Meta<typeof Histogram>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Basic: Story = {
  args: {
    dataType: 'latency',
    showHistogramLabels: true,
    histogramAccentColor: '#1EA7FD',
    label: 'Latency distribution',
  },
};
```

---

## Storybook for Svelte with Vite | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/frameworks/svelte-vite/?renderer=svelte

**Contents:**
- Storybook for Svelte with Vite
- Install
  - Requirements
- Run Storybook
- Writing native Svelte stories
  - Setup
  - Configure
  - Upgrade to Svelte CSF addon v5
    - Simplified story API
    - Story templates

Storybook for Svelte & Vite is a framework that makes it easy to develop and test UI components in isolation for applications using Svelte built with Vite.

To install Storybook in an existing Svelte project, run this command in your project's root directory:

You can then get started writing stories, running tests and documenting your components. For more control over the installation process, refer to the installation guide.

To run Storybook for a particular project, run the following:

To build Storybook, run:

You will find the output in the configured outputDir (default is storybook-static).

Storybook provides a Svelte addon maintained by the community, enabling you to write stories for your Svelte components using the template syntax.

The community actively maintains the Svelte CSF addon but still lacks some features currently available in the official Storybook Svelte framework support. For more information, see the addon's documentation.

If you initialized your project with the Svelte framework, the addon has already been installed and configured for you. However, if you're migrating from a previous version, you'll need to take additional steps to enable this feature.

Run the following command to install the addon.

The CLI's add command automates the addon's installation and setup. To install it manually, see our documentation on how to install addons.

Update your Storybook configuration file (i.e., .storybook/main.js|ts) to enable support for this format.

By default, the Svelte addon offers zero-config support for Storybook's Svelte framework. However, you can extend your Storybook configuration file (i.e., .storybook/main.js|ts) and provide additional addon options. Listed below are the available options and examples of how to use them.

Enabling the legacyTemplate option can introduce a performance overhead and should be used cautiously. For more information, refer to the addon's documentation.

With the Svelte 5 release, Storybook's Svelte CSF addon has been updated to support the new features. This guide will help you migrate to the latest version of the addon. Below is an overview of the major changes in version 5.0 and the steps needed to upgrade your project.

If you are using the Meta component or the meta named export to define the story's metadata (e.g., parameters), you'll need to update your stories to use the new defineMeta function. This function returns an object with the required information, including a Story component that you must use to define your component stories.

If you used the Template component to control how the component renders in the Storybook, this feature was replaced with built-in children support in the Story component, enabling you to compose components and define the UI structure directly in the story.

If you need support for the Template component, the addon provides a feature flag for backward compatibility. For more information, see the configuration options.

With Svelte's slot deprecation and the introduction of reusable snippets, the addon also introduced support for this feature allowing you to extend the Story component and provide a custom snippet to provide dynamic content to your stories. Story accepts a template snippet, allowing you to create dynamic stories without losing reactivity.

If you enabled automatic documentation generation with the autodocs story property, you must replace it with tags. This property allows you to categorize and filter stories based on specific criteria and generate documentation based on the tags applied to the stories.

First, install the framework:

Then, update your .storybook/main.js|ts to change the framework property:

You can pass an options object for additional configuration if needed:

The available options are:

Type: Record<string, any>

Configure options for the framework's builder. For this framework, available options can be found in the Vite builder docs.

Enables or disables automatic documentation generation for component properties. When disabled, Storybook will skip the docgen processing step during build, which can improve build performance.

Disabling docgen can improve build performance for large projects, but argTypes won't be inferred automatically, which will prevent features like Controls and docs from working as expected. To use those features, you will need to define argTypes manually.

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

Example 2 (unknown):
```unknown
npm run storybook
```

Example 3 (unknown):
```unknown
npm run build-storybook
```

Example 4 (elixir):
```elixir
npx storybook@latest add @storybook/addon-svelte-csf
```

---

## Storybook for Web components with Vite | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/frameworks/web-components-vite/?renderer=web-components

**Contents:**
- Storybook for Web components with Vite
- Install
  - Requirements
- Run Storybook
- FAQ
  - How do I manually install the Web Components framework?
- API
  - Options
    - builder

Storybook for Web components & Vite is a framework that makes it easy to develop and test UI components in isolation for applications using Web components built with Vite.

To install Storybook in an existing project, run this command in your project's root directory:

You can then get started writing stories, running tests and documenting your components. For more control over the installation process, refer to the installation guide.

To run Storybook for a particular project, run the following:

To build Storybook, run:

You will find the output in the configured outputDir (default is storybook-static).

First, install the framework:

Then, update your .storybook/main.js|ts to change the framework property:

You can pass an options object for additional configuration if needed:

The available options are:

Type: Record<string, any>

Configure options for the framework's builder. For this framework, available options can be found in the Vite builder docs.

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

Example 2 (unknown):
```unknown
npm run storybook
```

Example 3 (unknown):
```unknown
npm run build-storybook
```

Example 4 (elixir):
```elixir
npm install --save-dev @storybook/web-components-vite
```

---

## Setup Storybook | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/setup

**Contents:**
- Setup Storybook
- Render component styles
- Configure Storybook for your stack
- Load assets and resources

Now that you’ve learned what stories are and how to browse them, let’s demo working on one of your components.

Pick a simple component from your project, like a Button, and write a .stories.js, .stories.ts, or .stories.svelte file to go along with it. It might look something like this:

Go to your Storybook to view the rendered component. It’s OK if it looks a bit unusual right now.

Depending on your technology stack, you also might need to configure the Storybook environment further.

Storybook isn’t opinionated about how you generate or load CSS. It renders whatever DOM elements you provide. But sometimes, things won’t “look right” out of the box.

You may have to configure your CSS tooling for Storybook’s rendering environment. Here are some setup guides for popular tools in the community.

Don't see the tool that you're looking for? Check out the styling and css page for more details.

Storybook comes with a permissive default configuration. It attempts to customize itself to fit your setup. But it’s not foolproof.

Your project may have additional requirements before components can be rendered in isolation. This warrants customizing configuration further. There are three broad categories of configuration you might need.

If you see errors on the CLI when you run the yarn storybook command, you likely need to make changes to Storybook’s build configuration. Here are some things to try:

If Storybook builds but you see an error immediately when connecting to it in the browser, in that case, chances are one of your input files is not compiling/transpiling correctly to be interpreted by the browser. Storybook supports evergreen browsers, but you may need to check the Babel and Webpack settings (see above) to ensure your component code works correctly.

If a particular story has a problem rendering, often it means your component expects a specific environment is available to the component.

A common frontend pattern is for components to assume that they render in a specific “context” with parent components higher up the rendering hierarchy (for instance, theme providers).

Use decorators to “wrap” every story in the necessary context providers. The .storybook/preview.* file allows you to customize how components render in Canvas, the preview iframe. This file can be written in JavaScript (preview.jsx) or TypeScript (preview.tsx). See how you can wrap every component rendered in Storybook with Styled Components ThemeProvider, Vue's Vuetify, Svelte's Bits UI BitsConfig, or with an Angular theme provider component in the example below.

We recommend serving external resources and assets requested in your components statically with Storybook. It ensures that assets are always available to your stories. Read our documentation to learn how to host static files with Storybook.

**Examples:**

Example 1 (typescript):
```typescript
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';
 
import { YourComponent } from './YourComponent';
 
//👇 This default export determines where your story goes in the story list
const meta = {
  component: YourComponent,
} satisfies Meta<typeof YourComponent>;
 
export default meta;
type Story = StoryObj<typeof meta>;
 
export const Basic: Story = {
  args: {
    //👇 The args you need here will depend on your component
  },
};
```

Example 2 (jsx):
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

---

## Storybook for TanStack React | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/frameworks/tanstack-react

**Contents:**
- Storybook for TanStack React
- Install
  - Requirements
- Run Storybook
- Configure
  - Routing
    - Rendering a Route
      - Handling dynamic params (e.g., /$id)
    - Rendering nested routes
    - Using router parameters with a non-Route component

Storybook for TanStack React is Storybook's framework integration for TanStack Router and TanStack Start applications built with React and Vite.

It builds on @storybook/react-vite to add router-aware story rendering, automatic router mocking, and mocked TanStack Start server functions. Components that depend on routing or server functions can render inside Storybook without booting your full app runtime.

To install Storybook in an existing TanStack Router or TanStack Start project, run this command in your project's root directory:

You can then get started writing stories, running tests, and documenting your components. For more control over the installation process, refer to the installation guide.

This integration expects a TanStack Router application with @tanstack/react-router available in your project. If your app uses TanStack Start APIs such as server functions, keep the matching TanStack Start packages installed as well.

To run Storybook for a particular project, run the following:

To build Storybook, run:

You will find the output in the configured outputDir (default is storybook-static).

Storybook for TanStack React uses Vite through @storybook/builder-vite and automatically wraps each story in a memory-backed TanStack Router. This gives you a working router context in Storybook without having to boot your full application shell.

Out of the box, it supports these workflows:

Supply a TanStack Route object via parameters.tanstack.router.route. Storybook extracts the route's React component from the route and keeps the route available for typed router configuration.

Supply params alongside routeOverrides under parameters.tanstack.router. The params object is interpolated into the URL, and routeOverrides lets you stub the loader without touching the original route.

For the full set of properties, see Parameters.

When route is a file route connected to your app's route tree, Storybook automatically includes parent layout routes so the story renders inside the same nested hierarchy as the real app. You can also pass the routeTree export from routeTree.gen.ts directly.

Use path to navigate to the specific route, and routeOverrides to stub guards or loaders on ancestor routes so the story can render independently.

If your story renders a regular React component instead of a route object, you can still provide routing context through parameters.tanstack.router.

This is useful when your component reads from hooks such as useRouterState, useSearch, useParams, or useLoaderData, but you do not want to make the route itself the story component.

Use query for search params (e.g., ?tab=details&page=2) and path for a URL fragment (e.g., #section-name) under parameters.tanstack.router:

When a route has a loader or beforeLoad that calls real APIs, you can override those options per story without modifying the original route object. Pass routeOverrides under parameters.tanstack.router. Each key is a route ID and the value can override loader, beforeLoad, validateSearch, loaderDeps, and context.

Use '__root__' as the key to target the root route.

This framework automatically redirects @tanstack/react-router imports to a Storybook-compatible mock layer. That mock re-exports TanStack Router APIs, keeps hooks such as useNavigate(), useSearch(), and useParams() available in stories, and wires navigation attempts into Storybook spies.

For TanStack Start apps, the integration also stubs TanStack Start server and runtime entry points. This is what allows components that depend on server functions or Start-specific runtime modules to render in Storybook without a running Start server.

In practice, this means you can usually render TanStack Start components directly, and createServerFn() handlers are replaced with mock functions that you can observe and override in stories and tests.

If your component imports a TanStack Start server function, Storybook turns that createServerFn().handler(...) result into a mock function. That means you can override it per story with standard mock APIs.

For example, imagine your application code exports a server function like this:

In Storybook, you can override that function for each story:

This is useful for documenting loading, success, and error states without changing your application code.

TanStack Start apps often import server-only packages (e.g. database clients, auth libraries) at module scope inside route files. When Storybook loads the route tree, those imports can crash the browser. The integration handles this at three layers:

The preset already intercepts @tanstack/react-start, @tanstack/react-start/server, @tanstack/start-storage-context, and related TanStack modules. It also replaces createServerFn() handlers with mock functions. You do not need to do anything for these.

When your routes import app-specific server code (e.g. ~/db/client, ~/auth/index.server), use Storybook's mocking with a __mocks__ file to prevent the real module (and its Node.js dependencies) from loading in the browser.

Step 1: Register the mock in .storybook/preview.ts:

Step 2: Create src/db/__mocks__/client.ts next to the real module. Use only import type so no server packages are pulled in:

Why a __mocks__ file instead of automocking?

Storybook's automocking replaces functions but still evaluates the original module and its imports. For modules that import postgres, pg, or other Node.js-only packages, the original module must never be evaluated, because it would crash the browser. A __mocks__ file is the only approach that completely prevents evaluation of the original module and its dependency chain.

Errors like does not provide an export named 'default' or AsyncLocalStorage is not defined mean a server-only module reached the browser.

The fix is to mock the server module itself, not the component or route that uses it. For example, if Dashboard.tsx imports ~/auth/session, and ~/auth/session imports ~/db/client, and ~/db/client imports postgres — mock ~/db/client. The Node.js dependency (postgres) is the smoking gun; mock the closest module to it that you control.

To find that module, walk the error stack trace from top to bottom and stop at the first import you wrote yourself. Then add a __mocks__ file for it.

Two cases where you do not need a mock:

You can use this framework together with TanStack Query to provide a working QueryClient in Storybook and seed query data per story.

TanStack Query is not automatically set up. The recommended approach is to create a single QueryClient in your preview file, clear it between stories via beforeEach, and share the same instance through both parameters.tanstack.router.context and a QueryClientProvider decorator.

In individual stories, use beforeEach to call setQueryData on the shared QueryClient before the component renders. Access it from parameters.tanstack.router.context:

Storybook provides a migration tool for migrating to this framework from the React (Vite) framework, @storybook/react-vite. To migrate, run this command:

This automigration tool performs the following actions:

@storybook/tanstack-react already wraps every story in a TanStack Router automatically, so any manual RouterProvider / createRouter / createMemoryHistory / createRootRoute decorator should be removed after running the automigration. For stories that need a specific route, use parameters.tanstack.router instead.

First, install the framework:

Then, update your .storybook/main.js|ts to change the framework property:

Then similarly update your .storybook/preview.* to import from @storybook/tanstack-react:

@storybook/tanstack-react already wraps every story in a TanStack Router automatically, so any manual RouterProvider / createRouter / createMemoryHistory / createRootRoute decorator should be removed after running the automigration. For stories that need a specific route, use parameters.tanstack.router instead.

Use @storybook/tanstack-react when your components rely on TanStack Router or TanStack Start APIs and you want Storybook to provide router context, typed route parameters, automatic router mocking, and mocked TanStack Start server-function behavior.

Use @storybook/react-vite when your app is a standard React and Vite project without TanStack Router.

Import your application CSS in .storybook/preview.* so it is bundled with the preview:

For more information, see the styling documentation.

Add project-level decorators to apply providers to all stories.

You can also add component-level decorators to apply providers to all stories for a specific component, or story-level decorators to apply providers to a single story.

No. @storybook/tanstack-react runs stories in the browser using a memory-backed router. React Server Components require a server runtime and are not supported. If your component is a Server Component, extract the client-side parts into a Client Component and write stories for that instead.

This usually means a server-only module is being imported in the browser. Check the error stack trace to find the module and add a Storybook mock for it as described in Handling server-only dependencies.

The package exports these additional modules:

TanStack Router-compatible mock implementations used by the framework to provide router behavior in stories. Import from this module when you need direct access to the mock APIs (for example, to assert against navigation spies in tests).

TanStack Start-compatible mock implementations, including a mocked createServerFn() implementation. Import from this module when a story or test needs to interact directly with the Start mock layer.

You can pass an options object for additional configuration if needed:

The available options are:

Type: Record<string, any>

Configure options for the framework's builder. Available options can be found in the Vite builder docs.

This framework contributes the following parameters to Storybook under the tanstack.router namespace:

When route is supplied as a plain object, it may also include TanStack route options such as head, search, and params.parse.

Type: Record<string, unknown>

Router context values injected into the story router.

Type: ResolveParams<Path>

Interpolates route params into the current path. When route is a typed file route, the type is constrained to the param names declared in that route's path (for example, { id: string } for /$id).

Sets the initial URL path for the story router.

Type: Record<string, unknown>

Appends search params to the initial URL.

Type: AnyRoute | route options object

Supplies a route instance directly or creates a temporary story route from route options. Storybook extracts the route's React component automatically from the route.

Type: Partial<Record<string, RouteOverrideOptions>>

Per-route overrides keyed by route ID, applied to the story's route and root route. Use '__root__' to target the root route. Each entry can override loader, beforeLoad, validateSearch, loaderDeps, and context.

Type: ({ storyContext }) => RouterContext

Dynamically computes the router context from the story context. Use this when the router context depends on values that are already available in the story (for example, a QueryClient that is loaded by a story loader).

This is an alternative to context for cases where the router context needs a React context provider (e.g., TanStack Query's QueryClientProvider) that must be rendered in the story before the context value can be accessed.

**Examples:**

Example 1 (elixir):
```elixir
npm create storybook@latest
```

Example 2 (unknown):
```unknown
npm run storybook
```

Example 3 (unknown):
```unknown
npm run build-storybook
```

Example 4 (typescript):
```typescript
import type { Meta, StoryObj } from '@storybook/tanstack-react';
 
import { Route } from './Page';
 
const meta = {
  parameters: {
    layout: 'fullscreen',
    tanstack: {
      router: {
        route: Route, // 👈 Supply the Route here
        // 👇 Rest of these properties are type-safe
        params: { id: '42' },
        query: { tab: 'details' },
      },
    },
  },
} satisfies Meta<typeof Route>;
 
export default meta;
 
type Story = StoryObj<typeof meta>;
 
export const Default: Story = {};
 
export const WithCustomLoader: Story = {
  parameters: {
    tanstack: {
      router: {
        route: Route, // 👈 Supply the Route here
        // 👇 Rest of these properties are type-safe
        params: { id: '42' },
        routeOverrides: {
          '/items/$id': {
            loader: async () => ({
              item: { id: '42', name: 'Loaded inside Storybook' },
            }),
          },
        },
      },
    },
  },
};
```

---

## Conclusion | Storybook docs

**URL:** https://storybook.js.org/docs/get-started/conclusion

**Contents:**
- Conclusion

Congratulations! You learned the basics. Storybook is the most popular tool for UI component development and documentation. You’ll be able to transfer these skills to thousands of companies that use Storybook to build UIs including GitHub, Airbnb, and Stripe.

If you’d like to learn workflows for building app UIs with Storybook, check out our in-depth guides over at the tutorials page. Continue reading for detailed information on how to use Storybook APIs.

---
