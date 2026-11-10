import { fallbackContent } from "../js/fallback-data.js";
import { DEPLOYED_API_URL } from "../js/config-utils.js";
import { planSocialChanges, planSkillChanges } from "../js/content-sync.js";

const API_BASE = (process.env.API_BASE || DEPLOYED_API_URL).replace(/\/+$/, "");
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function requestJson(path, { method = "GET", token, body } = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status} for ${path}`);
  }

  return data;
}

async function login() {
  const data = await requestJson("/api/auth/login", {
    method: "POST",
    body: { username: ADMIN_USERNAME, password: ADMIN_PASSWORD },
  });

  const token = data?.access_token;

  if (!token) {
    throw new Error("Login response did not include an access token");
  }

  return token;
}

async function patchProfile(token) {
  const response = await fetch(`${API_BASE}/me`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: fallbackContent.profile.name,
      bio: fallbackContent.profile.bio,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(`Profile update failed with status ${response.status}`);
  }

  return data;
}

async function syncSocials(token) {
  const existing = await requestJson("/me/socials", { token });
  const plan = planSocialChanges(existing, fallbackContent.socials);

  for (const update of plan.update) {
    await requestJson(`/me/socials/${update.id}`, {
      method: "PATCH",
      token,
      body: update.data,
    });
  }

  for (const create of plan.create) {
    await requestJson("/me/socials", {
      method: "POST",
      token,
      body: create,
    });
  }

  const created = plan.create.length;
  const updated = plan.update.length;
  const skipped = Math.max(
    0,
    fallbackContent.socials.length - created - updated
  );

  return { created, updated, skipped };
}

async function syncSkills(token, endpoint, fallbackSkills) {
  const existing = await requestJson(endpoint, { token });
  const plan = planSkillChanges(existing, fallbackSkills);

  for (const update of plan.update) {
    await requestJson(`${endpoint}/${update.id}`, {
      method: "PATCH",
      token,
      body: update.data,
    });
  }

  for (const create of plan.create) {
    await requestJson(endpoint, {
      method: "POST",
      token,
      body: create,
    });
  }

  const created = plan.create.length;
  const updated = plan.update.length;
  const skipped = Math.max(
    0,
    fallbackSkills.length - created - updated
  );

  return { created, updated, skipped };
}

async function main() {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    throw new Error(
      "Missing ADMIN_USERNAME or ADMIN_PASSWORD environment variable."
    );
  }

  const token = await login();
  const profile = await patchProfile(token);
  const socials = await syncSocials(token);
  const technicalSkills = await syncSkills(
    token,
    "/me/technical-skills",
    fallbackContent.technicalSkills
  );
  const professionalSkills = await syncSkills(
    token,
    "/me/professional-skills",
    fallbackContent.professionalSkills
  );

  console.log("Production content sync complete.");
  console.log(
    `Socials: ${socials.created} created, ${socials.updated} updated, ${socials.skipped} skipped.`
  );
  console.log(
    `Technical skills: ${technicalSkills.created} created, ${technicalSkills.updated} updated, ${technicalSkills.skipped} skipped.`
  );
  console.log(
    `Professional skills: ${professionalSkills.created} created, ${professionalSkills.updated} updated, ${professionalSkills.skipped} skipped.`
  );

  if (profile?.name) {
    console.log(`Profile name synced: ${profile.name}`);
  }
}

main().catch((error) => {
  console.error(`Production content population failed: ${error?.message ?? error}`);
  process.exit(1);
});
