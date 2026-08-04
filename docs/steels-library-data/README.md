# STEELS Resource Library — Canonical Dataset

**STEM@Skook29 · Schuylkill Intermediate Unit 29**

`build_dataset.py` is the maintenance source and generator for the STEELS Resource Library. Generated outputs must remain synchronized; never hand-edit one generated output without regenerating the others.

## Files

```
data/
  steelsResources.json     # 49 curated resources (canonical)
  steelsResources.js       # same data as `const steelsResources` for direct <script> use
  steelsResources.csv      # same data, spreadsheet-ready
  featuredCollections.json # 17 curated collections referencing resource IDs (no duplicated data)
build_dataset.py           # the generator — edit resources HERE, then re-run
STATS.md                   # dataset statistics, metadata gaps, verification queue
```

The public website does not load files from `docs/`. Browsers read these deployment copies:

```text
js/steels-library/steelsResources.js
js/steels-library/featuredCollections.js
```

Collection definitions contain resource IDs only. They never duplicate resource records.

## Schema notes

- `access`: `Free | Registration | Workshop | Paid` — always disclosed honestly; see `notes` for tier details (e.g., NSTA freemium, PLT workshop-or-purchase).
- `paSpecific`: `true` = Pennsylvania-anchored (17 resources).
- `confidence`: `High` = URL verified directly (41); `Medium` = organization verified, exact program URL queued for re-verification (8). See STATS.md verification queue.
- `disciplinaryCoreIdeas` / `sciencePractices` / `crosscuttingConcepts`: tagged where confidently mappable; deliberately empty for portal/PD records rather than falsely tagged. The V2 standards-metadata pass completes these plus specific STEELS codes.
- `relatedResources`: resource IDs only — all references validated at build time.
- STEELS alignment is **inferred from NGSS** unless a record's notes state the publisher claims STEELS explicitly (SAS Hub assets, DCNR Watershed Education, Stroud, Da Vinci).

## Maintenance

1. Edit resource records and collection definitions in `build_dataset.py`.
2. From `docs/steels-library-data/`, run `python3 build_dataset.py`. The generator validates unique IDs, reference integrity, and enum values, then regenerates JSON, JavaScript, CSV, collection, and statistics outputs.
3. Confirm the script reports 49 resources and 17 collections with no validation errors.
4. The generator copies the new resource data into `js/steels-library/steelsResources.js` and creates `js/steels-library/featuredCollections.js` from the collection definitions. If working from a detached maintenance package, copy those two generated browser files into the same paths in the site repository.
5. Run `python3 scripts/check_site.py` from the project root and exercise the library filters locally.

During quarterly reviews, update URLs, `reviewDate`, `confidence`, and `notes`; regenerate `STATS.md`; and resolve the verification queue. The NOAA module-restoration check is next scheduled for October 2026.

## Curatorial decisions of record

- **Maker Ed excluded** — organization wound down ~2022; static archives conflict with the library's "we checked these" promise.
- **NOAA Data in the Classroom retained but flagged** — partial post-migration outage noted in-record.
- **Workshop-gated resources kept as a distinct access class** — they double as IU29 PD registration leads.
- **Paid resources included only where unusually valuable** (Mystery Science, PLT, Da Vinci, Hawk Mountain programs) and clearly labeled.
