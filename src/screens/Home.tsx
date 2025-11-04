import { useEffect, useState } from "react";
import { Copy, Check, AlertTriangle, Printer, BellOff, XCircle } from "lucide-react";
import type { Company } from "../DTOs/Company";
import { getCompanyInfo } from "../services/company.service";
import useTitle from "../hooks/title";
import Menu from "../components/menu";
import DeliveryMap from "../components/DeliveryMap";

// Exemplo Orders
const orders = [
    {
    id: 1,
    description: "2x Pizza Margherita, 1x Refrigerante 600ml",
    status: "Em preparação",
    image:
      "https://images.unsplash.com/photo-1601924928310-18152e668e4b?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    description: "1x Hambúrguer Artesanal, 1x Batata Frita",
    status: "Saiu para entrega",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    description: "3x Sushi Mix, 2x Sake",
    status: "Pedido recebido",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    description: "1x Lasanha Bolonhesa, 1x Suco Natural",
    status: "Entregue",
    image:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&q=80",
  },
];

function Home() {
  const [copied, setCopied] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [company, setCompany] = useState<Company>({
    id: 0,
    name: "",
    orders: [],
    products: [],
    created_at: "",
    updated_at: "",
  });

  const [alerts, setAlerts] = useState([
    
  ]);

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
    fetchCompany();
  }, []);

  const companyLink = `${window.location.origin}/register/${company.id}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(companyLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
        <main className="min-h-screen flex md:flex-row gap-6 p-4 md:p-8 relative overflow-hidden">
            {company ? (
                <>
                    <Menu />
                    <div className="flex flex-col w-full gap-6">
                        <div className="flex">
                            <div className="flex flex-col gap-6 w-full md:w-[420px] z-20 relative">
                                <header
                                    className="
                                        border border-gray-300 rounded-xl 
                                        bg-gray-100/90 text-gray-800 shadow-lg backdrop-blur-sm
                                        font-semibold tracking-wide flex flex-col
                                        dark:bg-[#121212] dark:text-white dark:border-gray-800
                                        mx-auto md:mx-0
                                        md:p-4
                                        transition-all duration-300
                                    "
                                >
                                    <h1 className="cursor-default select-none text-base md:text-lg text-center md:text-left text-gray-900 dark:text-white font-semibold ml-1">
                                        {company.name} App
                                    </h1>
                                    <div className="
                                        flex items-center gap-2 bg-white p-2 rounded-md text-sm border border-gray-300
                                        dark:bg-[#1e1e1e] dark:border-gray-700 transition-all duration-300
                                    ">
                                        <input
                                            type="text"
                                            readOnly
                                            value={
                                            copied
                                                ? "Link copiado!"
                                                : "Envie este link para os clientes fazerem pedidos"
                                            }
                                            className={`bg-transparent w-full outline-none select-none cursor-default transition-colors duration-300 ${
                                            copied ? "text-green-600" : "text-gray-400"
                                            }`}
                                        />
                                        {copied ? (
                                            <button
                                            className="p-1 bg-green-100 text-green-700 rounded transition-all duration-300"
                                            title="Copiado!"
                                            >
                                            <Check size={16} />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={copyToClipboard}
                                                className="p-1 hover:bg-gray-100 rounded transition-all duration-300 dark:text-white"
                                                title="Copiar link"
                                            >
                                                <Copy size={16} />
                                            </button>
                                        )}
                                    </div>
                                </header>

                                <section
                                    className="
                                        bg-white border border-gray-200 
                                        rounded-xl shadow-sm p-4 dark:bg-[#121212] dark:border-gray-800
                                        overflow-y-auto h-[40vh]
                                        transition-all duration-300
                                    "
                                >   
                                    {alerts.length === 0 ? (
                                        <div className="flex flex-col text-center justify-center items-center h-full">
                                            <i className="bi bi-check2-circle text-6xl text-gray-700 dark:text-white/90"></i>
                                            <p className="text-black dark:text-white/90">Tudo certo por aqui!!!</p>
                                        </div>
                                    ) : (
                                        <>
                                            <h2 className="text-gray-800 font-bold text-md mb-3 dark:text-white text-center md:text-left pb-2">
                                                Alertas e prioridades
                                            </h2>
                                            <ul className="flex flex-col gap-2 text-sm text-gray-700 cursor-default pr-1">
                                                {alerts.map((alert) => (
                                                    <li
                                                        key={alert.id}
                                                        className="
                                                            flex items-center gap-2 bg-red-10 border border-red-200 
                                                            p-2 rounded-md hover:bg-red-100
                                                            dark:bg-[#1e1e1e] dark:border-gray-800 dark:hover:bg-gray-700
                                                            transition
                                                        "
                                                    >
                                                        {alert.type === "delay" && (
                                                            <AlertTriangle className="text-yellow-600" size={16} />
                                                        )}
                                                        {alert.type === "printer" && (
                                                            <Printer className="text-red-600" size={16} />
                                                        )}
                                                        {alert.type === "offline" && (
                                                            <BellOff className="text-gray-600" size={16} />
                                                        )}
                                                        {alert.type === "stock" && (
                                                            <XCircle className="text-red-700" size={16} />
                                                        )}
                                                        <span className="dark:text-gray-200">{alert.message}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </section>
                            </div>

                            <section
                                className="
                                    hidden
                                    lg:flex flex-col
                                    top-10
                                    w-full ml-6
                                    bg-white border border-gray-200 rounded-2xl shadow-lg p-5
                                    dark:bg-[#121212] dark:border-gray-800
                                    z-20 transition-all duration-300
                                "
                            >
                                <h2 className="text-xl text-gray-700 font-semibold mb-2 dark:text-white">
                                    Mapa de entregadores
                                </h2>
                                <div className="flex-1 rounded-lg overflow-hidden">
                                    <DeliveryMap />
                                </div>
                            </section>
                        </div>

                        <section className="        
                                flex gap-2
                            "
                        >
                            {orders.length === 0 ? (
                                <div className="flex justify-center text-center items-center">
                                    <p className="text-gray-500 dark:text-gray-400 self-center mx-auto">
                                        Nenhum pedido realizado ainda.
                                    </p>
                                </div>
                            ) : (
                                orders.map((order) => (
                                    <div
                                        key={order.id}
                                        onClick={() => setSelectedOrder(order.id)}
                                        className={
                                            `
                                                w-34 sm:w-40 md:w-52 lg:w-36
                                                bg-gray-50 dark:bg-[#1b1b1b]
                                                p-2 rounded-xl shadow-md flex flex-col cursor-pointer
                                                hover:shadow-xl hover:scale-[1.03] transition-all duration-300
                                                border border-gray-200 dark:border-gray-700
                                                ${selectedOrder === order.id ? "ring-2 ring-red-500" : ""}
                                            `
                                        }
                                    >
                                        <img
                                            src={order.image}
                                            alt={`Imagem do pedido ${order.id}`}
                                            className="w-full h-28 object-cover rounded-xl mb-3"
                                        />
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                            Pedido #{order.id}
                                        </h3>
                                        <p className="mt-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                                            {order.status}
                                        </p>
                                    </div>
                                ))
                            )}
                        </section>
                    </div>  
                    {selectedOrder !== null && (
                        <div
                            onClick={() => setSelectedOrder(null)}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] backdrop-blur-sm"
                        >
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white dark:bg-[#121212] rounded-2xl shadow-2xl max-w-md w-[90%] p-6 relative transition-all duration-300"
                            >
                                {orders
                                    .filter((o) => o.id === selectedOrder)
                                    .map((order) => (
                                        <div
                                            key={order.id}
                                            className="flex flex-col gap-4"
                                        >
                                            <img
                                                src={order.image}
                                                alt={`Imagem do pedido ${order.id}`}
                                                className="w-full h-48 object-cover rounded-md"
                                            />
                                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Pedido #{order.id}
                                            </h2>
                                            <p className="text-gray-700 dark:text-gray-300">{order.description}</p>
                                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                                Status: {order.status}
                                            </p>

                                            <button
                                                onClick={() => setSelectedOrder(null)}
                                                className="self-end mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all"
                                            >
                                                Fechar
                                            </button>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-center mt-10">Carregando...</p>
            )}
        </main>
    </>
  );
}

export default Home;
