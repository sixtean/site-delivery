import api from "../hooks/refreshToken";

export async function RefreshService() {
  const response = await api.post("/auth/refresh", {}, { withCredentials: true });
  return response.data;
}