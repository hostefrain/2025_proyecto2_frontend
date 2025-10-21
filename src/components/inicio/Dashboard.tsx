import React, { useState } from "react";
import "./Dashboard.css";
import RegistrarVenta from "../dominio/RegistrarVenta";
import ConsultarVentas from "../dominio/ConsultarVentas";
import ConsultarStock from "../dominio/ConsultarStock";
import ConsultarClientes from "../dominio/ConsultarClientes";

// 👇 Define las props que recibe Dashboard
interface DashboardProps {
  selectedFeature: string;
}

const Dashboard: React.FC<DashboardProps> = () => {
  const [selectedFeature, setSelectedFeature] = useState("Dashboard");

  const renderFeature = () => {
    switch (selectedFeature) {
      case "Registrar Venta":
        return <RegistrarVenta onBack={() => setSelectedFeature("Dashboard")} />;
      case "Consultar Ventas":
        return <ConsultarVentas onBack={() => {setSelectedFeature("Dashboard")}} />;
      case "Consultar Productos":
        return <ConsultarStock onBack={() => setSelectedFeature("Dashboard")} />;
      case "Consultar Clientes":
        return <ConsultarClientes onBack={() => setSelectedFeature("Dashboard")} />;
      default:
        return (
          <div className="dashboard-container">
            <h2 className="dashboard-title">Dashboard</h2>
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

              <button className="dashboard-button"
              onClick={() => setSelectedFeature("Consultar Productos")}
              >
                Consultar Stock
                </button>

              <button className="dashboard-button"
              onClick={() => setSelectedFeature("Consultar Clientes")}
              >
                Consultar Clientes
                </button>
            </div>
          </div>
        );
    }
  };

  return renderFeature();
};

export default Dashboard;