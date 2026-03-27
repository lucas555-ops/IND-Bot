# 20_PUBLIC_DIRECTORY_BASELINE_V1

## What STEP007 adds

STEP007 is the first public browse layer for the project. It does not try to solve discovery fully. It only makes listed profiles visible in a simple browse surface.

## Inclusion rule

A profile can appear in the public directory only when both conditions are true:

- `visibility_status = listed`
- `profile_state = active`

This keeps browse truth aligned with the readiness rules introduced in earlier steps.

## Surface map

### Home
- adds `🌐 Browse directory` when persistence is enabled

### Directory list
- shows listed count
- shows first page of browse-ready profiles
- keeps paging narrow
- shows explicit empty state when no profiles are listed

### Directory card
- opens one listed profile
- keeps `Back to directory` tied to the originating page
- does not add contact actions yet

## What STEP007 intentionally does not do

- no search box
- no filters
- no ranking logic beyond recent update order
- no premium gates
- no intro request flow
- no LinkedIn outbound actions

## Why this is the correct narrow step

The project needed a real browse surface before adding search, filters, premium, or messaging. STEP007 provides that minimum truthful baseline.
