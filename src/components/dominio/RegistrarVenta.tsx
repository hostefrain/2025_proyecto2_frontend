import React, { useState, useEffect } from "react";
import "./css/RegistrarVenta.css";
import { useAuth } from "../../context/AuthContext";
import { getAllClientes } from "../../services/clienteService";
import { getAllProductos } from "../../services/productoService";
import { createVenta } from "../../services/ventaService";

interface RegistrarVentaProps {
  onBack: () => void;
  onRegistrarCliente: () => void;
}

interface Cliente {
  id: string;
  nombre: string;
  dni: string;
  email?: string;
}

interface Producto {
  id_producto: string;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  stock: number;
  precio: number;
}

interface ProductoSeleccionado {
  id: string;
  nombre: string;
  precio: number;
  cantidadSeleccionada: number;
  cantidadStock: number;
}

const RegistrarVenta: React.FC<RegistrarVentaProps> = ({ onBack, onRegistrarCliente }) => {
  const { user } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filtro, setFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<"dni" | "nombre">("dni");
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<ProductoSeleccionado[]>([]);
  const [cargandoClientes, setCargandoClientes] = useState(false);
  const [cargandoProductos, setCargandoProductos] = useState(false);

  useEffect(() => {
    const fetchClientes = async () => {
      setCargandoClientes(true);
      try {
        const data = await getAllClientes(); // Ya retorna Cliente[]
        setClientes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      } finally {
        setCargandoClientes(false);
      }
    };

    const fetchProductos = async () => {
      setCargandoProductos(true);
      try {
        const data = await getAllProductos(); // Ya retorna Producto[]
        setProductos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setCargandoProductos(false);
      }
    };

    fetchClientes();
    fetchProductos();
  }, []);

  const clientesFiltrados = clientes.filter((cliente) => {
    const valorFiltro = filtro.trim().toLowerCase();
    if (!valorFiltro) return true;
    if (tipoFiltro === "dni") {
      return cliente.dni?.toLowerCase().includes(valorFiltro);
    } else {
      return cliente.nombre?.toLowerCase().includes(valorFiltro);
    }
  });

  const agregarAlCarrito = (producto: Producto) => {
    const existente = carrito.find((p) => String(p.id) === String(producto.id_producto));
    
    if (existente) {
      if (existente.cantidadSeleccionada >= producto.stock) {
        alert("No podés agregar más unidades: alcanzaste el stock disponible.");
        return;
      }
      setCarrito((prev) =>
        prev.map((p) =>
          String(p.id) === String(producto.id_producto)
            ? { ...p, cantidadSeleccionada: p.cantidadSeleccionada + 1 }
            : p
        )
      );
    } else {
      if (producto.stock <= 0) {
        alert("No hay stock disponible de este producto.");
        return;
      }
      setCarrito((prev) => [
        ...prev,
        {
          id: String(producto.id_producto),
          nombre: producto.nombre,
          precio: producto.precio,
          cantidadSeleccionada: 1,
          cantidadStock: producto.stock,
        },
      ]);
    }
  };

  const cambiarCantidad = (id: string, nuevaCantidadRaw: number) => {
    const nuevaCantidad = Number.isNaN(nuevaCantidadRaw)
      ? 1
      : Math.max(1, Math.floor(nuevaCantidadRaw));

    setCarrito((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const stock = p.cantidadStock;
        const cantidadClamped = Math.min(nuevaCantidad, stock);
        return { ...p, cantidadSeleccionada: cantidadClamped };
      })
    );
  };

  const eliminarProducto = (id: string) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id));
  };

  const registrarVenta = async () => {
    if (!user) {
      alert("No se encontró información del usuario. Por favor, inicia sesión nuevamente.");
      return;
    }

    if (!clienteSeleccionado) {
      alert("Seleccioná un cliente antes de registrar la venta");
      return;
    }

    if (carrito.length === 0) {
      alert("Agregá al menos un producto al carrito");
      return;
    }

    for (const item of carrito) {
      const productoEnFuente = productos.find(
        (p) => String(p.id_producto) === String(item.id)
      );
      if (!productoEnFuente) {
        alert(`El producto ${item.nombre} ya no existe.`);
        return;
      }
      if (item.cantidadSeleccionada > productoEnFuente.stock) {
        alert(
          `La cantidad de ${item.nombre} supera el stock actual (${productoEnFuente.stock}).`
        );
        return;
      }
    }

    const precioTotal = carrito.reduce(
      (acc, p) => acc + p.precio * p.cantidadSeleccionada,
      0
    );

    const payload = {
      venta: {
        id_cliente: clienteSeleccionado.id,
        precioTotal: precioTotal,
      },
      detalles: carrito.map((p) => ({
        precioSubTotal: p.precio * p.cantidadSeleccionada,
        cantidad: p.cantidadSeleccionada,
        id_producto: p.id,
        id_venta: "",
      })),
    };

    try {
      const res = await createVenta(payload);
      alert("¡Venta registrada con éxito!");
      console.log("✅ Venta registrada:", res);
      setCarrito([]);
      setClienteSeleccionado(null);
      setFiltro("");
      const resProductos = await getAllProductos();
      setProductos(Array.isArray(resProductos) ? resProductos : []);
    } catch (error: any) {
      console.error("❌ Error al registrar venta:", error);
      alert(
        `Ocurrió un error al registrar la venta: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const cantidadEnCarrito = (productoId: string) => {
    const p = carrito.find((c) => c.id === productoId);
    return p ? p.cantidadSeleccionada : 0;
  };

  return (
    <div className="registrar-venta">
      <button onClick={onBack} className="btn-volver">
        ← Volver al Dashboard
      </button>

      <h2>Registrar Venta</h2>

      <div className="cliente-section">
        <h3>Seleccionar Cliente</h3>
        <div className="cliente-filtro">
          <select
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value as "dni" | "nombre")}
          >
            <option value="dni">Buscar por DNI</option>
            <option value="nombre">Buscar por Nombre</option>
          </select>
          <input
            type="text"
            placeholder={`Ingrese ${tipoFiltro}`}
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <button
            className="btn-registrar-cliente"
            onClick={onRegistrarCliente}
          >
            Registrar Cliente
          </button>
        </div>

        {cargandoClientes ? (
          <p>Cargando clientes...</p>
        ) : (
          <div className="cliente-lista">
            {clientesFiltrados.length === 0 ? (
              <p>No se encontraron clientes</p>
            ) : (
              clientesFiltrados.slice(0, 8).map((cliente, index) => (
                <div
                  key={cliente.id || index}
                  className={`cliente-card ${
                    clienteSeleccionado?.id === cliente.id ? "seleccionado" : ""
                  }`}
                  onClick={() => setClienteSeleccionado(cliente)}
                >
                  <p>
                    <strong>{cliente.nombre}</strong> — DNI:{" "}
                    {cliente.dni ?? "N/A"}
                  </p>
                  {cliente.email && <p>{cliente.email}</p>}
                </div>
              ))
            )}
          </div>
        )}

        {clienteSeleccionado && (
          <div className="cliente-seleccionado">
            Cliente seleccionado:{" "}
            <strong>
              {clienteSeleccionado.nombre} - {clienteSeleccionado.dni}
            </strong>
          </div>
        )}
      </div>

      <div className="productos-section">
        <h3>Productos Disponibles</h3>
        {cargandoProductos ? (
          <p>Cargando productos...</p>
        ) : (
          <div className="productos-grid">
            {productos.map((producto) => {
              const inCartQty = cantidadEnCarrito(String(producto.id_producto));
              const agotado = producto.stock <= 0;
              const puedeAgregar = !agotado && inCartQty < producto.stock;

              return (
                <div key={producto.id_producto} className="producto-card">
                  <div className="producto-img-wrap">
                    {producto.imagen ? (
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    ) : null}
                  </div>
                  <h4>{producto.nombre}</h4>
                  {producto.descripcion && (
                    <p className="prod-desc">{producto.descripcion}</p>
                  )}
                  <p className="stock-line">
                    Stock disponible:{" "}
                    <span className="stock-badge">{producto.stock}</span>
                  </p>
                  <p>
                    <strong>${producto.precio}</strong>
                  </p>
                  <button
                    onClick={() => agregarAlCarrito(producto)}
                    disabled={!puedeAgregar}
                    className={`agregar-btn ${
                      !puedeAgregar ? "disabled" : ""
                    }`}
                    title={
                      !puedeAgregar
                        ? agotado
                          ? "Sin stock"
                          : "Ya agregaste la cantidad máxima"
                        : "Agregar al carrito"
                    }
                  >
                    Agregar
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {carrito.length > 0 && (
        <div className="carrito-section">
          <h3>Productos Seleccionados</h3>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      max={p.cantidadStock}
                      value={p.cantidadSeleccionada}
                      onChange={(e) =>
                        cambiarCantidad(p.id, Number(e.target.value))
                      }
                    />
                    <div className="stock-small">
                      {" "}
                      / {p.cantidadStock} disponibles
                    </div>
                  </td>
                  <td>${p.precio}</td>
                  <td>
                    ${(p.precio * p.cantidadSeleccionada).toFixed(2)}
                  </td>
                  <td>
                    <button onClick={() => eliminarProducto(p.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="total">
            Total: $
            {carrito
              .reduce(
                (acc, p) => acc + p.precio * p.cantidadSeleccionada,
                0
              )
              .toFixed(2)}
          </div>
          <button className="btn-registrar" onClick={registrarVenta}>
            Registrar Venta
          </button>
        </div>
      )}
    </div>
  );
};

export default RegistrarVenta;