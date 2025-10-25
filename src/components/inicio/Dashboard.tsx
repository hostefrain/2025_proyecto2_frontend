import React, { useState } from "react";
import "./Dashboard.css";
import RegistrarVenta from "../dominio/RegistrarVenta";
import ConsultarVentas from "../dominio/ConsultarVentas";
import ConsultarStock from "../dominio/ConsultarStock";
import ConsultarClientes from "../dominio/ConsultarClientes";
import RegistrarCliente from "../dominio/RegistrarCliente";
import RegistrarProducto from "../admin/RegistrarProducto";
import ConsultarProductosAdmin from "../admin/ConsultarProductosAdmin";
import ConsultarMarcas from "../admin/ConsultarMarcas";
import ConsultarProveedores
 from "../admin/ConsultarProveedores";
import { useAuth } from "../../context/AuthContext";

const Dashboard: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState("Dashboard");
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  const renderFeature = () => {
    switch (selectedFeature) {
      case "Registrar Venta":
        return (
          <RegistrarVenta
            onBack={() => setSelectedFeature("Dashboard")}
            onRegistrarCliente={() => setSelectedFeature("Registrar Cliente")} 
          />
        );
      case "Consultar Ventas":
        return <ConsultarVentas onBack={() => setSelectedFeature("Dashboard")} />;
      case "Consultar Productos":
        return <ConsultarStock onBack={() => setSelectedFeature("Dashboard")} />;
      case "Consultar Clientes":
        return <ConsultarClientes onBack={() => setSelectedFeature("Dashboard")} />;
      case "Registrar Cliente":
        return <RegistrarCliente onBack={() => setSelectedFeature("Registrar Venta")} />;
      case "Registrar Productos":
        return <RegistrarProducto onBack={() => setSelectedFeature("Dashboard")} />;
      case "Consultar Productos Admin":
        return <ConsultarProductosAdmin onBack={() => setSelectedFeature("Dashboard")} />;
      case "Consultar Marcas":
        return <ConsultarMarcas onBack={() => setSelectedFeature("Dashboard")} />;
      case "Consultar Proveedores":
        return <ConsultarProveedores onBack={() => setSelectedFeature("Dashboard")} />;
      
      // Nuevos casos para Admin
      case "Consultar Proveedores":
        return <div className="placeholder">Consultar Proveedores (Por implementar)</div>;
      
      default:
        return (
          <div className="dashboard-container">
            <h2 className="dashboard-title">Dashboard</h2>
            
            {/* Sección de funcionalidades comunes */}
            <div className="dashboard-section">
              <h3 className="section-title">📊 Operaciones</h3>
              <div className="dashboard-buttons">
                <button
                  className="dashboard-button"
                  onClick={() => setSelectedFeature("Registrar Venta")}
                >
                  Registrar Venta
                </button>

                <button
                  className="dashboard-button"
                  onClick={() => setSelectedFeature("Consultar Ventas")}
                >
                  Consultar Ventas
                </button>

                <button 
                  className="dashboard-button"
                  onClick={() => setSelectedFeature("Consultar Productos")}
                >
                  Consultar Stock
                </button>

                <button 
                  className="dashboard-button"
                  onClick={() => setSelectedFeature("Consultar Clientes")}
                >
                  Consultar Clientes
                </button>
              </div>
            </div>

            {/* Sección solo para Admin */}
            {isAdmin() && (
              <div className="dashboard-section admin-section">
                <h3 className="section-title">🔐 Administración</h3>
                <div className="dashboard-buttons">
                  <button
                    className="dashboard-button admin-button"
                    onClick={() => setSelectedFeature("Registrar Productos")}
                  >
                    Registrar Productos
                  </button>

                  <button
                    className="dashboard-button admin-button"
                    onClick={() => setSelectedFeature("Consultar Productos Admin")}
                  >
                    Consultar Productos
                  </button>

                  <button
                    className="dashboard-button admin-button"
                    onClick={() => setSelectedFeature("Consultar Marcas")}
                  >
                    Consultar Marcas
                  </button>

                  <button
                    className="dashboard-button admin-button"
                    onClick={() => setSelectedFeature("Consultar Proveedores")}
                  >
                    Consultar Proveedores
                  </button>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return <>{renderFeature()}</>;
};

export default Dashboard;