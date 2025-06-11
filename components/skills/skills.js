import fetchHtmlFrag from "../../js/fetch-html-frag.js";

//First we create our objects of tech and skill level to dynamically insert them to the dom
//Ussing skill-template
let currentTechSkills = [
  {
    tech: "HTML/CSS",
    percentageLearnt: 80,
  },
  {
    tech: "JavaScript/node.js",
    percentageLearnt: 70,
  },
  {
    tech: "React",
    percentageLearnt: 80,
  },
  {
    tech: "Material UI",
    percentageLearnt: 80,
  },
  {
    tech: "Tailwind",
    percentageLearnt: 70,
  },
  {
    tech: "Python",
    percentageLearnt: 30,
  },
  {
    tech: "Flask/SQLAlchemy",
    percentageLearnt: 30,
  },
  {
    tech: "gitHub",
    percentageLearnt: 70,
  },
];

//function to fetch html template element as a fragment
async function fetchSkillTemplate() {
  try {
    const res = await fetch("../../components/skills/skill-template.html");
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
  clone.querySelector(".bar-inner").style.width = skills.percentageLearnt + "%";
}

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
      container1.append(clone);
    } else if (
      index >= countOfHalfSkills - 1 &&
      index < currentTechSkills.length
    ) {
      populateClone(clone, skills);
      container2.append(clone);
    }
  }
  console.log(container1, container2);
}

let skillTemplate = await fetchSkillTemplate();

fetchHtmlFrag(
  "../../components/skills/skills.html",
  "#skills-place",
  getHtmlElements
);
