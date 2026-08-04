/* STEELS Resource Library application — browser UI only; datasets load first. */
(function () {
  "use strict";

  const DOMAIN_LABELS = {
    "3.1": "3.1 Life Science",
    "3.2": "3.2 Physical Science",
    "3.3": "3.3 Earth and Space Science",
    "3.4": "3.4 Environmental Literacy and Sustainability",
    "3.5": "3.5 Technology and Engineering",
    "CS-CT": "CS / Computational Thinking",
    "Cross-domain": "Cross-domain",
    "Three-Dimensional Teaching": "Three-Dimensional Teaching",
    "Assessment": "Assessment",
    "Professional Learning": "Professional Learning"
  };

  const DOMAIN_COLORS = {
    "3.1": "#2f855a", "3.2": "#c2410c", "3.3": "#2563a5", "3.4": "#0f766e",
    "3.5": "#a16207", "CS-CT": "#6d28d9", "Cross-domain": "#4b5563",
    "Three-Dimensional Teaching": "#8b1a2e", "Assessment": "#be185d", "Professional Learning": "#0369a1"
  };

  const TYPE_BUCKETS = {
    "Guidance & planning": ["Official standards & guidance", "Standards unpacking tool", "Curriculum-mapping support"],
    "Lessons & units": ["Lesson plans & activities", "Model unit", "Phenomena collection", "Project-based learning unit"],
    "Investigations & data": ["Environmental investigation", "Watershed & outdoor learning", "Data set & simulation", "Interactive science tool", "Lab investigation"],
    "Assessment": ["Assessment tool"],
    "Engineering & making": ["Engineering design challenge", "Competition & design challenge", "MakerSpace integration"],
    "Professional learning": ["Professional learning"]
  };

  const ACCESS_LABELS = { Free: "Free", Registration: "Free — account required", Workshop: "Workshop required", Paid: "Paid" };
  const PATHWAY_LABELS = {
    "beginner-teacher": "Beginner Teacher", "instructional-coach": "Instructional Coach",
    administrator: "Administrator", elementary: "Elementary", middle: "Middle School", high: "High School"
  };
  const FEATURED_COLLECTION_IDS = ["new-to-steels", "ready-monday-morning", "environmental-literacy", "engineering", "assessment", "schuylkill-county"];
  const TRAINING_IDS = ["dcnr-watershed-education", "dcnr-educator-pd", "project-learning-tree", "da-vinci-steels-pd"];
  const NOAA_WARNING = "Some modules may be temporarily unavailable following a site migration. Check availability before assigning.";

  const state = {
    query: "", collection: null, grades: new Set(), domains: new Set(),
    types: new Set(), access: new Set(), paOnly: false
  };

  const byId = (id) => document.getElementById(id);
  const escapeHtml = (value) => {
    const node = document.createElement("span");
    node.textContent = String(value ?? "");
    return node.innerHTML;
  };
  const asArray = (value) => Array.isArray(value) ? value : [];

  function validateData() {
    const errors = [];
    if (typeof steelsResources === "undefined" || !Array.isArray(steelsResources)) errors.push("steelsResources is not an array");
    if (typeof featuredCollections === "undefined" || !Array.isArray(featuredCollections)) errors.push("featuredCollections is not an array");
    if (errors.length) return errors;

    const resourceIds = new Set();
    steelsResources.forEach((resource, index) => {
      if (!resource || !resource.id) errors.push(`Resource ${index} has no id`);
      if (resourceIds.has(resource.id)) errors.push(`Duplicate resource id: ${resource.id}`);
      resourceIds.add(resource.id);
      ["title", "url", "publisher", "description"].forEach((field) => {
        if (!resource[field]) errors.push(`Resource ${resource.id || index} has no ${field}`);
      });
    });
    const collectionIds = new Set();
    featuredCollections.forEach((collection, index) => {
      if (!collection || !collection.id) errors.push(`Collection ${index} has no id`);
      if (collectionIds.has(collection.id)) errors.push(`Duplicate collection id: ${collection.id}`);
      collectionIds.add(collection.id);
      asArray(collection.resourceIds).forEach((id) => {
        if (!resourceIds.has(id)) errors.push(`Collection ${collection.id} references missing resource: ${id}`);
      });
    });
    return errors;
  }

  function formatDate(value) {
    if (!value) return "Not recorded";
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date);
  }

  function initializeStats() {
    const dates = steelsResources.map((resource) => resource.reviewDate).filter(Boolean).sort();
    const latestReview = dates.at(-1);
    const highCount = steelsResources.filter((resource) => resource.confidence === "High").length;
    byId("libraryTotal").textContent = steelsResources.length;
    byId("libraryPaCount").textContent = steelsResources.filter((resource) => resource.paSpecific).length;
    byId("libraryHighConfidence").textContent = highCount;
    byId("libraryFreeCount").textContent = steelsResources.filter((resource) => resource.access === "Free").length;
    byId("libraryReviewDate").textContent = formatDate(latestReview);
    byId("reviewedResourceCount").textContent = steelsResources.length;
    byId("trustReviewDate").textContent = formatDate(latestReview);
  }

  function validCollectionResources(collection) {
    const ids = new Set(steelsResources.map((resource) => resource.id));
    return asArray(collection.resourceIds).filter((id) => ids.has(id));
  }

  function collectionButton(collection) {
    const count = validCollectionResources(collection).length;
    return `<button type="button" class="collection-button" data-collection="${escapeHtml(collection.id)}" aria-pressed="false">
      <strong>${escapeHtml(collection.title)}</strong>
      <span>${escapeHtml(collection.description)}</span>
      <small>${count} ${count === 1 ? "resource" : "resources"}</small>
    </button>`;
  }

  function renderCollections() {
    const primary = FEATURED_COLLECTION_IDS.map((id) => featuredCollections.find((collection) => collection.id === id)).filter(Boolean);
    const secondary = featuredCollections.filter((collection) => !FEATURED_COLLECTION_IDS.includes(collection.id));
    byId("featuredCollections").innerHTML = primary.map(collectionButton).join("");
    byId("moreCollections").innerHTML = secondary.map(collectionButton).join("");
    document.querySelectorAll(".collection-button").forEach((button) => {
      button.addEventListener("click", () => {
        state.collection = state.collection === button.dataset.collection ? null : button.dataset.collection;
        syncCollectionState();
        renderResults();
        byId("resultsHeading").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      });
    });
  }

  function syncCollectionState() {
    document.querySelectorAll(".collection-button").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.collection === state.collection));
    });
    const collection = featuredCollections.find((item) => item.id === state.collection);
    byId("collectionDescription").textContent = collection ? `${collection.title}: ${collection.description}` : "";
  }

  function filterButton(group, value, label) {
    return `<button type="button" class="filter-button" data-group="${group}" data-value="${escapeHtml(value)}" aria-pressed="false">${escapeHtml(label)}</button>`;
  }

  function renderFilterControls() {
    byId("gradeFilters").innerHTML = ["K-2", "3-5", "6-8", "9-12"].map((value) => filterButton("grades", value, value.replace("-", "–"))).join("");
    byId("domainFilters").innerHTML = Object.entries(DOMAIN_LABELS).map(([value, label]) => filterButton("domains", value, label)).join("");
    byId("typeFilters").innerHTML = Object.keys(TYPE_BUCKETS).map((value) => filterButton("types", value, value)).join("");
    byId("accessFilters").innerHTML = Object.keys(ACCESS_LABELS).map((value) => filterButton("access", value, ACCESS_LABELS[value])).join("");
    document.querySelectorAll(".filter-button").forEach((button) => {
      button.addEventListener("click", () => {
        const set = state[button.dataset.group];
        set.has(button.dataset.value) ? set.delete(button.dataset.value) : set.add(button.dataset.value);
        button.setAttribute("aria-pressed", String(set.has(button.dataset.value)));
        renderResults();
      });
    });
  }

  function matches(resource) {
    if (state.collection) {
      const collection = featuredCollections.find((item) => item.id === state.collection);
      if (collection && !collection.resourceIds.includes(resource.id)) return false;
    }
    if (state.paOnly && !resource.paSpecific) return false;
    if (state.grades.size && !asArray(resource.gradeBands).some((value) => state.grades.has(value))) return false;
    if (state.domains.size && !asArray(resource.steelsDomains).some((value) => state.domains.has(value))) return false;
    if (state.types.size && ![...state.types].some((bucket) => TYPE_BUCKETS[bucket].includes(resource.resourceType))) return false;
    if (state.access.size && !state.access.has(resource.access)) return false;
    if (state.query) {
      const terms = state.query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
      const haystack = [
        resource.title, resource.publisher, resource.description, resource.notes, resource.resourceType,
        ...asArray(resource.keywords), ...asArray(resource.steelsDomains)
      ].join(" ").toLocaleLowerCase();
      if (!terms.every((term) => haystack.includes(term))) return false;
    }
    return true;
  }

  function listSection(label, values, transform) {
    const items = asArray(values).filter(Boolean);
    if (!items.length) return "";
    return `<div><strong>${escapeHtml(label)}</strong><ul>${items.map((item) => `<li>${escapeHtml(transform ? transform(item) : item)}</li>`).join("")}</ul></div>`;
  }

  function resourceCard(resource) {
    const domain = asArray(resource.steelsDomains)[0];
    const confidenceLabel = resource.confidence === "Medium" ? "Verification follow-up scheduled" : "Reviewed link";
    const confidenceClass = resource.confidence === "Medium" ? "follow-up" : "confidence";
    const warning = resource.id === "noaa-data-in-classroom" ? `<p class="resource-warning"><strong>Availability note:</strong> ${NOAA_WARNING}</p>` : "";
    const related = asArray(resource.relatedResources).map((id) => steelsResources.find((item) => item.id === id)).filter(Boolean);
    const details = [
      resource.notes ? `<div><strong>Curator note</strong><p>${escapeHtml(resource.notes)}</p></div>` : "",
      resource.reviewDate ? `<div><strong>Last verified</strong><p>${escapeHtml(formatDate(resource.reviewDate))}</p></div>` : "",
      resource.confidence ? `<div><strong>Confidence</strong><p>${escapeHtml(resource.confidence)} — ${confidenceLabel}</p></div>` : "",
      resource.estimatedTime ? `<div><strong>Estimated time</strong><p>${escapeHtml(resource.estimatedTime)}</p></div>` : "",
      listSection("Recommended pathways", resource.recommendedPathways, (value) => PATHWAY_LABELS[value] || value),
      listSection("Disciplinary core ideas", resource.disciplinaryCoreIdeas),
      listSection("Science and engineering practices", resource.sciencePractices),
      listSection("Crosscutting concepts", resource.crosscuttingConcepts),
      related.length ? `<div><strong>Related resources</strong><div class="related-links">${related.map((item) => `<button type="button" class="related-button" data-related-id="${escapeHtml(item.id)}">Show ${escapeHtml(item.title)}</button>`).join("")}</div></div>` : ""
    ].filter(Boolean).join("");

    return `<article class="resource-card" id="resource-${escapeHtml(resource.id)}" tabindex="-1" style="--domain-color:${DOMAIN_COLORS[domain] || "#8b1a2e"}">
      <div class="resource-kicker">
        <span class="meta-chip">${escapeHtml(ACCESS_LABELS[resource.access] || resource.access)}</span>
        ${resource.paSpecific ? '<span class="meta-chip pa">Pennsylvania-specific</span>' : ""}
        <span class="meta-chip ${confidenceClass}">${escapeHtml(confidenceLabel)}</span>
      </div>
      <h3>${escapeHtml(resource.title)}</h3>
      <p class="resource-publisher">${escapeHtml(resource.publisher)}</p>
      <p class="resource-description">${escapeHtml(resource.description)}</p>
      <div class="metadata-block">
        <p><strong>Grades:</strong> ${asArray(resource.gradeBands).map((value) => escapeHtml(value.replace("-", "–"))).join(", ")}</p>
        <p><strong>Domains:</strong> ${asArray(resource.steelsDomains).map((value) => escapeHtml(DOMAIN_LABELS[value] || value)).join(", ")}</p>
        <p><strong>Type:</strong> ${escapeHtml(resource.resourceType)}</p>
        ${resource.estimatedTime ? `<p><strong>Estimated time:</strong> ${escapeHtml(resource.estimatedTime)}</p>` : ""}
      </div>
      ${warning}
      <div class="resource-actions">
        <a class="btn btn-primary btn-sm" href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer">Visit Resource <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>
      </div>
      <details class="resource-details"><summary>More Details</summary><div class="details-content">${details}</div></details>
    </article>`;
  }

  function renderResults() {
    const results = steelsResources.filter(matches);
    byId("resourceGrid").innerHTML = results.map(resourceCard).join("");
    byId("resourceGrid").hidden = results.length === 0;
    byId("emptyResults").hidden = results.length !== 0;
    byId("resultCount").textContent = `Showing ${results.length} of ${steelsResources.length} resources`;
    renderActiveFilters();
    document.querySelectorAll(".related-button").forEach((button) => button.addEventListener("click", () => showRelatedResource(button.dataset.relatedId)));
  }

  function activeFilterItems() {
    const items = [];
    if (state.collection) {
      const collection = featuredCollections.find((item) => item.id === state.collection);
      if (collection) items.push({ group: "collection", value: state.collection, label: `Collection: ${collection.title}` });
    }
    state.grades.forEach((value) => items.push({ group: "grades", value, label: value.replace("-", "–") }));
    state.domains.forEach((value) => items.push({ group: "domains", value, label: DOMAIN_LABELS[value] || value }));
    state.types.forEach((value) => items.push({ group: "types", value, label: value }));
    state.access.forEach((value) => items.push({ group: "access", value, label: ACCESS_LABELS[value] || value }));
    if (state.paOnly) items.push({ group: "paOnly", value: "true", label: "Pennsylvania-specific" });
    if (state.query) items.push({ group: "query", value: state.query, label: `Search: “${state.query}”` });
    return items;
  }

  function renderActiveFilters() {
    const items = activeFilterItems();
    byId("activeFilters").innerHTML = items.map((item) => `<button type="button" class="active-chip" data-remove-group="${item.group}" data-remove-value="${escapeHtml(item.value)}" aria-label="Remove ${escapeHtml(item.label)} filter">${escapeHtml(item.label)} ×</button>`).join("");
    byId("clearFilters").hidden = items.length === 0;
    document.querySelectorAll(".active-chip").forEach((button) => button.addEventListener("click", () => removeFilter(button.dataset.removeGroup, button.dataset.removeValue)));
  }

  function removeFilter(group, value) {
    if (group === "collection") { state.collection = null; syncCollectionState(); }
    else if (group === "query") { state.query = ""; byId("librarySearch").value = ""; }
    else if (group === "paOnly") { state.paOnly = false; byId("paFilter").checked = false; }
    else {
      state[group].delete(value);
      document.querySelectorAll(`.filter-button[data-group="${group}"]`).forEach((button) => {
        if (button.dataset.value === value) button.setAttribute("aria-pressed", "false");
      });
    }
    renderResults();
  }

  function clearAll() {
    state.query = ""; state.collection = null; state.paOnly = false;
    state.grades.clear(); state.domains.clear(); state.types.clear(); state.access.clear();
    byId("librarySearch").value = ""; byId("paFilter").checked = false;
    document.querySelectorAll(".filter-button").forEach((button) => button.setAttribute("aria-pressed", "false"));
    syncCollectionState();
    renderResults();
  }

  function showRelatedResource(id) {
    clearAll();
    window.requestAnimationFrame(() => {
      const card = byId(`resource-${id}`);
      if (!card) return;
      card.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
      card.focus({ preventScroll: true });
    });
  }

  function renderTrainingResources() {
    byId("trainingResources").innerHTML = TRAINING_IDS.map((id) => steelsResources.find((resource) => resource.id === id)).filter(Boolean).map((resource) =>
      `<a class="training-link" href="#resource-${escapeHtml(resource.id)}" data-training-id="${escapeHtml(resource.id)}">${escapeHtml(resource.title)} <span aria-hidden="true">→</span></a>`
    ).join("");
    document.querySelectorAll("[data-training-id]").forEach((link) => link.addEventListener("click", (event) => {
      event.preventDefault();
      showRelatedResource(link.dataset.trainingId);
    }));
  }

  function showLoadError(errors) {
    byId("libraryApp").hidden = true;
    byId("libraryError").hidden = false;
    console.error("STEELS Resource Library validation failed:", errors);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const errors = validateData();
    if (errors.length) { showLoadError(errors); return; }
    initializeStats();
    renderCollections();
    renderFilterControls();
    renderTrainingResources();
    let searchTimer;
    byId("librarySearch").addEventListener("input", (event) => {
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(() => { state.query = event.target.value.trim(); renderResults(); }, 180);
    });
    byId("paFilter").addEventListener("change", (event) => { state.paOnly = event.target.checked; renderResults(); });
    byId("clearFilters").addEventListener("click", clearAll);
    byId("emptyClear").addEventListener("click", clearAll);
    renderResults();
  });
}());
