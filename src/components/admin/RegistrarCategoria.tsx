import React, { useState } from "react";
import "./RegistrarRelacion.css";
import api from "../../api/axios";

interface RegistrarCategoriaProps {
  onSuccess: (nuevaCategoria: any) => void;
  onCancel: () => void;
}

const RegistrarCategoria: React.FC<RegistrarCategoriaProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      alert("El nombre de la categoría es obligatorio");
      return;
    }

    try {
      const response = await api.post("/categoria", formData);
      alert("Categoría creada con éxito");
      onSuccess(response.data);
      setFormData({ nombre: "", descripcion: "" });
    } catch (error: any) {
      alert(`Error al crear categoría: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content-small" onClick={(e) => e.stopPropagation()}>
        <h3>📁 Nueva Linea</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              placeholder="Ej: Electrónica"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              placeholder="Descripción de la linea"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={3}
            />
          </div>

          <div className="modal-buttons">
            <button type="button" className="btn-modal-cancelar" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn-modal-guardar">
              Crear Linea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarCategoria;