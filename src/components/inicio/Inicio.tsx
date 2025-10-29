import React from "react";
import Header from "../inicio/Header";
import Dashboard from "../inicio/Dashboard";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const Inicio: React.FC = () => {
  const { user, logout, loading } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <Header
        user={user}
        onLogout={handleLogout}
      />
      <Dashboard /> {/* 👈 Sin prop selectedFeature */}
    </div>
  );
};

export default Inicio;