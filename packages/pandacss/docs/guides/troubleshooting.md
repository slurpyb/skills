---
title: "Troubleshooting"
---

- When using `tsup` or any other build tool for your component library, if you run into a module resolution error that
  looks similar to `ERROR: Could not resolve "../styled-system/xxx"`. Consider setting the `outExtension`in the panda
  config to`js`

- If you use Yarn PnP, you might need to set the `nodeLinker: node-modules` in the `.yarnrc.yml` file.