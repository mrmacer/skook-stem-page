const ROLE_LABELS = {
  student: "Student",
  teacher: "Teacher / Educator",
  administrator: "Administrator",
  community: "Community Partner",
  business: "Business / Industry",
  parent: "Parent / Family",
  other: "Other",
};

const INTEREST_LABELS = {
  competitions: "Competitions",
  make: "Make@Skook29 / Makerspace",
  cso: "Chief Science Officers",
  steels: "STEELS Support",
  edtech: "EdTech & AI",
  "ai-resource-suggestion": "Suggest an AI / EdTech Resource",
  "ai-resource-update": "Report Outdated AI / EdTech Information",
  "ai-tool-review": "Request District AI Tool Review Support",
  "ai-resource-request": "Request an IU29 Original AI Resource",
  "site-support": "Website Support",
  resources: "Classroom Resources",
  pd: "Professional Development",
  partnership: "Partnership / Sponsorship",
  "student-experience": "Offer a Student Experience",
  speaker: "Guest Speaking / Mentoring",
  materials: "Materials or Equipment Donation",
  "community-opportunity": "Submit a Community Opportunity",
  "listening-session": "Community Listening Session",
  events: "Events",
  general: "General Information",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(data, status = 200, extraHeaders = {}) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

function clean(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return json(
        { ok: false, message: "Method not allowed." },
        405,
        { Allow: "POST" },
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, message: "Invalid request." }, 400);
    }

    // Honeypot submissions receive a neutral response without sending email.
    if (clean(body.website, 200)) {
      return json({ ok: true });
    }

    const firstName = clean(body.first_name, 80);
    const lastName = clean(body.last_name, 80);
    const email = clean(body.email, 254).toLowerCase();
    const organization = clean(body.organization, 160);
    const role = clean(body.role, 40);
    const interest = clean(body.interest, 60);
    const message = clean(body.message, 5000);
    const submissionId = clean(body.submission_id, 100);

    if (
      !firstName ||
      !lastName ||
      !EMAIL_PATTERN.test(email) ||
      !ROLE_LABELS[role] ||
      !message
    ) {
      return json(
        { ok: false, message: "Please complete all required fields." },
        400,
      );
    }

    if (interest && !INTEREST_LABELS[interest]) {
      return json({ ok: false, message: "Please select a valid topic." }, 400);
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM_EMAIL;
    const to = process.env.CONTACT_TO_EMAIL || "maceg@iu29.org";

    if (!apiKey || !from) {
      console.error("Contact form email configuration is incomplete.");
      return json(
        {
          ok: false,
          message: "The form is temporarily unavailable. Please email us directly.",
        },
        503,
      );
    }

    const roleLabel = ROLE_LABELS[role];
    const interestLabel = INTEREST_LABELS[interest] || "Not specified";
    const subjectTopic = INTEREST_LABELS[interest] || "General inquiry";
    const text = [
      "New STEM@Skook29 website request",
      "",
      `Name: ${firstName} ${lastName}`,
      `Email: ${email}`,
      `School / Organization: ${organization || "Not provided"}`,
      `Role: ${roleLabel}`,
      `Interest: ${interestLabel}`,
      "",
      "Message:",
      message,
    ].join("\n");

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };

    if (submissionId) {
      headers["Idempotency-Key"] = `stem-skook-contact-${submissionId}`;
    }

    let emailResponse;
    try {
      emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers,
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: email,
          subject: `[STEM@Skook29] ${subjectTopic} — ${firstName} ${lastName}`,
          text,
        }),
      });
    } catch (error) {
      console.error("Contact form delivery request failed.", error);
      return json(
        {
          ok: false,
          message: "We could not send your request. Please email us directly.",
        },
        502,
      );
    }

    if (!emailResponse.ok) {
      console.error(
        "Contact form delivery was rejected.",
        emailResponse.status,
      );
      return json(
        {
          ok: false,
          message: "We could not send your request. Please email us directly.",
        },
        502,
      );
    }

    return json({ ok: true });
  },
};
