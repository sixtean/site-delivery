import { useEffect, useState } from "react";
import useTitle from "../hooks/title";
import Menu from "../utils/menu";
import ThemeToggle from "../utils/togleTheme";
import { getCompanyInfo } from "../services/company.service";

import type { Company } from "../DTOs/Company";

function Home() {
    const [company, setCompany] = useState<Company>({
        id: 0,
        name: "",
        orders: [],
        products: [],
        created_at: "",
        updated_at: "",
    });

    useTitle(company.name, "Home");

    useEffect(() => {
        async function fetchCompany() {
            try {
                const data = await getCompanyInfo();
                setCompany(data.company);
            } catch (error) {
                console.error("Erro ao buscar informações da empresa:", error);
            }
        }
        fetchCompany()
    }, []);
    
    return (
        <>
            <main className="min-h-screen flex flex-col items-center justify-center ">
                {company ? (
                    <>
                        <Menu />
                        <ThemeToggle />
                        <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
                        <p className="text-gray-600">Bem-vindo(a), {company.name}!</p>
                    </>
                ) : (
                    <p className="text-center mt-10">Carregando...</p>
                )}
            </main>
        </>
    )
}

export default Home;