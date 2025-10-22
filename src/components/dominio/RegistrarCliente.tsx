import React, { useState } from "react";
import "./RegistrarCliente.css";
import api from "../../api/axios";

interface RegistrarClienteProps {
  onBack: () => void;
}

const RegistrarCliente: React.FC<RegistrarClienteProps> = ({ onBack }) => {
  const [cliente, setCliente] = useState({ nombre: "", telefono: "", dni: "" });

  const handleSubmit = async () => {
    if (!cliente.nombre || !cliente.telefono || !cliente.dni) {
      alert("Todos los campos son obligatorios");
      return;
    }
    try {
      await api.post("/cliente", cliente);
      alert("Cliente registrado con éxito");
      onBack();
    } catch (error: any) {
      alert(`Error al registrar cliente: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleCancel = () => {
    setCliente({ nombre: "", telefono: "", dni: "" });
    onBack();
  };

  return (
    <div className="registrar-cliente-container">
      <button onClick={onBack} className="volver-button">
        ← Volver
      </button>

      <h2 className="registrar-cliente-title">Registrar Cliente</h2>

      <form className="registrar-cliente-form" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label>Nombre completo</label>
          <input
            type="text"
            placeholder="Ingrese el nombre del cliente"
            value={cliente.nombre}
            onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
          />
        </div>

        <div>
          <label>Teléfono</label>
          <input
            type="tel"
            placeholder="Ej: +54 9 11 1234-5678"
            value={cliente.telefono}
            onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
          />
        </div>

        <div>
          <label>DNI</label>
          <input
            type="text"
            placeholder="Ej: 12345678"
            value={cliente.dni}
            onChange={(e) => setCliente({ ...cliente, dni: e.target.value })}
          />
        </div>

        <div className="registrar-cliente-buttons">
          <button 
            type="button" 
            className="registrar-cliente-button cancel" 
            onClick={handleCancel}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="registrar-cliente-button save" 
            onClick={handleSubmit}
          >
            Guardar Cliente
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrarCliente;