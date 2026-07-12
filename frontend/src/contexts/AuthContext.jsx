import React, { createContext, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import apiFetch from "../api";

const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  updateProfile: async () => ({ success: false })
});

export const AuthProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMe = useCallback(async () => {
    setLoading(true);
    const { ok, data } = await apiFetch("/api/auth/me");
    if (ok && data.user) {
      setUser(data.user);
      if (data.user.language) {
        localStorage.setItem("i18nextLng", data.user.language);
        i18n.changeLanguage(data.user.language);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [i18n]);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const login = async (email, password) => {
    setError(null);
    const { ok, data } = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    if (ok && data.success) {
      setUser(data.user);
      if (data.user.language) {
        localStorage.setItem("i18nextLng", data.user.language);
        i18n.changeLanguage(data.user.language);
      }
      return { success: true };
    }
    const msg = data.errors ? data.errors.join(" ") : "Login failed.";
    setError(msg);
    return { success: false, error: msg };
  };

  const register = async (name, email, password, language = "de") => {
    setError(null);
    const { ok, data } = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, language })
    });
    if (ok && data.success) {
      setUser(data.user);
      if (data.user.language) {
        localStorage.setItem("i18nextLng", data.user.language);
        i18n.changeLanguage(data.user.language);
      }
      return { success: true };
    }
    const msg = data.errors ? data.errors.join(" ") : "Registration failed.";
    setError(msg);
    return { success: false, error: msg };
  };

  const logout = async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  const updateProfile = async (updates) => {
    setError(null);
    const { ok, data } = await apiFetch("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(updates)
    });
    if (ok && data.success) {
      setUser(data.user);
      if (data.user.language) {
        localStorage.setItem("i18nextLng", data.user.language);
        i18n.changeLanguage(data.user.language);
      }
      return { success: true };
    }
    const msg = data.errors ? data.errors.join(" ") : "Update failed.";
    setError(msg);
    return { success: false, error: msg };
  };

  const changePassword = async (currentPassword, newPassword) => {
    setError(null);
    const { ok, data } = await apiFetch("/api/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword })
    });
    if (ok && data.success) {
      return { success: true };
    }
    const msg = data.errors ? data.errors.join(" ") : "Password change failed.";
    setError(msg);
    return { success: false, error: msg };
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
