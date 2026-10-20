# Public-site simplification preservation inventory

Updated: 2026-10-20

This inventory records what was de-emphasized without deleting the underlying work. “Direct-link-only” means the URL still works but is not promoted in the five-item primary navigation. It does **not** mean the page is private or access-controlled.

| Existing page, feature, or section | URL or source | Where visitors find it now | Visibility | Restore prior prominence |
|---|---|---|---|---|
| Student programs entrance | `students.html` | Primary navigation: **Student Programs** | Prominent | Keep the route in the primary navigation |
| Educator and district support entrance | `teachers.html` | Primary navigation: **Educator Support** | Prominent | Keep the route in the primary navigation |
| Resource entrance | `classroom-resources.html` | Primary navigation: **Resources** | Prominent | Keep the route in the primary navigation |
| Shared events calendar | `events.html`, `js/events-data.js` | Primary navigation and homepage “Coming up next” | Prominent | Keep the route in the primary navigation |
| Contact and partnership journey | `connect.html`, `/api/contact` | Primary navigation: **Connect** | Prominent | Keep the route in the primary navigation |
| Detailed contact form | `contact.html` | Footer and contextual link from Connect | Contextual | Point the primary Connect link to `contact.html` |
| Full programs overview and galleries | `programs.html` and fragment links | Student Programs and every footer’s Programs list | Contextual | Add `programs.html` to the primary navigation or homepage |
| Chief Science Officers ecosystem | `student-leadership.html`, `how-action-plans-work.html`, `leadership-training-institute.html`, `cso-advisor-center.html`, `cso-administrator-center.html` | Student Programs → Chief Science Officers; contextual links inside the CSO pages | Contextual | Add the student-leadership route to the primary navigation |
| WSCAM archive and filters | `wscam.html` | Student Programs and footer | Contextual | Add WSCAM to Student Programs promotion or primary navigation |
| Detailed district page | `districts.html` | Educator Support administrator section and footer | Contextual | Add Districts to the primary navigation |
| STEELS support and resource catalog | `steels-support.html`, `steels-resource-library.html` | Educator Support and Resources | Contextual | Add either route to the primary navigation |
| AI/EdTech support and catalog | `edtech-ai.html`, `ai-edtech-resource-library.html` | Educator Support and Resources | Contextual | Add either route to the primary navigation |
| Phenomenon Sessions | `phenomenon-sessions.html` | Educator Support specialist links | Contextual | Add the route to the primary navigation |
| STEELS Lesson Hook Generator | `lesson-hook-generator.html`; compatibility anchor at `teachers.html#lesson-hook-generator` | Optional tools section near the end of Educator Support | Contextual / direct | Add the standalone route to homepage or primary navigation |
| EdTech Concierge | `edtech-ai.html#edtech-concierge` | Optional tools section near the end of Educator Support | Contextual / direct | Add its fragment link to homepage or primary navigation |
| Community Hub and ecosystem map | `community.html`, `community.html#ecosystem-map` | Connect’s secondary “Community Hub” link | Contextual | Point the primary Connect link to `community.html` or add a homepage card |
| Schuylkill Living Lab pages, assets, backend, and documentation | `living-lab.html`, `living-lab-*.html`, `css/living-lab.css`, `assets/js/living-lab/`, `deferred/living-lab/api/`, `supabase/`, and `docs/living-lab/` | Preserved in source; excluded from the current `dist/` release, Vercel function discovery, and sitemap | Deferred / source-only | Follow the exact restoration checklist in `docs/living-lab/README.md` |
| Homepage thematic bar, audience chooser, duplicated program grid, tool promotion, ecosystem promotion, Living Lab promotion, statistics, and older closing CTA | `docs/archive/homepage-promotions-before-simplification.html` | Underlying pages and tools remain at the URLs above | Archived presentation; content preserved elsewhere | Restore selected section markup from the archive or from Git, then add current links/data |
| Previous Students page journey | `docs/archive/students-journey-before-simplification.html` | Concrete program routes on the simplified Students page | Archived presentation | Restore selected section markup from the archive or Git |
| Previous Teachers page journey and embedded generator | `docs/archive/teachers-journey-before-simplification.html` | Focused support routes plus the standalone generator | Archived presentation | Restore selected section markup from the archive or Git |
| Previous Connect audience-routing journey | `docs/archive/connect-journey-before-simplification.html` | Three concrete partnership choices and the preserved contact form | Archived presentation | Restore selected section markup from the archive or Git |
| Anonymous testimonial blocks | `docs/archive/*-anonymous-testimonial.html` | Not shown publicly pending source confirmation | Archived | Restore only after confirming permission, attribution, and exact wording |
| Unverified statistics, WSCAM totals, CSO funding-period wording, AI approval labels, and classroom-resource access claims | `docs/archive/unverified-claims-before-simplification.md` | Not shown publicly pending owner-held evidence | Archived verbatim | Complete the checks in `docs/owner-review.md` before restoring any claim |
| Empty CSO template cards | `docs/archive/cso-advisor-placeholder-templates.html` | Operational checklist remains public; current forms are requested from IU29 | Archived | Restore cards only when real downloadable files and owners are confirmed |
| Expired September 23 listening-session promotion | `docs/archive/community-listening-session-promotion.html` | `events.html#past-events` and a compact past-event note on Community | Archived / contextual | Restore only as an explicitly historical item, never as active registration |

The source archives are intentionally not linked as a public “everything we hid” directory. Git history remains a second safeguard; the pre-simplification baseline is commit `05994cb`.

`scripts/build_public_site.py` creates the Vercel `dist/` artifact from an explicit public allowlist and fails if internal folders, Living Lab files, links, or sitemap entries leak into it. `.vercelignore` separately excludes `docs/`, `artifacts/`, local `.claude/` settings, `supabase/`, and deferred Living Lab source from upload. The archives and owner notes should remain committed for preservation while staying outside the published website bundle.
