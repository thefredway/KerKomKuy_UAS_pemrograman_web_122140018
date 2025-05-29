import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "../api/api"; // Mengimpor fungsi login dari API

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Tambahkan loading state
  const navigate = useNavigate();

  // Simulasikan pemeriksaan user yang sudah login (dari localStorage)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      setUser(false); // false artinya tidak login
    }
    setLoading(false); // Setelah pengecekan selesai
  }, []);

  const login = async (nim, password) => {
    try {
      const response = await apiLogin(nim, password); // Panggil API login
      const user = response.data.user;
      setUser(user); // Set user ke state
      localStorage.setItem("user", JSON.stringify(user)); // Simpan user ke localStorage
      navigate("/"); // Arahkan ke halaman utama setelah login berhasil
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false; // Jika gagal login
    }
  };

  const logout = () => {
    setUser(false);
    localStorage.removeItem("user"); // Hapus dari localStorage
    navigate("/login"); // Arahkan ke halaman login
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
