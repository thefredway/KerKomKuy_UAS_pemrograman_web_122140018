import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Grup from "./pages/Grup";

function App() {
  console.log("App component rendered"); // Log tambahan

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/grup" element={<Grup />} />
      </Route>
    </Routes>
  );
}

export default App;
