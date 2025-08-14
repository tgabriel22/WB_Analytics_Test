import axios from "axios";

const isHttps =
  typeof window !== "undefined" && window.location.protocol === "https:";

const api = axios.create({
  baseURL: isHttps ? "/api/wb-proxy" : import.meta.env.VITE_API_BASE_URL,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  config.params = config.params || {};
  const key = import.meta.env.VITE_API_KEY;
  if (key) config.params.key = key; // <-- add key always
  if (isHttps) config.params._ts = Date.now(); // cache-buster in prod
  return config;
});

export default api;
