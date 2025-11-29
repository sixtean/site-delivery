import api from "../hooks/api";

export async function getCompanyInfo() {
    try {
        const response = await api.get("company/profile");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar empresa:", error);
        throw error;
    }
}