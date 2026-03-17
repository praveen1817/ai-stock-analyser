import React, { createContext, useContext, useState } from "react";

// ─── Store Context ──────────────────────────────────────────────────────────
// Central place to manage global app configuration and auth state.

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  // Base URL for all backend API calls.
  // Change this single value to switch between environments.
  const backendUrl = "http://localhost:5000";

  // JWT token — initialised from localStorage so it survives page reloads.
  const [token, setTokenState] = useState(
    () => localStorage.getItem("jsonToken") || ""
  );

  // Persist token to localStorage whenever it changes.
  const setToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("jsonToken", newToken);
    } else {
      localStorage.removeItem("jsonToken");
    }
    setTokenState(newToken);
  };

  const value = {
    backendUrl,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

// Custom hook — import and call this wherever you need the context.
// Usage:  const { backendUrl, token, setToken } = useStore();
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a <StoreProvider>");
  }
  return context;
};

export default StoreContext;

