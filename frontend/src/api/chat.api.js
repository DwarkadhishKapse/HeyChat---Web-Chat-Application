import api from "./axios";

export const getMyChats = async () => {
  const res = await api.get("/chats");
  return res.data;
};

export const createChat = async () => {
  const res = await api.post("/chats", { userId });
  return res.data;
};
