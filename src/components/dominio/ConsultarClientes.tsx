import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import './ConsultarClientes.css';

interface Cliente {
  id: string;
  dni: string;
  nombre: string;
  telefono: string;
}

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
      const response = await api.get('/cliente');
      setClientes(response.data);
    } catch (err: any) {
      console.error(err);
      setError('Error al cargar los clientes');
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
      <button onClick={onBack} className="btn-volver">← Volver</button>
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
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((c) => (
              <tr key={c.id}>
                <td>{c.dni}</td>
                <td>{c.nombre}</td>
                <td>{c.telefono}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ConsultarClientes;
