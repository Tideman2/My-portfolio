import fetchHtmlFrag from "../../js/fetch-html-frag.js";
import { bindThemeToggle } from "../../js/theme.js";

function initNav() {
  const siteHeader = document.querySelector("#site-header");
  if (!siteHeader) return;

  const menuToggle = siteHeader.querySelector("#menu-toggle");
  const themeToggle = siteHeader.querySelector("#theme-toggle");
  const navLinks = Array.from(siteHeader.querySelectorAll("[data-nav-link]"));

  const setMenu = (open, { focusToggle = false } = {}) => {
    siteHeader.classList.toggle("nav-open", open);
    document.body.classList.toggle("nav-open", open);
    menuToggle?.setAttribute("aria-expanded", String(open));
    menuToggle?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (focusToggle) menuToggle?.focus();
  };

  menuToggle?.addEventListener("click", () => {
    setMenu(!siteHeader.classList.contains("nav-open"));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && siteHeader.classList.contains("nav-open")) {
      setMenu(false, { focusToggle: true });
    }
  });

  document.addEventListener("click", (event) => {
    if (!siteHeader.classList.contains("nav-open")) return;
    if (!siteHeader.contains(event.target)) setMenu(false);
  });

  if (themeToggle) {
    bindThemeToggle(themeToggle);
    const updateThemeLabel = () => {
      const isDark = document.documentElement.dataset.theme === "dark";
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme"
      );
    };
    updateThemeLabel();
    themeToggle.addEventListener("click", updateThemeLabel);
  }

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (typeof IntersectionObserver === "function" && sections.length) {
    const linkFor = (id) =>
      navLinks.find((link) => link.getAttribute("href") === `#${id}`);
    const ratios = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }

        let activeId = null;
        let bestRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            activeId = id;
          }
        }
        if (!activeId) return;

        const activeLink = linkFor(activeId);
        navLinks.forEach((link) => {
          if (link === activeLink) link.setAttribute("aria-current", "page");
          else link.removeAttribute("aria-current");
        });
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((section) => observer.observe(section));
  } else if (navLinks[0]) {
    navLinks[0].setAttribute("aria-current", "page");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchHtmlFrag("components/navBar/nav.html", "header", initNav);
});
