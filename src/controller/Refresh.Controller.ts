import { RefreshService } from "../services/Refresh.Service";

export async function RefreshController() {
  console.log('RefreshController chamado');
  try {
    const response = await RefreshService();
    if (response?.accessToken) {
      sessionStorage.setItem("accessToken", response.accessToken);
    }
    return response;
  } catch (error) {
    console.error("Erro no RefreshController:", error);
    throw error;
  }
}