import React, { useState, useEffect } from 'react';
import './css/ConsultarProductosAdmin.css';
import { 
  getAllProductos, 
  updateProducto, 
  deleteProducto,
  getAllCategorias,
  getAllMarcas,
  getAllProveedores 
} from '../../services/productoService';
import type { Categoria } from '../../services/productoService';
import type { Producto } from '../../services/productoService';
import type { Marca } from '../../services/productoService';
import type { Proveedor } from '../../services/productoService';

interface ConsultarProductosAdminProps {
  onBack: () => void;
}

const ConsultarProductosAdmin: React.FC<ConsultarProductosAdminProps> = ({ onBack }) => {
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

  // Modal de edición
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loadingModal, setLoadingModal] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen: '',
    id_categoria: '',
    id_marca: '',
    id_proveedor: '',
  });

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
      const data = await getAllProductos();
      setProductos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelaciones = async () => {
    setLoadingModal(true);
    try {
      const [categoriasData, marcasData, proveedoresData] = await Promise.all([
        getAllCategorias(),
        getAllMarcas(),
        getAllProveedores(),
      ]);

      setCategorias(categoriasData);
      setMarcas(marcasData);
      setProveedores(proveedoresData);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoadingModal(false);
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

  const abrirModalEditar = async (producto: Producto) => {
    setProductoEditando(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio.toString(),
      stock: producto.stock.toString(),
      imagen: producto.imagen || '',
      id_categoria: producto.id_categoria || '',
      id_marca: producto.id_marca || '',
      id_proveedor: producto.id_proveedor || '',
    });
    setMostrarModalEditar(true);
    await fetchRelaciones();
  };

  const cerrarModalEditar = () => {
    setMostrarModalEditar(false);
    setProductoEditando(null);
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      imagen: '',
      id_categoria: '',
      id_marca: '',
      id_proveedor: '',
    });
  };

  const handleChangeModal = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitEditar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      alert('El nombre del producto es obligatorio');
      return;
    }

    if (!formData.precio || Number(formData.precio) <= 0) {
      alert('Ingresa un precio válido');
      return;
    }

    if (!formData.stock || Number(formData.stock) < 0) {
      alert('Ingresa un stock válido');
      return;
    }

    try {
      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: Number(formData.precio),
        stock: Number(formData.stock),
        imagen: formData.imagen,
        id_categoria: formData.id_categoria,
        id_marca: formData.id_marca,
        id_proveedor: formData.id_proveedor,
      };

      await updateProducto(productoEditando!.id_producto, payload);
      alert('Producto actualizado con éxito');
      cerrarModalEditar();
      fetchProductos();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const eliminarProducto = async (id: string, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar el producto "${nombre}"?`)) {
      return;
    }

    try {
      await deleteProducto(id);
      alert('Producto eliminado con éxito');
      fetchProductos();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const formatPrecio = (precio: number) => `$${precio.toFixed(2)}`;

  if (loading) {
    return (
      <div className="consultar-productos-admin">
        <button onClick={onBack} className="btn-volver">← Volver</button>
        <div className="loading">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="consultar-productos-admin">
      <button onClick={onBack} className="btn-volver">← Volver</button>
      <h2>🛠️ Administrar Productos</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Filtros */}
      <div className="filtros-container">
        <div className="filtro-group">
          <label>🔍 Nombre</label>
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            placeholder="Buscar por nombre" 
          />
        </div>

        <div className="filtro-group">
          <label>🏷️ Marca</label>
          <input 
            type="text" 
            value={marca} 
            onChange={(e) => setMarca(e.target.value)} 
            placeholder="Buscar por marca" 
          />
        </div>

        <div className="filtro-group">
          <label>🚚 Proveedor</label>
          <input 
            type="text" 
            value={proveedor} 
            onChange={(e) => setProveedor(e.target.value)} 
            placeholder="Buscar por proveedor" 
          />
        </div>

        <div className="filtro-group">
          <label>📁 Linea</label>
          <input 
            type="text" 
            value={categoria} 
            onChange={(e) => setCategoria(e.target.value)} 
            placeholder="Buscar por linea" 
          />
        </div>

        <div className="filtro-group">
          <label>💲 Precio Mín.</label>
          <input 
            type="number" 
            value={precioMin} 
            onChange={(e) => setPrecioMin(e.target.value)} 
            placeholder="Desde..." 
          />
        </div>

        <div className="filtro-group">
          <label>💲 Precio Máx.</label>
          <input 
            type="number" 
            value={precioMax} 
            onChange={(e) => setPrecioMax(e.target.value)} 
            placeholder="Hasta..." 
          />
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
              <th>Linea</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((p) => (
              <tr key={p.id_producto}>
                <td>
                  {p.imagen ? (
                    <img src={p.imagen} alt={p.nombre} className="producto-imagen" />
                  ) : (
                    <div className="sin-imagen">Sin imagen</div>
                  )}
                </td>
                <td>
                  <strong>{p.nombre}</strong>
                  {p.descripcion && (
                    <div className="descripcion-corta">{p.descripcion}</div>
                  )}
                </td>
                <td>{p.marca?.nombre || '-'}</td>
                <td>{p.proveedor?.nombre || '-'}</td>
                <td>{p.categoria?.nombre || '-'}</td>
                <td className="precio-cell">{formatPrecio(p.precio)}</td>
                <td>
                  <span className={`stock-badge ${p.stock < 10 ? 'stock-bajo' : ''}`}>
                    {p.stock}
                  </span>
                </td>
                <td>
                  <div className="acciones-buttons">
                    <button
                      className="btn-editar"
                      onClick={() => abrirModalEditar(p)}
                      title="Editar producto"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarProducto(p.id_producto, p.nombre)}
                      title="Eliminar producto"
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

      {/* Modal de edición */}
      {mostrarModalEditar && productoEditando && (
        <div className="modal-overlay" onClick={cerrarModalEditar}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()}>
            <h3>✏️ Editar Producto</h3>

            {loadingModal ? (
              <div className="loading">Cargando...</div>
            ) : (
              <form onSubmit={handleSubmitEditar} className="editar-producto-form">
                <div className="form-section-modal">
                  <h4 className="subtitle-modal">📦 Información</h4>

                  <div className="form-group">
                    <label>Nombre *</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChangeModal}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChangeModal}
                      rows={3}
                    />
                  </div>

                  <div className="form-row-modal">
                    <div className="form-group">
                      <label>Precio *</label>
                      <input
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleChangeModal}
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Stock *</label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChangeModal}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>URL Imagen</label>
                    <textarea
                      name="imagen"
                      value={formData.imagen}
                      onChange={handleChangeModal}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="form-section-modal">
                  <h4 className="subtitle-modal">🏷️ Clasificación</h4>

                  <div className="form-group">
                    <label>Categoría *</label>
                    <select
                      name="id_categoria"
                      value={formData.id_categoria}
                      onChange={handleChangeModal}
                      required
                    >
                      <option value="">-- Selecciona --</option>
                      {categorias.map((cat) => (
                        <option key={cat.id_categoria} value={cat.id_categoria}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Marca *</label>
                    <select
                      name="id_marca"
                      value={formData.id_marca}
                      onChange={handleChangeModal}
                      required
                    >
                      <option value="">-- Selecciona --</option>
                      {marcas.map((marca) => (
                        <option key={marca.id_marca} value={marca.id_marca}>
                          {marca.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Proveedor *</label>
                    <select
                      name="id_proveedor"
                      value={formData.id_proveedor}
                      onChange={handleChangeModal}
                      required
                    >
                      <option value="">-- Selecciona --</option>
                      {proveedores.map((prov) => (
                        <option key={prov.id_proveedor} value={prov.id_proveedor}>
                          {prov.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="modal-buttons">
                  <button type="button" className="btn-modal-cancelar" onClick={cerrarModalEditar}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-modal-guardar">
                    Actualizar Producto
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultarProductosAdmin;