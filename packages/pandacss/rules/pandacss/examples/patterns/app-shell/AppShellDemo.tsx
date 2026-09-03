import { AppShell } from "styled-system/jsx"
import { Box } from "styled-system/jsx"

// JSX side: AppShell is a real component with typed props (sidebar/aside) PLUS all
// style props. Children place themselves with `gridArea` style props — no extra
// area utilities. The same pattern is also callable as `appShell({ sidebar })` for
// a className, but the JSX form reads best for layout scaffolding.
export function AppShellDemo() {
  return (
    <AppShell sidebar="14rem" aside="18rem">
      <Box gridArea="header" bg="bg.surface" borderBlockEndWidth="1px" borderColor="border.subtle" padding="4">
        Header
      </Box>
      <Box gridArea="nav" bg="bg.muted" padding="4">Navigation</Box>
      <Box gridArea="main" padding="6">Main content</Box>
      <Box gridArea="aside" bg="bg.muted" padding="4">Aside</Box>
      <Box gridArea="footer" bg="fg.default" color="bg.surface" padding="4">Footer</Box>
    </AppShell>
  )
}

// collapses to 2 columns — no markup change, just omit aside:
// <AppShell sidebar="14rem"> … (no aside Box) … </AppShell>
