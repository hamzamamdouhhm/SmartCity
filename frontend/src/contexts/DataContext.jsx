import React, { createContext, useEffect, useState } from "react";
import apiFetch from "../api";

const DataContext = createContext({
  data: null,
  loading: true,
  error: null,
  refetch: async () => {}
});

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const { ok, data: payload } = await apiFetch("/api/benchmark");
    if (ok && payload) {
      setData(payload);
    } else {
      setError(payload.errors ? payload.errors.join(" ") : "Failed to load benchmark data.");
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <DataContext.Provider value={{ data, loading, error, refetch: fetchData }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
