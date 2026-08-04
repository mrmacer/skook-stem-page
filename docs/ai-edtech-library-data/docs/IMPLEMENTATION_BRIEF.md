# Developer Handoff — ai-edtech-resource-library.html

## Scope

Single static page inside the existing STEM@Skook29 site. **No external frameworks.** Vanilla HTML/CSS/JS. Data loads from the canonical generated files only — never an inline duplicated dataset.

## Data contract

```html
<script src="data/aiEdtechResources.js"></script>
<script src="data/featuredCollections.js"></script>
```

Exposes `aiEdtechResources` (array of 77 record objects) and `aiEdtechCollections` (15 collections referencing record IDs). Deploy `dist/` contents to `data/`. If the site later prefers fetch(), the identical `.json` files exist; pick one mechanism and delete the other from the deploy to avoid drift.

## Page structure (top to bottom)

1. **Native STEM@Skook29 header/nav/footer** — reuse existing site components verbatim.
2. **Breadcrumb** — Home › EdTech & AI Support › Resource Library.
3. **Hero** — title, one-paragraph philosophy statement (AI literacy first, no vendor hype), and the two disclaimers (see below) linked/summarized.
4. **Dynamic statistics strip** — computed at render time from the array (total records, free resources, PA-specific, teacher-only), never hardcoded.
5. **Start Here collections** — render 4-6 collections flagged for launch as horizontal card rows; each collection card links to a filtered view (`?collection=col-id`).
6. **Search + filters** — per FILTER_SYSTEM.md. Reflect state in URL query params so filtered views are shareable.
7. **Result count** — "Showing N of 77 resources," live-updating.
8. **Resource cards** — title, organization, description, chips: recommended-use status, teacher-only/student-facing indicator, district-review label (amber) when applicable, access/pricing label, privacy-transparency label (from evaluation.privacyTransparency), age info when present, PA keystone icon, last-verified date or "verification pending."
9. **Expanded details** — accessible disclosure widget (`<details>` or button+aria-expanded) revealing the advanced fields and full evaluation grid; renders `relatedResources` as links to sibling cards.
10. **Per-card actions** — "Visit resource" (external, `rel="noopener"`), "Report a broken link" (mailto or form, pre-filled with record ID), and page-level "Suggest a resource" CTA.

## Required disclaimers (verbatim intent, wordsmith freely)

- External services control their own terms; pricing, privacy, and features change without notice — always confirm on the provider's site.
- Inclusion in this library is not IU29 or district approval; student-facing tools require local district review and agreements.

## Non-negotiables

- **Accessibility:** semantic landmarks, full keyboard operability, visible focus, WCAG AA contrast, aria-live on the result count, no information conveyed by color alone (district-review chips carry text).
- **Mobile:** cards single-column below 768px; filters collapse into a disclosure; tap targets ≥44px.
- **Performance:** 77 records need no pagination; render all, filter in memory. Debounce keyword input.
- **Honesty rendering:** `verificationMethod: "catalog-review"` must visibly render as "verification pending," and `"Not clearly disclosed…"` strings must display as written — do not "clean them up."
- **IU29-original placeholders** (recordClass `iu29-original`) render with a distinct "Coming from STEM@Skook29" style and no external link.

## Do not build until asked

This brief is the handoff; the page itself is a separate task.
