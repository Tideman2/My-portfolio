window.APP_CONFIG = {
  API_URL: "http://localhost:8000",

  getDynamicApiUrl() {
    const hostname = window.location.hostname;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return "https://my-portfolio-backend-1rwp.onrender.com";
    }
    return this.API_URL;
  },

  getImageUploadUrl() {
    return this.getDynamicApiUrl();
  },
};

// Usage:
const apiUrl = window.APP_CONFIG.getDynamicApiUrl();
