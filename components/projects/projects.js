import fetchHtmlFrag from "../../js/fetch-html-frag.js";
import { getProjectsGrouped, getProjects } from "../../js/api.js";
import { formatStack, paginate, PROJECTS_PER_PAGE, needsReadMore } from "../../js/ui.js";

const SKELETON_COUNT = 3;

const state = {
  filters: [{ id: null, name: "All", slug: null }],
  selectedGroupId: null,
  projects: [],
  currentPage: 1,
  itemsPerPage: PROJECTS_PER_PAGE,
  template: null,
};

function getGrid() {
  return document.querySelector("#project-grid");
}

function getStatus() {
  return document.querySelector("#project-status");
}

function getStatusText() {
  return document.querySelector("#project-status .project-status-text");
}

function getRetry() {
  return document.querySelector("#project-retry");
}

function getSeeMore() {
  return document.querySelector("#see-more-btn");
}

function getGroupFilters() {
  return document.querySelector("#project-group-filters");
}

function getAllFilter() {
  return document.querySelector("#filter-all");
}

function setStatusText(text) {
  const element = getStatusText();
  if (element) element.textContent = text;
}

function hideStatus() {
  const element = getStatus();
  if (element) element.hidden = true;
}

function showStatus(text) {
  const element = getStatus();
  if (element) element.hidden = false;
  setStatusText(text);
}

function hideSeeMore() {
  const element = getSeeMore();
  if (element) element.hidden = true;
}

function showSeeMore() {
  const element = getSeeMore();
  if (element) element.hidden = false;
}

function createSkeletonCard() {
  const clone = state.template.content.cloneNode(true);
  const card = clone.querySelector(".project-card");
  card.classList.add("skeleton");

  const image = card.querySelector(".project-image");
  image.innerHTML = `<div class="project-image-placeholder"><span>Loading preview…</span></div>`;

  const body = card.querySelector(".project-body");
  body.querySelector(".project-group-badge").hidden = true;
  body.querySelector(".project-title").innerHTML = `<span class="skeleton-text"></span>`;
  body.querySelector(".project-goal").innerHTML = `<span class="skeleton-text"></span>`;
  body.querySelector(".project-read-more").hidden = true;
  body.querySelector(".project-stack").innerHTML = "";
  body.querySelector(".project-links").innerHTML = "";

  return clone;
}

function showLoading() {
  const grid = getGrid();
  if (grid) {
    grid.replaceChildren();
    for (let index = 0; index < SKELETON_COUNT; index += 1) {
      grid.append(createSkeletonCard());
    }
  }
  showStatus("Loading projects…");
  if (getRetry()) getRetry().hidden = true;
  hideSeeMore();
}

function renderCards(items) {
  const grid = getGrid();
  if (!grid) return;
  grid.replaceChildren();
  for (const project of items) {
    grid.append(createCard(project, project.group));
  }
}

function renderProjects(items, emptyMessage = "No projects to show yet.") {
  const grid = getGrid();
  if (!grid) return;

  if (!Array.isArray(items) || items.length === 0) {
    grid.replaceChildren();
    showStatus(emptyMessage);
    hideSeeMore();
    return;
  }

  const result = paginate(items, state.currentPage, state.itemsPerPage);
  renderCards(result.items);

  if (result.hasMore) {
    state.currentPage = result.page + 1;
    hideStatus();
    showSeeMore();
    return;
  }

  hideSeeMore();
  showStatus("That’s all for now.");
}

function createCard(project, group) {
  const clone = state.template.content.cloneNode(true);
  const card = clone.querySelector(".project-card");
  const title = String(project?.title ?? "").trim() || "Untitled project";
  const image = project?.image;
  const imageElement = card.querySelector(".project-image-media");
  const imagePlaceholder = card.querySelector(".project-image-placeholder");
  const goalElement = card.querySelector(".project-goal");
  const readMore = card.querySelector(".project-read-more");
  const stackElement = card.querySelector(".project-stack");
  const groupBadge = card.querySelector(".project-group-badge");
  const codeLink = card.querySelector(".view-code");
  const liveLink = card.querySelector(".live-demo");
  const linksContainer = card.querySelector(".project-links");

  card.dataset.title = title;
  card.querySelector(".project-title").textContent = title;

  if (image) {
    imageElement.setAttribute("src", String(image));
    imageElement.setAttribute("alt", `${title} preview`);
    imageElement.setAttribute("loading", "lazy");
    imageElement.hidden = false;
    imagePlaceholder.hidden = true;
  } else {
    imageElement.hidden = true;
    imagePlaceholder.hidden = false;
  }

  const groupName = String(
    group?.name ?? project?.group?.name ?? ""
  ).trim();
  groupBadge.textContent = groupName;
  groupBadge.hidden = !groupName;

  const goalText = String(project?.goal ?? "").trim();
  const hasGoal = goalText.length > 0;
  goalElement.textContent = goalText;
  goalElement.hidden = !hasGoal;

  if (readMore) {
    readMore.hidden = !hasGoal || !needsReadMore(goalText);
    readMore.addEventListener("click", () => {
      const expanded = goalElement.classList.toggle("expanded");
      readMore.textContent = expanded ? "Show less" : "Read more";
    });
  }

  const stacks = formatStack(project?.stack);
  stackElement.replaceChildren();
  for (const stackItem of stacks) {
    const listItem = document.createElement("li");
    listItem.textContent = stackItem;
    stackElement.append(listItem);
  }
  stackElement.hidden = stacks.length === 0;

  const codeUrl = project?.github_url;
  const liveUrl = project?.demo_url;
  codeLink.hidden = !codeUrl;
  liveLink.hidden = !liveUrl;
  codeLink.href = codeUrl ?? "#";
  liveLink.href = liveUrl ?? "#";
  if (linksContainer) {
    linksContainer.hidden = !codeUrl && !liveUrl;
  }

  return clone;
}

function renderFilters() {
  const groupFilters = getGroupFilters();
  if (groupFilters) groupFilters.replaceChildren();

  for (const group of state.filters) {
    if (group.id === null) continue;

    const button = document.createElement("button");
    button.type = "button";
    button.id = `filter-group-${group.id}`;
    button.className = "project-filter";
    button.textContent = group.name;
    button.dataset.groupId = String(group.id);
    button.setAttribute(
      "aria-pressed",
      String(state.selectedGroupId === group.id)
    );
    button.addEventListener("click", () => selectFilter(group.id));
    groupFilters.append(button);
  }

  const allButton = getAllFilter();
  if (allButton) {
    const allGroup = state.filters.find((group) => group.id === null) ?? {
      name: "All",
    };
    allButton.textContent = allGroup.name;
    allButton.setAttribute(
      "aria-pressed",
      String(state.selectedGroupId === null)
    );
  }
}

function selectFilter(groupId) {
  state.selectedGroupId = groupId;
  state.currentPage = 1;

  const items =
    state.selectedGroupId === null
      ? state.projects
      : state.projects.filter(
          (project) => project?.group?.id === state.selectedGroupId
        );

  renderProjects(
    items,
    state.selectedGroupId === null
      ? "No projects to show yet."
      : "No projects in this group yet."
  );
  renderFilters();
}

function handleSeeMore() {
  const items =
    state.selectedGroupId === null
      ? state.projects
      : state.projects.filter(
          (project) => project?.group?.id === state.selectedGroupId
        );
  renderProjects(items);
}

function showError() {
  showStatus("We couldn’t load projects right now. Try again.");
  if (getRetry()) getRetry().hidden = false;
  const grid = getGrid();
  if (grid) grid.replaceChildren();
  hideSeeMore();
}

async function loadProjects() {
  showLoading();

  try {
    const grouped = await getProjectsGrouped();
    const groups = grouped?.groups ?? [];
    const projects = grouped?.projects ?? [];
    const groupFilters = [];

    for (const group of groups) {
      const id = group?.id;
      const name = String(group?.name ?? "").trim();
      const groupProjects = projects.filter(
        (project) => project?.group?.id === id
      );

      if (name && groupProjects.length > 0) {
        groupFilters.push({ id, name, slug: group.slug });
      }
    }

    if (groupFilters.length === 0) {
      throw new Error("No project groups");
    }

    state.filters = [{ id: null, name: "All", slug: null }, ...groupFilters];
    state.projects = projects;
    state.selectedGroupId = null;
    state.currentPage = 1;
    renderFilters();
    renderProjects(projects);
  } catch (error) {
    try {
      const all = await getProjects();
      state.projects = all.map((project) => ({
        ...project,
        group: { id: null, name: "All projects", slug: null },
      }));
      state.filters = [{ id: null, name: "All projects", slug: null }];
      state.selectedGroupId = null;
      state.currentPage = 1;
      renderFilters();
      renderProjects(state.projects, "No projects to show yet.");
    } catch (fallbackError) {
      showError();
      console.error("Error loading projects:", fallbackError);
    }
  }
}

function initProjects(template) {
  state.template = template;
  const allButton = getAllFilter();
  if (allButton) {
    allButton.addEventListener("click", () => selectFilter(null));
  }
  const seeMore = getSeeMore();
  if (seeMore) {
    seeMore.addEventListener("click", handleSeeMore);
  }
  renderFilters();
  loadProjects();
}

async function fetchProjectTemplate() {
  try {
    const response = await fetch("components/projects/project-template.html");
    if (!response.ok) {
      throw new Error(`Template request failed: ${response.status}`);
    }
    const html = await response.text();
    return new DOMParser()
      .parseFromString(html, "text/html")
      .querySelector("template");
  } catch (error) {
    console.error("Could not load the project template:", error);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const templatePromise = fetchProjectTemplate();
  const loaded = await fetchHtmlFrag(
    "components/projects/projects.html",
    "#projects-place",
    null
  );
  const template = await templatePromise;

  if (!loaded) return;
  if (!template) {
    showError();
    return;
  }

  initProjects(template);
});
