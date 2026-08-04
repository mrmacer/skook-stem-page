# Website Filter System — V1 Recommendation

Principle: a teacher should reach a useful shortlist in two clicks. Everything else is progressive disclosure.

## Visible V1 filters (5 + search)

1. **Keyword search** — matches title, organization, description, categories.
2. **I am a…** (audience, collapsed to 6 visitor-facing roles: Teacher · Special Education · Administrator · Technology Director · School Board · Family) — map the dataset's 15 audience values to these 6 in the UI layer; keep the full taxonomy in data.
3. **Grade band** — K-2 · 3-5 · 6-8 · 9-12 · Educator/Adult · District Level.
4. **Category** (the 24-value taxonomy, shown as a grouped dropdown, not 24 checkboxes).
5. **Student-facing vs. teacher-only** — derived: studentAccounts == "yes" vs "no"; this is the single most-asked practical question and deserves top billing.
6. **Free only** toggle — access in {free} (freemium shown with a "free tier" chip, not hidden).

## Card-level labels (not filters, always visible)

- Recommended-use status chip (color-coded; "District review" in amber)
- Access/pricing chip · PA keystone icon for paSpecific · Last-verified date (or "verification pending" for catalog-review records — show it honestly)

## Advanced details (expandable per card)

Privacy summary, training-data summary, DPA availability, minimum age/consent, integrations, evidence summary, known limitations, risk notes, full evaluation grid, curator note, related resources.

## Future V2 filters

Record class · DPA available · Privacy transparency rating · Integration (Google/Microsoft/LMS) · Accessibility support · Last-verified recency · Confidence level.

## Administrator-only review view

A gated (or simply separate, unlinked) table view exposing: confidence, verificationMethod, re-verification queue, dpaAvailable, trainingDataSummary, riskNotes, and the excluded-resources list. This is the quarterly-review working surface; the public doesn't need it, reviewers do.

## Explicitly not in V1

No 30-filter wall, no star ratings, no "sort by popularity," no vendor logos above the fold.
