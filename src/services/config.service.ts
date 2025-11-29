import api from "../hooks/api";

export const getConfig = async () => {
  const res = await api.get(`config`);
  return res.data;
};

export const updateConfig = async (field: string, value: boolean) => {
  
  const parts = field.split(".");
  const payload: any = {};
  let ref = payload;

  parts.forEach((p, i) => {
    if (i === parts.length - 1) {
      ref[p] = value;
    } else {
      ref[p] = {};
      ref = ref[p];
    }
  });

  const res = await api.put(`config/update`, payload);

  console.log("🟪 FRONT SERVICE: Resposta do backend:", res.data);

  return res.data;
};