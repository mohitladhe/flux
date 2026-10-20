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
    participants,
  });
  return response.data.data;
};

export const updateAdminStatus = async (conversationId, memberId, isAdmin) => {
  const response = await api.patch(
    `/api/conversations/${conversationId}/members/${memberId}/admin`,
    { isAdmin },
  );
  return response.data.data;
};

export const removeMember = async (conversationId, memberId) => {
  const response = await api.delete(
    `/api/conversations/${conversationId}/members/${memberId}`,
  );
  return response.data.data;
};

export const addMember = async (conversationId, memberId) => {
  const response = await api.post(
    `/api/conversations/${conversationId}/members`,
    { memberId },
  );

  return response.data.data;
};

export const generateGroupInvite = async (conversationId) => {
  const response = await api.post(
    `/api/conversations/${conversationId}/invite-link`,
  );

  return response.data.data;
};

export const getGroupInvitePreview = async (token) => {
  const response = await api.post(`/api/conversations/invite/${token}`);

  return response.data.data;
};

export const joinGroupByInvite = async (token) => {
  const response = await api.post(`/api/conversations/invite/${token}/join`);

  return response.data.data;
};

export const revokeGroupInvite = async (conversationId) => {
  const response = await api.post(
    `/api/conversations/${conversationId}/invite-link/revoke`,
  );

  return response.data.data;
};
