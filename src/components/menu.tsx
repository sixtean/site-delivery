import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import logo from '../assets/images/favicon.png';
import pkg from '../../package.json';

const mainPages = [
  { name: "Home", path: "/home", icon: "bi-house" },
  { name: "Dashboard", path: "/dashboard", icon: "bi-graph-up-arrow" },
  { name: "Produtos", path: "/products", icon: "bi-box-seam" },
];

const otherPages = [
  { name: "Configurações", path: "/settings", icon: "bi-gear" },
  { name: "Suporte", path: "/support", icon: "bi-question-circle" },
  { name: "Sobre", path: "/about", icon: "bi-info-circle" },
];

function Menu() {
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const allPages = [...mainPages, ...otherPages];
    const current = allPages.find((page) => page.path === location.pathname);
    if (current) setActive(current.name);
  }, [location.pathname]);

  const handleNavigate = (page: any) => navigate(page.path);

  return (
    <div className="relative w-[90px] flex-shrink-0">
      <nav
        className="w-15 h-[92vh] ml-2 z-[60]
        bg-gray-100 text-gray-800 border-gray-300 
        dark:bg-[#121212] dark:text-white dark:border-gray-800
        flex flex-col items-center p-4
        rounded-3xl shadow-2xl border
        fixed top-9 left-2 transition-all duration-500"
      >
        <section
          className="flex flex-col items-center justify-center mb-8 mt-3 cursor-pointer relative group"
        >
          <img
            src={logo}
            alt="Logo"
            className="w-12 h-12 rounded-xl object-cover shadow-lg hover:scale-105 transition-transform"
          />
          <span
            className="absolute opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs px-2 py-1 rounded-md -bottom-6 transition-all"
          >
          {pkg.version}
          </span>
        </section>

        <ul className="flex flex-col items-center space-y-6 w-full">
          {mainPages.map((page, index) => (
            <li
              key={index}
              onClick={() => handleNavigate(page)}
              className={`group relative flex flex-col items-center cursor-pointer transition-all duration-200 ${
                active === page.name
                  ? "text-blue-700 dark:text-blue-600 drop-shadow-[0_0_6px_#0019FF]"
                  : "text-gray-500 hover:text-black dark:text-gray-500 dark:hover:text-white"
              }`}
            >
              <div className="relative flex flex-col items-center">
                <i className={`${page.icon} text-2xl`}></i>
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

        <div className="w-10 border-b border-gray-400 dark:border-gray-700 my-6"></div>

        <ul className="flex flex-col items-center space-y-6 w-full">
          {otherPages.map((page, index) => (
            <li
              key={index}
              onClick={() => handleNavigate(page)}
              className={`group relative flex flex-col items-center cursor-pointer transition-all duration-200 ${
                active === page.name
                  ? "text-blue-700 dark:text-blue-600 drop-shadow-[0_0_6px_#0019FF]"
                  : "text-gray-500 hover:text-black dark:text-gray-500 dark:hover:text-white"
              }`}
            >
              <div className="relative flex flex-col items-center">
                <i className={`${page.icon} text-2xl`}></i>
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
    </div>
  );
}

export default Menu;