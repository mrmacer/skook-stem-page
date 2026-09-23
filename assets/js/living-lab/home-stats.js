// Live regional totals for the Living Lab landing page (and reused by the
// homepage promo band -- see assets/js/living-lab/homepage-promo.js).
// No fake numbers: every value comes straight from Supabase, and every
// element starts as an em dash until real data resolves.
document.addEventListener("DOMContentLoaded", async () => {
  const schoolsEl = document.getElementById("ll-stat-schools");
  const obsEl = document.getElementById("ll-stat-observations");
  const speciesEl = document.getElementById("ll-stat-species");
  const invEl = document.getElementById("ll-stat-investigations");
  if (!schoolsEl) return;

  try {
    const [schools, observations, investigations] = await Promise.all([
      window.LivingLab.restGet("living_lab_schools", "select=id&active=eq.true"),
      window.LivingLab.restGet(
        "living_lab_observations",
        "select=species_common_name,species_scientific_name&status=eq.approved",
      ),
      window.LivingLab.restGet("living_lab_investigations", "select=id"),
    ]);

    const speciesSet = new Set(
      observations
        .map((o) => o.species_scientific_name || o.species_common_name)
        .filter(Boolean),
    );

    schoolsEl.textContent = schools.length.toLocaleString();
    obsEl.textContent = observations.length.toLocaleString();
    speciesEl.textContent = speciesSet.size.toLocaleString();
    invEl.textContent = investigations.length.toLocaleString();
  } catch (error) {
    console.error(error);
    [schoolsEl, obsEl, speciesEl, invEl].forEach((el) => {
      if (el) el.textContent = "—";
    });
  }
});
