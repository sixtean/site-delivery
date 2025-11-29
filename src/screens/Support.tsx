import Menu from "../components/menu";
import { useState } from "react";
import logo from '../assets/images/favicon.png';

function Support() {
    const [messages, setMessages] = useState([
        { from: "bot", text: "Olá! 👋 Bem-vindo ao suporte da Zoryon Tech." },
        { from: "bot", text: "Como posso ajudar você hoje?" }
    ]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { from: "user", text: input }]);
        setInput("");
        setTimeout(() => {
            setMessages(m => [...m, { from: "bot", text: "Um atendente será encaminhado via WhatsApp em instantes! 🚀" }]);
        }, 800);
    };

    const openWhatsApp = () => {
        const attendants = [
            "5533999411331",
            "5531999999999",
        ];

        const randomIndex = Math.floor(Math.random() * attendants.length);
        const phone = attendants[randomIndex];
    
        const msg = encodeURIComponent("Olá! Preciso de suporte com o sistema Zoryon Wipe.");
    
        window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${msg}`, "_blank");
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-gray-100 flex flex-col">
            <Menu />
            <div className="flex flex-col md:flex-row flex-1">
                <div className="flex flex-col flex-1 bg-zinc-900/70 p-6 md:p-10 border-r border-zinc-800 ml-28">
                    <h1 className="text-3xl font-bold text-blue-500 mb-6">Suporte Zoryon Tech</h1>
                    <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 shadow-inner">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                                        msg.from === "user"
                                            ? "bg-blue-600 text-white rounded-br-none shadow-blue-600/20"
                                            : "bg-zinc-700 text-gray-200 rounded-bl-none"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex gap-2">
                        <input
                            type="text"
                            placeholder="Digite sua mensagem..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if(e.key === "Enter") {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-full px-4 py-2 text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button
                            onClick={handleSend}
                            className="bg-blue-600 hover:bg-blue-700 transition-all px-5 py-2 rounded-full text-white font-medium"
                        >
                            <i className="bi bi-send-fill"></i>
                        </button>
                    </div>
                </div>
                <aside className="w-full md:w-96 bg-zinc-900 p-8 flex flex-col justify-between border-l border-zinc-800">
                    <div>
                        <div className="flex flex-col items-center text-center">
                            <img
                                src={logo}
                                alt="Zoryon Tech"
                                className="w-24 h-24 mb-4 animate-pulse-slow"
                            />
                            <h2 className="text-2xl font-bold text-blue-500">Zoryon Tech</h2>
                            <p className="text-gray-400 text-sm mt-1">Sua parceira na jornada digital</p>
                        </div>

                        <div className="mt-10 space-y-4">
                            <div className="bg-zinc-800/40 p-4 rounded-xl border border-zinc-700">
                                <h3 className="font-semibold text-blue-400 mb-1 flex items-center gap-2">
                                    <i className="bi bi-clock-history text-blue-500"></i> Horário de Atendimento
                                </h3>
                                <p className="text-gray-400 text-sm mt-4">Segunda a Sexta: 8h às 18h</p>
                                <p className="text-gray-400 text-sm">Sábado: 9h às 13h</p>
                            </div>

                            <div className="bg-zinc-800/40 p-4 rounded-xl border border-zinc-700">
                                <h3 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                                    <i className="bi bi-people text-blue-500"></i> Equipe de Suporte
                                </h3>
                                <ul className="text-gray-400 text-sm space-y-1 mt-4">
                                    <li><i className="bi bi-person text-blue-400"></i> Leandro Alves — Atendimento Técnico</li>
                                    <li><i className="bi bi-person text-blue-400"></i> Marina Costa — Design & Experiência</li>
                                    <li><i className="bi bi-person text-blue-400"></i> Carlos Mendes — Infraestrutura</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Botão de contato */}
                    <div className="flex flex-col items-center gap-3 mt-10">
                        <button
                            onClick={openWhatsApp}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-all px-5 py-2 rounded-full text-white font-medium w-full justify-center"
                        >
                            <i className="bi bi-whatsapp text-xl"></i> Falar com um atendente
                        </button>

                        <p className="text-xs text-gray-500 text-center">
                            O atendimento será aberto via WhatsApp Business oficial da Zoryon Tech.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default Support;