import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const about = readFileSync(
  new URL("../components/about/about.html", import.meta.url),
  "utf8"
);

test("about fragment has the API-driven containers", () => {
  for (const id of ["about-bio", "about-meta", "about-portrait"]) {
    assert.match(about, new RegExp(`id="${id}"`));
  }
});

test("about portrait is a real image with alternative text", () => {
  const image = about.match(/<img[^>]*id="about-portrait"[^>]*>/)?.[0] ?? "";
  assert.match(image, /alt="[^"]+"/);
});

test("about no longer hardcodes the old multi-paragraph bio", () => {
  assert.doesNotMatch(about, /This portfolio was built without frameworks/);
  assert.doesNotMatch(about, /about-texts/);
});
