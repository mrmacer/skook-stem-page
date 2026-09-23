// Schuylkill Living Lab -- observation submission.
// Mirrors api/contact.js's style: Web-standard Edge fetch handler, no npm
// dependencies. Writes go through the Supabase REST (PostgREST) API using
// the service-role key, which never reaches the browser. Every submission
// lands with status='pending' -- nothing appears on the public
// dashboard/map until a moderator flips it to 'approved' directly in
// Supabase (see docs/living-lab/README.md for the moderation workflow).
//
// No student names, emails, or other individual-identifying fields are
// accepted here by design -- the schema only has room for
// school + site + grade band + observation.

const GRADE_BANDS = new Set(["K-2", "3-5", "6-8", "9-12", "Mixed/Other"]);
const CATEGORIES = new Set([
  "Bird",
  "Plant",
  "Insect",
  "Mammal",
  "Amphibian/Reptile",
  "Fungi",
  "Aquatic Life",
  "Other",
]);
const ID_TOOLS = new Set([
  "Merlin",
  "Seek",
  "eBird",
  "iNaturalist",
  "Field Guide",
  "Expert Identification",
  "Other",
]);
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const URL_PATTERN = /^https?:\/\/\S+$/;

function json(data, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

function clean(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function cleanNumber(value, { min, max } = {}) {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return undefined; // signals "invalid" vs "absent"
  if (min !== undefined && n < min) return undefined;
  if (max !== undefined && n > max) return undefined;
  return n;
}

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return json({ ok: false, message: "Method not allowed." }, 405);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, message: "Invalid request." }, 400);
    }

    // Honeypot: silently accept, do not write.
    if (clean(body.website, 200)) {
      return json({ ok: true });
    }

    const schoolId = clean(body.school_id, 60);
    const siteId = clean(body.site_id, 60) || null;
    const gradeBand = clean(body.grade_band, 20);
    const observationDate = clean(body.observation_date, 10);
    const category = clean(body.category, 30);
    const speciesCommonName = clean(body.species_common_name, 160) || null;
    const speciesScientificName = clean(body.species_scientific_name, 160) || null;
    const habitatType = clean(body.habitat_type, 60) || null;
    const identificationTool = clean(body.identification_tool, 40) || null;
    const notes = clean(body.notes, 2000) || null;
    const studentQuestion = clean(body.student_question, 1000) || null;
    const externalUrl = clean(body.external_url, 500) || null;
    const imageUrl = clean(body.image_url, 500) || null;

    const count = cleanNumber(body.count, { min: 0, max: 100000 });
    const latitude = cleanNumber(body.latitude, { min: -90, max: 90 });
    const longitude = cleanNumber(body.longitude, { min: -180, max: 180 });

    const errors = [];
    if (!schoolId) errors.push("School is required.");
    if (!GRADE_BANDS.has(gradeBand)) errors.push("Please select a valid grade band.");
    if (!DATE_PATTERN.test(observationDate)) errors.push("Please provide a valid observation date.");
    if (!CATEGORIES.has(category)) errors.push("Please select a valid observation category.");
    if (identificationTool && !ID_TOOLS.has(identificationTool)) {
      errors.push("Please select a valid identification tool.");
    }
    if (count === undefined) errors.push("Count must be a non-negative number.");
    if (latitude === undefined) errors.push("Latitude looks out of range.");
    if (longitude === undefined) errors.push("Longitude looks out of range.");
    if (externalUrl && !URL_PATTERN.test(externalUrl)) errors.push("External URL must be a valid http(s) link.");
    if (imageUrl && !URL_PATTERN.test(imageUrl)) errors.push("Image URL must be a valid http(s) link.");

    if (errors.length) {
      return json({ ok: false, message: errors[0] }, 400);
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      console.error("Living Lab: Supabase service credentials not configured.");
      return json(
        { ok: false, message: "Observation submission is temporarily unavailable. Please try again later." },
        503,
      );
    }

    const record = {
      school_id: schoolId,
      site_id: siteId,
      grade_band: gradeBand,
      observation_date: observationDate,
      category,
      species_common_name: speciesCommonName,
      species_scientific_name: speciesScientificName,
      count,
      habitat_type: habitatType,
      identification_tool: identificationTool,
      notes,
      student_question: studentQuestion,
      external_url: externalUrl,
      image_url: imageUrl,
      latitude,
      longitude,
      source: "living_lab",
      status: "pending",
    };

    let response;
    try {
      response = await fetch(`${supabaseUrl}/rest/v1/living_lab_observations`, {
        method: "POST",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(record),
      });
    } catch (error) {
      console.error("Living Lab: observation insert request failed.", error);
      return json({ ok: false, message: "We could not save your observation. Please try again." }, 502);
    }

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("Living Lab: observation insert rejected.", response.status, detail);
      return json({ ok: false, message: "We could not save your observation. Please check your entries and try again." }, 502);
    }

    return json({
      ok: true,
      message: "Thanks! Your observation was submitted and will appear publicly once a moderator reviews it.",
    });
  },
};
