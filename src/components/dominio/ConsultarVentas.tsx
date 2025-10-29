// src/components/dominio/ConsultarVentas.tsx
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './css/ConsultarVentas.css';
import { getAllVentas, type Venta } from "../../services/ventaService";

interface ConsultarVentasProps {
  onBack: () => void;
}

const ConsultarVentas: React.FC<ConsultarVentasProps> = ({ onBack }) => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [ventasFiltradas, setVentasFiltradas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtros
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [dniCliente, setDniCliente] = useState('');
  
  // Detalle expandido
  const [ventaExpandida, setVentaExpandida] = useState<string | null>(null);

  useEffect(() => {
    fetchVentas();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [ventas, fechaDesde, fechaHasta, dniCliente]);

const fetchVentas = async () => {
  setLoading(true);
  setError('');
  try {
    const response = await getAllVentas()
    const data = response.map((venta: any) => ({
      ...venta,
      precioTotal: Number(venta.precioTotal),
      detalles: venta.detalles.map((detalle: any) => ({
        ...detalle,
        precioSubTotal: Number(detalle.precioSubTotal),
        producto: {
          ...detalle.producto,
          precio: Number(detalle.producto.precio),
        },
      })),
    }));
    setVentas(data);
  } catch (err: any) {
    setError('Error al cargar las ventas');
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  const aplicarFiltros = () => {
    let resultado = [...ventas];

    // Filtro por DNI
    if (dniCliente.trim()) {
      resultado = resultado.filter(venta => 
        venta.cliente.dni.toLowerCase().includes(dniCliente.toLowerCase())
      );
    }

    // Filtro por fecha desde
    if (fechaDesde) {
      resultado = resultado.filter(venta => {
        const fechaVenta = new Date(venta.createdAt);
        const fechaFiltro = new Date(fechaDesde);
        return fechaVenta >= fechaFiltro;
      });
    }

    // Filtro por fecha hasta
    if (fechaHasta) {
      resultado = resultado.filter(venta => {
        const fechaVenta = new Date(venta.createdAt);
        const fechaFiltro = new Date(fechaHasta);
        fechaFiltro.setHours(23, 59, 59, 999);
        return fechaVenta <= fechaFiltro;
      });
    }

    setVentasFiltradas(resultado);
  };

  const limpiarFiltros = () => {
    setFechaDesde('');
    setFechaHasta('');
    setDniCliente('');
  };

  const toggleDetalle = (idVenta: string) => {
    setVentaExpandida(ventaExpandida === idVenta ? null : idVenta);
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrecio = (precio: number) => {
    return `$${precio.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="consultar-ventas">
        <button onClick={onBack} className="btn-volver">← Volver</button>
        <div className="loading">Cargando ventas...</div>
      </div>
    );
  }

  return (
    <div className="consultar-ventas">
      <button onClick={onBack} className="btn-volver">← Volver</button>
      
      <h2>📊 Consultar Ventas</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Filtros */}
      <div className="filtros-container">
        <div className="filtro-group">
          <label>🔍 DNI Cliente</label>
          <input
            type="text"
            placeholder="Buscar por DNI"
            value={dniCliente}
            onChange={(e) => setDniCliente(e.target.value)}
          />
        </div>

        <div className="filtro-group">
          <label>📅 Fecha Desde</label>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
        </div>

        <div className="filtro-group">
          <label>📅 Fecha Hasta</label>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
        </div>

        <button onClick={limpiarFiltros} className="btn-limpiar">
          🗑️ Limpiar
        </button>
      </div>

      {/* Tabla de ventas */}
      {ventasFiltradas.length === 0 ? (
        <div className="no-data">No se encontraron ventas</div>
      ) : (
        <div className="ventas-lista">
          {ventasFiltradas.map((venta) => (
            <div key={venta.id_venta} className="venta-card">
              <div className="venta-header" onClick={() => toggleDetalle(venta.id_venta)}>
                <div className="venta-info">
                  <span className="venta-fecha">{formatFecha(venta.createdAt)}</span>
                  <span className="venta-cliente">
                    👤Cliente: {venta.cliente.nombre} - DNI: {venta.cliente.dni}
                  </span>
                  {venta.cliente.telefono && (
                    <span className="venta-telefono">📞 {venta.cliente.telefono}</span>
                  )}
                </div>
                <div className="venta-total">
                  <span className="total-label">Total:</span>
                  <span className="total-valor">{formatPrecio(venta.precioTotal)}</span>
                </div>
                <button className="btn-expand">
                  {ventaExpandida === venta.id_venta ? '▲' : '▼'}
                </button>
              </div>

              {ventaExpandida === venta.id_venta && (
                <div className="venta-detalle">
                  <h4>Detalle de la Venta</h4>
                  <table className="detalle-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unit.</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {venta.detalles.map((detalle) => (
                        <tr key={detalle.id_detalle}>
                          <td>{detalle.producto.nombre}</td>
                          <td>{detalle.cantidad}</td>
                          <td>{formatPrecio(detalle.producto.precio)}</td>
                          <td>{formatPrecio(detalle.precioSubTotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3}><strong>Total</strong></td>
                        <td><strong>{formatPrecio(venta.precioTotal)}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultarVentas;