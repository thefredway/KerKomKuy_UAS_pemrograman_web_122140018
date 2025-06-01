import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin, getUsers } from "../api/api"; // ✅ tambahkan getUsers

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Ambil user dari localStorage saat pertama kali
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      setUser(false);
    }
    setLoading(false);
  }, []);

  const login = async (nim, password) => {
    try {
      // 1. Login via API
      await apiLogin(nim, password);

      // 2. Ambil semua user lalu cari berdasarkan NIM
      const res = await getUsers();
      const userData = res.data.find((u) => u.nim === nim);

      if (userData) {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/");
        return true;
      } else {
        console.error("User tidak ditemukan setelah login.");
        return false;
      }
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const logout = () => {
    setUser(false);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
