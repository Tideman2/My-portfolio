import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const skills = readFileSync(
  new URL("../components/skills/skills.html", import.meta.url),
  "utf8"
);
const template = readFileSync(
  new URL("../components/skills/skill-template.html", import.meta.url),
  "utf8"
);

test("skills fragment has both API containers and empty states", () => {
  for (const id of [
    "technical-skills",
    "professional-skills",
    "technical-empty",
    "professional-empty",
  ]) {
    assert.match(skills, new RegExp(`id="${id}"`));
  }
  assert.match(skills, /id="technical-empty"[^>]*hidden/);
  assert.match(skills, /id="professional-empty"[^>]*hidden/);
  assert.match(skills, /class="eyebrow"/);
});

test("skills fragment no longer has percentage bars or a modal", () => {
  assert.doesNotMatch(skills, /skills-modal/);
  assert.doesNotMatch(skills, /percentage/i);
  assert.doesNotMatch(skills, /bar-inner/);
  assert.doesNotMatch(template, /percentage/i);
  assert.doesNotMatch(template, /bar-inner/);
});

test("skill template has five segments and a description", () => {
  const segments = template.match(/class="skill-segment"/g) ?? [];
  assert.equal(segments.length, 5);
  assert.match(template, /class="skill-name"/);
  assert.match(template, /class="skill-description"/);
  assert.match(template, /class="sr-only skill-level"/);
});
