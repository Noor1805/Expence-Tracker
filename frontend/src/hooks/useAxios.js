import { useState, useCallback } from "react";
import api from "../services/api";

const useAxios = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const request = useCallback(async (config) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api(config);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response ? err.response.data : err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, error, loading, request };
};

export default useAxios;
