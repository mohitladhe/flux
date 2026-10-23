import api from "./api";

export const getMyProfile = async () => {
  const response = await api.get("/api/auth/me");

  // Supports both { user: {...} } and { data: { user: {...} } }
  const payload = response?.data?.data ?? response?.data;
  const user = payload?.user;

  if (!user) {
    throw new Error("The profile API response did not contain a user.");
  }

  return user;
};

export const updateMyProfile = async (profileData) => {
  const response = await api.patch("/api/auth/me", profileData);

  const payload = response?.data?.data ?? response?.data;
  const user = payload?.user;

  if (!user) {
    throw new Error("The profile update response did not contain a user.");
  }

  return user;
};
