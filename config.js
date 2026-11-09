window.APP_CONFIG = {
  API_URL: "http://localhost:5001",
  DEPLOYED_API_URL: "https://my-portfolio-backend-1rwp.onrender.com",

  getDynamicApiUrl() {
    const hostname = window.location.hostname;
    const base =
      hostname !== "localhost" && hostname !== "127.0.0.1"
        ? this.DEPLOYED_API_URL
        : this.API_URL;
    return String(base).replace(/\/+$/, "");
  },

  getImageUploadUrl() {
    return this.getDynamicApiUrl();
  },
};

// Usage:
const apiUrl = window.APP_CONFIG.getDynamicApiUrl();
