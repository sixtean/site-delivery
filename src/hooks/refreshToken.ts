import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = sessionStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const { data } = await axios.post("http://localhost:3000/auth/refresh", {
            refreshToken,
          });

          sessionStorage.setItem("accessToken", data.accessToken);
          if (data.refreshToken) sessionStorage.setItem("refreshToken", data.refreshToken);

          api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Erro ao renovar token:", refreshError);

          sessionStorage.clear();
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;