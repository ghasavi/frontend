// src/utils/getBackendUrl.js
export const getBackendUrl = () => {
  // If environment variable exists, use it
  if (import.meta.env.VITE_BACKEND_URL) return import.meta.env.VITE_BACKEND_URL;

  // Otherwise, fallback to localhost
  return "http://localhost:5000";
};
