import api from "./axios";

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const signupUser = async (data) => {
  const res = await api.post("/auth/signup", data);
  return res.data;
};
