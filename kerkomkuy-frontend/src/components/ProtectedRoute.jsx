import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  console.log("ProtectedRoute component rendered");

  const { user } = useContext(AuthContext);

  console.log("ProtectedRoute user:", user);

  if (user === null) {
    // Tambahkan fallback untuk mencegah render sebelum user diperbarui
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
