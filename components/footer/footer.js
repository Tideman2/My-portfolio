import fetchHtmlFrag from "../../js/fetch-html-frag.js";
import { getSocials } from "../../js/api.js";
import { fallbackContent } from "../../js/fallback-data.js";
import { platformIcon } from "../../js/ui.js";

function faIconFor(name) {
  const key = platformIcon(name);
  if (key === "linkedin") return "fab fa-linkedin";
  if (key === "github") return "fab fa-github";
  if (key === "whatsapp") return "fab fa-whatsapp";
  if (key === "email") return "fas fa-envelope";
  return "fas fa-link";
}

function renderSocials(container, socials) {
  container.replaceChildren();
  const source = Array.isArray(socials) && socials.length ? socials : fallbackContent.socials;
  const items = Array.isArray(source) ? source : [];

  for (const social of items) {
    const url = String(social?.url ?? "").trim();
    if (!url) continue;

    const label = String(social?.platform_name ?? "Contact").trim() || "Contact";
    const item = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.setAttribute("aria-label", label);
    if (/^https?:/i.test(url)) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }

    const icon = document.createElement("i");
    icon.className = faIconFor(label);
    icon.setAttribute("aria-hidden", "true");
    anchor.append(icon);
    item.append(anchor);
    container.append(item);
  }
}

async function loadSocials(container) {
  try {
    const socials = await getSocials();
    renderSocials(container, socials);
  } catch {
    renderSocials(container, fallbackContent.socials);
  }
}

function setupBackToTop(content) {
  const link = content.querySelector("#back-to-top");
  if (!link) return;

  link.addEventListener("click", (event) => {
    event.preventDefault();
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    window.scrollTo({ top: 0, behavior });
  });
}

async function initFooter() {
  const loaded = await fetchHtmlFrag("components/footer/footer.html", "#footer-place", null);
  if (!loaded) return;

  const placeholder = document.querySelector("#footer-place");
  const appended = placeholder?.querySelector("footer");
  const content = appended?.querySelector(".footer-inner") ?? appended;
  if (!content) return;

  placeholder.replaceChildren(content);

  content.querySelector("#footer-year").textContent = String(new Date().getFullYear());

  const socialsContainer = content.querySelector("#footer-socials");
  if (socialsContainer) {
    await loadSocials(socialsContainer);
  }

  setupBackToTop(content);
}

document.addEventListener("DOMContentLoaded", () => {
  initFooter();
});
