# STEM@Skook29 EdTech & AI Resource Library — Data Package

Canonical dataset for the public AI & EdTech Resource Library at STEM@Skook29 (Schuylkill Intermediate Unit 29).

## Purpose

A curated, evidence-aware, school-appropriate catalog of AI literacy, classroom integration, digital citizenship, policy, privacy, and educator tool resources — with honest disclosure of pricing, privacy, limitations, and confidence. It is not a listicle, and inclusion is not district approval.

## Folder structure

```
build_dataset.py      <- THE canonical source. Edit records here and only here.
README.md             <- this file
STATS.md              <- generated statistics report (do not hand-edit)
dist/
  aiEdtechResources.json   <- generated
  aiEdtechResources.csv    <- generated (evaluation flattened to eval_* columns)
  aiEdtechResources.js     <- generated (const aiEdtechResources = [...])
  featuredCollections.json <- generated
  featuredCollections.js   <- generated (const aiEdtechCollections = [...])
docs/
  EXECUTIVE_SUMMARY.md
  FILTER_SYSTEM.md
  IMPLEMENTATION_BRIEF.md
  INTEGRATION.md
```

## Regenerating and validating

```
python3 build_dataset.py
```

The script validates unique IDs, required fields, enum values, and collection references; regenerates every derived file; rebuilds STATS.md; and runs `node --check` on generated JS. It fails loudly (nonzero exit) on any invalid data. **Never hand-edit files in `dist/`** — they will be overwritten, and hand edits guarantee format drift.

## Field notes and definitions

Most fields match their names. The ones that need definitions:

**recordClass** — what kind of record this is (framework-guidance, curriculum, digcit-media, policy-governance, privacy-security, teacher-tool, student-environment, ct-ai-creation, accessibility-udl, integrity-assessment, professional-learning, research-report, prompt-literacy, tool-evaluation, family-community, iu29-original). Guidance documents intentionally carry `not-applicable` in tool-specific fields; do not "fill them in."

**Evaluation ratings** — Strong / Acceptable / Mixed / Concern / Not enough information / not-applicable. There is deliberately no overall star rating. `protectsStudentThinking` rates the risk that the tool substitutes for student cognition by default; "Mixed" on a good tool usually means the tool makes offloading easy and task design must compensate.

**recommendedUse** — Recommended for teacher use · Recommended with district review · Recommended for limited pilot · Student use requires district approval · Useful resource, not a classroom tool · Not recommended for public library inclusion.

**confidence** — high (facts verified or from highly stable authoritative sources), medium (established resource; some details need confirmation), low (avoid publishing without verification; none currently included).

**verificationMethod** — `live-check` (page opened and facts verified on `verifiedDate`) or `catalog-review` (included from curator knowledge of a stable, established resource; `verifiedDate` reads `pending-first-verification` and the record appears in the STATS.md re-verification queue). This distinction is the honesty backbone of the dataset: publish it, don't hide it.

**Vendor claims** — FERPA/COPPA/SOC 2 statements are recorded as *vendor-stated*, never as certifications this library confirms. When public documentation doesn't answer a question, the field says "Not clearly disclosed in the reviewed public documentation."

## Workflows

**Add a tool safely** — (1) open the vendor's pricing, privacy policy, and terms; (2) draft the record in `build_dataset.py` with `verificationMethod="live-check"` and today's date; (3) mark anything unverified as `unclear`; (4) run the build; (5) if the tool is student-facing, it cannot ship without age, consent-model, and training-data fields populated or explicitly marked unclear.

**Retire a tool** — don't delete the record immediately; set `recommendedUse` to "Not recommended for public library inclusion" with a curatorNote explaining why, remove it from collections, and delete after one quarterly cycle so the history is traceable.

**Quarterly review** — work the STATS.md re-verification queue first, then re-open every `live-check` record older than one quarter, prioritizing the "time-sensitive facts" list at the bottom of STATS.md. Pricing, free-tier limits, minimum ages, and training-data language are the four fields that rot fastest.

**Update pricing/privacy info** — edit the record in `build_dataset.py`, bump `verifiedDate`, regenerate. The verifiedDate is a per-record promise to visitors; keep it honest.

## Collections

Collections reference resource IDs only (`resourceIds`), never duplicate record data. The build fails if a collection references a nonexistent ID, which is exactly the point.

## Standing warnings

- Tool terms, pricing, and free tiers change frequently and without notice; every public page rendering this data must carry a disclaimer that external services control their own terms.
- Inclusion in this library is not IU29 approval, endorsement, or evidence of classroom testing.
- AI detector output must never be presented as reliable proof of misconduct anywhere this data is used.

## Public-site integration

The browser must never load files directly from this documentation directory. After every successful build, copy the generated browser outputs:

```sh
cp dist/aiEdtechResources.js ../../js/ai-edtech-library/aiEdtechResources.js
cp dist/featuredCollections.js ../../js/ai-edtech-library/featuredCollections.js
node --check ../../js/ai-edtech-library/aiEdtechResources.js
node --check ../../js/ai-edtech-library/featuredCollections.js
```

The public page loads those two generated files before `js/ai-edtech-library/ai-edtech-resource-library.js`. Generated files carry a warning header and must never be hand-edited.

At the July 24, 2026 generation:

- 14 records were live-verified.
- 63 records were catalog-review records queued for first live verification.

The public page exposes that distinction directly. It labels live checks as “Live verified,” catalog reviews as “Curated — live verification pending,” and states that inclusion is not IU29 or district approval.
