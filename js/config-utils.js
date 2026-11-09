export const LOCAL_API_URL = "http://localhost:5001";
export const DEPLOYED_API_URL = "https://my-portfolio-backend-1rwp.onrender.com";

export function normalizeBaseUrl(url) {
  return String(url ?? "").trim().replace(/\/+$/, "");
}

export function resolveApiBase(
  hostname,
  localUrl = LOCAL_API_URL,
  deployedUrl = DEPLOYED_API_URL
) {
  const host = String(hostname ?? "");
  const base =
    host === "localhost" || host === "127.0.0.1" ? localUrl : deployedUrl;
  return normalizeBaseUrl(base);
}
