import React, { useState } from "react";
import "./RegistrarRelacion.css";
import api from "../../api/axios";

interface RegistrarMarcaProps {
  onSuccess: (nuevaMarca: any) => void;
  onCancel: () => void;
}

const RegistrarMarca: React.FC<RegistrarMarcaProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    logo: "",
  });

  // Estado para controlar si el logo se cargó correctamente
  const [logoValido, setLogoValido] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset logo válido cuando cambia la URL
    if (name === 'logo') {
      setLogoValido(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      alert("El nombre de la marca es obligatorio");
      return;
    }

    try {
      const response = await api.post("/marca", formData);
      alert("Marca creada con éxito");
      onSuccess(response.data);
      setFormData({ nombre: "", descripcion: "", logo: "" });
    } catch (error: any) {
      alert(`Error al crear marca: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content-small" onClick={(e) => e.stopPropagation()}>
        <h3>🏷️ Nueva Marca</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              name="nombre"
              placeholder="Ej: Samsung"
              value={formData.nombre}
              onChange={handleChange}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              placeholder="Descripción de la marca"
              value={formData.descripcion}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div className="form-group">
            <label>URL del logo</label>
            <input
              type="text"
              name="logo"
              placeholder="https://ejemplo.com/logo.png"
              value={formData.logo}
              onChange={handleChange}
            />
          </div>

          {/* 👇 VISTA PREVIA DEL LOGO */}
          {formData.logo && logoValido && (
            <div className="preview-logo">
              <label>Vista previa:</label>
              <img 
                src={formData.logo} 
                alt="Preview" 
                onError={() => setLogoValido(false)}
              />
            </div>
          )}

          {formData.logo && !logoValido && (
            <div className="preview-error">
              ⚠️ No se pudo cargar el logo. Verifica la URL.
            </div>
          )}

          <div className="modal-buttons">
            <button type="button" className="btn-modal-cancelar" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn-modal-guardar">
              Crear Marca
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarMarca;