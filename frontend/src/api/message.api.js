import api from "./axios";

export const getMessages = async (chatId) => {
  const res = await api.get(`/messages/${chatId}`);
  return res.data;
};

export const sendMessage = async (data) => {
  const res = await api.post("/messages", data);
  return res.data;
};

export const sendFileMessage = async (formData) => {
  const res = await api.post("/messages/send-file", formData);
  return res.data;
};

export const markAsDelivered = async (messageId) => {
  await api.post("/messages/delivered", { messageId });
};

export const markSeen = async (chatId) => {
  await api.post("/messages/seen", { chatId });
};
