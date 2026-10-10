import { createContext, useContext, useEffect, useState } from "react";
import { api, getTokens, setTokens } from "../api/client";
 
const AuthContext = createContext(null);
 
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
 
  // On first load, restore the session if we have a saved token
  useEffect(() => {
    const restore = async () => {
      if (!getTokens()?.access) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me/");
        setUser(data);
      } catch {
        setTokens(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);
 
  const login = async (email, password) => {
    const { data } = await api.post("/auth/login/", { email, password });
    setTokens({ access: data.access, refresh: data.refresh });
    setUser(data.user);
    return data.user;
  };
 
  const register = async ({ fullName, email, password, phone }) => {
    const [first_name, ...rest] = fullName.trim().split(" ");
    await api.post("/auth/register/", {
      email,
      username: email,
      first_name,
      last_name: rest.join(" "),
      phone: phone || "",
      password,
    });
    return login(email, password);
  };
 
  const logout = async () => {
    const tokens = getTokens();
    try {
      if (tokens?.refresh) await api.post("/auth/logout/", { refresh: tokens.refresh });
    } catch {
      // token may already be expired, we still clear the local session
    }
    setTokens(null);
    setUser(null);
  };
 
  // any role other than "customer" is a staff/admin role
  const isStaff = !!user && user.role !== "customer";
 
  return (
    <AuthContext.Provider value={{ user, loading, isStaff, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
 
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
 