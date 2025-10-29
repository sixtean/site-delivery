import { LoginService } from "../services/Login.service";

export async function LoginController(id: number, password: string) {
  try {

    if (!id || !password) {
      throw new Error("ID and Password are required");
    }

    const response = await LoginService(id, password);
    return response;

  } catch (error) {
    console.error("Login controller error:", error);
    throw error;
  }
}