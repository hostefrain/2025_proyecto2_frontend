import React, { useState, useEffect } from 'react';
import './css/ConsultarMarcas.css';
import { createMarca, deleteMarca, getAllMarcas, updateMarca, type Marca } from '../../services/marcaService';

interface ConsultarMarcasProps {
  onBack: () => void;
}

const ConsultarMarcas: React.FC<ConsultarMarcasProps> = ({ onBack }) => {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [marcasFiltradas, setMarcasFiltradas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtro
  const [filtroNombre, setFiltroNombre] = useState('');

  // Modales
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [marcaEditando, setMarcaEditando] = useState<Marca | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    logo: '',
  });

  useEffect(() => {
    fetchMarcas();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [marcas, filtroNombre]);

  const fetchMarcas = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllMarcas()
      setMarcas(response);
    } catch (err: any) {
      console.error(err);
      setError('Error al cargar las marcas');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...marcas];

    if (filtroNombre.trim()) {
      resultado = resultado.filter((m) =>
        m.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
      );
    }

    setMarcasFiltradas(resultado);
  };

  const limpiarFiltros = () => {
    setFiltroNombre('');
  };

  // Abrir modal de crear
  const abrirModalCrear = () => {
    setFormData({ nombre: '', descripcion: '', logo: '' });
    setMostrarModalCrear(true);
  };

  // Abrir modal de editar
  const abrirModalEditar = (marca: Marca) => {
    setMarcaEditando(marca);
    setFormData({
      nombre: marca.nombre,
      descripcion: marca.descripcion || '',
      logo: marca.logo || '',
    });
    setMostrarModalEditar(true);
  };

  const cerrarModales = () => {
    setMostrarModalCrear(false);
    setMostrarModalEditar(false);
    setMarcaEditando(null);
    setFormData({ nombre: '', descripcion: '', logo: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Crear marca
  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      alert('El nombre de la marca es obligatorio');
      return;
    }

    try {
      await createMarca(formData)
      alert('Marca creada con éxito');
      cerrarModales();
      fetchMarcas();
    } catch (error: any) {
      alert(`Error al crear marca: ${error.response?.data?.message || error.message}`);
    }
  };

  // Editar marca
  const handleEditar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      alert('El nombre de la marca es obligatorio');
      return;
    }

    try {
      await updateMarca(marcaEditando!.id_marca, formData)
      alert('Marca actualizada con éxito');
      cerrarModales();
      fetchMarcas();
    } catch (error: any) {
      alert(`Error al actualizar marca: ${error.response?.data?.message || error.message}`);
    }
  };

  // Eliminar marca
  const eliminarMarca = async (id: string, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar la marca "${nombre}"?`)) {
      return;
    }

    try {
      await deleteMarca(id)
      alert('Marca eliminada con éxito');
      fetchMarcas();
    } catch (error: any) {
      alert(`Error al eliminar: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="consultar-marcas">
        <button onClick={onBack} className="btn-volver">← Volver</button>
        <div className="loading">Cargando marcas...</div>
      </div>
    );
  }

  return (
    <div className="consultar-marcas">
      <div className="header-marcas">
        <button onClick={onBack} className="btn-volver">← Volver</button>
        <button onClick={abrirModalCrear} className="btn-nueva-marca">
          + Nueva Marca
        </button>
      </div>

      <h2>🏷️ Administrar Marcas</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Filtro */}
      <div className="filtros-container">
        <div className="filtro-group">
          <label>🔍 Nombre</label>
          <input
            type="text"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
            placeholder="Buscar por nombre"
          />
        </div>

        <button onClick={limpiarFiltros} className="btn-limpiar">🗑️ Limpiar</button>
      </div>

      {/* Tabla de marcas */}
      {marcasFiltradas.length === 0 ? (
        <div className="no-data">No se encontraron marcas</div>
      ) : (
        <table className="marcas-table">
          <thead>
            <tr>
              <th>Logo</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {marcasFiltradas.map((m) => (
              <tr key={m.id_marca}>
                <td>
                  {m.logo ? (
                    <img src={m.logo} alt={m.nombre} className="marca-logo" />
                  ) : (
                    <div className="sin-logo">Sin logo</div>
                  )}
                </td>
                <td>
                  <strong>{m.nombre}</strong>
                </td>
                <td>
                  <div className="descripcion-text">
                    {m.descripcion || 'Sin descripción'}
                  </div>
                </td>
                <td>
                  <div className="acciones-buttons">
                    <button
                      className="btn-editar"
                      onClick={() => abrirModalEditar(m)}
                      title="Editar marca"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarMarca(m.id_marca, m.nombre)}
                      title="Eliminar marca"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal CREAR marca */}
      {mostrarModalCrear && (
        <div className="modal-overlay" onClick={cerrarModales}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>🏷️ Nueva Marca</h3>

            <form onSubmit={handleCrear}>
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ej: Samsung"
                  value={formData.nombre}
                  onChange={handleChange}
                  autoFocus
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  placeholder="Descripción de la marca"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={3}
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

              {formData.logo && (
                <div className="preview-logo">
                  <label>Vista previa:</label>
                  <img src={formData.logo} alt="Preview" onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }} />
                </div>
              )}

              <div className="modal-buttons">
                <button type="button" className="btn-modal-cancelar" onClick={cerrarModales}>
                  Cancelar
                </button>
                <button type="submit" className="btn-modal-guardar">
                  Crear Marca
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal EDITAR marca */}
      {mostrarModalEditar && marcaEditando && (
        <div className="modal-overlay" onClick={cerrarModales}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>✏️ Editar Marca</h3>

            <form onSubmit={handleEditar}>
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ej: Samsung"
                  value={formData.nombre}
                  onChange={handleChange}
                  autoFocus
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  placeholder="Descripción de la marca"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={3}
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

              {formData.logo && (
                <div className="preview-logo">
                  <label>Vista previa:</label>
                  <img src={formData.logo} alt="Preview" onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }} />
                </div>
              )}

              <div className="modal-buttons">
                <button type="button" className="btn-modal-cancelar" onClick={cerrarModales}>
                  Cancelar
                </button>
                <button type="submit" className="btn-modal-guardar">
                  Actualizar Marca
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultarMarcas;