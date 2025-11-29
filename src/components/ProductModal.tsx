import { useState, useEffect } from "react";
import { createProducts, updateProduct } from "../services/product.service";
import { createCategory, getCategories } from "../services/category.service";
import { useNotify } from "./useNotify";

interface ProductCreatorProps {
  companyId: number;
  onClose: () => void;
  onSuccess: (createdOrUpdated: any) => void;
  editingProduct?: any;
}

export default function ProductCreator({
  companyId,
  onSuccess,
  editingProduct,
}: ProductCreatorProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    cost: "",
    stock: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { showNotify, NotifyComponent } = useNotify();

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      showNotify({
        title: "Erro",
        message: "Não foi possível carregar categorias.",
        type: "error",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name || "",
        description: editingProduct.description || "",
        price: editingProduct.price?.toString() || "",
        cost: editingProduct.cost?.toString() || "",
        stock: editingProduct.stock?.toString() || "",
        categoryId: editingProduct.category?.id?.toString() || "",
      });

      if (editingProduct.images_base64?.length > 0) {
        const base64Previews = editingProduct.images_base64.map(
          (img: string) => `data:image/jpeg;base64,${img}`
        );
        setPreviews(base64Previews);
      }
    }
  }, [editingProduct]);

  useEffect(() => {
    if (images.length > 0) {
      const newPreviews = images.map((img) => URL.createObjectURL(img));
      setPreviews(newPreviews);
    } else if (!editingProduct) {
      setPreviews([]);
    }
  }, [images, editingProduct]);

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const category = await createCategory(newCategory);
      setCategories([...categories, category]);
      setForm({ ...form, categoryId: category.id.toString() });
      setNewCategory("");
      setCreatingCategory(false);
      showNotify({
        title: "Sucesso",
        message: "Categoria criada com sucesso!",
        type: "success",
        duration: 3000,
      });
    } catch {
      showNotify({
        title: "Erro",
        message: "Não foi possível criar categoria.",
        type: "error",
        duration: 3000,
      });
    }
  };

  const lucro =
    form.price && form.cost ? Number(form.price) - Number(form.cost) : 0;
  const margem =
    form.price && form.cost
      ? ((lucro / Number(form.price)) * 100).toFixed(2)
      : "0";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      showNotify({
        title: "Dados",
        message: `Preencha os campos obrigatórios!`,
        type: "error",
        duration: 4000,
      });
      return;
    }

    const data = new FormData();
    data.append("companyId", companyId.toString());
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("stock", form.stock);
    if (form.categoryId) data.append("categoryId", form.categoryId);

    images.forEach((file) => data.append("image", file));

    setLoading(true);
    try {
      let createdOrUpdated;
      if (editingProduct) {
        createdOrUpdated = await updateProduct(editingProduct.id, data);
      } else {
        createdOrUpdated = await createProducts(data);
      }

      onSuccess(createdOrUpdated);
      showNotify({
        title: "Sucesso",
        message: `Produto salvo com sucesso!`,
        type: "success",
        duration: 4000,
      });

      setForm({
        name: "",
        description: "",
        price: "",
        cost: "",
        stock: "",
        categoryId: "",
      });
      setImages([]);
      setPreviews([]);

      location.reload(); // Para atualizar a lista de produtos na página
    } catch (err) {
      console.error(err);
      showNotify({
        title: "Erro",
        message: "Não foi possível salvar o produto.",
        type: "error",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      flex flex-col lg:flex-row 
      gap-6 
      p-4 sm:p-6
      min-h-screen 
      backdrop-blur-md
      w-[95vw]
      mx-auto
      items-center
      sm:items-center
      select-none
    "
    >
      <div
        className="
        w-[90%]
        h-auto
        mb-6 mt-4
        ml-12
        flex-1
        sm:w-[85%] sm:ml-12 sm:mb-10
        lg:h-[86vh] lg:ml-20
        bg-white dark:bg-[#121212] 
        rounded-3xl 
        p-4 sm:p-6 
        shadow-lg 
        flex flex-col 
        gap-4
      "
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white select-none">
          {editingProduct ? "Editar Produto" : "Criar Produto"}
        </h2>

        <div className="flex flex-col relative">
          <input
            type="text"
            maxLength={60}
            placeholder="Nome do produto *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 text-black dark:text-white dark:bg-[#1a1a1a]"
          />
          <span className="text-xs text-gray-500 absolute right-2 bottom-1 select-none">
            {form.name.length}/60
          </span>
        </div>

        <div className="flex flex-col relative">
          <textarea
            maxLength={250}
            placeholder="Descrição"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 text-black dark:text-white dark:bg-[#1a1a1a] resize-none h-28"
          />
          <span className="text-xs text-gray-500 absolute right-2 bottom-1 select-none">
            {form.description.length}/250
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-700 dark:text-gray-300 select-none">Categoria</label>
          <div className="flex gap-2">
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 text-black dark:text-white dark:bg-[#1a1a1a]"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setCreatingCategory(!creatingCategory)}
              className="bg-red-600 text-white px-4 rounded-xl"
              type="button"
            >
              <i className="bi bi-plus-lg"></i>
            </button>
          </div>

          {creatingCategory && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Nova categoria"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1a]"
              />
              <button
                onClick={handleCreateCategory}
                className="bg-green-600 text-white px-3 rounded-xl"
                type="button"
              >
                Salvar
              </button>
            </div>
          )}
        </div>

        {/* CAMPOS DE PREÇO — COSTO SOME NO MOBILE */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            placeholder="Preço *"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 text-black dark:text-white dark:bg-[#1a1a1a]
              sm:w-6
            "
          />

          <input
            type="number"
            placeholder="Custo"
            value={form.cost}
            onChange={(e) => setForm({ ...form, cost: e.target.value })}
            className="hidden sm:flex sm:w-6 flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 text-black dark:text-white dark:bg-[#1a1a1a]"
          />

          <input
            type="number"
            placeholder="Estoque"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 text-black dark:text-white dark:bg-[#1a1a1a]
              sm:w-6
            "
          />
        </div>

        <div className="hidden sm:flex flex-col lg:block bg-gray-100 dark:bg-[#1a1a1a] p-4 rounded-xl select-none">
          <p className="text-gray-700 dark:text-gray-300">
            Lucro: <span className="text-green-500">R$ {lucro.toFixed(2)}</span>
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Margem: <span className="text-green-500">{margem}%</span>
          </p>
        </div>

        <label className="cursor-pointer px-4 py-2 bg-gray-100 dark:bg-[#222] text-black dark:text-white rounded-xl text-center">
          Selecionar até 5 imagens
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setImages(Array.from(e.target.files || []).slice(0, 5))
            }
            className="hidden"
          />
        </label>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md transition"
        >
          {loading ? "Salvando..." : "Salvar Produto"}
        </button>
      </div>

      <div
        className="
        hidden   
        lg:flex lg:w-[22%] lg:h-[90vh]
        flex-col 
      
        bg-white dark:bg-[#121212] 
        rounded-3xl 
        p-6 
        shadow-lg 
        items-center
      "
      >
        {previews.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 w-full justify-items-center">
            {previews.map((src, i) => (
              <img
                key={i}
                src={src}
                className="w-40 h-40 object-cover rounded-2xl shadow-md"
              />
            ))}
          </div>
        ) : (
          <div className="w-64 h-64 bg-gray-200 dark:bg-[#1a1a1a] rounded-2xl flex items-center justify-center text-gray-500">
            Preview
          </div>
        )}

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 text-center">
          {form.name || "Nome do Produto"}
        </h3>

        <p className="text-gray-700 dark:text-gray-300 text-center mt-4">
          {form.description || "Descrição do produto..."}
        </p>

        <p className="text-red-600 font-semibold text-xl mt-4">
          R$ {form.price || "0.00"}
        </p>

        <p className="text-gray-500 mt-2">Estoque: {form.stock || "0"}</p>
      </div>

      <NotifyComponent />
    </div>
  );
}