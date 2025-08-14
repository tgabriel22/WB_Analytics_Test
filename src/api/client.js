// import axios from "axios";

// const isHttps =
//   typeof window !== "undefined" && window.location.protocol === "https:";

// const api = axios.create({
//   baseURL: isHttps ? "/api/wb-proxy" : import.meta.env.VITE_API_BASE_URL,
//   timeout: 20000,
// });

// api.interceptors.request.use((config) => {
//   config.params = config.params || {};
//   const key = import.meta.env.VITE_API_KEY;
//   if (key) config.params.key = key; // <-- add key always
//   if (isHttps) config.params._ts = Date.now(); // cache-buster in prod
//   return config;
// });

// export default api;

import axios from "axios";

const isProd = import.meta.env.PROD;
const api = axios.create({
  baseURL: isProd
    ? import.meta.env.VITE_PROXY_URL // e.g. https://wb-proxy.onrender.com
    : import.meta.env.VITE_API_BASE_URL, // local dev direct to IP
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  config.params = config.params || {};
  // You said it's OK to show the key in requests:
  const key = import.meta.env.VITE_API_KEY;
  if (key) config.params.key = key;
  if (isProd) config.params._ts = Date.now(); // cache-buster
  return config;
});

export default api;
