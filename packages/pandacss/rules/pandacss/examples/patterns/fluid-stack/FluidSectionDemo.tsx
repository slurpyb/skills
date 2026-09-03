import { FluidSection } from "styled-system/jsx"

export function FluidSectionDemo({ children }: { children: React.ReactNode }) {
  return (
    <FluidSection min="4" max="8" bg="bg.surface">
      {children}
    </FluidSection>
  )
}
