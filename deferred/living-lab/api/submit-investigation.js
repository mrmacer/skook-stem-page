// Deferred Living Lab source. Restore to api/submit-investigation.js before release.
// Schuylkill Living Lab -- investigation submission.
// Same architecture as api/submit-observation.js: server-side insert with
// the Supabase service-role key, no client-exposed credentials.
// Investigations are teacher-authored (not raw public submissions), so
// they're visible immediately (status defaults to 'question') rather than
// sitting in a moderation queue -- see the schema comments for why.

const GRADE_BANDS = new Set(["K-2", "3-5", "6-8", "9-12", "Mixed/Other"]);
const URL_PATTERN = /^https?:\/\/\S+$/;

function json(data, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

function clean(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
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

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return json({ ok: false, message: "Invalid request." }, 400);
    }

    if (clean(body.website, 200)) {
      return json({ ok: true });
    }

    const schoolId = clean(body.school_id, 60);
    const gradeBand = clean(body.grade_band, 20);
    const title = clean(body.title, 200);
    const drivingQuestion = clean(body.driving_question, 500);
    const description = clean(body.description, 3000) || null;
    const category = clean(body.category, 60) || null;
    const projectUrl = clean(body.project_url, 500) || null;

    const errors = [];
    if (!schoolId) errors.push("School is required.");
    if (!GRADE_BANDS.has(gradeBand)) errors.push("Please select a valid grade band.");
    if (!title) errors.push("Title is required.");
    if (!drivingQuestion) errors.push("A driving question is required.");
    if (projectUrl && !URL_PATTERN.test(projectUrl)) errors.push("Project URL must be a valid http(s) link.");

    if (errors.length) {
      return json({ ok: false, message: errors[0] }, 400);
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      console.error("Living Lab: Supabase service credentials not configured.");
      return json(
        { ok: false, message: "Investigation submission is temporarily unavailable. Please try again later." },
        503,
      );
    }

    const record = {
      school_id: schoolId,
      grade_band: gradeBand,
      title,
      driving_question: drivingQuestion,
      description,
      category,
      project_url: projectUrl,
      status: "question",
    };

    let response;
    try {
      response = await fetch(`${supabaseUrl}/rest/v1/living_lab_investigations`, {
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
      console.error("Living Lab: investigation insert request failed.", error);
      return json({ ok: false, message: "We could not save your investigation. Please try again." }, 502);
    }

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("Living Lab: investigation insert rejected.", response.status, detail);
      return json({ ok: false, message: "We could not save your investigation. Please check your entries and try again." }, 502);
    }

    return json({ ok: true, message: "Thanks! Your investigation is now live on the Living Lab." });
  },
};
