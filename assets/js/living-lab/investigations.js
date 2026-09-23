const STATUS_LABELS = {
  question: "Question",
  collecting_data: "Collecting Data",
  analyzing: "Analyzing",
  taking_action: "Taking Action",
  completed: "Completed",
};

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

async function renderInvestigations() {
  const list = document.getElementById("ll-investigations-list");
  const empty = document.getElementById("ll-investigations-empty");
  if (!list) return;

  try {
    const investigations = await window.LivingLab.restGet(
      "living_lab_investigations",
      "select=*,living_lab_schools(school_name,district_name)&order=created_at.desc&limit=60",
    );

    if (!investigations.length) {
      empty.style.display = "block";
      return;
    }

    list.innerHTML = investigations
      .map((inv) => {
        const school = inv.living_lab_schools;
        const statusClass = `ll-status-${escapeHtml(inv.status)}`;
        const replicateHref = `living-lab-investigations.html?replicate=${encodeURIComponent(inv.id)}&title=${encodeURIComponent(inv.title)}#start-investigation`;
        return `
          <div class="card fade-in"><div class="card-body">
            <span class="ll-status ${statusClass}">${escapeHtml(STATUS_LABELS[inv.status] || inv.status)}</span>
            <h3 class="card-title" style="margin-top:10px;">${escapeHtml(inv.title)}</h3>
            <p class="card-text">${escapeHtml(inv.driving_question)}</p>
            <p style="font-size:0.8125rem; color:var(--gray-500); margin-bottom:14px;">
              ${school ? escapeHtml(school.school_name) : "Unknown school"} &middot; Grade ${escapeHtml(inv.grade_band)}
            </p>
            <a href="${replicateHref}" class="btn btn-secondary btn-sm">Investigate This Too</a>
          </div></div>
        `;
      })
      .join("");
  } catch (error) {
    console.error(error);
    empty.style.display = "block";
    empty.querySelector(".ll-empty-text").textContent =
      "We couldn't load investigations right now. Please try again shortly.";
  }
}

async function setupForm() {
  const form = document.getElementById("ll-investigation-form");
  if (!form) return;

  const schoolSelect = document.getElementById("ll-inv-school");
  const status = document.getElementById("ll-inv-form-status");
  const submitButton = form.querySelector('button[type="submit"]');

  await window.LivingLab.populateSchoolSelect(schoolSelect);

  // Pre-fill from an "Investigate This Too" link.
  const params = new URLSearchParams(window.location.search);
  const replicateTitle = params.get("title");
  if (replicateTitle) {
    const descriptionEl = document.getElementById("ll-inv-description");
    descriptionEl.value = `Replicating the protocol from: "${replicateTitle}"`;
  }

  let submitting = false;

  function showStatus(kind, message) {
    status.className = `form-status ${kind}`;
    status.textContent = message;
    status.hidden = false;
    status.focus();
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting || !form.reportValidity()) return;

    submitting = true;
    submitButton.disabled = true;
    submitButton.dataset.defaultLabel = submitButton.textContent;
    submitButton.textContent = "Posting…";
    status.hidden = true;

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        throw new Error(result.message || "We could not save your investigation.");
      }

      form.reset();
      showStatus("success", result.message || "Investigation posted!");
      submitButton.textContent = "Posted ✓";
      renderInvestigations();
      return;
    } catch (error) {
      showStatus("error", error.message || "We could not save your investigation.");
      submitButton.disabled = false;
      submitButton.textContent = submitButton.dataset.defaultLabel;
      submitting = false;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderInvestigations();
  setupForm();
});
