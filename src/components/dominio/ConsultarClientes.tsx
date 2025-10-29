import React, { useEffect, useState } from 'react';
import './css/ConsultarClientes.css';
import { getAllClientes, createNuevoCliente, updateCliente} from '../../services/clienteService';
import type { Cliente } from '../../services/clienteService';

interface ConsultarClientesProps {
  onBack: () => void;
}

const ConsultarClientes: React.FC<ConsultarClientesProps> = ({ onBack }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtros
  const [dni, setDni] = useState('');
  const [nombre, setNombre] = useState('');

  // Modal de registro/edición
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [formCliente, setFormCliente] = useState({
    nombre: '',
    telefono: '',
    dni: ''
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [clientes, dni, nombre]);

  const fetchClientes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllClientes(); // 👈 Usar servicio
      setClientes(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...clientes];

    if (dni.trim()) {
      resultado = resultado.filter((c) =>
        c.dni.toLowerCase().includes(dni.toLowerCase())
      );
    }

    if (nombre.trim()) {
      resultado = resultado.filter((c) =>
        c.nombre.toLowerCase().includes(nombre.toLowerCase())
      );
    }

    setClientesFiltrados(resultado);
  };

  const limpiarFiltros = () => {
    setDni('');
    setNombre('');
  };

  const abrirModalRegistro = () => {
    setModoEdicion(false);
    setClienteEditando(null);
    setFormCliente({ nombre: '', telefono: '', dni: '' });
    setMostrarModal(true);
  };

  const abrirModalEdicion = (cliente: Cliente) => {
    setModoEdicion(true);
    setClienteEditando(cliente);
    setFormCliente({
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      dni: cliente.dni
    });
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setFormCliente({ nombre: '', telefono: '', dni: '' });
    setClienteEditando(null);
  };

const handleSubmit = async () => {
  if (!formCliente.nombre || !formCliente.telefono || !formCliente.dni) {
    alert('Todos los campos son obligatorios');
    return;
  }

  try {
    if (modoEdicion && clienteEditando) {
      // 👇 Usar servicio
      await updateCliente(clienteEditando.id!, formCliente);
      alert('Cliente actualizado con éxito');
    } else {
      // 👇 Usar servicio
      await createNuevoCliente(formCliente);
      alert('Cliente registrado con éxito');
    }
    cerrarModal();
    fetchClientes();
  } catch (error: any) {
    alert(error.message);
  }
};

  if (loading) {
    return (
      <div className="consultar-clientes">
        <button onClick={onBack} className="btn-volver">← Volver</button>
        <div className="loading">Cargando clientes...</div>
      </div>
    );
  }

  return (
    <div className="consultar-clientes">
      <div className="header-container">
        <button onClick={onBack} className="btn-volver">← Volver</button>
        <button onClick={abrirModalRegistro} className="btn-nuevo-cliente">
          + Nuevo Cliente
        </button>
      </div>

      <h2>👥 Consultar Clientes</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Filtros */}
      <div className="filtros-container">
        <div className="filtro-group">
          <label>🪪 DNI</label>
          <input
            type="text"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            placeholder="Buscar por DNI"
          />
        </div>

        <div className="filtro-group">
          <label>👤 Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Buscar por nombre"
          />
        </div>

        <button onClick={limpiarFiltros} className="btn-limpiar">🗑️ Limpiar</button>
      </div>

      {/* Tabla de clientes */}
      {clientesFiltrados.length === 0 ? (
        <div className="no-data">No se encontraron clientes</div>
      ) : (
        <table className="clientes-table">
          <thead>
            <tr>
              <th>DNI</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((c) => (
              <tr key={c.id}>
                <td>{c.dni}</td>
                <td>{c.nombre}</td>
                <td>{c.telefono}</td>
                <td>
                  <button 
                    className="btn-editar"
                    onClick={() => abrirModalEdicion(c)}
                  >
                    ✏️ Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de registro/edición */}
      {mostrarModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{modoEdicion ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}</h3>
            
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>Nombre completo</label>
                <input
                  type="text"
                  placeholder="Ingrese el nombre del cliente"
                  value={formCliente.nombre}
                  onChange={(e) => setFormCliente({ ...formCliente, nombre: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  placeholder="Ej: +54 9 11 1234-5678"
                  value={formCliente.telefono}
                  onChange={(e) => setFormCliente({ ...formCliente, telefono: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>DNI</label>
                <input
                  type="text"
                  placeholder="Ej: 12345678"
                  value={formCliente.dni}
                  onChange={(e) => setFormCliente({ ...formCliente, dni: e.target.value })}
                />
              </div>

              <div className="modal-buttons">
                <button type="button" className="btn-modal-cancelar" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-modal-guardar" onClick={handleSubmit}>
                  {modoEdicion ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultarClientes;