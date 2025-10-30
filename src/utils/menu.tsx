import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const mainPages = [
  { name: "Home", path: "/home", icon: "bi-house" },
  { name: "Dashboard", path: "/dashboard", icon: "bi-graph-up-arrow" },
  { name: "Configurações", path: "/config", icon: "bi-gear" },
];

const otherPages = [
  { name: "Suporte", path: "/support", icon: "bi-question-circle" },
  { name: "Sobre", path: "/about", icon: "bi-info-circle" },
];

function Menu() {
  const [active, setActive] = useState("Home");
  const navigate = useNavigate();

  const handleNavigate = (page: any) => {
    setActive(page.name);
    navigate(page.path);
  };

  return (
    <nav
      className="w-20 h-[92vh] 
                 bg-gray-100 text-gray-800 border-gray-300 
                 dark:bg-[#121212] dark:text-white dark:border-gray-800
                 flex flex-col items-center p-4
                 rounded-3xl shadow-2xl border
                 fixed top-9 left-2 transition-colors duration-500"
    >
      {/* Logo */}
      <section className="flex items-center justify-center mb-8 mt-3">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-10 h-10 rounded-xl object-cover border border-gray-300 dark:border-gray-700"
        />
      </section>

      {/* Páginas principais */}
      <ul className="flex flex-col items-center space-y-6 w-full">
        {mainPages.map((page, index) => (
          <li
            key={index}
            onClick={() => handleNavigate(page)}
            className={`group relative flex flex-col items-center cursor-pointer transition-all duration-200 ${
              active === page.name
                ? "text-red-700 dark:text-red-600 drop-shadow-[0_0_6px_#dc2626]"
                : "text-gray-500 hover:text-black dark:text-gray-500 dark:hover:text-white"
            }`}
          >
            <div className="relative flex flex-col items-center">
              <i className={`${page.icon} text-2xl`}></i>

              {/* Tooltip Light/Dark */}
              <span
                className="absolute left-14 top-1/2 -translate-y-1/2 
                           bg-gray-200 text-gray-900 
                           dark:bg-[#1e1e1e] dark:text-white
                           text-xs px-2 py-1 rounded-lg shadow-lg
                           opacity-0 translate-x-[-5px]
                           group-hover:opacity-100 group-hover:translate-x-0
                           transition-all duration-300 ease-out
                           pointer-events-none whitespace-nowrap"
              >
                {page.name}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Linha divisória abaixo de Config */}
      <div className="w-10 border-b border-gray-400 dark:border-gray-700 my-6"></div>

      {/* Seção Others */}
      <ul className="flex flex-col items-center space-y-6 w-full">
        {otherPages.map((page, index) => (
          <li
            key={index}
            onClick={() => handleNavigate(page)}
            className={`group relative flex flex-col items-center cursor-pointer transition-all duration-200 ${
              active === page.name
                ? "text-red-700 dark:text-red-600 drop-shadow-[0_0_6px_#dc2626]"
                : "text-gray-500 hover:text-black dark:text-gray-500 dark:hover:text-white"
            }`}
          >
            <div className="relative flex flex-col items-center">
              <i className={`${page.icon} text-2xl`}></i>

              {/* Tooltip Light/Dark */}
              <span
                className="absolute left-14 top-1/2 -translate-y-1/2 
                           bg-gray-200 text-gray-900 
                           dark:bg-[#1e1e1e] dark:text-white
                           text-xs px-2 py-1 rounded-lg shadow-lg
                           opacity-0 translate-x-[-5px]
                           group-hover:opacity-100 group-hover:translate-x-0
                           transition-all duration-300 ease-out
                           pointer-events-none whitespace-nowrap"
              >
                {page.name}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Menu;