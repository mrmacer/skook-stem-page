# Schuylkill Living Lab

## Release status: deferred

Living Lab is preserved in this repository but intentionally excluded from the current public release. The seven HTML pages, shared styles, browser code, deferred Vercel functions, Supabase migration/seed files, and this documentation remain in source control. The release builder keeps static files out of `dist/`; the three Living Lab functions live under `deferred/living-lab/api/` so Vercel cannot discover them as public `/api/*` routes. `.vercelignore` is an additional upload safeguard. No Supabase configuration or permissions are changed by this release state.

### Restore Living Lab to a future release

Restore it only after the data, moderation, privacy, and production-function review is complete:

1. In `scripts/build_public_site.py`, add all seven `living-lab*.html` filenames to `PUBLIC_ROOT_FILES`, remove `assets/js/living-lab` and `css/living-lab.css` from `DEFERRED_PATHS`, and keep the release verification enabled.
2. Move `deferred/living-lab/api/config.js`, `submit-investigation.js`, and `submit-observation.js` back into the root `api/` directory with the same filenames. Remove their deferred-source header comments if desired; no functional code needs to change.
3. In `.vercelignore`, remove the seven Living Lab HTML entries plus `css/living-lab.css` and `assets/js/living-lab/`. Keep `deferred/` ignored after the function files have been restored.
4. Restore the seven canonical URLs to `sitemap.xml`.
5. Add a reviewed public link from the appropriate current navigation, landing page, or resource page. The previous homepage promotion is preserved in `docs/archive/homepage-promotions-before-simplification.html`; do not copy its older navigation wholesale.
6. Configure the three existing Vercel environment variables described below. Apply and review the existing Supabase migration separately; do not use the sample seed in production.
7. Run `python3 scripts/build_public_site.py` and `python3 scripts/check_site.py dist`, confirm the seven pages now appear in `dist/`, then test `/api/config`, public reads, moderation, and both submission functions in a non-production deployment before release.

Until those steps are completed, the public routes should return the site's normal 404 response and must not be linked or listed in the sitemap.

A regional K–12 environmental science network prepared for STEM@Skook29: students across Schuylkill
County **Explore → Document → Investigate → Act** on the ecosystems around their schools. This
doc covers what was built, how to configure it, and what's still Phase 2.

## What was added

**Pages** (plain HTML/CSS/JS, matching the rest of the site — no framework, no build step):

| Page | Purpose |
| --- | --- |
| `living-lab.html` | Landing page: hero, live stats, the 4-part cycle, K–12 grade-band progression, links to everything below |
| `living-lab-explore.html` | Recommended observation tools (Merlin, Seek, eBird, iNaturalist) + planned future categories |
| `living-lab-submit.html` | Observation submission form |
| `living-lab-map.html` | Leaflet/OpenStreetMap regional map of schools & sites, with filters |
| `living-lab-dashboard.html` | Live regional stats + simple bar charts (no charting library) |
| `living-lab-investigations.html` | Browse + start student investigations, with an "Investigate This Too" link |
| `living-lab-teacher-toolkit.html` | Getting-started ladder, tool guides, STEELS practice connections |

**Preserved pre-deferral navigation**: a new "Living Lab" top-level dropdown (desktop + mobile) was inserted into
**all 24** existing HTML pages, between Teachers and Districts — see `js/main.js`'s existing
`.nav-dropdown` / `data-mobile-nav-group` handling, which needed zero changes since it's fully
class-based. `index.html`'s footer "Programs" column also got a Living Lab link.

**Preserved pre-deferral homepage integration**: a single, non-dominant promo band on `index.html` (between the
"Ecosystem Map Teaser" and the closing CTA banner) with live stats and a link to the full
Living Lab section.

**Shared styles**: `css/living-lab.css` — reuses every existing token/class it can
(`--purple-*`, `--orange-*`, `.container`, `.btn`, `.card`, `.section-header`, `.grid-*`,
`.stat-card`, `.tag`, the `.form-*` pattern from `contact.html`) and adds only what's new: the
cycle diagram, grade-band cards, participation ladder, status pills, lightweight bar charts, the
map shell, and the homepage promo band.

**Backend**: Supabase, added fresh (this project had none before). No `@supabase/supabase-js`
dependency — everything talks to PostgREST directly via `fetch()`, matching the site's existing
zero-build-step, zero-npm-dependency architecture (see `api/contact.js` for the precedent this
follows).

## Database

Run `supabase/migrations/0001_living_lab_schema.sql` in the Supabase SQL editor (or via the
Supabase CLI once/if you adopt it). It creates 5 tables and their RLS policies:

- `living_lab_schools`, `living_lab_sites` — reference data, publicly readable where `active = true`
- `living_lab_observations` — the core data. Publicly readable **only** where `status = 'approved'`
- `living_lab_investigations` — publicly readable immediately (no moderation queue; see below)
- `living_lab_investigation_schools` — junction table for future multi-school investigations (schema is ready; no UI uses it yet)

**No student PII is ever collected.** The schema only has room for School + Site + Grade Band +
Observation — there's no name/email/student-ID column anywhere.

**Security model**: the anon key (safe to expose, used by every page's JS) has **read-only**
access, restricted by RLS to already-approved/public rows. All writes go through
`api/submit-observation.js` and `api/submit-investigation.js`, which validate/sanitize input
server-side and use the service-role key (server-only, never sent to the browser) to insert.
The anon key has no insert/update/delete grant on any Living Lab table.

**Sample data**: `supabase/seed_sample_data.sql` adds ~4 fictional schools/sites and a handful of
fictional observations/investigations, useful for demoing the dashboard/map/investigations pages
before real data exists. Every row is labeled `SAMPLE DATA` in its notes/description field, and
the file's header comment includes the exact `DELETE` statements to remove it. **Do not run this
against production** unless you want that demo data live.

## Configuration

Add these to your Vercel project's environment variables (see `.env.example`):

```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

`api/config.js` serves the URL + anon key to the browser (both are safe to expose; they're
RLS-restricted). The service-role key is read only by the two `api/submit-*.js` functions and is
never returned by any endpoint.

Until these are set, every Living Lab page degrades honestly: stats show an em dash, charts/map
show a "couldn't load" message, and forms still render (they just won't be able to submit).
Nothing fakes success or shows placeholder numbers.

## Moderation

Every observation submission lands with `status = 'pending'` and is invisible to the public
dashboard/map until a moderator changes it to `'approved'`. **There's no admin UI yet** — for
now, moderate directly in the Supabase table editor:

```sql
update living_lab_observations set status = 'approved' where id = '...';
```

Investigations are **not** moderated (no `status='pending'` gate) — they're teacher-authored,
lower-risk content, visible the moment they're posted. Revisit this if spam becomes a problem.

## Local development / testing

This is a static site with Vercel Edge Functions (`api/*.js`), same as the rest of the repo:

```bash
# Full local testing including the /api/* functions:
vercel dev

# Or, for a quick static-only check (no /api/* -- Living Lab pages will
# show their honest "couldn't load" / em-dash states, which is expected):
python3 -m http.server 8934
```

## Known limitations / Phase 2

Per the build brief's own priority order, these were intentionally left for later:

- **No admin/moderation UI** — approving observations requires the Supabase table editor directly.
- **No multi-school investigation UI** — the `living_lab_investigation_schools` junction table
  exists, but nothing writes to it yet. "Investigate This Too" currently just pre-fills a new
  investigation's description with a reference to the original.
- **Data Lab** (filter/compare/graph/CSV export/AI-assisted analysis) — landing page has a
  teaser only, as the brief specified. No code beyond the teaser section exists yet.
- **No eBird/iNaturalist import/sync** — the schema has `source` and `external_record_id` columns
  ready for this, but no import job exists.
- **Detailed STEELS alignment resource** — Teacher Toolkit links out to the existing STEELS
  Resource Library and notes a dedicated Living Lab alignment doc is "coming soon."
- **Footer Living Lab link** was only added to `index.html` (the primary homepage integration
  point) and the pages generated fresh by this build — not mass-edited into the footer of the
  other 22 pre-existing pages, since nav (desktop dropdown + mobile) already covers full
  discoverability. Happy to mass-edit the footer too if you want it everywhere.
- **Canonical domain**: every new page uses `https://stem.mrmacer.com` in its
  `<link rel="canonical">` / OG tags, matching 100% of the existing pages. If the real production
  domain is `stem.mrmacer.com`, that's a pre-existing site-wide inconsistency, not something
  introduced here — worth a separate pass across all pages if/when you're ready.
