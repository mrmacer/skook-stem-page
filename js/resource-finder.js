/* Teacher Fast Lane resource finder. Existing catalog datasets load before this adapter. */
(function () {
  "use strict";

  const TOPICS = {
    steels: "STEELS & Science",
    ai: "AI for Teaching",
    assessment: "Firefly & Assessment",
    making: "STEM & Making"
  };

  const RECOMMENDED_IDS = {
    steels: ["sas-steels-hub", "openscied", "phet"],
    ai: ["cur-commonsense-ai", "cur-aiedu", "cur-dayofai"],
    assessment: ["pa-firefly", "steels-assessment-toolkit", "snap-assessments"],
    making: ["birdbrain-hummingbird-learning", "teachengineering", "smithsonian-makerspaces"]
  };

  const state = {
    query: "",
    topic: "steels",
    topicExplicit: false,
    grades: new Set(),
    source: "all",
    access: "all",
    type: "all",
    expanded: false
  };

  const byId = (id) => document.getElementById(id);
  const asArray = (value) => Array.isArray(value) ? value : [];
  let resources = [];

  function text(value) {
    return String(value ?? "").trim();
  }

  function firstSentence(value) {
    const clean = text(value).replace(/\s+/g, " ");
    const match = clean.match(/^.*?[.!?](?=\s|$)/);
    return match ? match[0] : clean;
  }

  function includesAny(value, patterns) {
    const haystack = text(value).toLowerCase();
    return patterns.some((pattern) => haystack.includes(pattern.toLowerCase()));
  }

  function normalizeSteels(resource) {
    const keywords = asArray(resource.keywords);
    const domains = asArray(resource.steelsDomains);
    const searchable = [
      resource.title, resource.description, resource.publisher, resource.resourceType,
      ...resource.gradeBands, ...domains, ...keywords
    ].join(" ");
    const topics = new Set(["steels"]);
    if (
      domains.includes("Assessment") ||
      includesAny(searchable, ["assessment", "pSSA", "firefly", "rubric", "student evidence"])
    ) topics.add("assessment");
    if (
      domains.includes("3.5") || domains.includes("CS-CT") ||
      includesAny(searchable, ["engineering", "maker", "robot", "coding", "scratch", "design challenge"])
    ) topics.add("making");

    let accessLabel = resource.access || "Check publisher";
    let accessKey = text(resource.access).toLowerCase();
    let note = "";
    if (resource.id === "pa-firefly") {
      accessLabel = "Public guidance; school-managed testing access";
      note = "Firefly is a Pennsylvania benchmark assessment, not a downloadable classroom lesson.";
    } else if (resource.id === "birdbrain-hummingbird-learning") {
      accessLabel = "Free learning portal; hardware required for robotics projects";
    }

    return {
      id: resource.id,
      source: "steels",
      sourceLabel: "STEELS Resource Library",
      title: resource.title,
      description: resource.description,
      publisher: resource.publisher,
      url: resource.url,
      gradeBands: asArray(resource.gradeBands),
      type: resource.resourceType || "STEELS resource",
      accessKey,
      accessLabel,
      topics,
      note,
      searchText: searchable.toLowerCase()
    };
  }

  function normalizeAi(resource) {
    const categories = asArray(resource.categories);
    const searchable = [
      resource.title, resource.description, resource.organization, resource.recordClass,
      resource.classroomUseCase, resource.districtUseCase, resource.pricingSummary,
      ...resource.gradeBands, ...categories, ...resource.audiences
    ].join(" ");
    const topics = new Set(["ai"]);
    if (resource.recordClass === "ct-ai-creation" || includesAny(searchable, ["robotics", "maker", "coding and building ai"])) {
      topics.add("making");
    }

    const accountRequired = resource.accountRequired === true;
    let accessLabel = resource.pricingSummary || resource.access || "Check publisher";
    if (accountRequired && resource.access === "free") accessLabel = "Free account required";
    if (!accountRequired && resource.access === "free") accessLabel = "Free; no account required to browse";

    const districtReview = [
      "Recommended with district review",
      "Recommended for limited pilot",
      "Student use requires district approval"
    ].includes(resource.recommendedUse);

    return {
      id: resource.id,
      source: "ai",
      sourceLabel: "AI & EdTech Resource Library",
      title: resource.title,
      description: resource.description,
      publisher: resource.organization,
      url: resource.url,
      gradeBands: asArray(resource.gradeBands),
      type: resource.recordClass || "AI / EdTech resource",
      accessKey: accountRequired ? "account-required" : text(resource.access).toLowerCase(),
      accessLabel,
      topics,
      note: districtReview ? "Review current terms and follow district policy before classroom or student use." : "",
      searchText: searchable.toLowerCase()
    };
  }

  function loadResources() {
    const errors = [];
    if (typeof steelsResources === "undefined" || !Array.isArray(steelsResources)) {
      errors.push("STEELS resources are unavailable.");
    }
    if (typeof aiEdtechResources === "undefined" || !Array.isArray(aiEdtechResources)) {
      errors.push("AI and EdTech resources are unavailable.");
    }
    if (errors.length) return errors;

    resources = [
      ...steelsResources.map(normalizeSteels),
      ...aiEdtechResources
        .filter((resource) => resource.access !== "planned")
        .filter((resource) => resource.recommendedUse !== "Not recommended for public library inclusion")
        .map(normalizeAi)
    ];
    return [];
  }

  function matchesGrade(resource) {
    if (!state.grades.size) return true;
    return [...state.grades].some((grade) =>
      resource.gradeBands.includes(grade) || resource.gradeBands.includes("K-12 Adaptable")
    );
  }

  function matchesAccess(resource) {
    if (state.access === "all") return true;
    if (state.access === "free") return resource.accessKey === "free";
    if (state.access === "no-account") return resource.accessKey === "free";
    if (state.access === "account-required") {
      return resource.accessKey === "account-required" || resource.accessKey === "registration";
    }
    if (state.access === "paid-workshop") {
      return ["paid", "workshop", "freemium"].includes(resource.accessKey);
    }
    return true;
  }

  function filteredResources() {
    const terms = state.query.toLowerCase().split(/\s+/).filter(Boolean);
    return resources.filter((resource) => {
      if (state.topic && !resource.topics.has(state.topic)) return false;
      if (state.source !== "all" && resource.source !== state.source) return false;
      if (state.type !== "all" && resource.type !== state.type) return false;
      if (!matchesGrade(resource) || !matchesAccess(resource)) return false;
      return terms.every((term) => resource.searchText.includes(term));
    });
  }

  function makeElement(tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content !== undefined) element.textContent = content;
    return element;
  }

  function makeCard(resource) {
    const card = makeElement("article", "finder-card");
    card.dataset.resourceId = resource.id;
    card.append(makeElement("div", "finder-card-source", resource.sourceLabel));
    card.append(makeElement("h3", "", resource.title));
    card.append(makeElement("p", "finder-card-description", firstSentence(resource.description)));

    const meta = makeElement("div", "finder-card-meta");
    meta.append(makeElement("span", "", `Grades: ${resource.gradeBands.join(", ") || "See publisher"}`));
    meta.append(makeElement("span", "", `Access: ${resource.accessLabel}`));
    meta.append(makeElement("span", "", `Source: ${resource.publisher}`));
    card.append(meta);

    if (resource.note) card.append(makeElement("p", "finder-card-note", resource.note));

    const link = makeElement("a", "", "Open Resource");
    link.href = resource.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `Open ${resource.title} from ${resource.publisher}`);
    card.append(link);
    return card;
  }

  function fillGrid(grid, items) {
    grid.replaceChildren(...items.map(makeCard));
  }

  function recommendedFor(topic, matches) {
    const ids = RECOMMENDED_IDS[topic] || [];
    const byResourceId = new Map(matches.map((resource) => [resource.id, resource]));
    return ids.map((id) => byResourceId.get(id)).filter(Boolean).slice(0, 3);
  }

  function hasRefinements() {
    return Boolean(state.query || state.grades.size || state.source !== "all" || state.access !== "all" || state.type !== "all");
  }

  function render() {
    const matches = filteredResources();
    const recommendedSection = byId("finderRecommended");
    const resultsSection = byId("finderResults");
    const empty = byId("finderEmpty");
    const showFullResults = state.expanded || hasRefinements() || !state.topic;

    document.querySelectorAll(".finder-topic").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.topic === state.topic));
    });
    document.querySelectorAll(".finder-grade").forEach((button) => {
      button.setAttribute("aria-pressed", String(state.grades.has(button.dataset.grade)));
    });

    if (state.topic && !showFullResults) {
      const recommended = recommendedFor(state.topic, matches);
      byId("finderRecommendedTitle").textContent = `Start with ${TOPICS[state.topic]}`;
      byId("finderRecommendedContext").textContent = "Three practical starting points from the existing catalogs.";
      fillGrid(byId("finderRecommendedGrid"), recommended);
      recommendedSection.hidden = recommended.length === 0;
    } else {
      recommendedSection.hidden = true;
    }

    resultsSection.hidden = !showFullResults;
    empty.hidden = matches.length > 0 || !showFullResults;
    if (showFullResults) {
      byId("finderResultCount").textContent = `${matches.length} ${matches.length === 1 ? "resource" : "resources"}`;
      fillGrid(byId("finderResultGrid"), matches);
    } else {
      byId("finderResultGrid").replaceChildren();
    }

    const browseButton = byId("finderBrowse");
    browseButton.hidden = showFullResults;
    browseButton.textContent = `Browse all ${matches.length} matching resources`;
    byId("finderReset").hidden = !hasRefinements() && state.topic === "steels" && !state.expanded;

    const topicText = state.topic ? TOPICS[state.topic] : "All topics";
    byId("finderActiveSummary").textContent = hasRefinements()
      ? `Showing ${topicText.toLowerCase()} with your selected filters.`
      : `Showing ${topicText.toLowerCase()}.`;
  }

  function populateTypeOptions() {
    const select = byId("finderType");
    const types = [...new Set(resources.map((resource) => resource.type))].sort((a, b) => a.localeCompare(b));
    types.forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type.replace(/-/g, " ");
      select.append(option);
    });
  }

  function reset() {
    state.query = "";
    state.topic = "steels";
    state.topicExplicit = false;
    state.grades.clear();
    state.source = "all";
    state.access = "all";
    state.type = "all";
    state.expanded = false;
    byId("resourceSearch").value = "";
    byId("finderSource").value = "all";
    byId("finderAccess").value = "all";
    byId("finderType").value = "all";
    render();
  }

  function applyTopicFromUrl() {
    const topic = new URLSearchParams(window.location.search).get("topic");
    if (topic && TOPICS[topic]) {
      state.topic = topic;
      state.topicExplicit = true;
    }
  }

  function bindEvents() {
    byId("resourceSearch").addEventListener("input", (event) => {
      state.query = event.target.value.trim();
      if (state.query && !state.topicExplicit) state.topic = null;
      state.expanded = Boolean(state.query);
      render();
    });

    document.querySelectorAll(".finder-topic").forEach((button) => {
      button.addEventListener("click", () => {
        state.topic = button.dataset.topic;
        state.topicExplicit = true;
        state.query = "";
        state.expanded = false;
        byId("resourceSearch").value = "";
        render();
      });
    });

    document.querySelectorAll(".finder-grade").forEach((button) => {
      button.addEventListener("click", () => {
        const grade = button.dataset.grade;
        if (state.grades.has(grade)) state.grades.delete(grade);
        else state.grades.add(grade);
        state.expanded = true;
        render();
      });
    });

    byId("finderSource").addEventListener("change", (event) => {
      state.source = event.target.value;
      state.expanded = true;
      render();
    });
    byId("finderAccess").addEventListener("change", (event) => {
      state.access = event.target.value;
      state.expanded = true;
      render();
    });
    byId("finderType").addEventListener("change", (event) => {
      state.type = event.target.value;
      state.expanded = true;
      render();
    });

    byId("finderBrowse").addEventListener("click", () => {
      state.expanded = true;
      render();
      byId("finderResults").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    byId("finderReset").addEventListener("click", reset);
    byId("finderEmptyReset").addEventListener("click", reset);
  }

  function init() {
    const errors = loadResources();
    if (errors.length) {
      byId("finderApp").hidden = true;
      byId("finderError").hidden = false;
      byId("finderErrorMessage").textContent = errors.join(" ");
      return;
    }

    populateTypeOptions();
    applyTopicFromUrl();
    bindEvents();
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
}());
