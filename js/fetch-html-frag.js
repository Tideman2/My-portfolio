// Utility function to fetch and inject an HTML fragment into a parent element.
// Params:
// - fragmentUrl: path to the HTML file
// - parentOfElement: selector string for the parent container (e.g., "header")
// - eventRehydration: optional callback function to rebind JS events after DOM insertion
// - options: injectable fetch/document for tests

export default async function fetchHtmlFrag(
  fragmentUrl,
  parentOfElement,
  eventRehydration,
  { fetchImpl = globalThis.fetch, documentRef = globalThis.document } = {}
) {
  try {
    const parent = documentRef?.querySelector?.(parentOfElement);
    if (!parent) {
      console.error(`Parent element "${parentOfElement}" not found.`);
      return false;
    }

    const response = await fetchImpl(fragmentUrl);
    if (!response?.ok) {
      console.error(
        `Failed to fetch ${fragmentUrl}: ${response?.status ?? "unknown status"}`
      );
      return false;
    }

    const html = await response.text();
    const temp = documentRef.createElement("div");
    temp.innerHTML = html;
    const child = temp.firstElementChild;
    if (!child) {
      console.error(`Fragment ${fragmentUrl} did not contain an element.`);
      return false;
    }

    parent.append(child);
    if (typeof eventRehydration === "function") {
      eventRehydration();
    }
    return true;
  } catch (error) {
    console.error(`Failed to fetch ${fragmentUrl}:`, error);
    return false;
  }
}
