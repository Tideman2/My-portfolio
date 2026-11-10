import fetchHtmlFrag from "../../js/fetch-html-frag.js";
import { getSocials, sendContactMessage } from "../../js/api.js";
import { fallbackContent } from "../../js/fallback-data.js";
import { platformIcon, validateContactForm } from "../../js/ui.js";
import { setContactStatus, setSubmitButtonState } from "./utils.js";

const FIELD_DEFINITIONS = [
  { name: "name", label: "Name", errorId: "name-error", type: "text" },
  { name: "email", label: "Email", errorId: "email-error", type: "email" },
  { name: "subject", label: "Subject", errorId: "subject-error", type: "text" },
  {
    name: "message",
    label: "Message",
    errorId: "message-error",
    type: "textarea",
  },
];

const FIELD_LABELS = Object.fromEntries(
  FIELD_DEFINITIONS.map((field) => [field.name, field.label]),
);

function faIconFor(name) {
  const key = platformIcon(name);
  if (key === "linkedin") return "fab fa-linkedin";
  if (key === "github") return "fab fa-github";
  if (key === "whatsapp") return "fab fa-whatsapp";
  if (key === "email") return "fas fa-envelope";
  return "fas fa-link";
}

function renderSocials(socials) {
  const container = document.querySelector("#contact-links");
  const list = container?.querySelector("ul");
  if (!container || !list) return;

  list.replaceChildren();
  const source =
    Array.isArray(socials) && socials.length
      ? socials
      : fallbackContent.socials;
  const items = Array.isArray(source) ? source : [];

  for (const social of items) {
    const url = String(social?.url ?? "").trim();
    if (!url) continue;

    const label =
      String(social?.platform_name ?? "Contact").trim() || "Contact";
    const item = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.setAttribute("aria-label", label);
    if (/^https?:/i.test(url)) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }

    const icon = document.createElement("i");
    icon.className = faIconFor(label);
    icon.setAttribute("aria-hidden", "true");
    anchor.append(icon);
    item.append(anchor);
    item.style.width = "fit-content";
    list.append(item);
  }
}

async function loadSocials() {
  try {
    const socials = await getSocials();
    renderSocials(socials);
  } catch {
    renderSocials(fallbackContent.socials);
  }
}

function getFieldElement(fieldName) {
  return document.getElementById(fieldName);
}

function getErrorElement(fieldName) {
  return document.getElementById(`${fieldName}-error`);
}

function getFieldValue(fieldName) {
  const element = getFieldElement(fieldName);
  return element?.value ?? "";
}

function getValues() {
  const values = {};
  for (const field of FIELD_DEFINITIONS) {
    values[field.name] = getFieldValue(field.name);
  }
  return values;
}

function clearFieldError(fieldName) {
  const error = getErrorElement(fieldName);
  if (error) {
    error.textContent = "";
    error.hidden = true;
  }
  const input = getFieldElement(fieldName);
  if (input) input.setAttribute("aria-invalid", "false");
}

function showFieldError(fieldName, message) {
  const error = getErrorElement(fieldName);
  if (error) {
    error.textContent = message;
    error.hidden = false;
  }
  const input = getFieldElement(fieldName);
  if (input) input.setAttribute("aria-invalid", "true");
}

function validateField(fieldName) {
  const result = validateContactForm({ [fieldName]: getFieldValue(fieldName) });
  const input = getFieldElement(fieldName);
  if (result.valid) {
    clearFieldError(fieldName);
    if (input) input.setAttribute("aria-invalid", "false");
    return true;
  }
  showFieldError(fieldName, result.errors[fieldName]);
  return false;
}

function validateAll() {
  const values = getValues();
  const result = validateContactForm(values);
  const invalidFields = Object.keys(result.errors);

  for (const field of FIELD_DEFINITIONS) {
    const valid = validateContactForm({ [field.name]: values[field.name] });
    if (valid) clearFieldError(field.name);
    else showFieldError(field.name, valid.errors[field.name]);
  }

  return { result, invalidFields };
}

function hideErrorSummary() {
  const summary = document.querySelector("#form-error-summary");
  if (summary) summary.hidden = true;
}

function buildErrorSummary(invalidFields) {
  const summary = document.querySelector("#form-error-summary");
  if (!summary) return;

  const list = summary.querySelector(".error-summary-links");
  if (list) list.replaceChildren();

  const links = summary.querySelector(".error-summary-links");
  if (links) {
    for (const fieldName of invalidFields) {
      const link = document.createElement("a");
      link.href = `#${fieldName}`;
      link.textContent = FIELD_LABELS[fieldName] ?? fieldName;
      links.append(link);
    }
  }

  summary.hidden = false;
  summary.focus();
}

function clearErrors() {
  for (const field of FIELD_DEFINITIONS) clearFieldError(field.name);
  hideErrorSummary();
}

function getForm() {
  return document.querySelector("#contact-form");
}

function getSubmitButton() {
  return document.querySelector("#message-me-btn");
}

async function sendMessage(values) {
  const submitButton = getSubmitButton();
  const form = getForm();

  setSubmitButtonState(submitButton, true, "Sending…");
  setContactStatus("Sending…", "info");

  try {
    await sendContactMessage(values);
    if (form) form.reset();
    clearErrors();
    setContactStatus("Message sent successfully", "success");
    setSubmitButtonState(submitButton, false);
    return true;
  } catch {
    setSubmitButtonState(submitButton, false);
    setContactStatus(
      "We couldn’t confirm the message was sent — wait a moment before retrying.",
      "error",
    );
    return false;
  }
}

async function handleSubmit(event) {
  event.preventDefault();

  const { result, invalidFields } = validateAll();
  const submitButton = getSubmitButton();

  if (!result.valid) {
    for (const fieldName of invalidFields) {
      validateField(fieldName);
    }
    buildErrorSummary(invalidFields);
    if (submitButton) setSubmitButtonState(submitButton, false);
    return;
  }

  const values = getValues();
  await sendMessage(values);
}

function initForm() {
  const form = getForm();
  if (!form) return;

  form.addEventListener("submit", handleSubmit);

  for (const field of FIELD_DEFINITIONS) {
    const element = document.getElementById(field.name);
    if (element) {
      element.addEventListener("blur", () => validateField(field.name));
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const loaded = await fetchHtmlFrag(
    "components/contact/contact.html",
    "#contact-place",
    null,
  );

  if (!loaded) return;

  renderSocials(fallbackContent.socials);
  await loadSocials();
  initForm();
});
