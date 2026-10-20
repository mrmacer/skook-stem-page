# Owner confirmation queue

Updated: 2026-10-20

The following claims or dates need an owner-held source before they should regain prominent public placement.

## Launch blockers

These items affect the core public release and should be confirmed before launch:

1. **Contact-form delivery:** perform one production smoke test after deployment and confirm the message reaches the intended IU29 recipient. Do not submit student information during the test.

## Deferred Living Lab work

Living Lab is excluded from the current public artifact and sitemap. Its backend is not a core-site launch blocker. Before restoring it, confirm `/api/config`, public read behavior, submission workflows, moderation, and storage/privacy settings by following `docs/living-lab/README.md`.

## Safe to leave omitted pending confirmation

These items do not block launch because the simplified site no longer depends on the claims:

- **Impact totals:** “5,000+ students,” “200+ educators,” and “50+ partners” were removed from prominent displays because no reporting period or supporting source is visible in the project. Confirm the measurement definition, reporting period, and source before reuse.
- **Chief Science Officers funding:** “funded for three more years” was replaced with “active, not a pilot” plus a contact route. Confirm the exact grant/funding start and end dates and source before publishing a fixed period.
- **Anonymous testimonials:** teacher quotations were removed from public pages and retained in `docs/archive/`. Confirm the speaker, consent, approved attribution, and exact wording before restoring them.
- **WSCAM totals:** the displayed archive now spans 2017–2026, so the old “2017–2023,” “60+ videos,” “19 partners,” and “more than a dozen schools” summary was removed. Confirm whether totals should be computed from the in-page archive data and how records with missing video URLs should count.
- **Classroom-material access:** prominent claims that all materials are teacher-tested, free, fully standards-tagged, or available through a login were softened. Confirm the current delivery method, eligibility, review process, and access terms.
- **AI tool readiness:** “Classroom Ready” labels were changed to “District Review Required” so the support page does not conflict with the catalog’s inclusion-is-not-approval language.

## Event dates to confirm before launch

The shared source in `js/events-data.js` currently marks the following dates confirmed and eligible for upcoming display as of October 20, 2026:

- AI 101 — October 20–21, 2026 (location is still TBD)
- Schuylkill STEM Ecosystem Collab — October 28, 2026 at Jacoby
- STEELS Admin WestEd Training — November 18, 2026 (location is still TBD)
- AI Collab — November 18, 2026 at the Makerspace
- Keystone Student Competition — November 20, 2026 (location is still TBD)
- Invention Convention — December 7, 2026 (time and location are still TBD)
- PETE&C — February 7–12, 2027
- STEM Design Challenge — March 17, 2027 at Jacoby
- Sea Air Land Challenge — April 7, 2027, with the location marked tentative

The Media and Design Competition and WSCAM have month-only 2027 dates. The site preserves that month precision and does not invent a day. Events marked `dateStatus: "tbd"` are retained in the data but are not promoted as upcoming.

Existing registration URLs are retained in the records with `registrationStatus: "unverified"`. The public renderer does not show a Register button unless an owner changes that status to `confirmed-open`. In particular, AI 101 is not presented as open for registration merely because its confirmed date includes the current day.

## Items intentionally preserved without public promotion

- Schuylkill Living Lab pages and backend remain in source but are excluded from the current public artifact and sitemap pending a separate review.
- The Lesson Hook Generator and EdTech Concierge remain public demonstrations. They do not require student data and should not be presented as protected or private merely because they are outside primary navigation.
