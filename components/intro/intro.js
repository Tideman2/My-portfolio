import fetchHtmlFrag from "../../js/fetch-html-frag.js";

function runTypedEffect() {
  new Typed("#typed-words", {
    strings: [
      "Problem solver by habit. Developer by choice.",
      "Focused on impact. Fueled by curiosity.",
      "Code that’s clean, interfaces that speak.",
      "I turn logic into experience — one line of code at a time.",
    ],
    typeSpeed: 60,
    showCursor: false,
    backSpeed: 30,
    startDelay: 500,
    backDelay: 1500,
    loop: true,
  });
}

fetchHtmlFrag(
  "../../components/intro/intro.html",
  "#hero-place",
  runTypedEffect
);
