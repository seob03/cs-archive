const MERMAID_FENCE = /^ {0,3}(`{3,}|~{3,})[\t ]*mermaid(?:[\t ].*)?$/i
const FLOWCHART_DEFINITION = /^\s*(?:flowchart|graph)\s+(?:TB|TD|BT|RL|LR)\b/i
const MERMAID_INIT_DIRECTIVE = /^\s*%%\{\s*init\s*:/i
const FLOWCHART_INIT = '%%{init: {"flowchart": {"wrappingWidth": 300}}}%%'

function isClosingFence(line: string, fence: { character: "`" | "~"; length: number }) {
  const escapedCharacter = fence.character === "`" ? "`" : "~"
  return new RegExp(`^\\s*${escapedCharacter}{${fence.length},}\\s*$`).test(line)
}

/**
 * Mermaid renders a literal "\\n" as text. Obsidian exports often use that
 * sequence for labels, so turn it into Mermaid's supported HTML line break
 * while leaving ordinary Markdown and other code fences untouched.
 */
export function normalizeMermaidEscapedLineBreaks(markdown: string): string {
  let fence: { character: "`" | "~"; length: number } | null = null
  let awaitingDefinition = false
  let hasExplicitInit = false

  return markdown
    .split(/\r?\n/)
    .flatMap((line) => {
      if (!fence) {
        const opening = line.match(MERMAID_FENCE)
        if (opening) {
          fence = {
            character: opening[1][0] as "`" | "~",
            length: opening[1].length,
          }
          awaitingDefinition = true
          hasExplicitInit = false
        }
        return line
      }

      if (isClosingFence(line, fence)) {
        fence = null
        awaitingDefinition = false
        hasExplicitInit = false
        return line
      }

      const normalizedLine = line.replace(/\\n/g, "<br/>")
      const trimmedLine = normalizedLine.trim()
      if (awaitingDefinition && MERMAID_INIT_DIRECTIVE.test(normalizedLine)) {
        hasExplicitInit = true
      }
      if (awaitingDefinition && trimmedLine !== "" && !trimmedLine.startsWith("%%")) {
        awaitingDefinition = false
        if (FLOWCHART_DEFINITION.test(normalizedLine) && !hasExplicitInit) {
          return [FLOWCHART_INIT, normalizedLine]
        }
      }

      return normalizedLine
    })
    .join("\n")
}
