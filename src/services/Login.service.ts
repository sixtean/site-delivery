import axios from "axios";

const API_URL = "http://localhost:3000/auth";


export async function LoginService(id: number, password: string) {

    try{
        const response = await axios.post(`${API_URL}/login-company`, {
            id,
            password,
        });
        return response.data;
    } catch (error) {
        console.error("LoginService error:", error);
        throw error;
    }
}