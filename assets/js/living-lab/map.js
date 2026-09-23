// Regional Map -- Leaflet + OpenStreetMap tiles (no paid mapping
// dependency), with client-side filtering over already-approved
// observations pulled from Supabase.

function schoolYearStart(now) {
  const year = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  return new Date(year, 7, 1);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", async () => {
  const mapEl = document.getElementById("ll-map");
  const emptyEl = document.getElementById("ll-map-empty");
  if (!mapEl || typeof L === "undefined") return;

  const categoryFilter = document.getElementById("ll-filter-category");
  const gradeFilter = document.getElementById("ll-filter-grade");
  const timeFilter = document.getElementById("ll-filter-time");

  // Centered roughly on Schuylkill County, PA.
  const map = L.map(mapEl).setView([40.69, -76.18], 10);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  let schools = [];
  let sites = [];
  let observations = [];
  let investigationCountBySchool = new Map();
  let markers = [];

  try {
    const [schoolRows, siteRows, obsRows, invRows] = await Promise.all([
      window.LivingLab.restGet("living_lab_schools", "select=*&active=eq.true"),
      window.LivingLab.restGet("living_lab_sites", "select=*&active=eq.true"),
      window.LivingLab.restGet(
        "living_lab_observations",
        "select=school_id,site_id,category,grade_band,species_common_name,species_scientific_name,observation_date&status=eq.approved",
      ),
      window.LivingLab.restGet("living_lab_investigations", "select=school_id"),
    ]);
    schools = schoolRows;
    sites = siteRows;
    observations = obsRows;
    invRows.forEach((inv) => {
      investigationCountBySchool.set(inv.school_id, (investigationCountBySchool.get(inv.school_id) || 0) + 1);
    });
  } catch (error) {
    console.error(error);
    emptyEl.style.display = "block";
    emptyEl.querySelector(".ll-empty-text").textContent =
      "We couldn't load the map right now. Please try again shortly.";
    return;
  }

  if (!schools.length) {
    emptyEl.style.display = "block";
    return;
  }

  function filteredObservations() {
    const category = categoryFilter.value;
    const grade = gradeFilter.value;
    const yearStart = timeFilter.value === "year" ? schoolYearStart(new Date()) : null;
    return observations.filter((o) => {
      if (category && o.category !== category) return false;
      if (grade && o.grade_band !== grade) return false;
      if (yearStart && new Date(o.observation_date) < yearStart) return false;
      return true;
    });
  }

  function schoolStats(schoolId, obsForFilter) {
    const schoolObs = obsForFilter.filter((o) => o.school_id === schoolId);
    const speciesSet = new Set(
      schoolObs.map((o) => o.species_scientific_name || o.species_common_name).filter(Boolean),
    );
    const lastDate = schoolObs
      .map((o) => o.observation_date)
      .sort()
      .pop();
    return {
      count: schoolObs.length,
      speciesCount: speciesSet.size,
      investigations: investigationCountBySchool.get(schoolId) || 0,
      lastDate,
    };
  }

  function draw() {
    markers.forEach((m) => map.removeLayer(m));
    markers = [];

    const obsForFilter = filteredObservations();
    const schoolById = new Map(schools.map((s) => [s.id, s]));

    // One marker per active site; schools without any active site get a
    // marker at the school's own coordinates instead.
    const schoolsWithSites = new Set(sites.map((s) => s.school_id));
    const points = [
      ...sites
        .filter((site) => site.latitude != null && site.longitude != null)
        .map((site) => ({ ...site, kind: "site" })),
      ...schools
        .filter((s) => !schoolsWithSites.has(s.id) && s.latitude != null && s.longitude != null)
        .map((s) => ({ ...s, kind: "school", school_id: s.id })),
    ];

    points.forEach((point) => {
      const school = schoolById.get(point.school_id);
      if (!school) return;
      const stats = schoolStats(school.id, obsForFilter);
      const marker = L.marker([point.latitude, point.longitude]).addTo(map);
      const siteLine =
        point.kind === "site"
          ? `<p>${escapeHtml(point.site_name)}${point.habitat_type ? ` &middot; ${escapeHtml(point.habitat_type)}` : ""}</p>`
          : "";
      marker.bindPopup(`
        <h4>${escapeHtml(school.school_name)}</h4>
        ${siteLine}
        <p>${stats.count} observation${stats.count === 1 ? "" : "s"}</p>
        <p>${stats.speciesCount} documented species</p>
        <p>${stats.investigations} investigation${stats.investigations === 1 ? "" : "s"}</p>
        <p>${stats.lastDate ? `Last observation: ${new Date(stats.lastDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}` : "No observations yet"}</p>
      `);
      markers.push(marker);
    });

    emptyEl.style.display = points.length ? "none" : "block";
  }

  [categoryFilter, gradeFilter, timeFilter].forEach((el) => el.addEventListener("change", draw));
  draw();
});
