import api from "./api";

export const createConversation = async (participantId) => {
  const response = await api.post("/api/conversations/create", {
    participantId,
  });
  return response.data.data;
};

export const getConversations = async () => {
  const response = await api.get("/api/conversations");
  return response.data.data;
};

export const createGroup = async (groupName, participants) => {
  const response = await api.post("/api/conversations/create-group", {
    groupName,
    participants
  });
  return response.data.data;
};
