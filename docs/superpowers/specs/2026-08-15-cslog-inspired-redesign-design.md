# CSLOG-Inspired Study Notes Redesign

## Goal

Rebuild the Quartz site as a simple, polished knowledge archive inspired by the visual system of `cslog.rtaeho.com`. The result should feel spacious and deliberate without copying the reference site's branding or adding decorative features that do not help reading.

## Design Principles

- Content is the product. Navigation and metadata stay quiet.
- Empty layout columns are never reserved.
- Thin borders, generous spacing, restrained indigo accents, and small monospace metadata provide the visual identity.
- Home is optimized for discovery; note pages are optimized for sustained reading.
- The content folder structure is the source of truth for categories and cards.
- Old layout overrides and components that no longer serve this design may be removed instead of preserved.

## Global Frame and Header

- Use a sticky 64px header with a subtle bottom border.
- Use `seob.log()` as the compact wordmark.
- Place Quartz search and the theme toggle on the right.
- Remove the always-visible Explorer, Reader Mode control, and Graph panel from the visual layout.
- Use a centered frame with a maximum width of 1280px and responsive horizontal padding.
- Use Inter for reading text and JetBrains Mono for metadata, categories, and code.

## Home Page

### Hero

- Show a small green publication indicator with the generated note count.
- Use a concise Korean headline about keeping learned CS knowledge.
- Use restrained indigo emphasis in the headline.
- Show only real static-build facts: note count and generated category count.
- Do not display fake view counts, monthly activity, sync age, or an activity sidebar.

### Categories

- Generate category chips from the first folder below `content/`.
- `content/BACKEND/...` creates the `BACKEND` category automatically.
- Future folders such as `DATABASE`, `ALGORITHM`, or `FRONTEND` appear without code changes.
- `ALL` is always first and each chip includes its generated note count.
- Deeper folders remain visible as a compact path on cards, for example `BACKEND / SPRING`.

### Cards

- Generate one card for each publishable Markdown note.
- Exclude root and folder `index.md` files from the card collection.
- Sort by modified date when available, with a stable title fallback.
- The newest card spans two columns on desktop; all other cards use the standard width.
- Each card contains a primary category badge, modified date when available, title, two-line excerpt, and folder path.
- Remove sequence numbers and decorative outbound arrows.
- Use a subtle border-color/background transition instead of pronounced shadows or floating motion.
- Grid behavior: three columns on wide desktop, two on tablet, one on mobile.
- Home never reserves a right sidebar column.

## Note Page

- Use a centered content frame up to 1280px.
- Use a main reading column up to approximately 760px.
- Add a 220-240px sticky table of contents only when the note has headings.
- If no table of contents is rendered, the main content recenters and no empty right column remains.
- Use a restrained 36px desktop title and a smaller mobile title.
- Present breadcrumbs/category, date metadata, and tags as compact quiet UI.
- Long titles wrap naturally; they do not expand into overlays on hover.
- Remove the local graph panel from the note layout.

## Reading Styles

- Body text uses approximately 16px size and 1.75 line height.
- Headings use compact spacing, strong hierarchy, and no oversized decorative treatment.
- Tables use thin borders and a very light header background.
- Inline code uses a pale neutral background with indigo text.
- Obsidian highlights use a clean marker-like underline without a heavy gray box.
- Links use indigo with a modest underline treatment.

## Code Blocks

- Use a near-black code surface in both light and dark modes.
- Preserve Shiki syntax token colors with sufficient contrast.
- Show a compact language label and existing copy control when Quartz emits it.
- Use rounded 8px corners, a thin dark border, and no heavy shadow.
- Comments remain readable in light mode against the dark code surface.

## Search and Dark Mode

- Style the Quartz search trigger as a compact header field on desktop and a smaller control on mobile.
- Keep search results simple and card-like with title and a short excerpt.
- Dark mode preserves the same spacing and hierarchy rather than introducing a separate visual system.

## Component and Data Changes

- Replace the hard-coded `BACKEND / SPRING` note selector with a general content-derived note collection.
- Derive category definitions and counts from the same collection used to render cards.
- Keep the transformation logic pure so it can be tested independently from JSX.
- Replace the current home component markup with hero, category bar, and responsive cards.
- Retain the existing Quartz layout injection only if it remains the smallest reliable integration point.
- Rewrite `custom.scss` around the new design tokens and remove superseded selectors.
- Disable unused layout plugins in `quartz.config.yaml` instead of hiding their output with CSS when practical.

## Responsive Behavior

- At desktop widths, cards use three columns and note pages use content plus TOC.
- At tablet widths, cards use two columns and the TOC is hidden so the reading column remains centered.
- At mobile widths, cards use one column, header controls compress, and all content uses full available width.
- No breakpoint creates a blank Explorer or right-sidebar column.

## Testing and Verification

- Add failing tests first for dynamic category extraction, counts, folder-index exclusion, and deterministic sorting.
- Add component tests for generated category chips and card metadata.
- Run the full TypeScript test suite and Quartz production build.
- Verify generated HTML contains all expected notes and no home graph or empty right layout reservation.
- Inspect light and dark modes at wide desktop, tablet, and mobile widths.
- Inspect at least one long-title card, one long-title note, one table, one highlighted phrase, and one syntax-highlighted code block.

## Out of Scope

- View counters, analytics-driven popularity sorting, monthly activity charts, bookmarks, comments, and sync-age indicators.
- Copying the reference site's logo, copy, or proprietary application behavior.
- Rewriting imported note content solely for visual consistency.
