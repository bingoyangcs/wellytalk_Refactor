# Agents Management Prototype Design

## Goal

Add a high-fidelity `Settings > Team > Agents` prototype to the existing Wellytalk static application. The page is intended for product reviews, interaction testing, and future extension with more Settings pages.

## Scope

- Add dedicated Agent and Group list views based on the supplied screenshots.
- Support search, pagination, create, edit, and delete interactions.
- Keep all data in browser memory and restore the bundled demonstration data after refresh.
- Reuse the current global navigation, Settings navigation, colors, typography, spacing, and offline static architecture.
- Target desktop layouts. Mobile layouts, backend APIs, authentication, persistence, invitations, and production validation are out of scope.

## Technical Approach

Keep the project dependency-free and add an isolated Agents feature module:

- `app.js` continues to own menu configuration and top-level page selection.
- `agents.js` owns demonstration data, state transitions, Agents page rendering, and page-specific event handling.
- `index.html` loads the Agents module and provides the shared page mount point.
- `styles.css` adds reusable table, badge, modal, form, pagination, tooltip, and confirmation styles.

The `agents` menu leaf receives an explicit `agents` view type. The existing page renderer mounts the Agents module only when that leaf is selected. Other pages and Routing rules behavior remain unchanged.

## Page Structure

The page header contains the Agents title and two tabs:

- `Agent`
- `Group`

Each tab preserves its own search query and current page while the user switches between them. Both tables use a compact desktop layout with a search field, primary action button, row actions, and bottom pagination.

## Agent View

The Agent table contains:

- Account
- Name and avatar
- Role
- Group
- Availability status
- Account status
- Edit and delete actions

The `+ Add agent` button opens an empty Agent form. Editing opens the same form populated with the selected row.

The Agent modal has three tabs:

1. `Account info`: avatar, full name, email, native language, nationality, and phone number.
2. `Role settings`: CS Agent and CS Manager role checkboxes with explanatory text.
3. `Work settings`: chat limit and assigned-group chips.

Saving validates required name and email fields, updates the in-memory list, closes the modal, and keeps the user on the current Agent page. New agents receive a generated local identifier and default account state.

## Group View

The Group table contains:

- Group name
- Number of members
- Member chips
- Edit and delete actions

Long member lists collapse to the available row width and can be expanded or collapsed. Hovering or focusing a member chip displays a compact profile card.

The `+ Create group` button and edit action share one modal. The modal contains:

- Required group name with character count
- Member search
- Checkbox list with Select all
- Selected-member panel with removable chips
- Cancel and Save/Create group actions

Saving immediately updates the group list and the group assignments shown in Agent work settings.

## Search And Pagination

- Search is case-insensitive.
- Agent search matches account, full name, and email.
- Group search matches group name.
- Changing a search query returns that tab to page 1.
- Pagination operates on the filtered results.
- Page-size controls are visual and functional, using local options suitable for the demonstration dataset.
- Empty searches show a clear no-results state without changing the underlying data.

## Delete And Confirmation

Deleting an Agent or Group opens a reusable confirmation dialog naming the selected record. Cancel leaves data unchanged. Confirm removes the record from memory.

Deleting an Agent also removes that member from every Group. Deleting a Group removes that assignment from every Agent. Pagination is corrected if deleting the last item on the current page would leave the user beyond the final page.

## State And Data Flow

The Agents module owns one state object containing:

- Agent records
- Group records
- Active tab
- Per-tab search, page, and page-size values
- Open modal type, mode, selected record, and form draft
- Open confirmation dialog
- Expanded Group rows

Events update state through small pure helper functions where practical, then rerender the Agents mount point. Modal drafts are separate from saved records so Cancel never mutates table data.

## Error Handling And Accessibility

- Required fields show inline errors and prevent Save.
- Destructive actions require explicit confirmation.
- Buttons and form controls use semantic HTML and visible keyboard focus states.
- Tabs expose selected state; dialogs expose labels and modal semantics.
- Escape closes the topmost modal or confirmation dialog without saving.
- Clicking the overlay closes non-destructive forms only when no unsaved change would be lost; otherwise Cancel or the close button is used.

## Testing

Add focused Node tests for:

- Resolving the Agents view type.
- Agent and Group search behavior.
- Create and update operations.
- Cascading cleanup after Agent or Group deletion.
- Pagination correction after filtering or deletion.
- Form validation helpers.

Browser verification covers:

- Navigation to `Settings > Team > Agents`.
- Agent/Group tab switching.
- Search and pagination.
- Add/edit/save/cancel flows for both record types.
- Modal tab switching and member selection.
- Delete confirmation and resulting table updates.
- Visual comparison at the supplied desktop viewport.
- No console errors during the tested flows.

