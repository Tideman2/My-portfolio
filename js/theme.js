export const THEME_KEY = "myportfolio-theme";

const VALID_THEMES = new Set(["light", "dark"]);

function browserStorage() {
  try {
    return typeof localStorage !== "undefined" ? localStorage : null;
  } catch {
    return null;
  }
}

function browserMatchMedia() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia.bind(window)
    : null;
}

export function getStoredTheme(storage) {
  const store = storage ?? browserStorage();
  if (!store || typeof store.getItem !== "function") return null;
  try {
    const value = store.getItem(THEME_KEY);
    return VALID_THEMES.has(value) ? value : null;
  } catch {
    return null;
  }
}

export function getSystemTheme(matchMedia) {
  const query = matchMedia ?? browserMatchMedia();
  if (typeof query !== "function") return "light";
  try {
    return query("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function resolveTheme(stored, system) {
  if (VALID_THEMES.has(stored)) return stored;
  return system === "dark" ? "dark" : "light";
}

export function applyTheme(theme, root) {
  const target =
    root ?? (typeof document !== "undefined" ? document.documentElement : null);
  if (!target) return;
  const resolved = theme === "dark" ? "dark" : "light";
  if (target.dataset) target.dataset.theme = resolved;
  if (target.style) target.style.colorScheme = resolved;
}

export function toggleTheme(current) {
  return current === "dark" ? "light" : "dark";
}

export function initTheme({ root, storage, matchMedia } = {}) {
  const store = storage ?? browserStorage();
  const query = matchMedia ?? browserMatchMedia();
  const stored = getStoredTheme(store);
  const system = getSystemTheme(query);
  const theme = resolveTheme(stored, system);
  applyTheme(theme, root);

  if (!stored && typeof query === "function") {
    try {
      const media = query("(prefers-color-scheme: dark)");
      const onChange = (event) => {
        applyTheme(event.matches ? "dark" : "light", root);
      };
      if (typeof media?.addEventListener === "function") {
        media.addEventListener("change", onChange);
      } else if (typeof media?.addListener === "function") {
        media.addListener(onChange);
      }
    } catch {
      // The system preference is optional; keep the resolved theme.
    }
  }

  return theme;
}

export function bindThemeToggle(button, { root, storage, matchMedia } = {}) {
  const target =
    root ?? (typeof document !== "undefined" ? document.documentElement : null);
  const store = storage ?? browserStorage();
  const declared = target?.dataset?.theme;
  let current = VALID_THEMES.has(declared)
    ? declared
    : initTheme({ root: target, storage: store, matchMedia });

  const updateButton = () => {
    if (!button) return;
    if (typeof button.setAttribute === "function") {
      button.setAttribute("aria-pressed", String(current === "dark"));
    }
    if (button.dataset) button.dataset.theme = current;
  };

  updateButton();

  const onClick = () => {
    current = toggleTheme(current);
    applyTheme(current, target);
    try {
      store?.setItem?.(THEME_KEY, current);
    } catch {
      // Storage can be unavailable in private mode; the toggle still works.
    }
    updateButton();
  };

  if (typeof button?.addEventListener === "function") {
    button.addEventListener("click", onClick);
  }

  return () => {
    if (typeof button?.removeEventListener === "function") {
      button.removeEventListener("click", onClick);
    }
  };
}
