import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './css/ConsultarProveedores.css';
import { createProveedor, deleteProveedor, updateProveedor, type Proveedor } from '../../services/proveedorService'
import { getAllProveedores } from '../../services/productoService';

interface ConsultarProveedoresProps {
  onBack: () => void;
}

const ConsultarProveedores: React.FC<ConsultarProveedoresProps> = ({ onBack }) => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtro
  const [filtroNombre, setFiltroNombre] = useState('');

  // Modales
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [proveedorEditando, setProveedorEditando] = useState<Proveedor | null>(null);

  const [nombreProveedor, setNombreProveedor] = useState('');

  useEffect(() => {
    fetchProveedores();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [proveedores, filtroNombre]);

  const fetchProveedores = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllProveedores()
      setProveedores(response);
    } catch (err: any) {
      console.error(err);
      setError('Error al cargar los proveedores');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...proveedores];

    if (filtroNombre.trim()) {
      resultado = resultado.filter((p) =>
        p.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
      );
    }

    setProveedoresFiltrados(resultado);
  };

  const limpiarFiltros = () => {
    setFiltroNombre('');
  };

  // Abrir modal de crear
  const abrirModalCrear = () => {
    setNombreProveedor('');
    setMostrarModalCrear(true);
  };

  // Abrir modal de editar
  const abrirModalEditar = (proveedor: Proveedor) => {
    setProveedorEditando(proveedor);
    setNombreProveedor(proveedor.nombre);
    setMostrarModalEditar(true);
  };

  const cerrarModales = () => {
    setMostrarModalCrear(false);
    setMostrarModalEditar(false);
    setProveedorEditando(null);
    setNombreProveedor('');
  };

  // Crear proveedor
  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombreProveedor.trim()) {
      alert('El nombre del proveedor es obligatorio');
      return;
    }

    try {
      await createProveedor({ nombre: nombreProveedor })
      alert('Proveedor creado con éxito');
      cerrarModales();
      fetchProveedores();
    } catch (error: any) {
      alert(`Error al crear proveedor: ${error.response?.data?.message || error.message}`);
    }
  };

  // Editar proveedor
  const handleEditar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombreProveedor.trim()) {
      alert('El nombre del proveedor es obligatorio');
      return;
    }

    try {
      await updateProveedor(proveedorEditando!.id_proveedor,{ nombre: nombreProveedor })
      alert('Proveedor actualizado con éxito');
      cerrarModales();
      fetchProveedores();
    } catch (error: any) {
      alert(`Error al actualizar proveedor: ${error.response?.data?.message || error.message}`);
    }
  };

  // Eliminar proveedor
  const eliminarProveedor = async (id: string, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar el proveedor "${nombre}"?`)) {
      return;
    }

    try {
      await deleteProveedor(id)
      alert('Proveedor eliminado con éxito');
      fetchProveedores();
    } catch (error: any) {
      alert(`Error al eliminar: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="consultar-proveedores">
        <button onClick={onBack} className="btn-volver">← Volver</button>
        <div className="loading">Cargando proveedores...</div>
      </div>
    );
  }

  return (
    <div className="consultar-proveedores">
      <div className="header-proveedores">
        <button onClick={onBack} className="btn-volver">← Volver</button>
        <button onClick={abrirModalCrear} className="btn-nuevo-proveedor">
          + Nuevo Proveedor
        </button>
      </div>

      <h2>🏢 Administrar Proveedores</h2>

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

      {/* Tabla de proveedores */}
      {proveedoresFiltrados.length === 0 ? (
        <div className="no-data">No se encontraron proveedores</div>
      ) : (
        <table className="proveedores-table">
          <thead>
            <tr>
              <th>Nombre del Proveedor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedoresFiltrados.map((p) => (
              <tr key={p.id_proveedor}>
                <td>
                  <strong className="nombre-proveedor">{p.nombre}</strong>
                </td>
                <td>
                  <div className="acciones-buttons">
                    <button
                      className="btn-editar"
                      onClick={() => abrirModalEditar(p)}
                      title="Editar proveedor"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarProveedor(p.id_proveedor, p.nombre)}
                      title="Eliminar proveedor"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal CREAR proveedor */}
      {mostrarModalCrear && (
        <div className="modal-overlay" onClick={cerrarModales}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>🏢 Nuevo Proveedor</h3>

            <form onSubmit={handleCrear}>
              <div className="form-group">
                <label>Nombre del proveedor *</label>
                <input
                  type="text"
                  placeholder="Ej: Distribuidora ABC"
                  value={nombreProveedor}
                  onChange={(e) => setNombreProveedor(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="modal-buttons">
                <button type="button" className="btn-modal-cancelar" onClick={cerrarModales}>
                  Cancelar
                </button>
                <button type="submit" className="btn-modal-guardar">
                  Crear Proveedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal EDITAR proveedor */}
      {mostrarModalEditar && proveedorEditando && (
        <div className="modal-overlay" onClick={cerrarModales}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>✏️ Editar Proveedor</h3>

            <form onSubmit={handleEditar}>
              <div className="form-group">
                <label>Nombre del proveedor *</label>
                <input
                  type="text"
                  placeholder="Ej: Distribuidora ABC"
                  value={nombreProveedor}
                  onChange={(e) => setNombreProveedor(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="modal-buttons">
                <button type="button" className="btn-modal-cancelar" onClick={cerrarModales}>
                  Cancelar
                </button>
                <button type="submit" className="btn-modal-guardar">
                  Actualizar Proveedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultarProveedores;