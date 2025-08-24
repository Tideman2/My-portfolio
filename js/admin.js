const projConainer = document.querySelector("#projects_container");
const template = document.getElementById("projectTemplate");
const API_URL = window.APP_CONFIG.getDynamicApiUrl();
let exitBtn = document.getElementById("exit");

function renderProjects() {
  projConainer.innerHTML = ""; // clear old content
  fetch(`${API_URL}/api/projects/`)
    .then((res) => res.json())
    .then((data) => {
      if (data.length < 1) {
        projConainer.textContent = "No Project in data-base, add a project";
        return;
      }
      for (let proj of data) {
        let div = document.createElement("div");
        let btn = document.createElement("button");
        btn.textContent = "Delete";
        btn.dataset.id = proj.id;
        attachDeleteEvent(btn);

        let clone = template.content.cloneNode(true);
        clone.querySelector(".title").textContent = proj.title;
        clone.querySelector(".stack").textContent = proj.stack;

        div.appendChild(clone);
        div.appendChild(btn);
        projConainer.appendChild(div);
      }
    })
    .catch((err) => console.log("Error occurred:", err));
}

// Call renderProjects on page load
renderProjects();

// Add project form submission
document.querySelector("#projectForm").addEventListener("submit", (e) => {
  e.preventDefault();
  let token = localStorage.getItem("token");
  console.log(token);
  const formData = new FormData(e.target);
  fetch("http://127.0.0.1:5000/api/projects/", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      renderProjects(); // <--- Refresh project list here
      e.target.reset();
    })
    .catch((err) => {
      alert("Project creation failed");
      console.error(err);
    });
});

// Delete event handler function
function attachDeleteEvent(elem) {
  elem.addEventListener("click", (e) => {
    let token = localStorage.getItem("token");
    let id = Number(e.currentTarget.dataset.id);
    fetch(`http://127.0.0.1:5000/api/projects/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        renderProjects(); // <--- Refresh project list after delete
      })
      .catch((err) => console.error(err));
  });
}

//Route protection logic

async function checkIfAuth() {
  let token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "adminindex.html"; // redirect to login
    console.log("No token");
  }

  let res = await fetch(`http://127.0.0.1:5000/api/auth/verify`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  if (!res.ok) {
    window.location.href = "adminindex.html";
    console.log("unauthorized");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  checkIfAuth();
});

exitBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "adminindex.html";
});
