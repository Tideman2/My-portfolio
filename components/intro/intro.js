import fetchHtmlFrag from "../../js/fetch-html-frag.js";
import { getProfile, getSocials } from "../../js/api.js";
import { fallbackContent } from "../../js/fallback-data.js";
import { platformIcon, prefersReducedMotion } from "../../js/ui.js";

const TAGLINES = [
  "I turn logic into experience — one line of code at a time.",
  "Problem solver by habit. Developer by choice.",
  "Focused on impact. Fueled by curiosity.",
  "Code that’s clean, interfaces that speak.",
];

const ICONS = {
  linkedin: "fab fa-linkedin",
  github: "fab fa-github",
  whatsapp: "fab fa-whatsapp",
  email: "fas fa-envelope",
  link: "fas fa-link",
};

function shortBio(bio) {
  const text = String(bio ?? "").trim();
  if (!text) return "";
  const first = text.split(/\n\s*\n/)[0].trim();
  if (first.length <= 260) return first;
  return `${first.slice(0, 257).trimEnd()}…`;
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element && value) element.textContent = value;
}

function renderProfile(profile) {
  const name =
    String(profile?.name ?? "").trim() || fallbackContent.profile.name;
  const bio =
    shortBio(profile?.bio) || shortBio(fallbackContent.profile.bio);
  setText("#hero-name", name);
  setText("#hero-bio", bio);
}

function renderSocials(socials) {
  const container = document.querySelector("#hero-socials");
  if (!container) return;

  const valid = (Array.isArray(socials) ? socials : []).filter((social) =>
    String(social?.url ?? "").trim()
  );
  const list = valid.length ? valid : fallbackContent.socials;

  container.replaceChildren();
  for (const social of list) {
    const url = String(social?.url ?? "").trim();
    if (!url) continue;
    const label = String(social?.platform_name ?? "Link").trim() || "Link";
    const link = document.createElement("a");
    link.href = url;
    link.className = "social-link";
    link.setAttribute("aria-label", label);

    if (/^https?:/i.test(url)) {
      link.target = "_blank";
      link.rel = "noreferrer noopener";
    }

    const icon = document.createElement("i");
    icon.className = ICONS[platformIcon(label)] ?? ICONS.link;
    icon.setAttribute("aria-hidden", "true");
    link.append(icon);
    container.append(link);
  }
}

let typedStarted = false;

function startTagline() {
  const tagline = document.querySelector("#hero-tagline");
  if (!tagline || typedStarted) return;

  if (prefersReducedMotion() || typeof window.Typed !== "function") {
    tagline.textContent = TAGLINES[0];
    return;
  }

  typedStarted = true;
  new window.Typed("#hero-tagline", {
    strings: TAGLINES,
    typeSpeed: 55,
    backSpeed: 30,
    startDelay: 400,
    backDelay: 1600,
    loop: true,
    showCursor: false,
  });
}

async function loadHero() {
  const [profileResult, socialsResult] = await Promise.allSettled([
    getProfile(),
    getSocials(),
  ]);

  const profile =
    profileResult.status === "fulfilled" ? profileResult.value : null;
  const socials =
    socialsResult.status === "fulfilled" ? socialsResult.value : null;

  renderProfile(profile ?? fallbackContent.profile);
  renderSocials(socials);
}

function initHero() {
  renderProfile(fallbackContent.profile);
  renderSocials(fallbackContent.socials);
  startTagline();
  loadHero();
}

document.addEventListener("DOMContentLoaded", () => {
  fetchHtmlFrag("components/intro/intro.html", "#hero-place", initHero);
});
