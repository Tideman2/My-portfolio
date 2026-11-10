import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const projects = readFileSync(
  new URL("../components/projects/projects.html", import.meta.url),
  "utf8"
);
const template = readFileSync(
  new URL("../components/projects/project-template.html", import.meta.url),
  "utf8"
);
const projectsJs = readFileSync(
  new URL("../components/projects/projects.js", import.meta.url),
  "utf8"
);

test("projects fragment has filters, grid, status, and see more", () => {
  for (const id of [
    "project-filters",
    "project-grid",
    "project-status",
    "see-more-btn",
    "see-more",
  ]) {
    assert.match(projects, new RegExp(`id="${id}"`));
  }
  assert.match(projects, /id="project-status"/);
  assert.match(projects, /id="project-status"[^>]*role="status"/);
});

test("see more button is present and hidden by default", () => {
  assert.match(projects, /id="see-more-btn"/);
  assert.match(projects, /id="see-more-btn"[\s\S]*?id="see-more"/);
  assert.match(projects, /id="see-more-btn"[\s\S]*?hidden/);
});

test("project template has image, title, goal, stack, group badge, and links", () => {
  for (const className of [
    "project-card",
    "project-image",
    "project-image-placeholder",
    "project-title",
    "project-goal",
    "project-stack",
    "project-group-badge",
    "project-links",
    "view-code",
    "live-demo",
  ]) {
    assert.match(template, new RegExp(`class="${className}"`));
  }
  assert.match(template, /loading="lazy"/);
});

test("project markup and logic drop the old flip card and onclick handlers", () => {
  assert.doesNotMatch(projects + template + projectsJs, /onclick/i);
  assert.doesNotMatch(projects + template, /class="card"/);
  assert.doesNotMatch(projects + template, /flipped/);
});
