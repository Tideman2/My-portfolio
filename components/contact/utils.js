//messageType is a string and can either me valid-messaage(success) or
//error-message(failure)
//timeSpan is an interger
// The notify function returns the id of the timeout to clear the notify tag
//Use if needed to clear the timeout if intending to use the notify tag again
export function notifyUser(message, messageType, timeSpan) {
  let notifyTag = document.querySelector("#notification-tag");
  notifyTag.innerHTML = message;
  notifyTag.classList.add(messageType);
  return setTimeout(() => {
    notifyTag.innerHTML = "";
    notifyTag.classList.remove(messageType);
  }, timeSpan);
}

// A loading class that  will be providing the static methods and attributes to start and end the loading
// effect

export class NotifyLoading {
  static get notifyTag() {
    return document.querySelector("#notification-tag");
  }

  static loadTextIntId;
  static removeTextIntId;
  static lodaingText = "Sending...";
  static intervalId;

  static clearIntervalHelper(interv) {
    clearInterval(interv);
  }

  static loadTextToNotifytag(callback) {
    let indexOfNextText = 0;
    this.loadTextIntId = setInterval(() => {
      let currentText = this.lodaingText[indexOfNextText];
      this.notifyTag.append(currentText);
      indexOfNextText += 1;
      if (indexOfNextText === this.lodaingText.length) {
        this.clearIntervalHelper(this.loadTextIntId);
        callback();
      }
    }, 100);
  }

  static removeTextFromNotifytag() {
    let indexOfNextToRemove = this.lodaingText.length - 1;
    this.removeTextIntId = setInterval(() => {
      if (indexOfNextToRemove >= 0) {
        if (this.notifyTag.lastChild) {
          this.notifyTag.lastChild.remove();
        }
        indexOfNextToRemove--;
      } else {
        this.clearIntervalHelper(this.removeTextIntId);
      }
    }, 100);
  }

  static startLoadingEffect() {
    this.stopLoadingEffect();
    let timeBetweenEffects = this.lodaingText.length * 100 * 2;
    this.intervalId = setInterval(() => {
      this.loadTextToNotifytag(this.removeTextFromNotifytag.bind(this));
    }, timeBetweenEffects);
    return this.intervalId;
  }

  static stopLoadingEffect() {
    if (this.intervalId) {
      this.notifyTag.innerHTML = "";
      this.clearIntervalHelper(this.loadTextIntId);
      this.clearIntervalHelper(this.removeTextIntId);
      this.clearIntervalHelper(this.intervalId);
    }
  }
}
