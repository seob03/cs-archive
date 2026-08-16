# Borderless Code Copy Button Design

## Goal

Make the code-block copy control feel lighter and cleaner without reducing discoverability.

## Design

- Keep the copy icon permanently visible at its current size and position.
- Remove the button border in every state.
- Use a transparent background in the resting state so the control blends into the code header.
- On hover or keyboard focus, show only a subtle dark background and the existing purple-to-white icon response.
- Preserve the current click behavior and copied-state icon.

## Verification

- Add a style regression assertion that rejects borders and requires a transparent resting background.
- Run the focused archive style test, the complete test suite, type checking, formatting, and a Quartz production build.
