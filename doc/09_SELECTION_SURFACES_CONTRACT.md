# 09_SELECTION_SURFACES_CONTRACT

## Purpose

This contract defines how picker/filter/toggle screens behave in this project.

## Surface types

### Multi-select
Use when multiple values can be selected.
Examples here:
- skills selection
- future multi-filter scopes

Visual contract:
- selected -> `☑️` or `✅`
- not selected -> `⬜️` or `▫️`

Rules:
- tapping an option changes visible state on the same screen
- if apply is deferred, use a separate lower action block
- do not mix options and actions inside one grid

### Single-choice
Use when only one value can be active.
Examples here:
- industry bucket
- future sort surfaces

Visual contract:
- active -> `🔘`
- inactive -> `⚪️`

Rules:
- do not use checkbox semantics for single-choice
- if clear/reset exists, keep it in the lower action block

### Toggle
Use for one binary state.
Examples here:
- listed / hidden
- future notifications on/off

Rules:
- toggle is not a checkbox grid
- toggle is not a single-choice picker pretending to be one

## Actions and navigation

Action rows are for:
- Save
- Apply
- Clear
- Reset
- Back
- Menu
- Home
- Confirm
- Delete
- Open

Actions must not visually pretend to be options.
Navigation must not visually pretend to be a selected value.

## Layout rules

- short neighboring options can go 2 per row
- long, risky, primary, or destructive actions should be separate rows
- `Save / Clear / Back / Menu / Home` belong in the lower action block

## Project-specific application

Apply this contract to:
- skills surface
- directory filter surfaces
- future sort surfaces
- any persistent profile selector

Do not drag it into:
- normal menu hubs
- destructive confirms
- yes/no actions
- receipt/status screens
