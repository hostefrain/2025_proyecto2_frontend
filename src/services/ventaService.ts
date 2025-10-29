// src/services/ventaService.ts
import api from '../api/axios';

export interface Cliente {
  id: string;
  nombre: string;
  dni: string;
  telefono?: string;
}

export interface Producto {
  nombre: string;
  precio: number;
}

export interface DetalleVenta {
  id_detalle: string;
  cantidad: number;
  precioSubTotal: number;
  id_producto: string;
  id_venta?: string;
  producto: Producto;
}

export interface Venta {
  id_venta: string;
  precioTotal: number;
  createdAt: string;
  id_cliente: string;
  cliente: Cliente;
  detalles: DetalleVenta[];
}

export interface CreateVentaPayload {
  venta: {
    id_cliente: string;
    precioTotal: number;
  };
  detalles: Array<{
    precioSubTotal: number;
    cantidad: number;
    id_producto: string;
    id_venta: string;
  }>;
}

/**
 * Obtener todas las ventas
 */
export const getAllVentas = async (): Promise<Venta[]> => {
  try {
    const response = await api.get('/venta');
    // Convertir precios a números
    const data = response.data.map((venta: any) => ({
      ...venta,
      precioTotal: Number(venta.precioTotal),
      detalles: venta.detalles?.map((detalle: any) => ({
        ...detalle,
        precioSubTotal: Number(detalle.precioSubTotal),
        producto: detalle.producto ? {
          ...detalle.producto,
          precio: Number(detalle.producto.precio),
        } : undefined,
      })),
    }));
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al cargar las ventas');
  }
};

/**
 * Obtener una venta por ID
 */
export const getVentaById = async (id: string): Promise<Venta> => {
  try {
    const response = await api.get(`/venta/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener la venta');
  }
};

/**
 * Crear una nueva venta
 */
export const createVenta = async (data: CreateVentaPayload): Promise<Venta> => {
  try {
    const response = await api.post('/venta', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al registrar la venta');
  }
};

/**
 * Eliminar una venta
 */
export const deleteVenta = async (id: string): Promise<void> => {
  try {
    await api.delete(`/venta/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al eliminar la venta');
  }
};