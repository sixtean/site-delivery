import { RefreshService } from "../services/Refresh.Service";

export async function RefreshController(refreshToken: string) {
  console.log('RefreshController chamado com token:', refreshToken);
  try {
    if (!refreshToken) throw new Error("Refresh token ausente.");

    const response = await RefreshService(refreshToken);
    if (response?.accessToken) {
      sessionStorage.setItem("accessToken", response.accessToken);
    }
    if (response?.refreshToken) {
      sessionStorage.setItem("refreshToken", response.refreshToken);
    }

    return response;
  } catch (error) {
    console.error("Erro no RefreshController:", error);
    throw error;
  }
}