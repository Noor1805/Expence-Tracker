import api from "./api";

const budgetService = {
  getAll: async () => {
    const response = await api.get("/budget");
    return response.data;
  },

  updateBudget: async (id, data) => {
    const response = await api.put(`/budget/update/${id}`, data);
    return response.data;
  },

  deleteBudget: async (id) => {
    const response = await api.delete(`/budget/delete/${id}`);
    return response.data;
  },

  getStats: async (month, year) => {
    const response = await api.get("/budget/stats", {
      params: { month, year },
    });
    return response.data;
  },
};

export default budgetService;
