import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const contact = readFileSync(
  new URL("../components/contact/contact.html", import.meta.url),
  "utf8"
);
const utils = readFileSync(
  new URL("../components/contact/utils.js", import.meta.url),
  "utf8"
);

test("contact markup has the required form and status regions", () => {
  for (const id of [
    "contact-links",
    "contact-form",
    "form-error-summary",
    "contact-status",
    "message-me-btn",
  ]) {
    assert.match(contact, new RegExp(`id="${id}"`));
  }

  for (const inputId of ["name", "email", "subject", "message"]) {
    assert.match(contact, new RegExp(`id="${inputId}"`));
    assert.match(contact, new RegExp(`aria-describedby="${inputId}-error"`));
    assert.match(contact, new RegExp(`<label for="${inputId}">`));
  }
});

test("contact markup has an accessible error summary and status region", () => {
  assert.match(contact, /id="form-error-summary"[^>]*tabindex="-1"/);
  assert.match(contact, /id="contact-status"[^>]*role="status"/);
});

test("contact markup removes placeholders and hardcoded social links", () => {
  assert.doesNotMatch(contact, /placeholder=/);
  assert.doesNotMatch(contact, /linkedin\.com|github\.com|whatsapp|@gmail/);
});

test("contact utils provide status and submit button helpers", () => {
  assert.match(utils, /setContactStatus/);
  assert.match(utils, /setSubmitButtonState/);
});
