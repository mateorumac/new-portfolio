# Mobile Nav Drawer Redesign

## Problem

The mobile nav drawer (`src/components/Navbar.jsx`, `src/styles/Navbar.css`) is a
full-width, full-height panel with a plain divider-line list of links and a
footer (DevTools pill + lang/theme circles) stacked at the bottom. It feels
outdated: the divider-line list reads like an old-school settings menu, and
the footer buttons feel like an afterthought disconnected from the rest of
the drawer, with a large empty gap between the two.

## Design

**Panel**
- Width: ~85% of viewport, capped at `max-width: 400px`, full height (unchanged).
- Slides in from the right as today; backdrop remains visible on the
  uncovered strip.

**Structure — two zones**
1. **Nav zone** — About, Career, Projects, Contact, Resume, and DevTools,
   vertically centered in the space below the drawer header.
2. **Footer zone** — lang flag + theme toggle circles only, pinned to the
   bottom of the drawer with a divider separating it from the nav zone.

DevTools moves out of the footer and becomes the 6th item in the nav zone's
list, keeping its full-width pill/gradient look — still visually prominent
since it links to a separate project — but now living in the main content
flow instead of being grouped with settings controls.

**Nav link style**
- Remove the `border-bottom` divider lines between links.
- Increase font size from `1.12rem` → `1.4rem`.
- Increase vertical gap between items from `1.45rem` → `1.9rem`.
- Links remain left-aligned, plain text, no icons (per chosen direction).

**Footer**
- Lang + theme circular buttons only, unchanged in size/style, pinned to
  drawer bottom with a top divider and consistent padding.

## Out of scope

- Desktop navbar styling (already addressed in prior work).
- Nav link icons (explicitly rejected in favor of the plain bigger-text list).
- Grouping DevTools visually with lang/theme (explicitly rejected — DevTools
  must read as distinct/prominent).
