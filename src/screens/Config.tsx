import { useEffect, useState } from "react";
import type { Company } from "../DTOs/Company";
import { getCompanyInfo } from "../services/company.service";
import Menu from "../components/menu";
import useTitle from "../hooks/title";
import ThemeToggle from "../components/togleTheme";
import Toggle from "../components/Toggle";
import logo from "../assets/images/favicon.png";
import pkg from '../../package.json';

import { getConfig, updateConfig } from "../services/config.service";

function Config() {
  const [company, setCompany] = useState<Company | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>("geral");
  const [subSection, setSubSection] = useState<string | null>(null);

  const [settings, setSettings] = useState<any>(null);
  const [webhookPlugins, setWebhookPlugins] = useState([
    {
      id: "plugin-1",
      name: "Plugin de Análise Externa",
      description: "Recebe eventos e envia respostas personalizadas.",
      active: false,
    },
    {
      id: "plugin-2",
      name: "Plugin de Automação",
      description: "Executa ações automáticas baseadas em gatilhos.",
      active: false,
    },
  ]);

  useEffect(() => {
      async function loadCompany() {
        try {
          const data = await getCompanyInfo();
          setCompany(data.company);
        } catch (err) {
          console.error("Erro ao carregar empresa:", err);
        }
      }
      loadCompany();
    }, []);

  useTitle(company?.name || "Empresa", "Config");

  useEffect(() => {
    async function load() {
      const data = await getConfig();
  
      setSettings(data.settings);
      setWebhookPlugins(data.webhookPlugins || []);
    }
  
    load();
  }, []);

  async function updateSettings(field: string, value: boolean) {
  
    await updateConfig(field, value);
  
    setSettings((prev: any) => {
      const [group, key] = field.split(".");
  
      return {
        ...prev,
        [group]: {
          ...prev[group],
          [key]: value,
        },
      };
    });
  }

  const sections = [
    { key: "geral", label: "Geral", icon: "bi-gear" },
    { key: "tema", label: "Temas", icon: "bi-palette" },
    { key: "bots", label: "Bots", icon: "bi-robot" },
    { key:"impressoras", label: "Impressoras", icon: "bi-laptop"},
    { key: "preferencias", label: "Preferências", icon: "bi-sliders" },
    { key: "sobre", label: "Sobre o Sistema", icon: "bi-info-circle" },
  ];

    const renderSection = () => {
        switch (selectedSection) {
          case "geral":
            return (
              <div className="p-6 text-gray-200">
                <h2 className="text-2xl font-semibold mb-6 text-white">
                  Configurações Gerais
                </h2>
                <div className="space-y-8">
                  <div className="bg-blue-950/30 p-5 rounded-xl border border-blue-800/40 shadow-lg backdrop-blur-md">
                    <h3 className="text-lg font-semibold text-blue-300 mb-3">
                      Comportamento da Interface
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Feedback visual em ações</span>
                        <Toggle />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Mostrar dicas e tooltips</span>
                        <Toggle />
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-950/30 p-5 rounded-xl border border-blue-800/40 shadow-lg backdrop-blur-md">
                    <h3 className="text-lg font-semibold text-blue-300 mb-3">
                      Navegação e Usabilidade
                    </h3>

                    <div className="flex flex-col gap-4">

                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Lembrar última página acessada</span>
                        <Toggle
                          checked={settings?.geral?.feedback_visual || false}
                          onChange={(value) => updateSettings("geral.feedback_visual", value)}
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Autosave de formulários</span>
                        <Toggle />
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Habilitar atalhos do teclado</span>
                        <Toggle />
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Ação de desfazer automática</span>
                        <Toggle />
                      </div>

                    </div>
                  </div>

                  {/* SEÇÃO — Sistema */}
                  <div className="bg-blue-950/30 p-5 rounded-xl border border-blue-800/40 shadow-lg backdrop-blur-md">
                    <h3 className="text-lg font-semibold text-blue-300 mb-3">
                      Sistema
                    </h3>

                    <div className="flex flex-col gap-4">

                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Limpeza automática do cache</span>
                        <Toggle />
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Otimização de performance</span>
                        <Toggle />
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Enviar relatórios de erro</span>
                        <Toggle />
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Limitar dados armazenados</span>
                        <Toggle />
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            );

          case "tema":
            return (
              <div className="p-6 text-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-white">
                  Personalização de Tema
                </h2>
                <div className="flex flex-col justify-betwean gap-3 mt-4">
                  <p className="text-gray-400 text-sm">
                    Altere entre modo claro e escuro ou configure cores personalizadas.
                  </p>
                  <div className="flex flex-row items-center justify-between gap-3 mt-8 max-w-[60vw]">
                    <p>Altere entre o modo claro e escuro</p>
                    <ThemeToggle
                      checked={settings?.tema?.theme === true}
                      onChange={(checked) => updateSettings("tema.theme", checked)}
                    />
                  </div>
              </div>
            </div>
          );

          case "bots":
            return (
              <div className="p-6 text-gray-200 flex">
                <div className="ml-4 w-[40%]">
                  <h2 className="text-xl font-semibold mb-4 text-white">
                    Configurações de Bots
                  </h2>
                  <p className="text-gray-400">
                    Configure o comportamento e integração dos bots do sistema.
                  </p>
                  <div className="mt-4 flex flex-col gap-3 mt-8">
                    <div
                      className="bg-zinc-900 p-3 rounded-lg hover:bg-[#2a2a2a] transition cursor-pointer"
                      onClick={() => setSubSection("ia")}
                    >
                      <i className="bi bi-robot p-4"></i>Assistente de IA
                    </div>
                    <div
                      className="bg-zinc-900 p-3 rounded-lg hover:bg-[#2a2a2a] transition cursor-pointer"
                      onClick={() => setSubSection("webhook")}
                    >
                      <i className="bi bi-link-45deg p-4"></i> Integração com Webhooks
                    </div>
                            
                  </div>
                </div>

                <div className="ml-8 mt-10 w-[50%] h-auto">
                  {subSection === "ia" && (
                    <div className="mt-6 bg-[#191919] border border-gray-800 p-4 rounded-xl mt-14">
                      <h3 className="text-lg font-semibold mb-2 text-blue-500">
                        Configurar IA
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">
                        Função disponivel em breve!!!
                      </p>
                      <button
                        onClick={() => setSubSection(null)}
                        className="text-sm text-gray-400 hover:text-red-500 transition mt-4"
                      >
                        <i className="bi bi-arrow-left"></i> <span className="p-1">Voltar</span>
                      </button>
                    </div>
                  )}

                  {/* =======================
                      SEÇÃO - WEBHOOK
                  ======================== */}
                  {subSection === "webhook" && (
                    <div className="mt-6 bg-[#191919] border border-gray-800 p-4 rounded-xl mt-14">
                      <h3 className="text-lg font-semibold mb-2 text-blue-500">
                        Integração com Webhooks
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        Gerencie plugins e módulos externos conectados via Webhook.
                      </p>
                      
                      {/* LISTA DE PLUGINS */}
                      <div className="space-y-4">
                        {webhookPlugins.map((plugin) => (
                          <div
                            key={plugin.id}
                            className="flex items-center justify-between bg-[#151522] border border-blue-900/20 p-4 rounded-xl hover:border-blue-600/40 transition"
                          >
                            <div>
                              <h4 className="text-blue-300 font-medium">{plugin.name}</h4>
                              <p className="text-gray-500 text-xs">{plugin.description}</p>
                              <span
                                className={`text-xs mt-2 inline-flex items-center px-2 py-1 rounded-md 
                                ${plugin.active ? "bg-green-900/30 text-green-400" : "bg-gray-800 text-gray-400"}`}
                              >
                                {plugin.active ? "Ativado" : "Desativado"}
                              </span>
                            </div>

                            <Toggle
                             checked={settings?.geral?.feedback_visual || false}
                             onChange={(value: boolean) => {
                               updateSettings("geral.feedback_visual", value);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setSubSection(null)}
                        className="text-sm text-gray-400 hover:text-red-500 transition mt-4"
                      >
                        <i className="bi bi-arrow-left"></i> <span className="p-1">Voltar</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );

              case "sobre":
                return (
                  <section className="max-w-4xl mx-auto p-6 md:p-10">
                    <div className="bg-gradient-to-br from-white/70 to-red-50 dark:from-[#0f0f0f] dark:to-[#151515] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                      <header className="flex items-center gap-4 p-6 md:p-8 bg-transparent">
                        <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-white shadow-md dark:bg-[#121212]">
                          <img src={logo} alt="Zoryon Tech logo" className="w-15 h-15 object-contain" />
                        </div>
              
                        <div className="flex-1">
                          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                            Zoryon Wipe
                          </h1>
                          <p className="mt-1 text-gray-600 dark:text-gray-400 max-w-2xl">
                            Plataforma personalizada e inteligente para gestão completa do seu comércio estoque,
                            rastreamento, relatórios e um app móvel customizável para a sua marca.
                          </p>
                        </div>
              
                        <div className="hidden md:flex flex-col items-end gap-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Versão</span>
                          <strong className="text-blue-600 dark:text-blue-400">{pkg.version}</strong>
                        </div>
                      </header>
          
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8">
                        <div className="md:col-span-2">
                          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                            O que é o Zoryon Wipe?
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                            O Zoryon Wipe é um ecossistema de gestão pensado para empreendedores que desejam
                            controle total do seu negócio com simplicidade. Reúne ferramentas de controle de
                            estoque, rastreamento de entregas, painéis de performance e automações inteligentes
                            que aprendem com sua operação para entregar insights acionáveis.
                          </p>
              
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                            Nossa plataforma foi projetada para ser <strong>flexível</strong> — você personaliza a
                            identidade visual do app (cores, logo), ativa módulos conforme necessidade e integra
                            facilmente com gateways de pagamento, serviços de entrega e APIs externas.
                          </p>
              
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex gap-3 items-start p-3 rounded-lg bg-white dark:bg-[#0e0e0e] border border-gray-100 dark:border-gray-800 shadow-sm">
                              <span className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 flex items-center justify-center text-lg">
                                <i className="bi bi-robot"></i>
                              </span>
                              <div>
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">IA Integrada</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Automação de tarefas, previsões de demanda e insights que ajudam a reduzir perdas e otimizar compras.</p>
                              </div>
                            </div>
              
                            <div className="flex gap-3 items-start p-3 rounded-lg bg-white dark:bg-[#0e0e0e] border border-gray-100 dark:border-gray-800 shadow-sm">
                              <span className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 flex items-center justify-center text-lg">
                                <i className="bi bi-box-seam"></i>
                              </span>
                              <div>
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Controle de Estoque</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Gestão detalhada de SKUs, níveis mínimos, alertas automáticos e histórico de movimentação.</p>
                              </div>
                            </div>
              
                            <div className="flex gap-3 items-start p-3 rounded-lg bg-white dark:bg-[#0e0e0e] border border-gray-100 dark:border-gray-800 shadow-sm">
                              <span className="w-10 h-10 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-300 flex items-center justify-center text-lg">
                                <i className="bi bi-geo-alt"></i>
                              </span>
                              <div>
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Rastreamento</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Acompanhe rotas, entregadores em tempo real.</p>
                              </div>
                            </div>
              
                            <div className="flex gap-3 items-start p-3 rounded-lg bg-white dark:bg-[#0e0e0e] border border-gray-100 dark:border-gray-800 shadow-sm">
                              <span className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 flex items-center justify-center text-lg">
                                <i className="bi bi-bar-chart-line"></i>
                              </span>
                              <div>
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Relatórios Inteligentes</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Dashboards com KPIs, tendências e relatórios exportáveis para tomada de decisão.</p>
                              </div>
                            </div>
                          </div>
                        </div>
              
                        <aside className="md:col-span-1 bg-white dark:bg-[#0b0b0b] rounded-lg p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Personalização</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Logo, cores e identidade do app</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-md" style={{ backgroundColor: "#00009f" }} />
                              <div className="w-8 h-8 rounded-md" style={{ backgroundColor: "#FFFFFF" }} />
                            </div>
                          </div>
              
                          <div className="mb-4">
                            <h5 className="text-xs text-gray-500 dark:text-gray-400">Implementação</h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Fácil integração com APIs, gateways de pagamento e soluções de entrega.</p>
                          </div>
              
                          <div className="mb-4">
                            <h5 className="text-xs text-gray-500 dark:text-gray-400">Segurança</h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Autenticação segura, controle de permissões e backups regulares.</p>
                          </div>
              
                          <a
                            className="block mt-2 text-center w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition"
                            href="/about"
                          >
                            Saiba mais
                          </a>
                        </aside>
                      </div>
              
                      <footer className="px-6 md:px-8 py-6 border-t border-gray-100 dark:border-gray-800 bg-transparent">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            © {new Date().getFullYear()} Zoryon Wipe — Plataforma de gestão inteligente.
                          </p>
              
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Contato</span>
                            <a className="text-sm text-red-600 dark:text-red-400 hover:underline" href="mailto:contato@ngc.system">
                              contato@ngc.system
                            </a>
                          </div>
                        </div>
                      </footer>
                    </div>
                  </section>
              );

        default:
            return null;
        }
    };

  return (
    <div className="select-none flex w-full h-screen bg-[#0e0e0e] text-white">
      <Menu />

      <aside className="w-[250px] bg-[#121212] h-full p-5 border-r border-gray-800 flex flex-col">
        <h1 className="text-lg font-semibold mb-6 text-gray-300">Configurações</h1>

        <ul className="flex flex-col space-y-3">
          {sections.map((s) => (
            <li
              key={s.key}
              onClick={() => {
                setSelectedSection(s.key);
                setSubSection(null);
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${
                selectedSection === s.key
                  ? "bg-blue-800 text-white shadow-md"
                  : "hover:bg-[#1e1e1e] text-gray-400 hover:text-white"
              }`}
            >
              <i className={`${s.icon} text-lg`} />
              <span className="text-sm font-medium">{s.label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto text-center text-xs text-gray-500 border-t border-gray-800 pt-4">
          Z - W © 2025 — Sistema Inteligente
        </div>
      </aside>

      
      <main className="flex-1 overflow-y-auto bg-[#101010]">{renderSection()}</main>
    </div>
  );
}

export default Config;
