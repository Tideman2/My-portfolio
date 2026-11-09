import { initTheme } from "./theme.js";

initTheme();

if (typeof document !== "undefined") {
  document.documentElement.classList.add("js");
}
