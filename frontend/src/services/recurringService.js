import api from "./api";

const recurringService = {
  // Placeholder pending backend implementation
  getAll: async () => {
    const response = await api.get("/transactions/recurring"); // Assuming reused endpoint
    return response.data;
  },
};

export default recurringService;
