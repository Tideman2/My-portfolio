import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const nav = readFileSync(
  new URL("../components/navBar/nav.html", import.meta.url),
  "utf8"
);

test("nav fragment has the required landmarks and ids", () => {
  assert.match(nav, /id="site-header"/);
  assert.match(nav, /<nav[\s>]/);
  assert.match(nav, /id="primary-nav"/);
  assert.match(nav, /id="theme-toggle"/);
  assert.match(nav, /id="menu-toggle"/);
});

test("mobile menu button exposes its state", () => {
  const button = nav.match(/<button[^>]*id="menu-toggle"[^>]*>/)?.[0] ?? "";
  assert.match(button, /aria-expanded="false"/);
  assert.match(button, /aria-controls="primary-nav"/);
  assert.match(button, /aria-label=/);
});

test("nav links point at every public section", () => {
  for (const target of [
    "#hero-place",
    "#about-place",
    "#skills-place",
    "#projects-place",
    "#contact-place",
  ]) {
    assert.match(nav, new RegExp(`href="${target}"`));
  }
});
