// Utility function to fetch and inject an HTML fragment into a parent element
// Params:
// - fragmentUrl: path to the HTML file
// - parentOfElement: selector string for the parent container (e.g., "header")
// - eventRehydration: optional callback function to rebind JS events after DOM insertion

export default function fetchHtmlFrag(
  fragmentUrl,
  parentOfElement,
  eventRehydration
) {
  fetch(fragmentUrl)
    .then((res) => res.text())
    .then((html) => {
      const temp = document.createElement("div");
      const parent = document.querySelector(parentOfElement);

      if (!parent) {
        console.error(`Parent element "${parentOfElement}" not found.`);
        return;
      }

      temp.innerHTML = html;
      parent.append(temp.firstChild);

      if (typeof eventRehydration === "function") {
        eventRehydration();
      }
    })
    .catch((error) => {
      console.error(`Failed to fetch ${fragmentUrl}:`, error);
    });
}
