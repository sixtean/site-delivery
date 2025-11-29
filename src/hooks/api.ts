import axios from "axios";

const api = axios.create({
    baseURL: "https://zoryonwipe.online/",
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if(error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }
        if (originalRequest.url.includes("/auth/refresh")) {
            window.location.href = "/";
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise(function (resolve, reject) {
                failedQueue.push({ resolve, reject });
            })
            .then(() => api(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;

        try {
            await api.post("auth/refresh", {}, { withCredentials: true });
            processQueue(null);
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            window.location.href = "/";
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;