import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  const fetchMe = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
      setAuthReady(true); // ✅ AUTH IS NOW READY
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchMe();
    } else {
      setLoading(false);
      setAuthReady(true); // even without token
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, authReady }} // expose authReady
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
