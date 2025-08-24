window.APP_CONFIG = {
  API_URL: "http://localhost:5000",
  IMG_URL: "https://tideman2.github.io/My-portfolio/static/project_images",

  getDynamicApiUrl() {
    if (window.location.hostname !== "localhost") {
      return "https://my-portfolio-backend-1rwp.onrender.com";
    }
    return this.API_URL;
  },

  getImageUploadUrl() {
    return this.IMG_URL;
  },
};

// Usage:
const apiUrl = window.APP_CONFIG.getDynamicApiUrl();
