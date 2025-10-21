import React, { useState } from "react";
import Header from "../inicio/Header";
import Dashboard from "../inicio/Dashboard";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const Inicio: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState("Perfil");
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

  // 👇 Ya no necesitas conversión, el tipo es correcto
  return (
    <div>
      <Header
        user={user}
        onSelectFeature={setSelectedFeature}
        onLogout={handleLogout}
      />
      <Dashboard selectedFeature={selectedFeature} />
    </div>
  );
};

export default Inicio;