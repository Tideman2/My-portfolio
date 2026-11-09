import test from "node:test";
import assert from "node:assert/strict";
import fetchHtmlFrag from "../js/fetch-html-frag.js";

function fakeDocument(parent) {
  return {
    querySelector: () => parent,
    createElement: () => {
      const temp = {};
      Object.defineProperty(temp, "innerHTML", {
        set(value) {
          temp._child = { html: value };
        },
      });
      Object.defineProperty(temp, "firstElementChild", {
        get() {
          return temp._child;
        },
      });
      return temp;
    },
  };
}

test("fetchHtmlFrag injects the first element and calls onReady", async () => {
  const appended = [];
  const parent = { append: (child) => appended.push(child) };
  let ready = 0;
  const result = await fetchHtmlFrag(
    "/fragment.html",
    "#parent",
    () => {
      ready += 1;
    },
    {
      fetchImpl: async () => ({
        ok: true,
        text: async () => "<section>Hello</section>",
      }),
      documentRef: fakeDocument(parent),
    }
  );

  assert.equal(result, true);
  assert.equal(ready, 1);
  assert.equal(appended.length, 1);
  assert.equal(appended[0].html, "<section>Hello</section>");
});

test("fetchHtmlFrag returns false when the parent is missing", async () => {
  const result = await fetchHtmlFrag("/fragment.html", "#missing", undefined, {
    fetchImpl: async () => ({ ok: true, text: async () => "<p>x</p>" }),
    documentRef: fakeDocument(null),
  });
  assert.equal(result, false);
});

test("fetchHtmlFrag returns false on a failed fetch", async () => {
  const result = await fetchHtmlFrag("/fragment.html", "#parent", undefined, {
    fetchImpl: async () => {
      throw new Error("network down");
    },
    documentRef: fakeDocument({ append() {} }),
  });
  assert.equal(result, false);
});

test("fetchHtmlFrag returns false on a non-ok response", async () => {
  const result = await fetchHtmlFrag("/fragment.html", "#parent", undefined, {
    fetchImpl: async () => ({
      ok: false,
      status: 404,
      text: async () => "not found",
    }),
    documentRef: fakeDocument({ append() {} }),
  });
  assert.equal(result, false);
});
