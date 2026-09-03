import { TextColumns } from "styled-system/jsx"
import { css } from "styled-system/css"

export function TextColumnsDemo({ paragraphs }: { paragraphs: string[] }) {
  return (
    <TextColumns min="measure.narrow" gap="8" className={css({ textStyle: "body.md", color: "fg.default" })}>
      {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
    </TextColumns>
  )
}
