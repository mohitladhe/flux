import api from "./api";

export const getMessages = async (conversationId) => {
  const response = await api.get(`/api/messages/${conversationId}`);
  return response.data.data;
};

export const sendMessage = async (content) => {
  const response = await api.post("/api/messages/send", content);
  return response.data;
};