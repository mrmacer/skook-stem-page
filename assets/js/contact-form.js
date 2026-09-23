document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  const interestSelect = form.querySelector("#interest-type");
  const status = form.querySelector("#form-status");
  const submitButton = form.querySelector('button[type="submit"]');
  const recognizedInterests = new Set(
    Array.from(interestSelect.options)
      .map((option) => option.value)
      .filter(Boolean),
  );

  const requestedInterest = new URLSearchParams(window.location.search).get(
    "interest",
  );
  if (requestedInterest && recognizedInterests.has(requestedInterest)) {
    interestSelect.value = requestedInterest;
  }

  let submissionInProgress = false;

  function showStatus(kind, message) {
    status.className = `form-status ${kind}`;
    status.textContent = message;
    if (kind === "error") {
      status.append(" ");
      const fallbackLink = document.createElement("a");
      fallbackLink.href = "mailto:maceg@iu29.org";
      fallbackLink.textContent = "Email maceg@iu29.org instead.";
      status.append(fallbackLink);
    }
    status.hidden = false;
    status.focus();
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submissionInProgress || !form.reportValidity()) return;

    submissionInProgress = true;
    submitButton.disabled = true;
    submitButton.dataset.defaultLabel = submitButton.textContent;
    submitButton.textContent = "Sending…";
    status.hidden = true;

    const data = Object.fromEntries(new FormData(form).entries());
    data.submission_id =
      window.crypto && typeof window.crypto.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "We could not send your request.");
      }

      form.reset();
      if (requestedInterest && recognizedInterests.has(requestedInterest)) {
        interestSelect.value = requestedInterest;
      }
      showStatus(
        "success",
        "Thanks — your request has been received. Expect a response within one business day.",
      );
      submitButton.textContent = "Message Sent ✓";
      return;
    } catch (error) {
      showStatus(
        "error",
        error.message || "We could not send your request.",
      );
      submitButton.disabled = false;
      submitButton.textContent = submitButton.dataset.defaultLabel;
      submissionInProgress = false;
    }
  });
});
