import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Grup from "./pages/Grup";
import Footer from "./components/Footer";
import AppNavbar from "./components/Navbar";
function App() {
  console.log("App component rendered"); // Log tambahan

  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />
      <div className="flex-grow-1">
        <main className="main container py-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/grup" element={<Grup />} />
            </Route>
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
