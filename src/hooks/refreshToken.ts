import axios from "axios";
import { RefreshController } from "../controller/Refresh.Controller";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const accessToken = sessionStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('Tentando renovar token...');
        const refreshed = await RefreshController();

        if(refreshed?.accessToken) {
          api.defaults.headers.common["Authorization"] = `Bearer ${refreshed.accessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${refreshed.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Erro ao atualizar token:", refreshError);
        sessionStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;