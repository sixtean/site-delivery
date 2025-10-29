import api from "../hooks/refreshToken";

export async function RefreshService(refreshToken: string) {
  const response = await api.post("/auth/refresh", { refreshToken });
  return response.data;
}