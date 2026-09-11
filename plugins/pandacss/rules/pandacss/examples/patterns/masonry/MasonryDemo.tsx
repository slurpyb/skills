import { Masonry, Box } from "styled-system/jsx"

export function MasonryDemo({ items }: { items: { id: string; body: string }[] }) {
  return (
    <Masonry min="18rem" gap="4">
      {items.map(it => (
        <Box key={it.id} layerStyle="surface.raised" padding="4">{it.body}</Box>
      ))}
    </Masonry>
  )
}
