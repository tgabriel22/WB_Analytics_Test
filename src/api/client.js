import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const key = import.meta.env.VITE_API_KEY;
  config.params = config.params || {};
  // always append ?key=...
  if (key) config.params.key = key;
  return config;
});

export default api;
