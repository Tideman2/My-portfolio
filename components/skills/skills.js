import fetchHtmlFrag from "../../js/fetch-html-frag.js";
import { getTechnicalSkills, getProfessionalSkills } from "../../js/api.js";
import { fallbackContent } from "../../js/fallback-data.js";
import { proficiencyLabel } from "../../js/ui.js";

const GROUPS = [
  {
    grid: "#technical-skills",
    empty: "#technical-empty",
    status: "#technical-status",
    fallback: fallbackContent.technicalSkills,
    load: getTechnicalSkills,
  },
  {
    grid: "#professional-skills",
    empty: "#professional-empty",
    status: "#professional-status",
    fallback: fallbackContent.professionalSkills,
    load: getProfessionalSkills,
  },
];

function normalizeSkills(list) {
  return (Array.isArray(list) ? list : []).filter((skill) =>
    String(skill?.name ?? "").trim()
  );
}

function normalizeProficiency(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 1;
  return Math.min(5, Math.max(1, Math.round(number)));
}

function buildCard(skill, template) {
  const fragment = template.content.cloneNode(true);
  const card = fragment.querySelector(".skill-card");
  const name = String(skill?.name ?? "").trim() || "Untitled skill";
  const proficiency = normalizeProficiency(skill?.proficiency);
  const description = String(skill?.description ?? "").trim();

  card.dataset.proficiency = String(proficiency);
  card.querySelector(".skill-name").textContent = name;

  const level = card.querySelector(".skill-level");
  if (level) level.textContent = proficiencyLabel(proficiency);

  card.querySelectorAll(".skill-segment").forEach((segment, index) => {
    segment.classList.toggle("is-filled", index < proficiency);
  });

  const descriptionElement = card.querySelector(".skill-description");
  if (descriptionElement) {
    if (description) descriptionElement.textContent = description;
    else descriptionElement.hidden = true;
  }

  return fragment;
}

function renderList(group, template, list) {
  const container = document.querySelector(group.grid);
  if (!container) return;

  const skills = normalizeSkills(list);
  container.replaceChildren();
  for (const skill of skills) {
    container.append(buildCard(skill, template));
  }
  container.hidden = skills.length === 0;
  container.setAttribute("aria-busy", "false");

  const status = document.querySelector(group.status);
  if (status) status.hidden = true;

  const empty = document.querySelector(group.empty);
  if (empty) empty.hidden = skills.length > 0;
}

function showUnavailable(group) {
  const container = document.querySelector(group.grid);
  if (container) {
    container.replaceChildren();
    container.hidden = true;
    container.setAttribute("aria-busy", "false");
  }

  const status = document.querySelector(group.status);
  if (status) status.hidden = true;

  const empty = document.querySelector(group.empty);
  if (empty) empty.hidden = false;
}

async function fetchSkillTemplate() {
  try {
    const response = await fetch("components/skills/skill-template.html");
    if (!response.ok) throw new Error(`Template request failed: ${response.status}`);
    const html = await response.text();
    return new DOMParser()
      .parseFromString(html, "text/html")
      .querySelector("template");
  } catch (error) {
    console.error("Could not load the skill template:", error);
    return null;
  }
}

async function loadSkills(template) {
  const results = await Promise.allSettled(
    GROUPS.map((group) => group.load())
  );

  results.forEach((result, index) => {
    const group = GROUPS[index];
    const apiList = result.status === "fulfilled" ? result.value : [];
    const skills = normalizeSkills(apiList);
    renderList(group, template, skills.length ? skills : group.fallback);
  });
}

function initSkills(template) {
  for (const group of GROUPS) {
    renderList(group, template, group.fallback);
  }
  loadSkills(template);
}

document.addEventListener("DOMContentLoaded", async () => {
  const [template, loaded] = await Promise.all([
    fetchSkillTemplate(),
    fetchHtmlFrag("components/skills/skills.html", "#skills-place", null),
  ]);

  if (!loaded) return;
  if (!template) {
    GROUPS.forEach(showUnavailable);
    return;
  }

  initSkills(template);
});
