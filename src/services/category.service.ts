import api from "../hooks/api";

export const getCategories = async () => {
  const { data } = await api.get("/categories");
  return data;
};

export const createCategory = async (name: string) => {
  const { data } = await api.post("/categories", { name });
  return data;
};
