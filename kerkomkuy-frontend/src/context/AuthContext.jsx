import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

  const login = (nim, password) => {
    if (nim === "1" && password === "kerkom123") {
      const userData = { nim };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData)); // Simpan user ke localStorage
      navigate("/");
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(false);
    localStorage.removeItem("user"); // Hapus dari localStorage
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
