import { FullPageLayout } from "../cfg"
import { QuartzComponent } from "./types"

export type QuartzLayoutParts = {
  defaults: Partial<FullPageLayout>
  byPageType: Record<string, Partial<FullPageLayout>>
}

export function augmentStudyNotesLayout(
  layout: QuartzLayoutParts,
  component: QuartzComponent,
  searchComponent?: QuartzComponent,
  relatedGraph?: QuartzComponent,
): QuartzLayoutParts {
  const contentLayout = layout.byPageType.content ?? {}
  const appendSearch = (header: QuartzComponent[] | undefined) =>
    searchComponent ? [...(header ?? []), searchComponent] : header

  return {
    ...layout,
    defaults: {
      ...layout.defaults,
      header: appendSearch(layout.defaults.header),
      beforeBody: [...(layout.defaults.beforeBody ?? []), component],
    },
    byPageType: {
      ...layout.byPageType,
      content: {
        ...contentLayout,
        header: appendSearch(contentLayout.header),
        beforeBody: [...(contentLayout.beforeBody ?? []), component],
        right: relatedGraph ? [relatedGraph, ...(contentLayout.right ?? [])] : contentLayout.right,
      },
    },
  }
}
