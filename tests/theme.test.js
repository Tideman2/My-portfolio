import test from "node:test";
import assert from "node:assert/strict";
import {
  THEME_KEY,
  getStoredTheme,
  getSystemTheme,
  resolveTheme,
  applyTheme,
  toggleTheme,
  initTheme,
  bindThemeToggle,
} from "../js/theme.js";

function fakeRoot() {
  return { dataset: {}, style: {} };
}

function fakeStorage(value) {
  const data = new Map();
  if (value !== undefined) data.set(THEME_KEY, value);
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
  };
}

function fakeMatchMedia(matches) {
  return () => ({
    matches,
    addEventListener() {},
    removeEventListener() {},
  });
}

test("resolveTheme prefers a stored choice and falls back to the system", () => {
  assert.equal(resolveTheme(null, "dark"), "dark");
  assert.equal(resolveTheme("light", "dark"), "light");
  assert.equal(resolveTheme("junk", "light"), "light");
});

test("toggleTheme flips the theme", () => {
  assert.equal(toggleTheme("dark"), "light");
  assert.equal(toggleTheme("light"), "dark");
});

test("getStoredTheme returns only valid themes", () => {
  assert.equal(getStoredTheme(fakeStorage("dark")), "dark");
  assert.equal(getStoredTheme(fakeStorage("light")), "light");
  assert.equal(getStoredTheme(fakeStorage("junk")), null);
  assert.equal(getStoredTheme(null), null);
});

test("getSystemTheme reads the dark media query", () => {
  assert.equal(getSystemTheme(fakeMatchMedia(true)), "dark");
  assert.equal(getSystemTheme(fakeMatchMedia(false)), "light");
  assert.equal(getSystemTheme(null), "light");
});

test("applyTheme sets the root dataset and color-scheme", () => {
  const root = fakeRoot();
  applyTheme("dark", root);
  assert.equal(root.dataset.theme, "dark");
  assert.equal(root.style.colorScheme, "dark");
});

test("initTheme resolves and applies the stored theme", () => {
  const root = fakeRoot();
  const storage = fakeStorage("light");
  const theme = initTheme({
    root,
    storage,
    matchMedia: fakeMatchMedia(true),
  });
  assert.equal(theme, "light");
  assert.equal(root.dataset.theme, "light");
});

test("bindThemeToggle toggles, persists, and updates aria-pressed", () => {
  const root = fakeRoot();
  applyTheme("light", root);
  const storage = fakeStorage();
  const listeners = {};
  const button = {
    dataset: {},
    attributes: {},
    addEventListener(type, handler) {
      listeners[type] = handler;
    },
    removeEventListener(type) {
      delete listeners[type];
    },
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
  };

  const cleanup = bindThemeToggle(button, {
    root,
    storage,
    matchMedia: fakeMatchMedia(false),
  });

  assert.equal(button.attributes["aria-pressed"], "false");
  listeners.click();
  assert.equal(root.dataset.theme, "dark");
  assert.equal(button.attributes["aria-pressed"], "true");
  assert.equal(storage.data.get(THEME_KEY), "dark");
  cleanup();
  assert.equal(listeners.click, undefined);
});
