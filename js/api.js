import { normalizeBaseUrl, resolveApiBase } from "./config-utils.js";

export class ApiError extends Error {
  constructor(message, status = 0, body = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function getApiBase() {
  if (typeof window !== "undefined" && window.APP_CONFIG?.getDynamicApiUrl) {
    return normalizeBaseUrl(window.APP_CONFIG.getDynamicApiUrl());
  }
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "localhost";
  return resolveApiBase(hostname);
}

function buildUrl(path, baseUrl) {
  const base = normalizeBaseUrl(baseUrl || getApiBase());
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

export async function request(
  path,
  { method = "GET", body, headers = {}, timeout = 12000, baseUrl } = {}
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const requestHeaders = { Accept: "application/json", ...headers };
  const isJsonBody =
    body != null &&
    typeof body === "object" &&
    !(body instanceof FormData) &&
    !(body instanceof Blob);

  if (isJsonBody) {
    requestHeaders["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(buildUrl(path, baseUrl), {
      method,
      signal: controller.signal,
      headers: requestHeaders,
      body: isJsonBody ? JSON.stringify(body) : body,
    });

    const text = await response.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!response.ok) {
      throw new ApiError(
        `Request failed with status ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error?.name === "AbortError" || controller.signal.aborted) {
      throw new ApiError("Request timed out", 0, null);
    }
    throw new ApiError(error?.message || "Network request failed", 0, null);
  } finally {
    clearTimeout(timer);
  }
}

export function getProfile({ baseUrl } = {}) {
  return request("/me", { baseUrl });
}

export function getSocials({ baseUrl } = {}) {
  return request("/me/socials", { baseUrl });
}

export function getTechnicalSkills({ baseUrl } = {}) {
  return request("/me/technical-skills", { baseUrl });
}

export function getProfessionalSkills({ baseUrl } = {}) {
  return request("/me/professional-skills", { baseUrl });
}

export function getProjectGroups({ baseUrl } = {}) {
  return request("/api/project-groups", { baseUrl });
}

export function getProjects({ groupId, group, baseUrl, timeout } = {}) {
  const params = new URLSearchParams();
  if (groupId !== undefined && groupId !== null) {
    params.set("group_id", String(groupId));
  } else if (group) {
    params.set("group", group);
  }
  const query = params.toString();
  return request(`/api/projects/${query ? `?${query}` : ""}`, {
    baseUrl,
    timeout,
  });
}

export async function getProjectsGrouped({ baseUrl } = {}) {
  const groups = await getProjectGroups({ baseUrl });
  if (!Array.isArray(groups) || groups.length === 0) {
    const projects = await getProjects({ baseUrl });
    return {
      groups: [],
      projects: projects.map((project) => ({ ...project, group: null })),
    };
  }

  const lists = await Promise.all(
    groups.map(async (group) => {
      const projects = await getProjects({ groupId: group.id, baseUrl });
      return projects.map((project) => ({ ...project, group }));
    })
  );

  return { groups, projects: lists.flat() };
}

export function sendContactMessage(payload, { baseUrl } = {}) {
  return request("/api/mail/", {
    method: "POST",
    body: payload,
    baseUrl,
    timeout: 30000,
  });
}
