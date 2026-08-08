import api from "./api";

export const registerUser = async (userData) => {
  const response = await api.post("/api/auth/register", userData);
  return response.data.data;
};

export const loginUser = async (userData) => {
  const response = await api.post("/api/auth/login", userData);
  return response.data.data;
};

export const verifyUser = async (verificationData) => {
  const response = await api.post("/api/auth/verify", verificationData);
  return response.data.data;
};

export const resendOtp = async (userData) => {
  const response = await api.post("/api/auth/resend-otp", userData);
  return response.data.data;
};

export const verifyToken = async () => {
  const response = await api.get("/api/auth/me");
  return response.data;
};

export const requestPasswordReset = async (userData) => {
  const response = await api.post("/api/auth/password-reset", userData);
  return response.data.data;
};

export const verifyPasswordReset = async (userData) => {
  const response = await api.post("/api/auth/verify-password-reset", userData);
  return response.data.data;
};

export const setNewPassword = async (userData) => {
  const response = await api.post("/api/auth/set-new-password", userData);
  return response.data.data;
};
