import test from "node:test";
import assert from "node:assert/strict";
import {
  PROJECTS_PER_PAGE,
  proficiencyLabel,
  formatStack,
  platformKey,
  platformIcon,
  validateEmail,
  validateContactForm,
  paginate,
  splitBio,
  initials,
  prefersReducedMotion,
  revealOnScroll,
  needsReadMore,
} from "../js/ui.js";

test("proficiencyLabel describes the 1-5 level", () => {
  assert.equal(proficiencyLabel(4), "Proficiency 4 out of 5");
});

test("formatStack splits and trims comma-separated stacks", () => {
  assert.deepEqual(formatStack("Python, Flask, MySQL"), [
    "Python",
    "Flask",
    "MySQL",
  ]);
  assert.deepEqual(formatStack(null), []);
  assert.deepEqual(formatStack("  "), []);
});

test("platformIcon maps known platforms and falls back to a link", () => {
  assert.equal(platformKey("LinkedIn"), "linkedin");
  assert.equal(platformIcon("LinkedIn"), "linkedin");
  assert.equal(platformIcon("GitHub"), "github");
  assert.equal(platformIcon("WhatsApp"), "whatsapp");
  assert.equal(platformIcon("Gmail"), "email");
  assert.equal(platformIcon("BlueSky"), "link");
});

test("validateEmail accepts normal emails and rejects bad ones", () => {
  assert.equal(validateEmail("isaac@example.com"), true);
  assert.equal(validateEmail("not-an-email"), false);
  assert.equal(validateEmail(""), false);
});

test("validateContactForm reports all missing fields", () => {
  const result = validateContactForm({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  assert.equal(result.valid, false);
  assert.deepEqual(Object.keys(result.errors).sort(), [
    "email",
    "message",
    "name",
    "subject",
  ]);
});

test("validateContactForm rejects a malformed email", () => {
  const result = validateContactForm({
    name: "Isaac",
    email: "nope",
    subject: "Hello",
    message: "Hi",
  });
  assert.equal(result.valid, false);
  assert.match(result.errors.email, /valid email/i);
});

test("validateContactForm accepts a complete form", () => {
  const result = validateContactForm({
    name: "Isaac",
    email: "isaac@example.com",
    subject: "Hello",
    message: "Hi",
  });
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});

test("paginate returns six items and reports more pages", () => {
  assert.equal(PROJECTS_PER_PAGE, 6);
  const first = paginate([1, 2, 3, 4, 5, 6, 7], 1);
  assert.deepEqual(first.items, [1, 2, 3, 4, 5, 6]);
  assert.equal(first.page, 1);
  assert.equal(first.hasMore, true);

  const second = paginate([1, 2, 3, 4, 5, 6, 7], 2);
  assert.deepEqual(second.items, [7]);
  assert.equal(second.page, 2);
  assert.equal(second.hasMore, false);
});

test("splitBio splits on blank lines and handles null", () => {
  assert.deepEqual(splitBio("one\n\ntwo"), ["one", "two"]);
  assert.deepEqual(splitBio(null), []);
  assert.deepEqual(splitBio("single paragraph"), ["single paragraph"]);
});

test("initials takes the first letter of the first two names", () => {
  assert.equal(initials("Isaac Mark"), "IM");
  assert.equal(initials("  isaac  "), "I");
  assert.equal(initials(""), "");
});

test("prefersReducedMotion reads the media query", () => {
  assert.equal(prefersReducedMotion(() => ({ matches: true })), true);
  assert.equal(prefersReducedMotion(() => ({ matches: false })), false);
  assert.equal(prefersReducedMotion(null), false);
});

test("revealOnScroll shows everything when motion is reduced", () => {
  const classes = new Set();
  const element = { classList: { add: (name) => classes.add(name) } };
  revealOnScroll([element], { reducedMotion: true });
  assert.equal(classes.has("is-visible"), true);
});

test("needsReadMore flags goals longer than the clamped card", () => {
  assert.equal(needsReadMore("Short goal."), false);
  assert.equal(needsReadMore("x".repeat(150)), false);
  assert.equal(needsReadMore("x".repeat(151)), true);
  assert.equal(needsReadMore("  "), false);
  assert.equal(needsReadMore(null), false);
});
