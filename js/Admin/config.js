window.APP_CONFIG = {
  API_URL: "https://my-portfolio-backend-1rwp.onrender.com",

  getDynamicApiUrl() {
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return "http://localhost:5000";
    }
    return this.API_URL;
  },
};

// Usage:
const apiUrl = window.APP_CONFIG.getDynamicApiUrl();
