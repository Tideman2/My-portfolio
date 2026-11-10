import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { normalizeBaseUrl, resolveApiBase } from "../js/config-utils.js";

test("normalizeBaseUrl trims trailing slashes", () => {
  assert.equal(normalizeBaseUrl("https://api.test/"), "https://api.test");
  assert.equal(normalizeBaseUrl("https://api.test///"), "https://api.test");
});

test("resolveApiBase uses local off the deployed host", () => {
  assert.equal(resolveApiBase("localhost"), "http://localhost:5001");
  assert.equal(resolveApiBase("127.0.0.1"), "http://localhost:5001");
});

test("resolveApiBase uses the deployed API elsewhere", () => {
  assert.equal(
    resolveApiBase("tideman2.github.io"),
    "https://my-portfolio-backend-1rwp.onrender.com"
  );
});

test("classic config.js stays compatible with the shell", () => {
  const source = readFileSync(new URL("../config.js", import.meta.url), "utf8");
  assert.match(source, /5001/);
  assert.match(source, /my-portfolio-backend-1rwp/);
  assert.doesNotMatch(source, /\bexport\b/);
});
