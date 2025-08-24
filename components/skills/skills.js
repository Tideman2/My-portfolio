import fetchHtmlFrag from "../../js/fetch-html-frag.js";
import currentTechSkills from "./skills-utility/tech-skills.js";
//First we create our objects of tech and skill level to dynamically insert them to the dom
//Ussing skill-template

//function to fetch html template element as a fragment
async function fetchSkillTemplate() {
  try {
    const res = await fetch("components/skills/skill-template.html");
    const html = await res.text();
    const temp = document.createElement("div");
    temp.innerHTML = html;
    // Return the actual <template> element
    return temp.querySelector("template");
  } catch (err) {
    console.log("while fetching Skills template", err);
  }
}

//functipn to populate the clone of the template
function populateClone(clone, skills) {
  clone.querySelector(".tech-stack").innerHTML = skills.tech;
  clone.querySelector(".percentage").innerHTML = skills.percentageLearnt + "%";
  clone.querySelector(".percentage").dataset.title = skills.tech;
  clone.querySelector(".percentage").dataset.modalContent = skills.why;
  clone.querySelector(".bar-inner").style.width = skills.percentageLearnt + "%";
}

//function to rehydrate modalOpen functionality
function attachEventToCloneButton(clone) {
  const percentageBtn = clone.querySelector(".percentage");
  percentageBtn.addEventListener("click", (e) => {
    const modalElement = document.querySelector("#skills-modal");

    // Update modal content
    modalElement.querySelector("#skills-modal-title").textContent =
      e.currentTarget.dataset.title;
    modalElement.querySelector("#skills-modal-body").textContent =
      e.currentTarget.dataset.modalContent;

    // Show modal
    modalElement.classList.add("skills-modal-active");
  });
}

// Add this outside the click handler (runs once)
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("close-skills-modal-btn")) {
    document
      .querySelector("#skills-modal")
      .classList.remove("skills-modal-active");
  }

  // Close when clicking outside content
  if (e.target.classList.contains("skills-modal")) {
    e.target.classList.remove("skills-modal-active");
  }
});

//function to be passed to fetchHTMLfragment to get the elemnts after it's in the Dom and not before
function getHtmlElements() {
  let container1 = document.querySelector("#container-one");
  let container2 = document.querySelector("#container-two");
  //we want to share the skills into container1 and 2 equally
  let countOfHalfSkills = currentTechSkills.length / 2;
  for (let [index, skills] of currentTechSkills.entries()) {
    let clone = skillTemplate.content.cloneNode(true);
    if (index <= countOfHalfSkills - 1) {
      populateClone(clone, skills);
      attachEventToCloneButton(clone);
      container1.append(clone);
    } else if (
      index >= countOfHalfSkills - 1 &&
      index < currentTechSkills.length
    ) {
      populateClone(clone, skills);
      attachEventToCloneButton(clone);
      container2.append(clone);
    }
  }
}

let skillTemplate = await fetchSkillTemplate();

fetchHtmlFrag(
  "components/skills/skills.html",
  "#skills-place",
  getHtmlElements
);
