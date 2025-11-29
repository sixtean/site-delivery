import { useEffect, useState } from "react";
import { Copy, Check, XCircle } from "lucide-react";
import type { Company } from "../DTOs/Company";
import { getCompanyInfo } from "../services/company.service";
import { getProducts } from "../services/product.service";
import useTitle from "../hooks/title";
import Menu from "../components/menu";
import DeliveryMap from "../components/DeliveryMap";
import { useNotify } from "../components/useNotify";

const orders: any[] = [];

function Home() {
    const [copied, setCopied] = useState(false);
    const { showNotify, NotifyComponent } = useNotify();
    const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
    const [company, setCompany] = useState<Company>({
        id: 0,
        name: "",
        orders: [],
        products: [],
        created_at: "",
        updated_at: "",
    });

    const [alerts, setAlerts] = useState<any[]>([]);
    const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);

    useTitle(company.name, "Home");

    function exportLowStockToCSV(lowStockProducts: any[]) {
        if (!lowStockProducts || lowStockProducts.length === 0) {
          showNotify({
            title: "Erro ao exportar",
            message: "Não há produtos com estoque baixo para exportar.",
            type: "error",
            duration: 3000,
          });
          return;
        }
      
        const headers = [
          'ID', 'Company', 'Category', 'Name', 'Description',
          'Price', 'Stock', 'Created At', 'Updated At'
        ];
      
        const rows = lowStockProducts.map(p => {
          let priceNumber = Number(p.price);
          if (isNaN(priceNumber)) priceNumber = 0;
      
          return [
            p.id,
            p.company?.name || '',
            p.category?.name || '',
            p.name,
            p.description || '',
            priceNumber.toFixed(2),
            p.stock,
            new Date(p.created_at).toLocaleDateString(),
            new Date(p.updated_at).toLocaleDateString()
          ];
        });
      
        const csvContent = [
          headers.join(','),
          ...rows.map(row => row.map(field => `"${field}"`).join(','))
        ].join('\n');
      
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = 'estoque_baixo.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }      

    useEffect(() => {
        async function fetchCompany() {
        try {
            const data = await getCompanyInfo();
            setCompany(data.company);
            const productsData = await getProducts();

            const lowStock = productsData.filter((p: any) => p.stock < 5);
            setLowStockProducts(lowStock);

            const stockAlerts = lowStock.map((p: any) => ({
            id: p.id,
            type: "stock",
            message: `Estoque baixo: ${p.name} (${p.stock} unidades)`,
            }));

            setAlerts(stockAlerts);
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
            <main className="select-none min-h-screen flex md:flex-row gap-6 md:p-8 overflow-hidden">
                {company ? (
                    <>
                        <Menu />
                        <div className="flex flex-wrap lg:flex-row w-full gap-6">
                            <div className="flex h-[55vh] xl:h-[65vh]">
                                <div className="flex flex-col gap-4 w-full lg:w-[30vw] min-h-0 z-20 relative"
                                >
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
                                        <h1 className="cursor-default text-base md:text-lg text-center md:text-left text-gray-900 dark:text-white font-semibold ml-1">
                                            {company.name}
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
                                                className={`bg-transparent w-full outline-none cursor-default transition-colors duration-300 ${
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
                                            overflow-y-auto h-full
                                            transition-all duration-300
                                        "
                                    >   
                                        {alerts.length === 0 ? (
                                            <div className="flex flex-col text-center justify-center items-center h-full">
                                                <i className="bi bi-check2-circle text-6xl text-gray-700 dark:text-blue-800/90"></i>
                                                <p className="text-black dark:text-blue-800/90">Tudo certo por aqui</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex justify-between">
                                                    <h2 className="text-gray-800 font-bold text-md mb-3 dark:text-white text-center md:text-left pb-2">
                                                        Alertas e prioridades
                                                    </h2>
                                                    <button
                                                        className="text-2xl mb-6 dark:text-gray-300 dark:hover:text-gray-400 text-blue-600 hover:text-blue-800 transition-all duraction-500"
                                                        onClick={() => exportLowStockToCSV(lowStockProducts)}
                                                    >
                                                        <i className="bi bi-file-earmark-arrow-down"></i>
                                                    </button>
                                                </div>
                                                <ul className="flex flex-col gap-2 text-sm text-gray-700 cursor-default pr-1">
                                                    {alerts.map((alert) => (
                                                        <li
                                                        key={alert.id}
                                                        className="
                                                        flex items-center gap-2 bg-red-10 border border-red-200
                                                        p-2 rounded-lg hover:bg-red-100/90
                                                        dark:bg-[#1e1e1e] dark:border-gray-800 dark:hover:bg-gray-700
                                                        transition-all duration-300
                                                        "
                                                    >
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
                                        lg:flex flex-col flex-1
                                        bg-white border border-gray-200 rounded-2xl shadow-lg p-5 ml-6
                                        dark:bg-[#121212] dark:border-gray-800
                                        z-20 transition-all duration-300 w-[55vw]
                                        
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
                                    flex flex-wrap justify-start gap-4 max-h-[30vh] xl:max-h-[25vh]
                                "
                            >
                                {orders.length === 0 ? (
                                    <div className="flex justify-center text-center items-center w-full">
                                        <p className="text-gray-500 dark:text-gray-400 self-center mx-auto select-none">
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
                                                    w-34 sm:w-40 md:w-52 lg:w-40
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
                        <NotifyComponent />
                    </>
                ) : (
                    <p className="text-center mt-10">Carregando...</p>
                )}
            </main>
        </>
    );
}

export default Home;
