# Study Notes Clean Layout Design

## Status

Approved direction, pending implementation.

## Goal

Turn the Quartz site into a calm, readable knowledge archive. The primary job of the site is to help the owner read, scan, and revisit study notes; visual decoration must stay secondary to legibility and retrieval.

## User requirements

- The home route must immediately show the study notes instead of a separate hero or knowledge-map page.
- All existing Spring notes should appear as cards.
- Each card should show a title and one or two lines of body preview.
- Search should be simple and should present results in the same visual language as the cards.
- The left folder-style explorer should not occupy the main screen.
- Categories should be presented as a centered navigation/filter near the content, inspired by the supplied `cslog` reference.
- The current note title should be smaller and long titles should truncate with an ellipsis; hovering should reveal the full title.
- The main reading column should use the available width more effectively.
- The right rail should show the page's related graph above a compact table of contents.
- Code blocks must remain readable in light mode, including comments and other muted syntax tokens.
- The knowledge-map section and other large decorative home sections should be removed.

## Design principles

1. **Reading first.** Use generous line height, a restrained measure, and clear hierarchy rather than large promotional typography.
2. **Quiet surfaces.** Use a warm near-white paper background, thin borders, and minimal shadows. Indigo is reserved for links, active states, and small controls.
3. **One visual system.** Home cards, category filters, and search results should share the same spacing, border, radius, and hover behavior.
4. **Automatic content.** The home card grid must be generated from Quartz page data so newly added notes appear without manually editing `content/index.md`.
5. **Progressive disclosure.** Long titles and secondary navigation stay compact until the reader asks for more through hover, focus, or interaction.

## Proposed page structure

### Global shell

- Remove the left folder explorer from the default desktop reading experience.
- Keep a restrained site identity and utility controls in a top area rather than replacing the explorer with another large sidebar.
- Place the category navigation in the central content area, directly above the cards.
- Keep the right rail only for contextual tools on note pages.

### Home

The home page should have this order:

1. Small site label and one-line description.
2. Centered category navigation: `ALL NOTES`, `BACKEND`, and `SPRING` (with room to derive future top-level categories automatically).
3. A responsive grid of all Spring note cards.

Each card contains:

- a small category/path label;
- a title, clamped to one line with an ellipsis;
- a short excerpt derived from the note description or opening text;
- a subtle arrow/affordance that becomes visible on hover/focus.

The cards should be two columns at normal desktop widths, collapse to one column on narrow screens, and avoid heavy shadows or oversized decorations.

Category controls should filter the current card grid without forcing the user into a folder-explorer page. `ALL NOTES` is the default state.

### Note pages

- Reduce the article title scale to a compact reading-oriented range.
- Clamp long titles visually and reveal the full title on hover/focus without changing the document content.
- Widen the center column while keeping the actual text measure comfortable for long reading.
- Use the right rail as a contextual companion: related local graph first, compact table of contents second.
- Keep graph depth limited to immediate relationships so it communicates context without becoming a second knowledge-map page.
- Hide or de-emphasize empty contextual blocks rather than reserving large blank regions.

### Search

- Keep the search control easy to find in the top utility area after the explorer is removed.
- Style search results as the same title/excerpt cards used on the home page.
- Keep result metadata minimal; prioritize title, excerpt, and destination.

### Code blocks

- Keep a dark code surface in both themes for consistent visual grouping.
- Explicitly override low-contrast Shiki light-theme token colors when rendered on the dark surface.
- Raise the contrast of comments and other gray tokens in light mode while preserving syntax distinctions.
- Keep the language label small and unobtrusive.

## Implementation approach

Create a local Quartz component for the home card grid. It will receive `allFiles`, select note pages under the current `BACKEND/SPRING` area, derive stable titles and excerpts, and render the category controls and cards. The component will render only for the home route; the note source file will remain lightweight.

Use Quartz's existing graph, table-of-contents, and search components where possible. The work should primarily configure their placement and add scoped styling rather than fork their behavior. If the search package does not expose the exact card markup, its result container will receive matching CSS so the user-facing result still belongs to the same visual system.

The left explorer will be removed from the main layout, and the search control will be moved or exposed in the top utility area so removing the explorer does not remove search access.

## Responsive behavior

- Desktop: centered content with a wide reading column and a compact right rail for graph + TOC.
- Tablet: reduce side padding and let the right rail move below the article when needed.
- Mobile: one-column cards; centered category controls may wrap; graph and TOC remain collapsible/stacked and must not force horizontal scrolling.

## Acceptance criteria

- Opening `/cs-note/` immediately shows the note card grid; no knowledge-map hero is visible.
- All existing Spring notes are represented by cards with readable title and excerpt text.
- A newly added Spring note appears after the normal Quartz build without editing the home page manually.
- The left folder explorer is absent from the primary desktop view, while search remains accessible.
- Category controls are centered and can narrow the visible cards to the selected category.
- Note titles are visibly smaller, long titles truncate, and hover/focus reveals the full title.
- The article body uses more horizontal space without creating an uncomfortable line length.
- Note pages show the local graph above the TOC in the right rail.
- Light-mode code blocks have readable comments and syntax tokens; no important code appears as faint gray text.
- Home cards and search results feel like the same component family.
- `npm run check`, a production build, and a local smoke check for the home page and at least one note page pass.

## Non-goals for this pass

- Reorganizing the note contents or rewriting note text.
- Building a full global knowledge graph on the home page.
- Adding detailed nested category taxonomies beyond the requested top-level navigation.
- Replacing Quartz's search engine with a new search backend.
