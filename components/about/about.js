import fetchHtmlFrag from "../../js/fetch-html-frag.js";
import { getProfile } from "../../js/api.js";
import { fallbackContent } from "../../js/fallback-data.js";
import { splitBio } from "../../js/ui.js";

function renderBio(bio) {
  const container = document.querySelector("#about-bio");
  if (!container) return;

  const paragraphs = splitBio(bio);
  const list = paragraphs.length
    ? paragraphs
    : splitBio(fallbackContent.profile.bio);

  container.replaceChildren();
  for (const text of list) {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    container.append(paragraph);
  }
}

function renderPortraitAlt(profile) {
  const portrait = document.querySelector("#about-portrait");
  if (!portrait) return;
  const name =
    String(profile?.name ?? "").trim() || fallbackContent.profile.name;
  portrait.alt = `Illustration of ${name} as a retro developer`;
}

function renderMeta(profile) {
  const container = document.querySelector("#about-meta");
  if (!container) return;

  const items = [];
  if (String(profile?.country ?? "").trim()) {
    items.push({ label: "Based in", value: String(profile.country).trim() });
  }
  if (profile?.age !== null && profile?.age !== undefined) {
    items.push({ label: "Age", value: String(profile.age) });
  }

  container.replaceChildren();
  for (const item of items) {
    const chip = document.createElement("span");
    chip.className = "meta-chip";
    chip.setAttribute("role", "listitem");

    const label = document.createElement("span");
    label.className = "meta-label";
    label.textContent = item.label;

    const value = document.createElement("span");
    value.className = "meta-value";
    value.textContent = item.value;

    chip.append(label, value);
    container.append(chip);
  }
  container.hidden = items.length === 0;
}

async function loadAbout() {
  try {
    const profile = await getProfile();
    renderBio(profile?.bio);
    renderPortraitAlt(profile);
    renderMeta(profile);
  } catch {
    renderBio(fallbackContent.profile.bio);
    renderPortraitAlt(fallbackContent.profile);
    renderMeta(fallbackContent.profile);
  }
}

function initAbout() {
  renderBio(fallbackContent.profile.bio);
  renderPortraitAlt(fallbackContent.profile);
  renderMeta(fallbackContent.profile);
  loadAbout();
}

document.addEventListener("DOMContentLoaded", () => {
  fetchHtmlFrag("components/about/about.html", "#about-place", initAbout);
});
