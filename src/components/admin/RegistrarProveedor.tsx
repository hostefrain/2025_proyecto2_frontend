import React, { useState } from "react";
import "./RegistrarRelacion.css";
import api from "../../api/axios";

interface RegistrarProveedorProps {
  onSuccess: (nuevoProveedor: any) => void;
  onCancel: () => void;
}

const RegistrarProveedor: React.FC<RegistrarProveedorProps> = ({ onSuccess, onCancel }) => {
  const [nombre, setNombre] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert("El nombre del proveedor es obligatorio");
      return;
    }

    try {
      const response = await api.post("/proveedor", { nombre });
      alert("Proveedor creado con éxito");
      onSuccess(response.data);
      setNombre("");
    } catch (error: any) {
      alert(`Error al crear proveedor: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content-small" onClick={(e) => e.stopPropagation()}>
        <h3>🏢 Nuevo Proveedor</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre del proveedor *</label>
            <input
              type="text"
              placeholder="Ej: Distribuidora ABC"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoFocus
            />
          </div>

          <div className="modal-buttons">
            <button type="button" className="btn-modal-cancelar" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn-modal-guardar">
              Crear Proveedor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarProveedor;