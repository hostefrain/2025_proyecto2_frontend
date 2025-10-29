import React from "react";
import "./css/DashboardReporte.css";

// 1. Define las props que acepta el componente
interface DashboardReporteProps {
  onBack: () => void;
}

// 2. Asigna las props al componente
const DashboardReporte: React.FC<DashboardReporteProps> = ({ onBack }) => {
  return (
    <div className="dashboard-container">
      {/* 3. Agrega un botón para volver al Dashboard principal */}
      <button className="back-button" onClick={onBack}>
        ← Volver al Dashboard
      </button>

      <iframe
        src="http://localhost:3001/public/dashboard/eb4b2df5-68d2-484d-bd0d-1bff0dae6a58"
        title="Dashboard de Reportes"
        frameBorder="0"
        allowTransparency
        allowFullScreen
        style={{
          width: "100%",
          height: "90vh",
          border: "none",
        }}
      ></iframe>
    </div>
  );
};

export default DashboardReporte;