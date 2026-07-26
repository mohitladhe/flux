import api from "./api";

export const searchUser = async (search) => {
  const response = await api.get("/api/users/search", {
    params: {
      q: search,
    },
  });
  return response.data;
};
