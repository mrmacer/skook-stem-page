// Shared read-only Supabase (PostgREST) client for Living Lab pages.
// No @supabase/supabase-js dependency -- this site has no build step, so
// we talk to PostgREST directly with fetch(), same philosophy as
// assets/js/contact-form.js talking to /api/contact. The anon key this
// fetches from /api/config is safe to use in the browser: every table it
// can reach is behind RLS restricting it to already-public rows (see
// supabase/migrations/0001_living_lab_schema.sql).
window.LivingLab = window.LivingLab || {};

(function (LivingLab) {
  let configPromise = null;

  function getConfig() {
    if (!configPromise) {
      configPromise = fetch("/api/config")
        .then((res) => res.json())
        .then((data) => {
          if (!data.ok) throw new Error(data.message || "Living Lab data is not configured yet.");
          return data;
        });
    }
    return configPromise;
  }

  // Thin PostgREST GET wrapper. `query` is a raw querystring, e.g.
  // "select=*&status=eq.approved&order=observation_date.desc&limit=50".
  async function restGet(table, query = "") {
    const { supabaseUrl, supabaseAnonKey } = await getConfig();
    const url = `${supabaseUrl}/rest/v1/${table}${query ? `?${query}` : ""}`;
    const res = await fetch(url, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    });
    if (!res.ok) {
      throw new Error(`Living Lab: failed to load ${table} (${res.status}).`);
    }
    return res.json();
  }

  // Populates a <select> with active schools (id/name), sorted alphabetically.
  // Used by both submission forms and the map/dashboard filter bars.
  async function populateSchoolSelect(selectEl, { placeholder = "Select your school…" } = {}) {
    selectEl.innerHTML = `<option value="">${placeholder}</option>`;
    try {
      const schools = await restGet(
        "living_lab_schools",
        "select=id,school_name,district_name&active=eq.true&order=school_name.asc",
      );
      schools.forEach((school) => {
        const opt = document.createElement("option");
        opt.value = school.id;
        opt.textContent = `${school.school_name} (${school.district_name})`;
        selectEl.appendChild(opt);
      });
      return schools;
    } catch (error) {
      console.error(error);
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "Schools unavailable right now";
      selectEl.appendChild(opt);
      return [];
    }
  }

  // Populates a <select> with a school's active sites. Called after a
  // school is chosen so the site list only shows that school's locations.
  async function populateSiteSelect(selectEl, schoolId, { placeholder = "Select a site (optional)…" } = {}) {
    selectEl.innerHTML = `<option value="">${placeholder}</option>`;
    if (!schoolId) return [];
    try {
      const sites = await restGet(
        "living_lab_sites",
        `select=id,site_name,habitat_type&active=eq.true&school_id=eq.${schoolId}&order=site_name.asc`,
      );
      sites.forEach((site) => {
        const opt = document.createElement("option");
        opt.value = site.id;
        opt.textContent = site.habitat_type ? `${site.site_name} (${site.habitat_type})` : site.site_name;
        selectEl.appendChild(opt);
      });
      return sites;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  LivingLab.getConfig = getConfig;
  LivingLab.restGet = restGet;
  LivingLab.populateSchoolSelect = populateSchoolSelect;
  LivingLab.populateSiteSelect = populateSiteSelect;
})(window.LivingLab);
