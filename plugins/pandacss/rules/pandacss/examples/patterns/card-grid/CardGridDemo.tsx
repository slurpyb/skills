import { CardGrid, Box } from "styled-system/jsx"

// JSX: <CardGrid min="20rem"> — `min` is the typed prop the pattern declared.
// No @media; the grid auto-fits to the container.
export function CardGridDemo({ items }: { items: { id: string; title: string }[] }) {
  return (
    <CardGrid min="20rem">
      {items.map(it => (
        <Box key={it.id} layerStyle="surface.raised" padding="4">{it.title}</Box>
      ))}
    </CardGrid>
  )
}
