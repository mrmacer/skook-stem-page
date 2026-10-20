/* AI & EdTech Resource Library application — browser UI only; generated datasets load first. */
(function () {
  "use strict";

  const AUDIENCES = [
    "Classroom Teacher",
    "Instructional Coach",
    "Curriculum Director",
    "Building Administrator",
    "District Administrator",
    "Technology Director",
    "Special Education Teacher",
    "Student",
    "Family / Caregiver"
  ];

  const GRADES = [
    "K-2",
    "3-5",
    "6-8",
    "9-12",
    "K-12 Adaptable",
    "Educator / Adult",
    "District / System Level"
  ];

  const PRIORITY_CATEGORIES = [
    "AI Literacy Foundations",
    "Classroom Integration",
    "Teacher Planning and Productivity",
    "Digital Citizenship",
    "Media Literacy and Deepfakes",
    "Privacy and Student Data",
    "District Policy and Governance",
    "Academic Integrity",
    "Assessment Redesign",
    "Accessibility",
    "Differentiation and UDL",
    "Computational Thinking",
    "Coding and Building AI",
    "Professional Learning",
    "Research and Evidence",
    "Pennsylvania-Specific Resources"
  ];

  const RECORD_CLASS_LABELS = {
    "framework-guidance": "Framework and Guidance",
    curriculum: "Curriculum",
    "teacher-tool": "Teacher Tool",
    "student-environment": "Student Learning Environment",
    "digcit-media": "Digital Citizenship and Media Literacy",
    "privacy-security": "Privacy and Security",
    "policy-governance": "Policy and Governance",
    "accessibility-udl": "Accessibility and UDL",
    "professional-learning": "Professional Learning",
    "research-report": "Research Report",
    "tool-evaluation": "Tool Evaluation",
    "integrity-assessment": "Academic Integrity and Assessment",
    "ct-ai-creation": "Computational Thinking and AI Creation",
    "family-community": "Family and Community",
    "iu29-original": "IU29 Original / Planned Resource",
    "prompt-literacy": "Prompt Literacy"
  };

  const ACCESS_LABELS = {
    free: "Free",
    freemium: "Freemium",
    paid: "Paid",
    registration: "Registration",
    workshop: "Workshop",
    planned: "Planned"
  };

  const USE_LABELS = {
    "Recommended for teacher use": "Teacher use",
    "Recommended with district review": "District review required",
    "Recommended for limited pilot": "Limited pilot",
    "Student use requires district approval": "Student use requires district approval",
    "Useful resource, not a classroom tool": "Informational resource"
  };

  const USE_DISPLAY = {
    "Recommended for teacher use": "Appropriate for teacher investigation/use under local policy",
    "Recommended with district review": "District review recommended",
    "Recommended for limited pilot": "Limited pilot recommended",
    "Student use requires district approval": "Student use requires district approval",
    "Useful resource, not a classroom tool": "Guidance / research resource"
  };

  const VERIFICATION_LABELS = {
    "live-check": "Live verified",
    "catalog-review": "Curated — live verification pending"
  };

  const CONFIDENCE_LABELS = {
    high: "High confidence",
    medium: "Medium confidence",
    low: "Low confidence / review required"
  };

  const EVALUATION_LABELS = {
    instructionalValue: "Instructional value",
    easeOfUse: "Ease of use",
    teacherControl: "Teacher control",
    studentSafety: "Student safety",
    privacyTransparency: "Privacy transparency",
    accessibility: "Accessibility",
    costClarity: "Cost clarity",
    ageAppropriateness: "Age appropriateness",
    evidenceQuality: "Evidence quality",
    districtReadiness: "District readiness",
    integrationSupport: "Integration support",
    protectsStudentThinking: "Protects student thinking"
  };

  const DISTRICT_REVIEW_STATUSES = new Set([
    "Recommended with district review",
    "Recommended for limited pilot",
    "Student use requires district approval"
  ]);

  const state = {
    query: "",
    collection: null,
    audience: new Set(),
    grade: new Set(),
    category: new Set(),
    recordClass: new Set(),
    access: new Set(),
    recommendedUse: new Set(),
    verification: new Set(),
    studentFacing: false,
    paOnly: false
  };

  let publicResources = [];
  let searchTimer = null;
  const byId = (id) => document.getElementById(id);
  const asArray = (value) => Array.isArray(value) ? value : [];
  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function escapeHtml(value) {
    const node = document.createElement("span");
    node.textContent = String(value ?? "");
    return node.innerHTML;
  }

  function formatDate(value) {
    if (!value || value === "pending-first-verification") return "Pending first live verification";
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime())
      ? String(value)
      : new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date);
  }

  function isStudentFacing(resource) {
    return resource.studentAccounts === "yes";
  }

  function isOriginal(resource) {
    return resource.recordClass === "iu29-original";
  }

  function isPlanned(resource) {
    return isOriginal(resource) && resource.access === "planned";
  }

  function isMeaningful(value) {
    if (value === null || value === undefined || value === "" || value === false) return false;
    if (Array.isArray(value)) return value.length > 0;
    return value !== "not-applicable";
  }

  function readableValue(value) {
    if (value === "unclear") return "Not clearly disclosed in the reviewed public documentation.";
    if (value === "not-applicable") return "Not applicable for this resource.";
    if (value === true || value === "yes") return "Yes";
    if (value === false || value === "no") return "No";
    return String(value);
  }

  function validateData() {
    const errors = [];
    if (typeof aiEdtechResources === "undefined" || !Array.isArray(aiEdtechResources)) {
      errors.push("aiEdtechResources is not an array");
    }
    if (typeof aiEdtechCollections === "undefined" || !Array.isArray(aiEdtechCollections)) {
      errors.push("aiEdtechCollections is not an array");
    }
    if (errors.length) return errors;

    const resourceIds = new Set();
    aiEdtechResources.forEach((resource, index) => {
      if (!resource || !resource.id) errors.push(`Resource ${index} has no id`);
      if (resourceIds.has(resource.id)) errors.push(`Duplicate resource id: ${resource.id}`);
      resourceIds.add(resource.id);
      ["title", "organization", "description", "recordClass", "recommendedUse"].forEach((field) => {
        if (!resource[field]) errors.push(`Resource ${resource.id || index} has no ${field}`);
      });
      if (typeof resource.url !== "string") errors.push(`Resource ${resource.id || index} URL is not a string`);
      if (resource.evaluation !== undefined && (typeof resource.evaluation !== "object" || Array.isArray(resource.evaluation))) {
        errors.push(`Resource ${resource.id || index} evaluation is invalid`);
      }
    });

    const collectionIds = new Set();
    aiEdtechCollections.forEach((collection, index) => {
      if (!collection || !collection.id) errors.push(`Collection ${index} has no id`);
      if (collectionIds.has(collection.id)) errors.push(`Duplicate collection id: ${collection.id}`);
      collectionIds.add(collection.id);
      asArray(collection.resourceIds).forEach((id) => {
        if (!resourceIds.has(id)) errors.push(`Collection ${collection.id} references missing resource: ${id}`);
      });
    });

    aiEdtechResources.forEach((resource) => {
      asArray(resource.relatedResources).forEach((id) => {
        if (!resourceIds.has(id)) errors.push(`Resource ${resource.id} references missing related resource: ${id}`);
      });
    });
    return errors;
  }

  function initializeStats() {
    const validDates = publicResources
      .map((resource) => resource.verifiedDate)
      .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date))
      .sort();
    byId("libraryTotal").textContent = publicResources.length;
    byId("libraryLiveVerified").textContent = publicResources.filter((resource) => resource.verificationMethod === "live-check").length;
    byId("libraryPaCount").textContent = publicResources.filter((resource) => resource.paSpecific).length;
    byId("libraryFreeCount").textContent = publicResources.filter((resource) => resource.access === "free").length;
    byId("libraryStudentFacing").textContent = publicResources.filter(isStudentFacing).length;
    byId("libraryDistrictReview").textContent = publicResources.filter((resource) => DISTRICT_REVIEW_STATUSES.has(resource.recommendedUse)).length;
    byId("libraryReviewDate").textContent = formatDate(validDates.at(-1));
  }

  function validCollectionResources(collection) {
    const ids = new Set(publicResources.map((resource) => resource.id));
    return asArray(collection.resourceIds).filter((id) => ids.has(id));
  }

  function renderCollections() {
    const collectionButton = (collection) => {
      const count = validCollectionResources(collection).length;
      const audience = asArray(collection.audience).join(", ");
      return `<button type="button" class="collection-button" data-collection="${escapeHtml(collection.id)}" aria-pressed="false">
        <strong>${escapeHtml(collection.title)}</strong>
        <span>${escapeHtml(collection.description)}</span>
        ${audience ? `<span class="collection-audience">For: ${escapeHtml(audience)}</span>` : ""}
        <small>${count} ${count === 1 ? "resource" : "resources"}</small>
      </button>`;
    };

    byId("featuredCollections").innerHTML = aiEdtechCollections.slice(0, 3).map(collectionButton).join("");
    byId("additionalCollections").innerHTML = aiEdtechCollections.slice(3).map(collectionButton).join("");

    byId("collectionsHeading").closest("section").addEventListener("click", (event) => {
      const button = event.target.closest(".collection-button");
      if (!button) return;
      state.collection = state.collection === button.dataset.collection ? null : button.dataset.collection;
      syncCollectionState();
      renderResults();
      byId("resultsHeading").focus({ preventScroll: true });
      byId("resultsHeading").scrollIntoView({
        behavior: reducedMotion() ? "auto" : "smooth",
        block: "start"
      });
    });
  }

  function syncCollectionState() {
    document.querySelectorAll(".collection-button").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.collection === state.collection));
    });
    const collection = aiEdtechCollections.find((item) => item.id === state.collection);
    const description = byId("collectionDescription");
    description.hidden = !collection;
    description.textContent = collection
      ? `${collection.title}: ${collection.description} (${validCollectionResources(collection).length} resources)`
      : "";
  }

  function uniqueDatasetValues(field) {
    return [...new Set(publicResources.flatMap((resource) => asArray(resource[field])))].sort((a, b) => a.localeCompare(b));
  }

  function orderedCategories() {
    const values = uniqueDatasetValues("categories");
    return [
      ...PRIORITY_CATEGORIES.filter((value) => values.includes(value)),
      ...values.filter((value) => !PRIORITY_CATEGORIES.includes(value))
    ];
  }

  function filterOption(group, value, label) {
    const safeId = `filter-${group}-${String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    return `<span class="filter-option">
      <input type="checkbox" id="${escapeHtml(safeId)}" data-group="${escapeHtml(group)}" value="${escapeHtml(value)}">
      <label for="${escapeHtml(safeId)}">${escapeHtml(label)}</label>
    </span>`;
  }

  function renderFilterControls() {
    const groups = [
      ["audienceFilters", "audience", AUDIENCES, (value) => value],
      ["gradeFilters", "grade", GRADES, (value) => value.replaceAll("-", "–")],
      ["categoryFilters", "category", orderedCategories(), (value) => value],
      ["recordClassFilters", "recordClass", Object.keys(RECORD_CLASS_LABELS).filter((value) => publicResources.some((resource) => resource.recordClass === value)), (value) => RECORD_CLASS_LABELS[value]],
      ["accessFilters", "access", Object.keys(ACCESS_LABELS), (value) => ACCESS_LABELS[value]],
      ["useFilters", "recommendedUse", Object.keys(USE_LABELS), (value) => USE_LABELS[value]],
      ["verificationFilters", "verification", Object.keys(VERIFICATION_LABELS), (value) => VERIFICATION_LABELS[value]]
    ];

    groups.forEach(([containerId, group, values, labeler]) => {
      byId(containerId).innerHTML = values.map((value) => filterOption(group, value, labeler(value))).join("");
    });

    document.querySelectorAll(".filter-option input").forEach((input) => {
      input.addEventListener("change", () => {
        const set = state[input.dataset.group];
        input.checked ? set.add(input.value) : set.delete(input.value);
        renderResults();
      });
    });

    byId("studentFacingFilter").addEventListener("change", (event) => {
      state.studentFacing = event.target.checked;
      renderResults();
    });
    byId("paFilter").addEventListener("change", (event) => {
      state.paOnly = event.target.checked;
      renderResults();
    });
  }

  function matches(resource) {
    if (state.collection) {
      const collection = aiEdtechCollections.find((item) => item.id === state.collection);
      if (collection && !collection.resourceIds.includes(resource.id)) return false;
    }
    if (state.studentFacing && !isStudentFacing(resource)) return false;
    if (state.paOnly && !resource.paSpecific) return false;
    if (state.audience.size && !asArray(resource.audiences).some((value) => state.audience.has(value))) return false;
    if (state.grade.size && !asArray(resource.gradeBands).some((value) => state.grade.has(value))) return false;
    if (state.category.size && !asArray(resource.categories).some((value) => state.category.has(value))) return false;
    if (state.recordClass.size && !state.recordClass.has(resource.recordClass)) return false;
    if (state.access.size && !state.access.has(resource.access)) return false;
    if (state.recommendedUse.size && !state.recommendedUse.has(resource.recommendedUse)) return false;
    if (state.verification.size && !state.verification.has(resource.verificationMethod)) return false;
    if (state.query) {
      const terms = state.query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
      const haystack = [
        resource.title,
        resource.organization,
        resource.description,
        resource.recordClass,
        resource.classroomUseCase,
        resource.districtUseCase,
        resource.privacySummary,
        resource.curatorNote,
        ...asArray(resource.categories),
        ...asArray(resource.audiences),
        ...asArray(resource.gradeBands),
        ...asArray(resource.instructionalPurpose),
        ...asArray(resource.knownLimitations),
        ...asArray(resource.riskNotes)
      ].join(" ").toLocaleLowerCase();
      if (!terms.every((term) => haystack.includes(term))) return false;
    }
    return true;
  }

  function tagList(values, limit = 4) {
    const items = asArray(values).filter(Boolean);
    if (!items.length) return "";
    const shown = items.slice(0, limit);
    return `<div class="tag-list">${shown.map((value) => `<span class="meta-chip">${escapeHtml(value)}</span>`).join("")}${items.length > limit ? `<span class="meta-chip">+${items.length - limit} more</span>` : ""}</div>`;
  }

  function listItems(values) {
    const items = asArray(values).filter(Boolean);
    return items.length ? `<ul>${items.map((value) => `<li>${escapeHtml(value)}</li>`).join("")}</ul>` : "";
  }

  function detailList(items) {
    const rows = items.filter((item) => item.always || isMeaningful(item.value));
    if (!rows.length) return "";
    return `<dl class="detail-list">${rows.map((item) => `<div><dt>${escapeHtml(item.label)}</dt><dd>${escapeHtml(readableValue(item.value))}</dd></div>`).join("")}</dl>`;
  }

  function evaluationSection(resource) {
    const evaluation = resource.evaluation || {};
    const rows = Object.entries(EVALUATION_LABELS)
      .filter(([key]) => evaluation[key] && evaluation[key] !== "not-applicable")
      .map(([key, label]) => `<div class="evaluation-item"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(evaluation[key])}</span></div>`);
    if (!rows.length) return "";
    return `<section class="detail-section">
      <h4>Evaluation Snapshot</h4>
      <div class="evaluation-grid">${rows.join("")}</div>
      <p class="evaluation-note">Evaluation labels reflect the reviewed public information and instructional curation available at the listed verification date. Districts should complete their own legal, privacy, security, and procurement review.</p>
    </section>`;
  }

  function privacySection(resource) {
    if (!isStudentFacing(resource)) return "";
    return `<section class="detail-section">
      <h4>Student Privacy and Age Review</h4>
      ${detailList([
        { label: "Student accounts", value: resource.studentAccounts, always: true },
        { label: "Minimum age", value: resource.minimumAge, always: true },
        { label: "Parent consent", value: resource.parentConsent, always: true },
        { label: "Teacher-managed environment", value: resource.teacherManaged, always: true },
        { label: "DPA availability", value: resource.dpaAvailable, always: true },
        { label: "Training-data summary", value: resource.trainingDataSummary, always: true },
        { label: "Retention summary", value: resource.retentionSummary, always: true },
        { label: "Deletion option", value: resource.deletionOption, always: true }
      ])}
      ${resource.privacySummary ? `<p class="unclear-note"><strong>Privacy summary:</strong> ${escapeHtml(resource.privacySummary)}</p>` : ""}
    </section>`;
  }

  function relatedSection(resource) {
    const related = asArray(resource.relatedResources)
      .map((id) => publicResources.find((item) => item.id === id))
      .filter(Boolean);
    if (!related.length) return "";
    return `<section class="detail-section"><h4>Related Resources</h4><div class="related-links">
      ${related.map((item) => `<button type="button" class="related-button" data-related-id="${escapeHtml(item.id)}">Show ${escapeHtml(item.title)}</button>`).join("")}
    </div></section>`;
  }

  function resourceDetails(resource) {
    const purpose = listItems(resource.instructionalPurpose);
    const limitations = listItems(resource.knownLimitations);
    const risks = listItems(resource.riskNotes);
    return [
      (purpose || resource.classroomUseCase || resource.districtUseCase) ? `<section class="detail-section">
        <h4>Instructional and District Use</h4>
        ${purpose ? `<div><strong>Instructional purpose</strong>${purpose}</div>` : ""}
        ${resource.classroomUseCase ? `<p><strong>Classroom use case:</strong> ${escapeHtml(resource.classroomUseCase)}</p>` : ""}
        ${resource.districtUseCase ? `<p><strong>District use case:</strong> ${escapeHtml(resource.districtUseCase)}</p>` : ""}
      </section>` : "",
      `<section class="detail-section"><h4>Access and Accounts</h4>${detailList([
        { label: "Pricing summary", value: resource.pricingSummary },
        { label: "Free-tier limitations", value: resource.freeTierLimits },
        { label: "Account required", value: resource.accountRequired, always: true },
        { label: "Student accounts", value: resource.studentAccounts },
        { label: "District plan available", value: resource.districtPlan, always: true },
        { label: "Google / Microsoft / LMS integrations", value: asArray(resource.integrations).join(", ") }
      ])}</section>`,
      privacySection(resource),
      (resource.accessibilityNotes || asArray(resource.languageSupport).length) ? `<section class="detail-section">
        <h4>Accessibility and Language</h4>
        ${detailList([
          { label: "Accessibility notes", value: resource.accessibilityNotes },
          { label: "Language support", value: asArray(resource.languageSupport).join(", ") }
        ])}
      </section>` : "",
      (resource.evidenceSummary || limitations || risks) ? `<section class="detail-section">
        <h4>Evidence, Limitations, and Risk Notes</h4>
        ${resource.evidenceSummary ? `<p><strong>Evidence summary:</strong> ${escapeHtml(resource.evidenceSummary)}</p>` : ""}
        ${limitations ? `<div><strong>Known limitations</strong>${limitations}</div>` : ""}
        ${risks ? `<div><strong>Risk notes</strong>${risks}</div>` : ""}
      </section>` : "",
      evaluationSection(resource),
      `<section class="detail-section"><h4>Verification and Curation</h4>${detailList([
        { label: "Last verified", value: formatDate(resource.verifiedDate), always: true },
        { label: "Verification method", value: VERIFICATION_LABELS[resource.verificationMethod] || resource.verificationMethod, always: true },
        { label: "Confidence", value: CONFIDENCE_LABELS[resource.confidence] || resource.confidence, always: true },
        { label: "Curator note", value: resource.curatorNote }
      ])}</section>`,
      relatedSection(resource)
    ].filter(Boolean).join("");
  }

  function resourceCard(resource) {
    const student = isStudentFacing(resource);
    const teacherOnly = resource.studentAccounts === "no";
    const original = isOriginal(resource);
    const planned = isPlanned(resource);
    const verification = VERIFICATION_LABELS[resource.verificationMethod] || resource.verificationMethod;
    const confidence = CONFIDENCE_LABELS[resource.confidence] || resource.confidence;
    const safeExternalUrl = /^https?:\/\//i.test(resource.url);
    const resourceAction = planned || !safeExternalUrl
      ? `<a class="btn btn-primary btn-sm" href="contact.html?interest=ai-resource-request">Notify Me / Request This Resource</a>`
      : `<a class="btn btn-primary btn-sm" href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer">View Resource <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>`;

    return `<article class="resource-card${original ? " original" : ""}" id="resource-${escapeHtml(resource.id)}" tabindex="-1">
      <div class="resource-kicker">
        <span class="meta-chip">${escapeHtml(planned ? "In development" : ACCESS_LABELS[resource.access] || resource.access)}</span>
        <span class="meta-chip ${resource.verificationMethod === "live-check" ? "live" : "pending"}">${escapeHtml(verification)}</span>
        <span class="meta-chip">${escapeHtml(confidence)}</span>
        <span class="meta-chip ${student ? "student" : ""}">${student ? "Student-facing" : (teacherOnly ? "Teacher-facing" : "Audience varies")}</span>
        ${DISTRICT_REVIEW_STATUSES.has(resource.recommendedUse) ? '<span class="meta-chip review">District review required</span>' : ""}
        ${resource.paSpecific ? '<span class="meta-chip pa">Pennsylvania-specific</span>' : ""}
        ${original ? `<span class="meta-chip original">STEM@Skook29 Original${planned ? " — Planned" : ""}</span>` : ""}
      </div>
      <h3>${escapeHtml(resource.title)}</h3>
      <p class="resource-organization">${escapeHtml(resource.organization)}</p>
      <p class="resource-description">${escapeHtml(resource.description)}</p>
      <div class="resource-meta">
        <p><strong>Record class:</strong> ${escapeHtml(RECORD_CLASS_LABELS[resource.recordClass] || resource.recordClass)}</p>
        <p><strong>Grades:</strong> ${asArray(resource.gradeBands).map((value) => escapeHtml(value.replaceAll("-", "–"))).join(", ") || "Not specified"}</p>
        <p><strong>Audiences:</strong> ${asArray(resource.audiences).map(escapeHtml).join(", ") || "Not specified"}</p>
        <p><strong>Recommended use:</strong> ${escapeHtml(USE_DISPLAY[resource.recommendedUse] || resource.recommendedUse)}</p>
      </div>
      ${tagList(resource.categories)}
      ${resource.pricingSummary ? `<p class="pricing-line"><strong>Access:</strong> ${escapeHtml(resource.pricingSummary)}</p>` : ""}
      <div class="resource-actions">${resourceAction}</div>
      <details class="resource-details">
        <summary>More Details</summary>
        <div class="details-content">${resourceDetails(resource)}</div>
      </details>
    </article>`;
  }

  function renderResults() {
    const results = publicResources.filter(matches);
    byId("resourceGrid").innerHTML = results.map(resourceCard).join("");
    byId("resourceGrid").hidden = results.length === 0;
    byId("emptyResults").hidden = results.length !== 0;
    byId("resultCount").textContent = `Showing ${results.length} of ${publicResources.length} resources`;
    renderActiveFilters();
  }

  function activeFilterItems() {
    const items = [];
    if (state.collection) {
      const collection = aiEdtechCollections.find((item) => item.id === state.collection);
      if (collection) items.push({ group: "collection", value: state.collection, label: `Collection: ${collection.title}` });
    }
    [
      ["audience", (value) => value],
      ["grade", (value) => value.replaceAll("-", "–")],
      ["category", (value) => value],
      ["recordClass", (value) => RECORD_CLASS_LABELS[value] || value],
      ["access", (value) => ACCESS_LABELS[value] || value],
      ["recommendedUse", (value) => USE_LABELS[value] || value],
      ["verification", (value) => VERIFICATION_LABELS[value] || value]
    ].forEach(([group, labeler]) => {
      state[group].forEach((value) => items.push({ group, value, label: labeler(value) }));
    });
    if (state.studentFacing) items.push({ group: "studentFacing", value: "true", label: "Student-facing only" });
    if (state.paOnly) items.push({ group: "paOnly", value: "true", label: "Pennsylvania-specific only" });
    if (state.query) items.push({ group: "query", value: state.query, label: `Search: “${state.query}”` });
    return items;
  }

  function renderActiveFilters() {
    const items = activeFilterItems();
    byId("activeFilters").innerHTML = items.map((item) =>
      `<button type="button" class="active-chip" data-remove-group="${escapeHtml(item.group)}" data-remove-value="${escapeHtml(item.value)}" aria-label="Remove ${escapeHtml(item.label)} filter">${escapeHtml(item.label)} ×</button>`
    ).join("");
    byId("clearFilters").hidden = items.length === 0;
  }

  function syncFilterControls() {
    document.querySelectorAll(".filter-option input").forEach((input) => {
      input.checked = state[input.dataset.group].has(input.value);
    });
    byId("studentFacingFilter").checked = state.studentFacing;
    byId("paFilter").checked = state.paOnly;
    byId("librarySearch").value = state.query;
    syncCollectionState();
  }

  function removeFilter(group, value) {
    if (group === "collection") state.collection = null;
    else if (group === "query") state.query = "";
    else if (group === "studentFacing") state.studentFacing = false;
    else if (group === "paOnly") state.paOnly = false;
    else if (state[group] instanceof Set) state[group].delete(value);
    syncFilterControls();
    renderResults();
  }

  function clearFilters() {
    state.query = "";
    state.collection = null;
    state.studentFacing = false;
    state.paOnly = false;
    ["audience", "grade", "category", "recordClass", "access", "recommendedUse", "verification"].forEach((group) => state[group].clear());
    syncFilterControls();
    renderResults();
  }

  function showRelatedResource(resourceId) {
    const resource = publicResources.find((item) => item.id === resourceId);
    if (!resource) return;
    clearFilters();
    requestAnimationFrame(() => {
      const card = byId(`resource-${resourceId}`);
      if (!card) return;
      card.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "center" });
      card.focus({ preventScroll: true });
      byId("resultCount").textContent = `Showing ${publicResources.length} resources. Moved to ${resource.title}.`;
    });
  }

  function applyQueryParameters() {
    const params = new URLSearchParams(window.location.search);
    const recognized = {
      category: new Set(uniqueDatasetValues("categories")),
      audience: new Set(uniqueDatasetValues("audiences")),
      grade: new Set(uniqueDatasetValues("gradeBands")),
      access: new Set(publicResources.map((resource) => resource.access)),
      collection: new Set(aiEdtechCollections.map((collection) => collection.id))
    };

    ["category", "audience", "grade", "access"].forEach((parameter) => {
      const value = params.get(parameter);
      if (value && recognized[parameter].has(value)) state[parameter].add(value);
    });

    const collection = params.get("collection");
    if (collection && recognized.collection.has(collection)) state.collection = collection;

    const search = params.get("search");
    if (search && search.length <= 120) state.query = search.trim();
  }

  function bindEvents() {
    byId("librarySearch").addEventListener("input", (event) => {
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(() => {
        state.query = event.target.value.trim();
        renderResults();
      }, 180);
    });

    byId("activeFilters").addEventListener("click", (event) => {
      const button = event.target.closest(".active-chip");
      if (button) removeFilter(button.dataset.removeGroup, button.dataset.removeValue);
    });

    byId("clearFilters").addEventListener("click", clearFilters);
    byId("emptyClearFilters").addEventListener("click", clearFilters);
    byId("resourceGrid").addEventListener("click", (event) => {
      const related = event.target.closest(".related-button");
      if (related) showRelatedResource(related.dataset.relatedId);
    });
  }

  function showError(errors) {
    console.error("AI & EdTech Resource Library validation failed:", errors);
    byId("libraryApp").hidden = true;
    byId("libraryError").hidden = false;
  }

  function init() {
    const errors = validateData();
    if (errors.length) {
      showError(errors);
      return;
    }

    const excludedFromPublic = aiEdtechResources.filter((resource) =>
      resource.recommendedUse === "Not recommended for public library inclusion"
    );
    if (excludedFromPublic.length) {
      console.warn("Records excluded from public display by recommendedUse:", excludedFromPublic.map((resource) => resource.id));
    }

    publicResources = aiEdtechResources.filter((resource) =>
      resource.recommendedUse !== "Not recommended for public library inclusion"
    );

    initializeStats();
    renderCollections();
    renderFilterControls();
    applyQueryParameters();
    syncFilterControls();
    bindEvents();
    renderResults();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}());
