import test from "node:test";
import assert from "node:assert/strict";
import {
  ApiError,
  getProjects,
  getProjectsGrouped,
  sendContactMessage,
} from "../js/api.js";

const baseUrl = "https://api.test";

test("getProjects uses the trailing slash and group_id filter", async () => {
  let seen;
  globalThis.fetch = async (url) => {
    seen = url;
    return new Response("[]", { status: 200 });
  };
  await getProjects({ groupId: 2, baseUrl });
  assert.equal(seen, "https://api.test/api/projects/?group_id=2");
});

test("getProjects prefers group_id when both filters are supplied", async () => {
  let seen;
  globalThis.fetch = async (url) => {
    seen = url;
    return new Response("[]", { status: 200 });
  };
  await getProjects({ groupId: 3, group: "solo", baseUrl });
  assert.equal(seen, "https://api.test/api/projects/?group_id=3");
});

test("getProjectsGrouped merges each project with its group", async () => {
  globalThis.fetch = async (url) => {
    if (url.endsWith("/api/project-groups")) {
      return Response.json([{ id: 1, name: "Solo", slug: "solo" }]);
    }
    return Response.json([{ id: 9, title: "P", group: undefined }]);
  };
  const result = await getProjectsGrouped({ baseUrl });
  assert.equal(result.projects[0].group.name, "Solo");
});

test("getProjectsGrouped falls back to all projects when there are no groups", async () => {
  globalThis.fetch = async (url) => {
    if (url.endsWith("/api/project-groups")) return Response.json([]);
    return Response.json([{ id: 9, title: "P" }]);
  };
  const result = await getProjectsGrouped({ baseUrl });
  assert.equal(result.groups.length, 0);
  assert.equal(result.projects[0].group, null);
});

test("request turns a non-JSON 500 into ApiError", async () => {
  globalThis.fetch = async () =>
    new Response("Internal Server Error", { status: 500 });
  await assert.rejects(
    () =>
      sendContactMessage(
        { name: "a", email: "a@b.co", subject: "s", message: "m" },
        { baseUrl }
      ),
    (error) => error instanceof ApiError && error.status === 500
  );
});

test("request aborts after the timeout", async () => {
  globalThis.fetch = (_url, { signal }) =>
    new Promise((_resolve, reject) => {
      signal.addEventListener("abort", () =>
        reject(new DOMException("Aborted", "AbortError"))
      );
    });
  await assert.rejects(
    () => getProjects({ baseUrl, timeout: 5 }),
    /timed out/i
  );
});
