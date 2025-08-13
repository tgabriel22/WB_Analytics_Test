import axios from "axios";

const isHttps =
  typeof window !== "undefined" && window.location.protocol === "https:";
const api = axios.create({
  baseURL: isHttps ? "/api/wb-proxy" : import.meta.env.VITE_API_BASE_URL,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  if (!isHttps) {
    const key = import.meta.env.VITE_API_KEY;
    config.params = config.params || {};
    if (key) config.params.key = key;
  }
  return config;
});

export default api;
