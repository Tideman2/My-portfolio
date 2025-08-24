let adminForm = document.querySelector("#admin-form");
let notifyElem = document.querySelector("#notify");
const API_URL = window.APP_CONFIG.getDynamicApiUrl();
console.log(adminForm);

//function to validate password
function validatePassword(input) {
  return input.length > 7;
}

adminForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let formData = new FormData(e.target);
  let { password, username } = Object.fromEntries(formData.entries());

  if (!validatePassword(password)) {
    notifyElem.innerHTML = "Password must be at least 8 characters";
    notifyElem.style.color = "red";
    return;
  }

  //Clear notification
  notifyElem.innerHTML = "";
  notifyElem.style.color = "none";
  let dataBody = {
    username,
    password,
  };

  try {
    let token = await login(dataBody);
    if (token) {
      console.log(token);
      localStorage.setItem("token", token);
      window.location.href = "admin.html";
    } else {
      notifyElem.innerHTML = "Invalid credentials";
      notifyElem.style.color = "red";
    }
  } catch (err) {
    notifyElem.innerHTML = "Server error";
    notifyElem.style.color = "red";
  }
});

async function login(bodyData) {
  let response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST", // or "GET", "DELETE", etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyData), // <-- for POST/PUT requests
  });

  if (response.ok) {
    let data = await response.json();
    return data.access_token; // <-- returning the token
  } else {
    return null;
  }
}
