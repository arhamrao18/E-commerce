import axios from "axios";
 
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const TOKEN_KEY = "lumen_tokens";
 
export const api = axios.create({ baseURL: BASE_URL });
 
export function getTokens() {
  try {
    return JSON.parse(localStorage.getItem(TOKEN_KEY)) || null;
  } catch {
    return null;
  }
}
 
export function setTokens(tokens) {
  if (tokens) localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  else localStorage.removeItem(TOKEN_KEY);
}
 
// Attach the access token to every request
api.interceptors.request.use((config) => {
  const tokens = getTokens();
  if (tokens?.access) config.headers.Authorization = `Bearer ${tokens.access}`;
  return config;
});
 
// On 401, try once to refresh the access token, then retry the request
let refreshPromise = null;
 
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const tokens = getTokens();
 
    if (error.response?.status !== 401 || original._retry || !tokens?.refresh) {
      return Promise.reject(error);
    }
    original._retry = true;
 
    try {
      // plain axios call so this request doesn't go through the interceptors again
      refreshPromise =
        refreshPromise || axios.post(`${BASE_URL}/auth/refresh/`, { refresh: tokens.refresh });
      const { data } = await refreshPromise;
      refreshPromise = null;
 
      // backend rotates refresh tokens, so save the new one if it sends it
      setTokens({ access: data.access, refresh: data.refresh || tokens.refresh });
      original.headers.Authorization = `Bearer ${data.access}`;
      return api(original);
    } catch (refreshError) {
      refreshPromise = null;
      setTokens(null);
      return Promise.reject(refreshError);
    }
  }
);
 