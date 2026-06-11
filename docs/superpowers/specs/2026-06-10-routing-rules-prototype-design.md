# Routing Rules Prototype Design

## Goal

Create a high-fidelity desktop prototype of the supplied Settings > Routing rules screen. The prototype is intended for product design reviews, interaction demonstrations, and future extension with additional product pages.

## Scope

- Reproduce the screenshot's desktop layout, visual hierarchy, colors, English copy, spacing, and component states.
- Target a desktop canvas with a minimum width of approximately 1100px.
- Support lightweight interactions for navigation selection, rule toggles, and the Load based radio options.
- Keep drag handles visual only.
- Reset all controls to the screenshot defaults after a refresh.
- Do not add persistence, backend APIs, authentication, responsive mobile layouts, or production application behavior.

## Technical Approach

Use a dependency-free static project:

- `index.html` contains the Routing rules page markup.
- `styles.css` contains design tokens, layout rules, and reusable component styles.
- `app.js` initializes navigation, toggle, and radio interactions.
- `assets/` is reserved for shared images or icons needed by future pages.

Icons should use inline SVG or reusable CSS-friendly SVG assets so the page works offline without external services, fonts, or package installation.

## Page Architecture

The page has three persistent regions:

1. `global-sidebar`: narrow product-level icon navigation.
2. `settings-sidebar`: Settings navigation with expandable Automation children and Routing rules selected.
3. `page-content`: page-specific content for Routing rules.

This separation lets future pages reuse both navigation regions while replacing only the main content area.

## Main Content

The Routing rules content includes:

- Page heading with routing icon and the title "Routing rules".
- Active tab labeled "Intra-group routing rules".
- Informational note matching the supplied English copy.
- Four routing rule cards:
  - Last agent
  - Language Based
  - Skill based
  - Load based

Each card includes a visual drag handle, title, routing prompt, description or radio choices, and an enabled toggle.

## Visual System

Define reusable CSS custom properties for:

- Brand purple and selected-state lavender.
- Primary, secondary, and muted text.
- Page, sidebar, card, and note backgrounds.
- Borders, shadows, radii, spacing, and control dimensions.

Use a system sans-serif font stack. The prototype should prioritize visual similarity at the reference viewport while remaining usable on larger desktop widths.

## Interactions

- Clicking an enabled switch toggles its active state.
- Clicking either Load based option updates the radio selection.
- Clicking supported navigation items updates the selected visual state without navigating away.
- Controls expose keyboard focus styles and use semantic buttons or inputs where practical.
- No interaction is persisted across refreshes.

## Extensibility

Reusable classes should cover:

- Global navigation buttons
- Settings navigation rows and nested items
- Page headers and tabs
- Information notes
- Rule cards
- Toggle switches
- Radio controls

New prototype pages can be introduced as separate HTML files that reuse `styles.css`, shared assets, and the two sidebars. A framework or client-side router should only be introduced later if page count or shared behavior makes static duplication difficult to maintain.

## Verification

- Open `index.html` directly without a server or network connection.
- Compare the page at approximately 1143 x 695 with the supplied reference.
- Verify all four switches respond to pointer and keyboard input.
- Verify the Load based radio choices are mutually exclusive.
- Verify selected navigation styles update correctly.
- Confirm no browser console errors occur.

