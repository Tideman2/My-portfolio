import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const index = readFileSync(
  new URL("../index.html", import.meta.url),
  "utf8"
);
const footer = readFileSync(
  new URL("../components/footer/footer.html", import.meta.url),
  "utf8"
);

test("document shell has final metadata, landmarks, scripts, and skip link", () => {
  assert.match(index, /<title>Isaac Mark — Web Developer<\/title>/);
  assert.match(index, /<meta\s+name="description"[^>]*>/);
  assert.match(index, /<meta\s+property="og:title"[^>]*>/);
  assert.match(index, /<meta\s+property="og:description"[^>]*>/);
  assert.match(index, /<meta\s+property="og:url"[^>]*>/);
  assert.match(index, /<meta\s+property="og:image"[^>]*>/);

  assert.match(index, /<a\s+class="skip-link"\s+href="#main">/);
  assert.match(index, /<main id="main">/);
  assert.match(index, /<footer id="footer-place">/);

  assert.match(index, /<script\s+type="module"\s+src="\/?(\.\/)?js\/index\.js"><\/script>/);
  assert.match(index, /<script\s+type="module"\s+src="\/?(\.\/)?components\/navBar\/getNavComp\.js"><\/script>/);
  assert.match(index, /<script\s+type="module"\s+src="\/?(\.\/)?components\/intro\/intro\.js"><\/script>/);
  assert.match(index, /<script\s+type="module"\s+src="\/?(\.\/)?components\/about\/about\.js"><\/script>/);
  assert.match(index, /<script\s+type="module"\s+src="\/?(\.\/)?components\/skills\/skills\.js"><\/script>/);
  assert.match(index, /<script\s+type="module"\s+src="\/?(\.\/)?components\/projects\/projects\.js"><\/script>/);
  assert.match(index, /<script\s+type="module"\s+src="\/?(\.\/)?components\/contact\/contact\.js"><\/script>/);
  assert.match(index, /<script\s+type="module"\s+src="\/?(\.\/)?components\/footer\/footer\.js"><\/script>/);
  assert.match(index, /<script\s+src="config\.js"><\/script>/);
  assert.doesNotMatch(
    index,
    /<script[^>]*src="https:\/\/cdn\.jsdelivr\.net\/npm\/typed\.js[^>]*>\s*<\/script>\s*<\/head>/i
  );
});

test("footer fragment has landmark, socials, year, and back-to-top", () => {
  assert.match(footer, /<footer[\s\S]*id="footer-year"/);
  assert.match(footer, /id="footer-socials"/);
  assert.match(footer, /id="back-to-top"/);
  assert.match(footer, /<footer[\s\S]*>/);
});
