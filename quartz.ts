import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { PageTypeDispatcher } from "./quartz/plugins/pageTypes/dispatcher"
import StudyNotes from "./quartz/components/StudyNotes"
import ArchiveSearch from "./quartz/components/ArchiveSearch"
import RelatedGraph from "./quartz/components/RelatedGraph"
import { augmentStudyNotesLayout } from "./quartz/components/study-notes-layout"
import { normalizeMermaidEscapedLineBreaks } from "./quartz/mermaid"
import type { QuartzTransformerPluginInstance } from "./quartz/plugins/types"

const config = await loadQuartzConfig()
const mermaidLineBreaks: QuartzTransformerPluginInstance = {
  name: "MermaidEscapedLineBreaks",
  textTransform: (_ctx, source) => normalizeMermaidEscapedLineBreaks(source),
}

config.plugins.transformers.unshift(mermaidLineBreaks)

const baseLayout = await loadQuartzLayout()
const layout = augmentStudyNotesLayout(baseLayout, StudyNotes, ArchiveSearch, RelatedGraph)

const dispatcher = PageTypeDispatcher({
  defaults: layout.defaults,
  byPageType: layout.byPageType,
})
const dispatcherIndex = config.plugins.emitters.findIndex(
  (emitter) => emitter.name === "PageTypeDispatcher",
)

if (dispatcherIndex === -1) {
  config.plugins.emitters.push(dispatcher)
} else {
  config.plugins.emitters.splice(dispatcherIndex, 1, dispatcher)
}

export default config
export { layout }
