# Integration with Existing STEM@Skook29 Features

## Page-level connections

- **EdTech & AI Support page** — becomes the narrative front door; the library is its searchable back half. Replace any static tool lists on the support page with links into filtered library views (e.g., `?collection=col-monday-morning`) so there is exactly one source of truth.
- **Professional Learning events** — every PD offering links to a companion collection ("attendees of the Gemini session, here's your stack"); conversely, PD-relevant records (pd-*) can link to upcoming IU29 sessions.
- **Classroom Resources** — Monday Morning and AI Literacy Lessons collections cross-link here.
- **District Support** — Policy Starter Pack, Privacy, and Administrator Toolkit collections become the district-support AI section; the district-only artifacts (AUP template, procurement bank) live behind the existing district-support access pattern.
- **Privacy and Accessibility pages** — link to the priv-* and acc-* filtered views; the AEM procurement-language record belongs on the accessibility page directly.
- **Homepage AI demonstration cards** — rotate `featured: true` records; the featured flag exists in the data for exactly this.
- **Future Living IEP Lab** — the accessibility/SPED collection (PaTTAN, CIDDL, CAST, AEM) is the citation layer for Living IEP presentations, and Living IEP tools should eventually appear as iu29-original records once public.

## EdTech Concierge on vetted data (no web search)

The Concierge should answer from this dataset **only**:

1. Load `aiEdtechResources.json` as its entire tool-knowledge base (77 records fit trivially in a single model context — no vector store needed at this scale).
2. System-prompt constraints: recommend only records present in the data; always surface recommendedUse status, privacy summary, and last-verified date; if no record fits, say so and offer the suggest-a-resource path — never invent or web-search a tool.
3. Procurement-grade questions (DPAs, student PII, contracts) escalate to a human with the relevant record IDs attached.
4. Because answers cite record IDs, every Concierge recommendation is auditable against the library.

## Future AI tools retrieve only vetted records

Establish the pattern now: any school-facing IU29 AI feature (STEELS Lesson Hook Generator included) takes the generated JSON as its retrieval corpus and is prohibited from open-web tool recommendations. The build script's validation gate means anything the AI can recommend has passed curation — the dataset is the allowlist. When the catalog grows past comfortable context size, add a retrieval step over the same JSON; the contract (vetted records in, record IDs out) stays identical.

## Update loop

Quarterly re-verification (STATS.md queue) → edit build_dataset.py → regenerate → redeploy `dist/`. The Concierge and any AI tools pick up changes automatically because they read the same generated files. One canonical source, everywhere.
