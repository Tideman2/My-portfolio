import fetchHtmlFrag from "../../js/fetch-html-frag.js";

// Instead of running immediately, wrap in:
document.addEventListener("DOMContentLoaded", function () {
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
});
