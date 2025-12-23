import api from "./api";

const userService = {
  updateProfile: async (data) => {
    const response = await api.put("/users/profile", data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await api.put("/users/change-password", data);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete("/auth/delete-account");
    return response.data;
  },
};

export default userService;
