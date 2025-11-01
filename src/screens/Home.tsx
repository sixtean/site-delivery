import { useEffect, useState } from "react";
import { Copy, Check, AlertTriangle, Printer, BellOff, XCircle } from "lucide-react";

import type { Company } from "../DTOs/Company";
import ThemeToggle from "../utils/togleTheme";
import { getCompanyInfo } from "../services/company.service";

import useTitle from "../hooks/title";
import Menu from "../utils/menu";

function Home() {
    const [copied, setCopied] = useState(false);
    const [company, setCompany] = useState<Company>({
        id: 0,
        name: "",
        orders: [],
        products: [],
        created_at: "",
        updated_at: "",
    });

    const [alerts, setAlerts] = useState([
        { id: 1, type: 'Delay', message: 'Pedido 143 atrasado há 14 min' },
        { id: 2, type: 'Printer', message: 'Impressora desconectada' },
        { id: 3, type: 'Offiline', message: 'Entregador Lucass está desconectado há 20 min' },
        { id: 4, type: 'stock', message: 'Estoque baixo em "Batata palha"' },
    ])

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
        setCopied(true);
        setTimeout(() => setCopied(false), 2000)
    };
    
    return (
        <>
            <main className="min-h-screen flex flex-col items-center justify-center ">
                {company ? (
                    <>
                        <header
                            className="absolute top-10 left-28 px-6 py-4 
                                        border border-gray-300 rounded-xl 
                                        bg-gray-100/90 text-gray-800 
                                        shadow-[0_4px_20px_rgba(0,0,0,0.15)] 
                                        backdrop-blur-sm
                                        font-semibold tracking-wide 
                                        flex flex-col gap-2 w-[340px]"
                            > 
                            <h1 className="text-lg drop-shadow-sm text-gray-900">
                                {company.name}
                            </h1>
                            <div className="flex items-center gap-2 bg-white p-2 rounded-md text-sm border border-gray-300">
                                <input
                                    type="text"
                                    readOnly
                                    value={
                                        copied
                                            ? "Link copiado!"
                                            : "Envie este link para os clientes fazerem pedidos"
                                    }
                                    onFocus={(e) => e.target.select()}
                                    className={`bg-transparent w-full outline-none select-none cursor-default transition-colors duraction-300 ${
                                        copied ? "text-green-600" : "text-gray-700"
                                    }`}
                                />    
                                {copied ? (                        
                                    <button
                                        className="p-1 bg-green-100 text-green-700 rounded transition-all duraction-300"
                                        title="Copiado!"
                                    >
                                        <Check size={16} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={copyToClipboard}
                                        className="p-1 hover:bg-gray-100 rounded transition-all duraction-300"
                                        title="Copiar link"
                                    >
                                        <Copy size={16} />
                                    </button>
                                )}
                            </div>
                        </header>
                        <section className="mt-6 w-[340px] bg-white border border-red-200 rounded-xl shadow-sm p-4">
                            <h2 className="text-gray-800 font-bold text-md mb-2">
                                Alertas e prioridades
                            </h2>
                            <ul className="flex flex-col gap-2 text-sm text-gray-700">
                                {alerts.map((alert) => (
                                    <li
                                        key={alert.id}
                                        className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 p-2 rounded-md hover:bg-yellow-100 transition"
                                        >
                                        {alert.type === "delay" && <AlertTriangle className="text-yellow-600" size={16} />}
                                        {alert.type === "printer" && <Printer className="text-red-600" size={16} />}
                                        {alert.type === "offline" && <BellOff className="text-gray-600" size={16} />}
                                        {alert.type === "stock" && <XCircle className="text-red-700" size={16} />}
                                        <span>{alert.message}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

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