import { useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";

import {
    Home,
    Settings,
    Info,
    LogOut,
    User,
    HelpCircle,
    Boxes,
} from "lucide-react";

function MenuPersonal() {
    const [visible, setVisible] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();


    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();

        setPos({ x: e.pageX, y: e.pageY });
        setVisible(true);
        };

        const handleClick = () => setVisible(false);

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("click", handleClick);

        return () => {
        document.removeEventListener("contextmenu", handleContextMenu);
        document.removeEventListener("click", handleClick);
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            className="
                fixed z-[9999]
                bg-white/80 dark:bg-zinc-900/80 
                backdrop-blur-xl 
                shadow-2xl border border-zinc-300 dark:border-zinc-700
                rounded-xl p-2 w-60 
                animate-fadeIn
            "
            style={{ top: pos.y, left: pos.x }}
            >

            {/* GRUPO 1 */}
            <MenuItem icon={<Home size={18} />} label="Página Inicial" onClick={() => navigate('/home')} />
            <MenuItem icon={<User size={18} />} label="Perfil" />
            <MenuItem icon={<Boxes size={18} />} label="Produtos" onClick={() => navigate('/products')}  />

            <Divider />

            {/* GRUPO 2 */}
            <MenuItem icon={<Settings size={18} />} label="Configurações" onClick={() => navigate('/settings')}/>
            <MenuItem icon={<Info size={18} />} label="Sobre" onClick={() => navigate('/about')}/>
            <MenuItem icon={<HelpCircle size={18} />} label="Suporte" onClick={() => navigate('/support')}/>

            <Divider />

            {/* GRUPO 3 */}
            <MenuItem
                icon={<LogOut size={18} className="text-red-500" />}
                label="Sair"
                className="text-red-500 hover:bg-red-500/10"
                onClick={() => navigate('/')}
            />
        </div>
    );
}

function MenuItem({
    icon,
    label,
    onClick,
    className = "",
}: {
    icon: JSX.Element;
    label: string;
    onClick?: () => void;
    className?: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-3 
                w-full px-3 py-2 
                text-left rounded-lg
                transition-all
                text-zinc-700 dark:text-zinc-200
                hover:bg-zinc-200 dark:hover:bg-zinc-700 
                ${className}
            `}
        >
        {icon}
        <span className="font-medium">{label}</span>
        </button>
    );
}

function Divider() {
    return (
        <div className="border-t border-zinc-300 dark:border-zinc-700 my-2"></div>
    );
}

export default MenuPersonal;