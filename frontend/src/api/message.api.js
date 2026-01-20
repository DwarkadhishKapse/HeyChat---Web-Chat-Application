import api from "./axios";

export const getMessages = async (chatId) => {
  const res = await api.get(`/messages/${chatId}`);
  return res.data;
};

export const sendMessage = async (data) => {
  const res = await api.post("/messages", data);
  return res.data;
};
