import {
  Grid, Flex, Stack, Wrap, Box, Container, Center, Bleed, AspectRatio, Divider, Cq, VisuallyHidden,
} from "styled-system/jsx"
import { css } from "styled-system/css"

// What Panda ships — no custom code. Each replaces a chunk of the Tailwind SKILL,
// using OUR rules: logical props, tokens, intrinsic sizing. All JSX components.

// Auto-fit grid — `minChildWidth` IS the repeat(auto-fit, minmax()) the SKILL hand-wrote.
export const AutoGrid = ({ items }: { items: string[] }) => (
  <Grid minChildWidth="16rem" gap="6">
    {items.map(i => <Box key={i} layerStyle="surface.raised" padding="4">{i}</Box>)}
  </Grid>
)

// Cluster — wrapping row with token gap (the `flex justify-*` examples).
export const TagRow = ({ tags }: { tags: string[] }) => (
  <Wrap gap="2" align="center">
    {tags.map(t => <Box key={t} bg="bg.muted" paddingInline="2" paddingBlock="1" rounded="full">{t}</Box>)}
  </Wrap>
)

// Negative-margin bleed — full-bleed image inside a padded container, done right.
export const FullBleedFigure = () => (
  <Container>
    <p className={css({ textStyle: "body.md" })}>Padded prose…</p>
    <Bleed inline="8">
      <AspectRatio ratio={21 / 9}>
        <img src="/hero.jpg" alt="" className={css({ inlineSize: "full", objectFit: "cover" })} />
      </AspectRatio>
    </Bleed>
    <p className={css({ textStyle: "body.md" })}>…more padded prose.</p>
  </Container>
)

// Dividers between siblings — Stack + Divider, not divide-y utilities.
export const ItemList = ({ items }: { items: string[] }) => (
  <Stack gap="0">
    {items.map((it, i) => (
      <Box key={it}>
        {i > 0 && <Divider color="border.subtle" marginBlock="3" />}
        {it}
      </Box>
    ))}
  </Stack>
)

// Container query — child reflows on the CARD's width, not the viewport.
export const ProfileCard = () => (
  <Cq name="card">
    <Flex direction="column" gap="3" className={css({ "@container card (min-width: 28rem)": { flexDirection: "row" } })}>
      <Box boxSize="16" rounded="full" bg="bg.muted" />
      <Stack gap="0">
        <span className={css({ textStyle: "heading.h3" })}>Jordan</span>
        <span className={css({ textStyle: "body.sm", color: "fg.muted" })}>Design systems</span>
      </Stack>
    </Flex>
  </Cq>
)

// Centering + visually-hidden heading (the `.clipped` BONES pattern).
export const Hero = () => (
  <Center minBlockSize="20rem">
    <VisuallyHidden><h2>Hero</h2></VisuallyHidden>
    <span className={css({ textStyle: "heading.h2" })}>Welcome</span>
  </Center>
)
