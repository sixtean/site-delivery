import { useState, useEffect } from "react";
import type { Company } from "../DTOs/Company";
import { getCompanyInfo } from "../services/company.service";
import useTitle from "../hooks/title";
import Menu from "../components/menu";

function Stock() {
    const [company, setCompany] = useState<Company>({
        id: 0,
        name: "",
        orders: [],
        products: [],
        created_at: "",
        updated_at: "",
    });

    useEffect(() => {
        async function fetchCompany() {
          try {
            const data = await getCompanyInfo();
            setCompany(data.company);
          } catch (error) {
            console.error("Erro ao buscar informações da empresa:", error);
          }
        }
        fetchCompany();
    }, []);

    useTitle(company.name, "Stock")
    return (
        <>
            <main className="min-h-screen flex md:flex-row gap-6 p-4 md:p-8 relative overflow-hidden">
                <Menu />
            </main>
        </>
    )
}

export default Stock;