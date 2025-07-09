import fetchHtmlFrag from "../../js/fetch-html-frag.js";

let maxCardHeight = 0;

let itemsPerPage = 3;
let currentPage = 1;
let fetchedProjects;
let totalPages;
let cardTemplate;

let fragmentUrl = "../../components/projects/projects.html";
let parentElement = "#projects-place";
//urls for porjcets data from the backend and url for Cards template
let urls = [
  "http://127.0.0.1:5000/api/projects/",
  "../../components/projects/project-template.html",
];

// function to calculate pagination start and end, also return a slice of it
function paginate() {
  let start = (currentPage - 1) * itemsPerPage;
  let end = start + itemsPerPage;
  if (currentPage > totalPages) {
    alert("No more projects");
  }
  let items = fetchedProjects.slice(start, end);
  currentPage += 1;
  return items;
}

//function to put paginated projects iin the dom
function loadPaginatedData() {
  let paginated = paginate();
  let cardContainer = document.querySelector("#card-box");
  for (let proj of paginated) {
    let clone = cardTemplate.content.cloneNode(true);
    let cloneCard = clone.querySelector(".card");
    //attach event to card
    cloneCard.addEventListener("click", () => {
      cloneCard.classList.toggle("flipped");
      console.log("clicked on card");
    });
    let populatedClone = populateCardClone(proj, clone);
    cardContainer.appendChild(populatedClone);
    if (cardContainer.lastElementChild.clientHeight >= maxCardHeight) {
      maxCardHeight = cardContainer.lastElementChild.clientHeight;
    }
  }

  //Equalize cards height after appending all card
  let allCards = cardContainer.querySelectorAll(".card-front");
  allCards.forEach((card) => {
    card.style.height = `${maxCardHeight}px`;
  });
  // rehydrateCardEvent();
}

//function added click functionality to all cards to trigger the animation
function rehydrateCardEvent() {
  document.querySelectorAll(".card").forEach((card) => {
    console.log("Got the cards");
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });
  });
}

//function using the urls array to get the projects, card-templat
//  and organize them into a object with project and template
let resultOfPromises = async () => {
  const [dataRes, templateRes] = await Promise.all(
    urls.map((url) => fetch(url))
  );
  const projectData = await dataRes.json();
  const template = await templateRes.text();
  let temp = document.createElement("div");
  temp.innerHTML = template;
  return {
    projects: projectData,
    template: temp.querySelector("template"),
  };
};

//function to populate card with project data before adding them to the dom
function populateCardClone(project, clone) {
  let { demo_url: demo, github_url: code, goal, stack, image, title } = project;

  clone.querySelector("img").src = `http://localhost:5000/${image}`;
  clone.querySelector(".title").innerHTML = title;
  clone.querySelector(".about-project").innerHTML = goal;
  clone.querySelector(".view-code").href = code;
  clone.querySelector(".live-demo").href = demo;

  let stckContainer = clone.querySelector(".stack");

  // Split stack into words
  stack.split(" ").forEach((text) => {
    let liElem = document.createElement("li");
    liElem.innerHTML = text;
    stckContainer.append(liElem);
  });

  return clone;
}

//function to handle pagination

async function loadProjects() {
  let { projects, template } = await resultOfPromises();
  fetchedProjects = [...projects];
  totalPages = Math.ceil(fetchedProjects.length / itemsPerPage);
  cardTemplate = template;
  loadPaginatedData();
  // rehydrateCardEvent();
}

//Using the null as last  arguement because the fetchHtmlFrag expects rehydration function as it's last arguement
fetchHtmlFrag(fragmentUrl, parentElement, () => {
  loadProjects();
  let seeMoreBtn = document
    .querySelector("#see-more-btn")
    .querySelector("button");
  seeMoreBtn.addEventListener("click", () => {
    loadPaginatedData();
    // rehydrateCardEvent();
  });
});
