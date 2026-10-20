/* Shared event rendering and filtering. Loaded after js/events-data.js. */
(function () {
  "use strict";

  const events = Array.isArray(window.STEM_EVENTS) ? window.STEM_EVENTS : [];
  const SITE_TIME_ZONE = "America/New_York";
  const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: SITE_TIME_ZONE });
  const longDateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: SITE_TIME_ZONE
  });
  const monthYearFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: SITE_TIME_ZONE
  });
  const categoryDescriptions = {
    "student-events": "Hands-on summer experiences where students build, create, design, code, and explore real STEM tools and technologies.",
    "professional-learning": "Full-day professional learning experiences designed to help educators bring creativity, STEM, engineering, and AI into meaningful classroom practice.",
    "community-events": "Listening sessions, ecosystem gatherings, and partnership events open to local employers, community organizations, and nonprofits across Schuylkill County.",
    "competitions": "STEM competitions give students real-world challenges to apply creativity, engineering, collaboration, and problem-solving in high-energy environments."
  };

  function parseDate(value) {
    if (!value) return null;
    if (/^\d{4}-\d{2}$/.test(value)) return new Date(`${value}-15T12:00:00Z`);
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(`${value}T12:00:00Z`);
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  function siteDateKey(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: SITE_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
  }

  function isUpcoming(event, now = new Date()) {
    if (event.status !== "scheduled") return false;
    if (event.dateStatus !== "confirmed") return false;
    const start = parseDate(event.startDate);
    if (!start) return false;
    const today = siteDateKey(now);
    if (event.datePrecision === "month") return event.startDate >= today.slice(0, 7);
    if (/^\d{4}-\d{2}-\d{2}$/.test(event.startDate)) {
      const finalDate = /^\d{4}-\d{2}-\d{2}$/.test(event.endDate || "") ? event.endDate : event.startDate;
      return finalDate >= today;
    }
    const end = parseDate(event.endDate) || start;
    return end.getTime() >= now.getTime();
  }

  function isPast(event, now = new Date()) {
    const hasConfirmedDate = event.dateStatus === "confirmed";
    return event.status === "scheduled" && hasConfirmedDate && Boolean(parseDate(event.startDate)) && !isUpcoming(event, now);
  }

  function sortEvents(list) {
    return [...list].sort((a, b) => {
      const aDate = parseDate(a.startDate);
      const bDate = parseDate(b.startDate);
      return (aDate ? aDate.getTime() : Number.MAX_SAFE_INTEGER) - (bDate ? bDate.getTime() : Number.MAX_SAFE_INTEGER);
    });
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[char]));
  }

  function formatDate(event) {
    const date = parseDate(event.startDate);
    if (!date) return event.dateStatus === "tbd" ? "Date TBD" : "Date to be announced";
    if (event.datePrecision === "month") return monthYearFormatter.format(date);
    const endDate = parseDate(event.endDate);
    if (!endDate || endDate.toDateString() === date.toDateString()) return longDateFormatter.format(date);
    if (endDate.getFullYear() === date.getFullYear() && endDate.getMonth() === date.getMonth()) {
      return `${monthFormatter.format(date)} ${date.getDate()}–${endDate.getDate()}, ${date.getFullYear()}`;
    }
    return `${longDateFormatter.format(date)}–${longDateFormatter.format(endDate)}`;
  }

  function formatDateBox(event) {
    const date = parseDate(event.startDate);
    if (!date) return { month: "TBD", day: "" };
    if (event.datePrecision === "month") return { month: monthFormatter.format(date), day: `'${String(date.getFullYear()).slice(-2)}` };
    return { month: monthFormatter.format(date), day: String(date.getDate()) };
  }

  function formatTime(event) {
    if (event.allDay) return "All Day";
    if (event.sessionBlocks) return "";
    if (!event.startTime) return "Time to be announced";
    return event.endTime ? `${event.startTime}–${event.endTime}` : event.startTime;
  }

  function formatLocation(event) {
    if (!event.location) return "";
    if (event.locationStatus === "tentative" && event.locationNote) {
      return `${event.location} (${event.locationNote}; tentative)`;
    }
    return event.location;
  }

  function getEvents({ upcomingOnly = true, pastOnly = false, ecosystemOnly = false, limit = 0 } = {}) {
    let list = events.filter(event => !ecosystemOnly || event.ecosystemRelevant);
    if (pastOnly) list = list.filter(event => isPast(event));
    else if (upcomingOnly) list = list.filter(event => isUpcoming(event));
    list = sortEvents(list);
    return limit > 0 ? list.slice(0, limit) : list;
  }

  function eventCard(event, featured = false, allowRegistration = true) {
    const box = formatDateBox(event);
    const locationLabel = event.location ? `📍 ${event.locationShort || formatLocation(event)}` : event.locationStatus === "tbd" ? "📍 Location TBD" : "";
    const timeLabel = event.allDay || (event.startTime && !event.sessionBlocks)
      ? `⏰ ${formatTime(event)}`
      : event.timeStatus === "tbd"
        ? "⏰ Time TBD"
        : "";
    const meta = [
      locationLabel,
      timeLabel,
      ...(event.opportunities || []).includes("judges") ? ["🤝 Judges needed"] : [],
      ...(event.audiences || []).map(audience => `🎓 ${audience}`)
    ].filter(Boolean);
    const sessionBlocks = (event.sessionBlocks || []).map(block => `<li><strong>${escapeHtml(block.label)}:</strong> ${escapeHtml(block.startTime)}–${escapeHtml(block.endTime)}</li>`).join("");
    const actions = [];
    const registrationIsConfirmedOpen = event.registrationStatus === "confirmed-open";
    if (allowRegistration && event.registrationUrl && registrationIsConfirmedOpen) actions.push(`<a class="btn btn-primary btn-sm" href="${escapeHtml(event.registrationUrl)}" target="_blank" rel="noopener noreferrer">Register</a>`);
    if (event.detailsUrl) actions.push(`<a class="btn btn-secondary btn-sm" href="${escapeHtml(event.detailsUrl)}">Details</a>`);
    const registrationNote = allowRegistration && event.registrationStatus === "unverified"
      ? '<p class="event-registration-note">Registration status has not been confirmed.</p>'
      : allowRegistration && event.registrationStatus === "closed"
        ? '<p class="event-registration-note">Registration is closed.</p>'
        : "";
    return `<article class="event-card${featured ? " event-card-featured" : ""}" data-event-id="${escapeHtml(event.id)}">
      <div class="event-date-box" aria-label="${escapeHtml(formatDate(event))}">
        <div class="event-date-month" aria-hidden="true">${escapeHtml(box.month)}</div>
        <div class="event-date-day" aria-hidden="true">${escapeHtml(box.day)}</div>
      </div>
      <div class="event-content">
        <div class="event-category">${escapeHtml(event.category)}</div>
        <h3 class="event-title">${escapeHtml(event.title)}</h3>
        <p class="event-meta"><span class="sr-only">Date: </span>${escapeHtml(formatDate(event))}${meta.length ? ` <span aria-hidden="true">·</span> ${meta.map(escapeHtml).join(" <span aria-hidden=\"true\">·</span> ")}` : ""}</p>
        ${sessionBlocks ? `<ul class="event-session-blocks" aria-label="Session times">${sessionBlocks}</ul>` : ""}
        ${event.description ? `<p class="event-description">${escapeHtml(event.description)}</p>` : ""}
        ${registrationNote}
        ${actions.length ? `<div class="event-card-actions">${actions.join("")}</div>` : ""}
      </div>
    </article>`;
  }

  function renderList(container) {
    const limit = Number(container.dataset.limit || 0);
    const ecosystemOnly = container.dataset.ecosystemOnly === "true";
    const includePast = container.dataset.includePast === "true";
    const list = getEvents({ upcomingOnly: !includePast, ecosystemOnly, limit });
    if (!list.length) {
      container.innerHTML = '<p class="event-empty">There are no upcoming events listed right now. Check back soon or <a href="connect.html#interest">start a conversation</a>.</p>';
      return;
    }
    container.innerHTML = list.map((event, index) => eventCard(event, index === 0 && container.dataset.featuredFirst === "true")).join("");
  }

  function renderEventPage(container) {
    const list = getEvents({ upcomingOnly: true });
    const groups = ["student-events", "professional-learning", "community-events", "competitions"];
    container.innerHTML = groups.map(groupId => {
      const groupEvents = list.filter(event => event.categoryGroup === groupId);
      if (!groupEvents.length) return "";
      const title = groupId === "student-events" ? "Summer Camps" : groupId === "professional-learning" ? "Professional Learning" : groupId === "community-events" ? "Community Events" : "Competitions";
      return `<section class="event-page-group" id="${groupId}">
        <h3 class="event-page-group-title">${title}</h3>
        <p>${categoryDescriptions[groupId]}</p>
        <div class="events-grid">${groupEvents.map(event => eventCard(event)).join("")}</div>
      </section>`;
    }).join("");
    if (!container.innerHTML.trim()) container.innerHTML = '<p class="event-empty">There are no events listed right now.</p>';
  }

  function renderPastEvents(container) {
    const list = getEvents({ upcomingOnly: false, pastOnly: true }).reverse();
    if (!list.length) {
      container.innerHTML = '<p class="event-empty">No past events are listed.</p>';
      return;
    }
    container.innerHTML = list.map(event => eventCard(event, false, false)).join("");
  }

  function addSchema() {
    const visible = getEvents({ upcomingOnly: true });
    if (!visible.length || document.querySelector('script[data-stem-event-schema]')) return;
    const graph = visible.filter(event => {
      const startDate = typeof event.startDate === "string" ? event.startDate : "";
      return /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(startDate) && parseDate(startDate);
    }).map(event => {
      const item = {
        "@type": event.categoryGroup === "professional-learning" ? "EducationEvent" : "Event",
        name: event.title,
        description: event.description,
        eventStatus: "https://schema.org/EventScheduled",
        organizer: { "@type": "EducationalOrganization", name: "STEM@Skook29" },
        url: new URL(event.detailsUrl || "events.html", window.location.href).href
      };
      if (event.startDate && event.datePrecision !== "month") item.startDate = event.startDate;
      if (event.endDate && event.datePrecision !== "month") item.endDate = event.endDate;
      if (event.location) item.location = { "@type": "Place", name: event.location };
      return item;
    });
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.stemEventSchema = "true";
    script.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
    document.head.appendChild(script);
  }

  window.STEMEventTools = { events, getEvents, isUpcoming, isPast, parseDate, renderList };
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-event-page]").forEach(renderEventPage);
    document.querySelectorAll("[data-past-events]").forEach(renderPastEvents);
    document.querySelectorAll("[data-event-list]").forEach(renderList);
    addSchema();
  });
})();
