window.APP_CONFIG = {
  API_URL: "http://localhost:5000",

  getDynamicApiUrl() {
    if (window.location.hostname !== "localhost") {
      return "https://my-portfolio-backend-1rwp.onrender.com";
    }
    return this.API_URL;
  },
};

// Usage:
const apiUrl = window.APP_CONFIG.getDynamicApiUrl();
