import api from "../hooks/api";

export async function getProducts() {
  const response = await api.get("company/products");
  return response.data;
}

export async function createProducts(formData: FormData) {
  const response = await api.post("company/newproduct", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function updateProduct(id: number, formData: FormData) {
  const response = await api.put(`company/updateproducts/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function deleteProduct(id: number) {
  const response = await api.delete(`company/products/delete/${id}`);
  return response.data;
}