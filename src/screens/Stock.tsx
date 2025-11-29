import { useState, useEffect } from "react";
import type { Company } from "../DTOs/Company";
import { getCompanyInfo } from "../services/company.service";
import { getProducts, deleteProduct } from "../services/product.service";
import useTitle from "../hooks/title";
import { useNotify } from "../components/useNotify";
import Menu from "../components/menu";
import ProductCreator from '../components/ProductModal';
import { getCategories } from "../services/category.service";

function Stock() {
  const [company, setCompany] = useState<Company | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const { showNotify, NotifyComponent } = useNotify();
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id?: number; name?: string }>({ open: false });
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    }
  };  

  function exportToCSV() {
    if(!products || products.length === 0) {
      showNotify({
        title: "Erro ao exportar",
        message: "Não há produtos para exportar.",
        type: "error",
        duration: 3000,
      });

      return
    }

    const headers = [
      'ID', 'Company', 'Category', 'Name', 'Description',
      'Price', 'Stock', 'Created At', 'Updated At'
    ];;


    const rows = products.map(p => [
      p.id,
      p.company?.name || '',
      p.category?.name || '',
      p.name,
      p.description || '',
      typeof p.price === 'number' ? p.price.toFixed(2) : Number(p.price).toFixed(2) || '0.00',
      p.stock,
      new Date(p.created_at).toLocaleDateString(),
      new Date(p.updated_at).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = 'estoque.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

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
    fetchProducts();
  }, []);

  useTitle(company?.name || "Empresa", "Stock");

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    }
  };
  
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);
  
  const filteredProducts = (products ?? []).filter((product) => {
    const matchName = (product?.name ?? "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategory =
      !selectedCategory || product.category?.id === selectedCategory;
    return matchName && matchCategory;
  });

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleProductSuccess = (createdOrUpdated: any) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? createdOrUpdated : p));
      setEditingProduct(null);
    } else {
      setProducts([createdOrUpdated, ...products]);
    }
    setShowModal(false);
  };

  const handleDeleteProduct = async (_p0: number) => {
    if (!confirmDelete.id) return;
    try {
      await deleteProduct(confirmDelete.id);
      setProducts(products.filter((p) => p.id !== confirmDelete.id));
      setConfirmDelete({ open: false });
      showNotify({
        title: "Sucesso",
        message: "Produto excluído com sucesso!",
        type: "success",
        duration: 3000,
      });
      location.reload(); // Para atualizar o estoque na página
    } catch (err) {
      console.error("Erro ao deletar produto:", err);
      showNotify({
        title: "Erro",
        message: "Não foi possível excluir este produto!",
        type: "error",
        duration: 4000,
      });
    }
  };

  function ModalWrapper({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    useEffect(() => {
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);
  
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    };
  
    return (
      <div
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        {children}
      </div>
    );
  }
  
  function Carousel({ images }: { images: string[] }) {
    const [index, setIndex] = useState(0);
  
    useEffect(() => {
      if (images.length === 0) return;
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 2500);
      return () => clearInterval(interval);
    }, [images]);
  
    if (images.length === 0) return null;
  
    return (
      <div className="relative w-14 h-14 rounded-xl overflow-hidden">
        <img
          src={images[index]}
          alt={`Imagem ${index + 1}`}
          className="w-full h-full object-cover transition-all duration-700 ease-in-out"
        />

        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${
                i === index ? "bg-red-700" : "bg-gray-300 dark:bg-gray-700"
              }`}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className="select-none min-h-screen flex flex-col md:flex-row gap-6 p-4 md:p-8 bg-gray-50 dark:bg-[#0d0d0d] transition-all">
      <Menu />

      <section className="flex-1 flex flex-col bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-5 transition-all duration-300">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div className="flex">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white select-none">Produtos</h1>
            <h4 className="flex ml-8 text-2xl font-semibold text-gray-900 dark:text-white select-none">Total:
              <p className="ml-1 text-blue-500 "> R$ 
                {products
                  .reduce((total, p) => total + Number(p.price), 0)
                  .toLocaleString("pt-BR", { style: "currency", currency: "BRL"
                })}
              </p>
            </h4>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 w-full sm:w-64">
              <input
                type="text"
                placeholder="Pesquisar produto..."
                className="bg-transparent outline-none text-gray-900 dark:text-gray-100 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-xl shadow-md transition-all duration-200"
                onClick={() => { setEditingProduct(null); setShowModal(true); }}
              >
                <i className="bi bi-plus-lg select-none"></i> Adicionar
              </button>
            </div>

            <div className="flex gap-3">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl shadow-md transition-all duration-200"
                onClick={() => exportToCSV()}
              >
                <i className="bi bi-airplane select-none"></i> Exportar
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative ">
                <button
                  className="bg-gray-200 dark:bg-[#1a1a1a] px-3 py-2 rounded-xl text-gray-800 dark:text-gray-200 flex items-center gap-2"
                  onClick={() =>
                    setShowCategoriesDropdown((prev) => !prev)
                  }
                >
                  🏷️ Categorias
                </button>

                {showCategoriesDropdown && (
                  <div className="absolute z-10 bg-white text-black dark:text-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl ml-[-40%] mt-6 mr-12 w-48 shadow-lg">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
                      onClick={() => {
                        setSelectedCategory(null);
                        setShowCategoriesDropdown(false);
                      }}
                    >
                      Todas
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] ${
                          selectedCategory === cat.id ? "bg-gray-100 dark:bg-blue-700/30" : ""
                        }`}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setShowCategoriesDropdown(false);
                        }}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        <div className="overflow-x-auto max-h-[80vh] rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 dark:bg-[#1b1b1b]">
              <tr>
                <th className="px-4 py-3 text-gray-700 dark:text-gray-300 select-none">Imagem</th>
                <th className="px-4 py-3 text-gray-700 dark:text-gray-300 select-none">Nome</th>
                <th className="px-4 py-3 text-gray-700 dark:text-gray-300 select-none">Preço</th>
                <th className="px-4 py-3 text-gray-700 dark:text-gray-300 select-none">Estoque</th>
                <th className="px-4 py-3 text-gray-700 dark:text-gray-300 select-none">Status</th>
                <th className="px-4 py-3 text-gray-700 dark:text-gray-300 select-none">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500 dark:text-gray-400">
                    Nenhum produto encontrado, adicione novos produtos.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
                  >
                    <td className="px-4 py-3 select-none">
                      <Carousel
                        images={
                          Array.isArray(p.image_data)
                            ? p.image_data.map((img: string) =>
                                img.startsWith("http")
                                  ? img
                                  : `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/${img}`
                              )
                            : p.image_data
                            ? [
                                p.image_data.startsWith("http")
                                  ? p.image_data
                                  : `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/${p.image_data}`,
                              ]
                            : []
                        }
                      />

                    </td>
                    <td className="px-4 py-3 text-black dark:text-white">{p.name}</td>
                    <td className="px-4 py-3 text-black dark:text-white">R$ {Number(p.price).toFixed(2)}</td>
                    <td className="px-4 py-3 text-black dark:text-white select-none">{p.stock}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium select-none ${
                          p.stock > 0
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {p.stock > 0 ? "Disponível" : "Esgotado"}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 select-none"
                        onClick={() => handleEditProduct(p)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 select-none"
                        onClick={() => setConfirmDelete({ open: true, id: p.id })}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {confirmDelete.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1b1b1b] text-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md border border-gray-800">
            <h2 className="text-xl font-semibold mb-2 text-center">
              Excluir produto
            </h2>
            <p className="text-gray-300 text-center mb-6">
              Tem certeza que deseja excluir{" "}
              <span className="font-semibold text-red-400">{confirmDelete.name}</span>?
              <br />
              Essa ação não poderá ser desfeita.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmDelete({ open: false })}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteProduct(confirmDelete.id!)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow-md transition-all duration-200"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && company && (
        <ModalWrapper onClose={() => setShowModal(false)}>
          <ProductCreator
            companyId={company.id}
            editingProduct={editingProduct}
            onSuccess={handleProductSuccess}
            onClose={() => setShowModal(false)}
          />
        </ModalWrapper>
      )}
      <NotifyComponent />
    </main>
  );
}

export default Stock;