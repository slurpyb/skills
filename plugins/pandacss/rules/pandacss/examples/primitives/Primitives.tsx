import { Stack, Box, Flex, styled } from "styled-system/jsx"

// Layout at the call site = BUILT-IN patterns (Stack/Flex/Box/Grid/Container/Wrap).
// Never hand-roll these with styled("div", {flex...}) — they already ship.
// styled.x carries one-off identity/typography inline via style props.
//
// Compose-don't-conflate: arrangement is the pattern (outside), appearance is the
// styled element (inside). Patterns never carry component state.

export function ProfileHeader({ name, role }: { name: string; role: string }) {
  return (
    <Flex gap="3" align="center">
      <Box boxSize="12" rounded="full" bg="bg.muted" />
      <Stack gap="0">
        <styled.h2 textStyle="heading.h3" color="fg.default">{name}</styled.h2>
        <styled.p textStyle="body.sm" color="fg.muted">{role}</styled.p>
      </Stack>
    </Flex>
  )
}

// Polymorphic primitive — `styled(el, recipe?)` accepts `as` with full typing.
// One Heading, any level, no ElementType plumbing.
const heading = styled("h2", {
  base: { fontWeight: "semibold", color: "fg.default" },
  variants: {
    level: { h1: { textStyle: "heading.h2" }, h2: { textStyle: "heading.h2" }, h3: { textStyle: "heading.h3" } },
  },
  defaultVariants: { level: "h2" },
})
export const Heading = heading

// usage:
// <Heading as="h1" level="h1">Page title</Heading>
// <Heading as="h3" level="h3">Section</Heading>
