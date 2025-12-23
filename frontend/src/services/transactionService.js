import api from "./api";

const transactionService = {
  create: async (data) => {
    const response = await api.post("/transactions/create", data);
    return response.data;
  },

  getAll: async (params) => {
    const response = await api.get("/transactions", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  bulkDelete: async (ids) => {
    const response = await api.post("/transactions/bulk-delete", { ids });
    return response.data;
  },

  clearAll: async () => {
    const response = await api.delete("/transactions/clear");
    return response.data;
  },

  uploadReceipt: async (id, file) => {
    const formData = new FormData();
    formData.append("receipt", file);
    const response = await api.post(
      `/transactions/upload-receipt/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  getStats: async () => {
    const response = await api.get("/transactions/stats/total");
    return response.data;
  },

  getBalanceHistory: async () => {
    const response = await api.get("/transactions/stats/balance");
    return response.data;
  },

  getCategoryStats: async () => {
    const response = await api.get("/transactions/stats/category");
    return response.data;
  },

  getMonthlyStats: async () => {
    const response = await api.get("/transactions/stats/monthly");
    return response.data;
  },

  getPaymentStats: async () => {
    const response = await api.get("/transactions/stats/payment-method");
    return response.data;
  },

  getUpcoming: async () => {
    const response = await api.get("/transactions/upcoming");
    return response.data;
  },

  getRecent: async () => {
    const response = await api.get("/transactions/recent");
    return response.data;
  },

  exportCSV: async () => {
    const response = await api.get("/transactions/export/csv", {
      responseType: "blob",
    });
    return response;
  },
};

export default transactionService;
