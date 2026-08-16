# Category colors and upload-order cards

## Goal

Keep the archive visually simple while making categories easier to distinguish and making card order stable. Cards must be ordered by the moment each Markdown note was first added to Git, not by later edits.

## Visual behavior

- Reuse the knowledge graph's existing category color function so a category has one color everywhere.
- Apply the color to category badges, category filter accents, and card hover borders. Keep card surfaces neutral in both light and dark modes.
- Assign unknown categories such as future `OS` folders a deterministic fallback color.
- Remove estimated reading time from note detail metadata while retaining the note date.

## Upload date and sorting

- Define upload time as the committer timestamp of the earliest Git commit that added the current Markdown file.
- Resolve this timestamp during the Quartz build from the repository history. GitHub Actions already checks out the full history with `fetch-depth: 0`.
- Sort cards by upload time descending. Use Korean title order only when timestamps are equal or unavailable.
- Display the upload date on each card.
- Editing a tracked note must not move it. Adding a new note must place it before older notes.
- If Git history is unavailable, fall back to the existing created date and then to the title. The build must still complete.

## Components and data flow

1. A focused Git date resolver receives a note path and returns its first-added timestamp.
2. `buildStudyNotesIndex` receives resolved upload dates, stores an `uploaded` date on each card model, and performs the stable sort.
3. `StudyNotes` displays `uploaded`, exposes a shared category color through a CSS custom property, and leaves card backgrounds neutral.
4. Content Meta is configured with reading time disabled.

The Git resolver is isolated from the pure catalog builder so sorting behavior can be tested without shelling out to Git.

## Verification

- Unit tests prove that upload time wins over modified time and that equal or missing upload times use title order.
- Component tests prove that cards display upload dates, carry category color variables, and contain no reading-time text.
- Configuration tests prove Content Meta has `showReadingTime: false`.
- Existing graph color tests continue to prove category color consistency.
- Run the focused tests, full test suite, type check, formatting check, and Quartz production build.
