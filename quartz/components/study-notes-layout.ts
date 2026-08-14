import { FullPageLayout } from "../cfg"
import { QuartzComponent } from "./types"

export type QuartzLayoutParts = {
  defaults: Partial<FullPageLayout>
  byPageType: Record<string, Partial<FullPageLayout>>
}

export function augmentStudyNotesLayout(
  layout: QuartzLayoutParts,
  component: QuartzComponent,
): QuartzLayoutParts {
  const contentLayout = layout.byPageType.content ?? {}

  return {
    ...layout,
    defaults: {
      ...layout.defaults,
      beforeBody: [...(layout.defaults.beforeBody ?? []), component],
    },
    byPageType: {
      ...layout.byPageType,
      content: {
        ...contentLayout,
        beforeBody: [...(contentLayout.beforeBody ?? []), component],
      },
    },
  }
}
