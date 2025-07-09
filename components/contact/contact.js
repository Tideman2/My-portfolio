import fetchHtmlFrag from "../../js/fetch-html-frag.js";
import { notifyUser, NotifyLoading } from "./utils.js";

function getFormElement() {
  return document.querySelector("#message-me-form");
}

// Validate email
function validateGmail(userInput) {
  const gmailSuffix = "@gmail.com";
  if (!userInput) return false;
  userInput = userInput.toLowerCase();
  return userInput.endsWith(gmailSuffix) && userInput.indexOf("@") > 0;
}

function validateForEmpty(input) {
  if (!input) return false;
  console.log(input.length > 0);
  return input.trim().length > 0;
}

//function to send the post mail req to the backend
async function postMail(dataFromForm) {
  try {
    let response = await fetch("http://127.0.0.1:5000/api/mail/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataFromForm),
    });

    if (!response.ok) {
      // Extract error message from the response body if possible
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send message");
    }
    NotifyLoading.stopLoadingEffect();
    const data = await response.json();

    console.log("Message sent successfully:", data);
    notifyUser("Message sent successfully", "valid-message", 3000);
    return data;
  } catch (err) {
    NotifyLoading.stopLoadingEffect();
    notifyUser("Failed to send message", "error-message", 3000);
    console.error("Error sending message:", err.message);
    throw err;
  }
}

function handleBtnClick({ e }) {
  e.preventDefault();
  const fromEl = getFormElement();
  const form = new FormData(fromEl);
  const email = form.get("email");
  const name = form.get("name");
  const subject = form.get("subject");
  const message = form.get("message");

  if (!validateGmail(email)) {
    notifyUser("Please input a valid Gmail address", "error-message", 3000);
  } else if (
    !validateForEmpty(name) ||
    !validateForEmpty(subject) ||
    !validateForEmpty(message)
  ) {
    notifyUser("No input field should be empty", "error-message", 3000);
  } else {
    let dataFromForm = {
      name,
      subject,
      message,
      email,
    };
    NotifyLoading.startLoadingEffect();
    postMail(dataFromForm);
    fromEl.reset();
  }
}

// After the HTML is loaded into the DOM
function load() {
  const btn = document.querySelector("#message-me-btn");
  btn.addEventListener("click", (e) => handleBtnClick({ e }));
}

fetchHtmlFrag("../../components/contact/contact.html", "#contact-place", load);
