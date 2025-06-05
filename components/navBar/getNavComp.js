import fetchHtmlFrag from "../../js/fetch-html-frag.js";
// function to be run for the nav component when the index.html document is completely done loading
function rehidrateNavbarEvents() {
  if (document.querySelector("#toggle-btn")) {
    document.querySelector("#toggle-btn").addEventListener("click", () => {
      let navBar = document.querySelector(".navbar");
      navBar.classList.toggle("active");
    });
  }
}

fetchHtmlFrag(
  "../../components/navBar/nav.html",
  "header",
  rehidrateNavbarEvents
);

// function getNav() {
//   fetch("../../components/navBar/nav.html")
//     .then((response) => response.text())
//     .then((html) => {
//       let temp = document.createElement("div");
//       let header = document.querySelector("header");
//       temp.innerHTML = html;
//       if (header.firstChild) {
//         header.insertBefore(temp.firstChild, header.firstChild);
//       } else {
//         header.append(temp.firstChild);
//       }
//       //rehydrate navbar events
//       rehidrateNavbarEvents();
//     })
//     .catch((err) =>
//       console.log("error occured when fetching nav component", err)
//     );
// }

// getNav();
