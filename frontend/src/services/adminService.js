import api from "./api";

const adminService = {
  getStats: async () => {
    const response = await api.get("/admin/stats/app");
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get("/admin/users");
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  toggleBlockUser: async (id) => {
    const response = await api.put(`/admin/users/block/${id}`);
    return response.data;
  },
};

export default adminService;
