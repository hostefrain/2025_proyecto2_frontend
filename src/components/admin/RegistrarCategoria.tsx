import React, { useState } from "react";
import "./css/RegistrarRelacion.css";
import { createNuevaCategoria, type NuevaCategoria, type Categoria } from '../../services/categoriaService';

interface RegistrarCategoriaProps {
  onSuccess: (nuevaCategoria: Categoria) => void;
  onCancel: () => void;
}

const RegistrarCategoria: React.FC<RegistrarCategoriaProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<NuevaCategoria>({
    nombre: "",
    descripcion: "",
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      alert("El nombre de la categoría es obligatorio");
      return;
    }

    setLoading(true);
    try {
      const data = await createNuevaCategoria(formData);
      alert("Categoría creada con éxito");
      onSuccess(data);
      setFormData({ nombre: "", descripcion: "" });
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content-small" onClick={(e) => e.stopPropagation()}>
        <h3>📁 Nueva Línea</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              placeholder="Ej: Electrónica"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              autoFocus
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              placeholder="Descripción de la línea"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="modal-buttons">
            <button 
              type="button" 
              className="btn-modal-cancelar" 
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-modal-guardar"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Línea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarCategoria;