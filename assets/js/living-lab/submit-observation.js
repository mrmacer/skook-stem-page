document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("ll-observation-form");
  if (!form) return;

  const schoolSelect = document.getElementById("ll-school");
  const siteSelect = document.getElementById("ll-site");
  const status = document.getElementById("ll-form-status");
  const submitButton = form.querySelector('button[type="submit"]');

  await window.LivingLab.populateSchoolSelect(schoolSelect);

  schoolSelect.addEventListener("change", async () => {
    siteSelect.disabled = true;
    siteSelect.innerHTML = '<option value="">Loading sites…</option>';
    if (!schoolSelect.value) {
      siteSelect.innerHTML = '<option value="">Choose a school first…</option>';
      return;
    }
    await window.LivingLab.populateSiteSelect(siteSelect, schoolSelect.value);
    siteSelect.disabled = false;
  });

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
    submitButton.textContent = "Submitting…";
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
        throw new Error(result.message || "We could not save your observation.");
      }

      form.reset();
      siteSelect.innerHTML = '<option value="">Choose a school first…</option>';
      siteSelect.disabled = true;
      showStatus(
        "success",
        result.message || "Thanks! Your observation was submitted for review.",
      );
      submitButton.textContent = "Submitted ✓";
      return;
    } catch (error) {
      showStatus("error", error.message || "We could not save your observation.");
      submitButton.disabled = false;
      submitButton.textContent = submitButton.dataset.defaultLabel;
      submitting = false;
    }
  });
});
