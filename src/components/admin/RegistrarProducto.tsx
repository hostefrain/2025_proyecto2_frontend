import React, { useState, useEffect } from "react";
import "./css/RegistrarProducto.css";
import RegistrarCategoria from "./RegistrarCategoria";
import RegistrarMarca from "./RegistrarMarca";
import RegistrarProveedor from "./RegistrarProveedor";
import { createProducto, getAllCategorias, getAllMarcas, getAllProveedores } from '../../services/productoService';
import type { Categoria } from "../../services/productoService";
import type { Marca } from "../../services/productoService";
import type { Proveedor } from "../../services/productoService";

interface RegistrarProductoProps {
  onBack: () => void;
}

const RegistrarProducto: React.FC<RegistrarProductoProps> = ({ onBack }) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagen: "",
    id_categoria: "",
    id_marca: "",
    id_proveedor: "",
  });

  // Estados para mostrar modales
  const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);
  const [mostrarModalMarca, setMostrarModalMarca] = useState(false);
  const [mostrarModalProveedor, setMostrarModalProveedor] = useState(false);

  // Estado para controlar si la imagen se cargó correctamente
  const [imagenValida, setImagenValida] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [categoriasRes, marcasRes, proveedoresRes] = await Promise.all([
        getAllCategorias(),
        getAllMarcas(),
        getAllProveedores(),
      ]);

      setCategorias(Array.isArray(categoriasRes) ? categoriasRes : []);
      setMarcas(Array.isArray(marcasRes) ? marcasRes : []);
      setProveedores(Array.isArray(proveedoresRes) ? proveedoresRes : []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      alert("Error al cargar categorías, marcas o proveedores");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset imagen válida cuando cambia la URL
    if (name === 'imagen') {
      setImagenValida(true);
    }
  };

  // Callbacks cuando se crea una nueva categoría/marca/proveedor
  const handleCategoriaCreada = async (nuevaCategoria: any) => {
    const categoriasRes = await getAllCategorias()
    setCategorias(categoriasRes);
    setFormData(prev => ({ ...prev, id_categoria: nuevaCategoria.id_categoria }));
    setMostrarModalCategoria(false);
  };

  const handleMarcaCreada = async (nuevaMarca: any) => {
    const marcasRes = await getAllMarcas()
    setMarcas(marcasRes);
    setFormData(prev => ({ ...prev, id_marca: nuevaMarca.id_marca }));
    setMostrarModalMarca(false);
  };

  const handleProveedorCreado = async (nuevoProveedor: any) => {
    const proveedoresRes = await getAllProveedores()
    setProveedores(proveedoresRes);
    setFormData(prev => ({ ...prev, id_proveedor: nuevoProveedor.id_proveedor }));
    setMostrarModalProveedor(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      alert("El nombre del producto es obligatorio");
      return;
    }

    if (!formData.precio || Number(formData.precio) <= 0) {
      alert("Ingresa un precio válido");
      return;
    }

    if (!formData.stock || Number(formData.stock) < 0) {
      alert("Ingresa un stock válido");
      return;
    }

    if (!formData.id_categoria) {
      alert("Selecciona una categoría");
      return;
    }

    if (!formData.id_marca) {
      alert("Selecciona una marca");
      return;
    }

    if (!formData.id_proveedor) {
      alert("Selecciona un proveedor");
      return;
    }

    try {
      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || "",
        precio: Number(formData.precio),
        stock: Number(formData.stock),
        imagen: formData.imagen || "",
        id_categoria: formData.id_categoria,
        id_marca: formData.id_marca,
        id_proveedor: formData.id_proveedor,
      };

      const response = await createProducto(payload)
      alert("¡Producto registrado con éxito!");
      console.log("✅ Producto creado:", response);

      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        imagen: "",
        id_categoria: "",
        id_marca: "",
        id_proveedor: "",
      });
      setImagenValida(true);
    } catch (error: any) {
      console.error("❌ Error al registrar producto:", error);
      alert(
        `Error al registrar el producto: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      imagen: "",
      id_categoria: "",
      id_marca: "",
      id_proveedor: "",
    });
    setImagenValida(true);
    onBack();
  };

  if (loading) {
    return (
      <div className="registrar-producto">
        <button onClick={onBack} className="btn-volver">
          ← Volver al Dashboard
        </button>
        <div className="loading">Cargando datos...</div>
      </div>
    );
  }

  return (
    <div className="registrar-producto-container">
      <button onClick={onBack} className="btn-volver-producto">
        ← Volver
      </button>

      <h2 className="registrar-producto-title">Registrar Producto</h2>

      <form className="registrar-producto-form" onSubmit={handleSubmit}>
        {/* Información básica */}
        <div className="form-section">
          <h3 className="section-subtitle">📦 Información del Producto</h3>
          
          <div className="form-group">
            <label>Nombre del producto *</label>
            <input
              type="text"
              name="nombre"
              placeholder="Ej: Laptop HP Pavilion"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              placeholder="Descripción detallada del producto"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Precio *</label>
              <input
                type="number"
                name="precio"
                placeholder="0.00"
                value={formData.precio}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Stock *</label>
              <input
                type="number"
                name="stock"
                placeholder="0"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>URL de la imagen</label>
            <textarea
              name="imagen"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={formData.imagen}
              onChange={handleChange}
              rows={4}
            />
          </div>

          {/* 👇 PREVIEW DE LA IMAGEN */}
          {formData.imagen && imagenValida && (
            <div className="preview-imagen">
              <label>Vista previa:</label>
              <img 
                src={formData.imagen} 
                alt="Preview del producto" 
                onError={() => setImagenValida(false)}
              />
            </div>
          )}

          {formData.imagen && !imagenValida && (
            <div className="preview-error">
              ⚠️ No se pudo cargar la imagen. Verifica la URL.
            </div>
          )}
        </div>

        {/* Clasificación */}
        <div className="form-section">
          <h3 className="section-subtitle">🏷️ Clasificación</h3>

          {/* CATEGORÍA */}
          <div className="form-group-with-button">
            <div className="form-group flex-grow">
              <label>Linea *</label>
              <select
                name="id_categoria"
                value={formData.id_categoria}
                onChange={handleChange}
                required
              >
                <option value="">-- Selecciona una linea --</option>
                {categorias.map((cat) => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
            <button 
              type="button" 
              className="btn-add-item"
              onClick={() => setMostrarModalCategoria(true)}
              title="Crear nueva categoría"
            >
              + Nueva
            </button>
          </div>

          {/* MARCA */}
          <div className="form-group-with-button">
            <div className="form-group flex-grow">
              <label>Marca *</label>
              <select
                name="id_marca"
                value={formData.id_marca}
                onChange={handleChange}
                required
              >
                <option value="">-- Selecciona una marca --</option>
                {marcas.map((marca) => (
                  <option key={marca.id_marca} value={marca.id_marca}>
                    {marca.nombre}
                  </option>
                ))}
              </select>
            </div>
            <button 
              type="button" 
              className="btn-add-item"
              onClick={() => setMostrarModalMarca(true)}
              title="Crear nueva marca"
            >
              + Nueva
            </button>
          </div>

          {/* PROVEEDOR */}
          <div className="form-group-with-button">
            <div className="form-group flex-grow">
              <label>Proveedor *</label>
              <select
                name="id_proveedor"
                value={formData.id_proveedor}
                onChange={handleChange}
                required
              >
                <option value="">-- Selecciona un proveedor --</option>
                {proveedores.map((prov) => (
                  <option key={prov.id_proveedor} value={prov.id_proveedor}>
                    {prov.nombre}
                  </option>
                ))}
              </select>
            </div>
            <button 
              type="button" 
              className="btn-add-item"
              onClick={() => setMostrarModalProveedor(true)}
              title="Crear nuevo proveedor"
            >
              + Nuevo
            </button>
          </div>
        </div>

        {/* Botones */}
        <div className="form-buttons">
          <button type="button" className="btn-cancelar" onClick={handleCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn-guardar">
            Guardar Producto
          </button>
        </div>
      </form>

      {/* Modales */}
      {mostrarModalCategoria && (
        <RegistrarCategoria
          onSuccess={handleCategoriaCreada}
          onCancel={() => setMostrarModalCategoria(false)}
        />
      )}

      {mostrarModalMarca && (
        <RegistrarMarca
          onSuccess={handleMarcaCreada}
          onCancel={() => setMostrarModalMarca(false)}
        />
      )}

      {mostrarModalProveedor && (
        <RegistrarProveedor
          onSuccess={handleProveedorCreado}
          onCancel={() => setMostrarModalProveedor(false)}
        />
      )}
    </div>
  );
};

export default RegistrarProducto;