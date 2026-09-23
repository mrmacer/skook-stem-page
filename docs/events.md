# Shared event data

The canonical event source is [`js/events-data.js`](../js/events-data.js). It is loaded by the home page, `/connect`, `community.html`, and `events.html` through [`js/events-renderer.js`](../js/events-renderer.js). The existing event facts and descriptions were retained, but the visible event cards now render from this source rather than being maintained separately in each HTML page.

## Add or edit an event

Add one object to `window.STEM_EVENTS` with:

- `id`: unique stable identifier
- `title`, `description`, `category`, and `categoryGroup`
- `startDate` and optional `endDate` in ISO format; use a date-only value when no event time is confirmed
- `dateStatus: "confirmed" | "tbd"`; omit `startDate` when the date is still TBD
- `startTime` and optional `endTime` for a single time block
- `sessionBlocks` when one event has separate schedule blocks; do not collapse them into one continuous time
- `allDay: true` for all-day events
- `timeStatus: "tbd"` when the date is confirmed but the time is not
- `location` and optional `locationShort`
- `locationStatus: "tentative"` and `locationNote` when the source calendar is not definitive
- `audiences` for the small audience line on cards
- `opportunities: ["judges"]` when judges are explicitly requested
- `registrationUrl` and/or `detailsUrl` only when a real destination exists
- `ecosystemRelevant: true` when it belongs in partner-facing modules
- `status: "scheduled"`, or another status when it should not appear as upcoming

Use `datePrecision: "month"` with a `YYYY-MM` `startDate` only for retained legacy events whose verified content gives only a month. Do not guess a day. Month-precision events are sorted by month and remain visible during their listed month. TBD events remain on the full Events page but never enter chronological upcoming modules.

## Feature, filter, or remove

`ecosystemRelevant` controls the partner-oriented `/connect` and Community modules. The `featured` flag is intentionally not needed by the renderer: the first upcoming event is presented as the next event. To cancel or remove an event, change `status` from `scheduled` or delete the object after confirming it is no longer needed. Past exact-date events are automatically excluded from upcoming modules.

The events page renders the complete source, while the home page shows three upcoming events, Community shows three ecosystem-relevant events, and `/connect` shows the next ecosystem-relevant event followed by the next several ecosystem events. Links and JSON-LD are generated from the same objects.
