import Menu from "../components/menu";

function About() {
    return (
        <div className="min-h-screen bg-zinc-950 text-gray-100 flex flex-col">
            <Menu />

            <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-gradient-to-b from-blue-700/20 to-transparent">
                <h1 className="text-5xl md:text-6xl font-extrabold text-blue-600 tracking-tight mb-4">
                    Zoryon Tech
                </h1>
                <p className="max-w-2xl text-lg md:text-xl text-gray-300">
                    Inovando o futuro digital com performance, segurança e design.
                </p>
            </section>

            <section className="py-16 px-6 md:px-20">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-blue-500 mb-8 text-center">
                        Nossa História
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed text-center">
                        Fundada com o objetivo de unir tecnologia e experiência do usuário, a <span className="text-blue-400 font-semibold">Zoryon Tech</span> nasceu para redefinir o padrão de qualidade em sistemas digitais. 
                        Nossa missão é simplificar o complexo, entregando soluções que unem design, eficiência e segurança.
                    </p>
                </div>
            </section>

            <section className="bg-zinc-900 py-20 px-6 md:px-16">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-center">
                    <div className="p-8 bg-zinc-800/40 rounded-2xl border border-zinc-700 shadow-lg hover:shadow-blue-600/20 transition-all">
                        <i className="bi bi-bullseye text-blue-500 text-4xl mb-4"></i>
                        <h3 className="text-xl font-semibold mb-2 text-blue-400">Missão</h3>
                        <p className="text-gray-400">
                            Criar soluções inteligentes que otimizam a experiência digital de empresas e usuários em todo o mundo.
                        </p>
                    </div>

                    <div className="p-8 bg-zinc-800/40 rounded-2xl border border-zinc-700 shadow-lg hover:shadow-blue-600/20 transition-all">
                        <i className="bi bi-eye text-blue-500 text-4xl mb-4"></i>
                        <h3 className="text-xl font-semibold mb-2 text-blue-400">Visão</h3>
                        <p className="text-gray-400">
                            Ser referência em inovação tecnológica e design de interfaces, impulsionando o futuro digital global.
                        </p>
                    </div>

                    <div className="p-8 bg-zinc-800/40 rounded-2xl border border-zinc-700 shadow-lg hover:shadow-blue-600/20 transition-all">
                        <i className="bi bi-heart text-blue-500 text-4xl mb-4"></i>
                        <h3 className="text-xl font-semibold mb-2 text-blue-400">Valores</h3>
                        <p className="text-gray-400">
                            Ética, criatividade, compromisso com resultados e respeito pela experiência do usuário.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 md:px-20">
                <h2 className="text-3xl font-bold text-blue-500 mb-12 text-center">Nossa Equipe</h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[
                        { nome: "Leandro Alves", cargo: "Fundador & Desenvolvedor", icon: "bi-person-badge" },
                        { nome: "Marina Costa", cargo: "UI/UX Designer", icon: "bi-brush" },
                        { nome: "Carlos Mendes", cargo: "Engenheiro de Software", icon: "bi-cpu" },
                    ].map((membro, i) => (
                        <div key={i} className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-blue-600 transition-all shadow-md hover:shadow-red-600/20 text-center">
                            <i className={`bi ${membro.icon} text-blue-500 text-5xl mb-4`}></i>
                            <h3 className="text-xl font-semibold text-blue-400">{membro.nome}</h3>
                            <p className="text-gray-400">{membro.cargo}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Rodapé */}
            <footer className="bg-zinc-900 py-8 mt-auto">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-4">
                    <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Zoryon Tech — Todos os direitos reservados.</p>
                    <div className="flex gap-4 text-xl text-gray-400">
                        <a href="#" className="hover:text-red-500"><i className="bi bi-instagram"></i></a>
                        <a href="#" className="hover:text-red-500"><i className="bi bi-github"></i></a>
                        <a href="#" className="hover:text-red-500"><i className="bi bi-linkedin"></i></a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default About;
