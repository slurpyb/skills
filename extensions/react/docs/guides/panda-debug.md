---
title: "panda debug"
---

Panda's built-in debug command helps you see which files are processed, what styles are generated, and your final
config.

By default it will scan and output debug files for the entire project depending on your `include` and `exclude` options
from your config file.

<Tabs items={['pnpm', 'npm', 'yarn', 'bun']}>
  {/* <!-- prettier-ignore-start --> */}
  <Tab>
    ```bash
    pnpm panda debug
    # You can also debug a specific file or folder
    # using the optional glob argument
    pnpm panda debug src/components/Button.tsx
    pnpm panda debug "./src/components/**"
    ```
  </Tab>
  <Tab>
    ```bash
    npx panda debug
    # # You can also debug a specific file or folder
    # using the optional glob argument
    npx panda debug src/components/Button.tsx
    npx panda debug "./src/components/**"
    ```
  </Tab>
  <Tab>
    ```bash
    yarn panda debug
    # # You can also debug a specific file or folder
    # using the optional glob argument
    yarn panda debug src/components/Button.tsx
    yarn panda debug "./src/components/**"
    ```
  </Tab>
  <Tab>
    ```bash
    bun panda debug
    # # You can also debug a specific file or folder
    # using the optional glob argument
    bun panda debug src/components/Button.tsx
    bun panda debug "./src/components/**"
    ```
  </Tab>
  {/* <!-- prettier-ignore-end --> */}
</Tabs>

This would generate a `debug` folder in your `config.outdir` folder with the following structure:

<FileTree>
  <FileTree.Folder name="styled-system" defaultOpen>
    <FileTree.Folder name="debug" defaultOpen>
      <FileTree.File name="config.json" />
      <FileTree.File name="src__components__Button.ast.json" />
      <FileTree.File name="src__components__Button.css" />
    </FileTree.Folder>
  </FileTree.Folder>
</FileTree>

The `config.json` file will contain the resolved config result, meaning the output after merging config presets in your
own specific options.

It can be useful to check if your config contains everything you expect for your app to be working, such as tokens or
recipes.

`*.ast.json` files will look like:

```json
[
  {
    "name": "css",
    "type": "object",
    "data": [
      {
        "transitionProperty": "all",
        "opacity": "0.5",
        "border": "1px solid",
        "borderColor": "black",
        "color": "gray.600",
        "_hover": {
          "color": "gray.900"
        },
        "rounded": "md",
        "p": "1.5",
        "_dark": {
          "borderColor": "rgba(255, 255, 255, 0.1)",
          "color": "gray.400",
          "_hover": {
            "color": "gray.50"
          }
        }
      }
    ],
    "kind": "CallExpression",
    "line": 13,
    "column": 9
  }
]
```

And the `.css` file associated would just contain the styles generated from the extraction process on that file only.