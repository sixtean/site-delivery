import api from "../hooks/refreshToken";

export async function LoginService(id: number, password: string) {

    try{
        const response = await api.post(`auth/login-company`, {
            id,
            password,
        });
        return response.data;
    } catch (error) {
        console.error("LoginService error:", error);
        throw error;
    }
}