const MERMAID_FENCE = /^ {0,3}(`{3,}|~{3,})[\t ]*mermaid(?:[\t ].*)?$/i

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

  return markdown
    .split(/\r?\n/)
    .map((line) => {
      if (!fence) {
        const opening = line.match(MERMAID_FENCE)
        if (opening) {
          fence = {
            character: opening[1][0] as "`" | "~",
            length: opening[1].length,
          }
        }
        return line
      }

      if (isClosingFence(line, fence)) {
        fence = null
        return line
      }

      return line.replace(/\\n/g, "<br/>")
    })
    .join("\n")
}
