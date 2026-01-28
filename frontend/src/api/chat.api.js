import api from "./axios";

export const createChat = async (userId) => {
  const res = await api.post("/chats", { userId: userId });
  return res.data;
};

export const getMyChats = async () => {
  const res = await api.get("/chats");
  return res.data;
};
