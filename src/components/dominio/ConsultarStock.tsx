import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './ConsultarStock.css';

interface Categoria {
  id_categoria: string;
  nombre: string;
}

interface Marca {
  id_marca: string;
  nombre: string;
}

interface Proveedor {
  id_proveedor: string;
  nombre: string;
}

interface Producto {
  id_producto: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  stock: number;
  categoria: Categoria;
  marca: Marca;
  proveedor: Proveedor;
}

interface ConsultarStockProps {
  onBack: () => void;
}

const ConsultarStock: React.FC<ConsultarStockProps> = ({ onBack }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtros
  const [nombre, setNombre] = useState('');
  const [marca, setMarca] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [productos, nombre, marca, proveedor, categoria, precioMin, precioMax]);

  const fetchProductos = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/producto');
      const data = response.data.map((p: any) => ({
        ...p,
        precio: Number(p.precio),
      }));
      setProductos(data);
    } catch (err: any) {
      console.error(err);
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...productos];

    if (nombre.trim()) {
      resultado = resultado.filter((p) =>
        p.nombre.toLowerCase().includes(nombre.toLowerCase())
      );
    }

    if (marca.trim()) {
      resultado = resultado.filter((p) =>
        p.marca?.nombre.toLowerCase().includes(marca.toLowerCase())
      );
    }

    if (proveedor.trim()) {
      resultado = resultado.filter((p) =>
        p.proveedor?.nombre.toLowerCase().includes(proveedor.toLowerCase())
      );
    }

    if (categoria.trim()) {
      resultado = resultado.filter((p) =>
        p.categoria?.nombre.toLowerCase().includes(categoria.toLowerCase())
      );
    }

    if (precioMin) {
      resultado = resultado.filter((p) => p.precio >= parseFloat(precioMin));
    }

    if (precioMax) {
      resultado = resultado.filter((p) => p.precio <= parseFloat(precioMax));
    }

    setProductosFiltrados(resultado);
  };

  const limpiarFiltros = () => {
    setNombre('');
    setMarca('');
    setProveedor('');
    setCategoria('');
    setPrecioMin('');
    setPrecioMax('');
  };

  const formatPrecio = (precio: number) => `$${precio.toFixed(2)}`;

  if (loading) {
    return (
      <div className="consultar-stock">
        <button onClick={onBack} className="btn-volver">← Volver</button>
        <div className="loading">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="consultar-stock">
      <button onClick={onBack} className="btn-volver">← Volver</button>
      <h2>📦 Consultar Stock</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Filtros */}
      <div className="filtros-container">
        <div className="filtro-group">
          <label>🔍 Nombre</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Buscar por nombre" />
        </div>

        <div className="filtro-group">
          <label>🏷️ Marca</label>
          <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Buscar por marca" />
        </div>

        <div className="filtro-group">
          <label>🚚 Proveedor</label>
          <input type="text" value={proveedor} onChange={(e) => setProveedor(e.target.value)} placeholder="Buscar por proveedor" />
        </div>

        <div className="filtro-group">
          <label>📁 Categoría</label>
          <input type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Buscar por categoría" />
        </div>

        <div className="filtro-group">
          <label>💲 Precio Mín.</label>
          <input type="number" value={precioMin} onChange={(e) => setPrecioMin(e.target.value)} placeholder="Desde..." />
        </div>

        <div className="filtro-group">
          <label>💲 Precio Máx.</label>
          <input type="number" value={precioMax} onChange={(e) => setPrecioMax(e.target.value)} placeholder="Hasta..." />
        </div>

        <button onClick={limpiarFiltros} className="btn-limpiar">🗑️ Limpiar</button>
      </div>

      {/* Tabla de productos */}
      {productosFiltrados.length === 0 ? (
        <div className="no-data">No se encontraron productos</div>
      ) : (
        <table className="productos-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Marca</th>
              <th>Proveedor</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((p) => (
              <tr key={p.id_producto}>
                <td>
                  <img src={p.imagen} alt={p.nombre} className="producto-imagen" />
                </td>
                <td>{p.nombre}</td>
                <td>{p.marca?.nombre || '-'}</td>
                <td>{p.proveedor?.nombre || '-'}</td>
                <td>{p.categoria?.nombre || '-'}</td>
                <td>{formatPrecio(p.precio)}</td>
                <td>{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ConsultarStock;
