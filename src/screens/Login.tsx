import { useState } from "react";
import useTitle from "../hooks/title";
import { useNotify } from "../utils/useNotify";
import { LoginController } from "../controller/Login.controller";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    
    const [isLogin, setIsLogin] = useState(true);
    const [id, setId] = useState('');
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { showNotify, NotifyComponent } = useNotify();

    useTitle("Site Delivery", isLogin ? "Login" : "Registro");

    const toggleMode = () => setIsLogin(!isLogin);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const idSave: number = Number(id);
        try {
            const result = await LoginController(idSave, password);
      
            showNotify({
                title: "Login bem-sucedido",
                message: `Bem-vindo, ${result?.company?.name || "usuário"}!`,
                type: "success",
                duration: 4000,
            });

            if(result?.success) {
               
                  
                setTimeout(() => {
                    navigate("/home");
                }, 4500);
            }
        } catch (error: any) {
            console.error(error);
      
            showNotify({
                title: "Erro no login",
                message: error.response?.data?.message || "Ocorreu um erro ao fazer login.",
                type: "error",
                duration: 5000,
            });
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
            <section className="w-full max-w-md">
                <article className="bg-gray-900 rounded-2xl shadow-lg p-8">
                    <header className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">
                            {isLogin ? "Login" : "Registro"}
                        </h2>
                    </header>

                    {isLogin ? (
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <fieldset>
                                <label htmlFor="userId" className="block text-sm font-medium text-gray-400 mb-1">
                                ID
                                </label>
                                <input
                                type="text"
                                id="userId"
                                placeholder="Seu ID"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:outline-none"
                                required
                                />
                            </fieldset>

                            <fieldset className="relative">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                                    Senha
                                    </label>
                                    <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="********"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:outline-none"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[65%] -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"} text-lg`}></i>
                                </button>
                            </fieldset>

                            <button
                                type="submit"
                                className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition-all duration-200"
                            >
                                Entrar
                            </button>
                        </form>
                    ) : (
                    <article className="text-center text-gray-400 space-y-4">
                        <p>
                            Para criar uma conta, entre em contato com os desenvolvedores para receber acesso.
                        </p>
                        <address className="text-primary font-medium not-italic">
                            Email: <a href="mailto:suporte@sitedelivery.com" className="text-red-500">suporte@sitedelivery.com</a>
                        </address>
                    </article>
                )}

                    <footer className="text-center text-gray-400 text-sm mt-6">
                        {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
                        <button
                        onClick={toggleMode}
                        className="text-primary hover:underline font-medium text-blue-400 hover:text-blue-500"
                        type="button"
                        >
                            {isLogin ? "Registro" : "Login"}
                        </button>
                    </footer>
                </article>
            </section>
            <NotifyComponent />
        </main>
    );
}

export default Login;