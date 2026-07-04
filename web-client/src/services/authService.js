import api from "./api";

export const registerUser = async (userData) => {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
};

export const loginUser = async (userData) => {
    const response = await api.post("/api/auth/login", userData);
    return response.data;
}

export const verifyUser = async (verificationData) => {
    const response = await api.post("/api/auth/verify", verificationData);
    return response.data;
}

export const resendOtp = async (userData) => {
    const response = await api.post("/api/auth/resend-otp", userData);
    return response.data;
}