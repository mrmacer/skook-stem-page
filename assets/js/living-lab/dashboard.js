// Regional Dashboard -- all numbers computed client-side from approved
// Supabase rows. No hand-authored stats anywhere on this page.

function schoolYearStart(now) {
  // PA school years run roughly August -> June; anything from August
  // onward counts as "this school year", otherwise it's the previous
  // calendar year's August.
  const year = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  return new Date(year, 7, 1); // August 1
}

function renderBarChart(containerId, entries, { emptyText } = {}) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!entries.length) {
    const empty = document.createElement("p");
    empty.style.cssText = "color:var(--gray-400); font-size:0.875rem;";
    empty.textContent = emptyText || "No data yet.";
    el.replaceChildren(empty);
    return;
  }
  const max = Math.max(...entries.map((e) => e.value));
  const fragment = document.createDocumentFragment();

  entries.forEach((e) => {
    const row = document.createElement("div");
    row.className = "ll-bar-row";

    const label = document.createElement("span");
    label.className = "ll-bar-label";
    label.title = e.label;
    label.textContent = e.label;

    const track = document.createElement("span");
    track.className = "ll-bar-track";

    const fill = document.createElement("span");
    fill.className = "ll-bar-fill";
    fill.style.width = `${max ? (e.value / max) * 100 : 0}%`;
    track.append(fill);

    const value = document.createElement("span");
    value.className = "ll-bar-value";
    value.textContent = e.value;

    row.append(label, track, value);
    fragment.append(row);
  });

  el.replaceChildren(fragment);
}

function topEntries(counts, limit) {
  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

document.addEventListener("DOMContentLoaded", async () => {
  const emptyBlock = document.getElementById("ll-dash-empty");
  const chartsBlock = document.getElementById("ll-dash-charts");

  try {
    const [schools, observations, investigations] = await Promise.all([
      window.LivingLab.restGet("living_lab_schools", "select=id&active=eq.true"),
      window.LivingLab.restGet(
        "living_lab_observations",
        "select=category,habitat_type,species_common_name,species_scientific_name,grade_band,observation_date&status=eq.approved",
      ),
      window.LivingLab.restGet("living_lab_investigations", "select=id"),
    ]);

    document.getElementById("ll-dash-schools").textContent = schools.length.toLocaleString();
    document.getElementById("ll-dash-observations").textContent = observations.length.toLocaleString();
    document.getElementById("ll-dash-investigations").textContent = investigations.length.toLocaleString();

    const speciesSet = new Set(
      observations.map((o) => o.species_scientific_name || o.species_common_name).filter(Boolean),
    );
    document.getElementById("ll-dash-species").textContent = speciesSet.size.toLocaleString();

    if (!observations.length) {
      chartsBlock.style.display = "none";
      emptyBlock.style.display = "block";
      document.getElementById("ll-dash-year-count").textContent = "0";
      return;
    }

    const yearStart = schoolYearStart(new Date());
    const thisYear = observations.filter((o) => new Date(o.observation_date) >= yearStart);
    document.getElementById("ll-dash-year-count").textContent = thisYear.length.toLocaleString();

    const byCategory = new Map();
    const byHabitat = new Map();
    const bySpecies = new Map();
    const byGrade = new Map();
    const byMonth = new Map();

    observations.forEach((o) => {
      if (o.category) byCategory.set(o.category, (byCategory.get(o.category) || 0) + 1);
      if (o.habitat_type) byHabitat.set(o.habitat_type, (byHabitat.get(o.habitat_type) || 0) + 1);
      const species = o.species_common_name || o.species_scientific_name;
      if (species) bySpecies.set(species, (bySpecies.get(species) || 0) + 1);
      if (o.grade_band) byGrade.set(o.grade_band, (byGrade.get(o.grade_band) || 0) + 1);
    });

    thisYear.forEach((o) => {
      const d = new Date(o.observation_date);
      const key = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      byMonth.set(key, (byMonth.get(key) || 0) + 1);
    });

    renderBarChart("ll-chart-category", topEntries(byCategory, 8));
    renderBarChart("ll-chart-habitat", topEntries(byHabitat, 8), { emptyText: "No habitat data submitted yet." });
    renderBarChart("ll-chart-species", topEntries(bySpecies, 8), { emptyText: "No species identified yet." });
    renderBarChart(
      "ll-chart-grade",
      ["K-2", "3-5", "6-8", "9-12", "Mixed/Other"]
        .map((label) => ({ label, value: byGrade.get(label) || 0 }))
        .filter((e) => e.value > 0),
    );
    renderBarChart(
      "ll-chart-monthly",
      Array.from(byMonth.entries())
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => new Date(a.label) - new Date(b.label)),
      { emptyText: "No observations logged yet this school year." },
    );
  } catch (error) {
    console.error(error);
    chartsBlock.style.display = "none";
    emptyBlock.style.display = "block";
    emptyBlock.querySelector(".ll-empty-text").textContent =
      "We couldn't load the dashboard right now. Please try again shortly.";
  }
});
