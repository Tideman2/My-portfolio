import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const hero = readFileSync(
  new URL("../components/intro/intro.html", import.meta.url),
  "utf8"
);

test("hero fragment has the API-driven elements", () => {
  for (const id of [
    "hero-name",
    "hero-tagline",
    "hero-bio",
    "hero-actions",
    "hero-socials",
    "hero-portrait",
  ]) {
    assert.match(hero, new RegExp(`id="${id}"`));
  }
});

test("hero portrait is a real image with alternative text", () => {
  const image = hero.match(/<img[^>]*id="hero-portrait"[^>]*>/)?.[0] ?? "";
  assert.match(image, /alt="[^"]+"/);
});

test("hero CTAs and noscript fallback are present", () => {
  assert.match(hero, /href="#projects-place"/);
  assert.match(hero, /href="#contact-place"/);
  assert.match(hero, /<noscript>/);
});
