import { useEffect, useState } from "react";
import useTitle from "../hooks/title";
import Menu from "../utils/menu";
import ThemeToggle from "../utils/togleTheme";
import { getCompanyInfo } from "../services/company.service";
import { Copy } from "lucide-react";

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

    const companyLink = `${window.location.origin}/register/${company.id}`;

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(companyLink);
        alert("Link copiado para a área de transferência!");
    };
    
    return (
        <>
            <main className="min-h-screen flex flex-col items-center justify-center ">
                {company ? (
                    <>
                        <header
                            className="absolute top-10 left-28 px-6 py-4 
                                        border border-red-400/30 rounded-xl 
                                        bg-gradient-to-r from-red-500/90 to-red-600/90 
                                        shadow-[0_4px_20px_rgba(0,0,0,0.15)] 
                                        backdrop-blur-sm text-white
                                        font-semibold tracking-wide 
                                        flex flex-col gap-2 w-[340px]"
                            > 
                            <h1 className="text-lg drop-shadow-sm">
                                {company.name}
                            </h1>
                            <div className="flex items-center gap-2 bg-white/10 p-2 rounded-md text-sm">
                                <input
                                    type="text"
                                    readOnly
                                    value={companyLink}
                                    className="bg-transparent text-white w-full outline-none"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="p-1 hover:bg-white/20 rounded transition"
                                    title="Copiar link"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                            <p className="text-x5 text-white/80">
                                Compartilhe este link para que seus clientes possam fazer pedidos!
                            </p>
                        </header>
                        <Menu />
                        <ThemeToggle />
                    </>
                ) : (
                    <p className="text-center mt-10">Carregando...</p>
                )}
            </main>
        </>
    )
}

export default Home;