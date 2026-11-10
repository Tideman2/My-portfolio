export function setContactStatus(message, type = "info") {
  const element = document.querySelector("#contact-status");
  if (!element) return;
  element.textContent = message;
  element.hidden = false;
  element.classList.toggle("error", type === "error");
  element.classList.toggle("success", type === "success");
}

export function setSubmitButtonState(button, isSending, sendingText = "Sending…") {
  if (!button) return;
  if (isSending) {
    button.dataset.originalText = button.textContent;
    button.disabled = true;
    button.textContent = sendingText;
    return;
  }
  button.disabled = false;
  button.textContent = button.dataset.originalText ?? button.textContent;
}
