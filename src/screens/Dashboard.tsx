import { useState, useEffect } from "react";
import type { Company } from "../DTOs/Company";
import { getCompanyInfo } from "../services/company.service";
import { getProducts } from "../services/product.service";
import Menu from "../components/menu";
import useTitle from "../hooks/title";

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    AreaChart,
    Area,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

import {
    Package,
    BarChart3,
    DollarSign,
    TrendingUp,
    BatteryCharging,
    Truck,
    PieChart as PieIcon,
    Clock4,
} from "lucide-react";

function Dashboard() {

    const [company, setCompany] = useState<Company>({
        id: 0,
        name: "",
        orders: [],
        products: [],
        created_at: "",
        updated_at: "",
    });
    const [totalStock, setTotalStock] = useState(0);
    useTitle(company.name, "Dashboard");

    const estoqueData = [
        { name: "Jan", Total: 120 },
        { name: "Fev", Total: 80 },
        { name: "Mar", Total: 65 },
        { name: "Abr", Total: 150 },
        { name: "Mai", Total: 110 },
        { name: "Jun", Total: 98 },
    ];

    const vendasMensais = [
        { name: "Seg", vendas: 32 },
        { name: "Ter", vendas: 51 },
        { name: "Qua", vendas: 44 },
        { name: "Qui", vendas: 70 },
        { name: "Sex", vendas: 65 },
        { name: "Sab", vendas: 88 },
        { name: "Dom", vendas: 40 },
    ];

    const vendasDoDia = [
        { hora: "08h", valor: 5 },
        { hora: "10h", valor: 12 },
        { hora: "12h", valor: 18 },
        { hora: "14h", valor: 25 },
        { hora: "16h", valor: 22 },
        { hora: "18h", valor: 31 },
        { hora: "20h", valor: 27 },
    ];

    const ultimosMeses = [
        { mes: "Jan", total: 4100 },
        { mes: "Fev", total: 3800 },
        { mes: "Mar", total: 4500 },
        { mes: "Abr", total: 4900 },
        { mes: "Mai", total: 5200 },
        { mes: "Jun", total: 6100 },
    ];

    useEffect(() => {
        async function fetchCompany() {
            try {
                const data = await getCompanyInfo();
                setCompany(data.company);

                const productsData: any[] = await getProducts();

                const validProducts = productsData.filter(
                    (p) =>
                        p &&
                        typeof p.stock !== "undefined" &&
                        Number.isFinite(Number(p.stock))
                );

                // total de unidades no estoque
                const totalStockQuantity = validProducts.reduce((acc, p) => {
                    return acc + Number(p.stock);
                }, 0);

                setTotalStock(totalStockQuantity);

                console.log("Total exato de unidades:", totalStockQuantity);

            } catch (error) {
                console.error("Erro ao buscar informações da empresa:", error);
            }
        }

        fetchCompany();
    }, []);



    return (
        <div className="p-6 md:p-12 md:px-28 text-black dark:text-white select-none">
            <Menu />

            <h1 className="text-4xl font-extrabold mb-8 tracking-tight">
                Dashboard <span className="text-blue-500">{company.name}</span>
            </h1>

            {/* RESUMO CARDS */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <Card title="Unidades no Estoque" value={totalStock} icon={<Package size={26} />} color="blue" />
                <Card title="Vendas no Mês" value="R$ 12.450" icon={<DollarSign size={26} />} color="green" />
                <Card title="Clientes Ativos" value="321" icon={<TrendingUp size={26} />} color="purple" />
                <Card title="Entregas Pendentes" value="17" icon={<Truck size={26} />} color="orange" />
            </section>

            {/* GRAFICOS - versão menor e futurista */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-7">

                {/* Estoque */}
                <CardChart title="Balança do Estoque" icon={<BarChart3 size={20} className="text-blue-500" />}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={estoqueData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="Total"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ r: 3 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardChart>

                {/* Vendas Semana */}
                <CardChart title="Vendas da Semana" icon={<BatteryCharging size={20} className="text-green-500" />}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={vendasMensais}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Bar dataKey="vendas" fill="#22c55e" radius={[5, 5, 5, 5]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardChart>

                {/* Vendas do Dia */}
                <CardChart title="Vendas do Dia" icon={<Clock4 size={20} className="text-purple-500" />}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={vendasDoDia}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <XAxis dataKey="hora" tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="valor"
                                stroke="#a855f7"
                                fill="#a855f733"
                                strokeWidth={3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardChart>

            </section>

            {/* Ultimos 6 meses + Top Vendas */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-12">

                <CardChart title="Relatório dos Últimos 6 Meses" icon={<PieIcon size={22} className="text-orange-500" />}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={ultimosMeses}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <XAxis dataKey="mes" />
                            <YAxis />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="#fb923c"
                                fill="#fb923c33"
                                strokeWidth={3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardChart>

                {/* top produtos */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xl border border-zinc-200 dark:border-zinc-700">
                    <h2 className="text-xl font-bold mb-4">Top Produtos Vendidos</h2>

                    <div className="space-y-3">
                        <Event text="Mouse Gamer RGB — 212 vendas" />
                        <Event text="Teclado Mecânico Red — 188 vendas" />
                        <Event text="Headset Surround — 142 vendas" />
                        <Event text="Webcam Full HD — 77 vendas" />
                        <Event text="Cabo USB-C — 55 vendas" />
                    </div>
                </div>

            </section>

            {/* Eventos recentes */}
            <section className="mt-16 mb-20">
                <h2 className="text-2xl font-bold mb-5">Eventos Recentes</h2>

                <div className="space-y-3">
                    <Event text="Novo produto adicionado: Headset Gamer RGB" />
                    <Event text="Venda concluída: Pedido #10291 – R$ 289,90" />
                    <Event text="Estoque baixo: Cabo USB-C" />
                    <Event text="Cliente VIP atualizado: User #183" />
                </div>
            </section>
        </div>
    );
}

/* ---------------- COMPONENTES ---------------- */

function Card({ title, value, icon, color }: any) {
    const colors: any = {
        blue: "text-blue-500",
        green: "text-green-500",
        purple: "text-purple-500",
        orange: "text-orange-500",
    };

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-6 rounded-2xl shadow-lg flex items-center gap-5 transition-all hover:scale-[1.02]">
            <div className={`p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 ${colors[color]}`}>
                {icon}
            </div>

            <div>
                <p className="text-zinc-600 dark:text-zinc-300">{title}</p>
                <p className="text-3xl font-bold">{value}</p>
            </div>
        </div>
    );
}

function CardChart({ title, icon, children }: any) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-xl border border-zinc-200 dark:border-zinc-700 h-[240px] flex flex-col">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                {icon} {title}
            </h2>
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}

function Event({ text }: { text: string }) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 shadow">
            <p className="text-zinc-700 dark:text-zinc-300">{text}</p>
        </div>
    );
}

export default Dashboard;