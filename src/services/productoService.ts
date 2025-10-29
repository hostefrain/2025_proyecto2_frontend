// src/services/productoService.ts
import api from '../api/axios';

export interface Categoria {
  id_categoria: string;
  nombre: string;
}

export interface Marca {
  id_marca: string;
  nombre: string;
}

export interface Proveedor {
  id_proveedor: string;
  nombre: string;
}

export interface Producto {
  id_producto: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen?: string;
  stock: number;
  categoria?: Categoria;
  marca?: Marca;
  proveedor?: Proveedor;
  id_categoria?: string;
  id_marca?: string;
  id_proveedor?: string;
}

/**
 * Obtener todos los productos
 */
export const getAllProductos = async (): Promise<Producto[]> => {
  try {
    const response = await api.get('/producto');
    // Convertir precio a número
    const data = response.data.map((p: any) => ({
      ...p,
      precio: Number(p.precio),
    }));
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al cargar los productos');
  }
};

/**
 * Obtener un producto por ID
 */
export const getProductoById = async (id: string): Promise<Producto> => {
  try {
    const response = await api.get(`/producto/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener el producto');
  }
};

/**
 * Crear un nuevo producto
 */
export const createProducto = async (data: Omit<Producto, 'id_producto'>): Promise<Producto> => {
  try {
    const response = await api.post('/producto', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al registrar producto');
  }
};

/**
 * Actualizar un producto
 */
export const updateProducto = async (id: string, data: Partial<Producto>): Promise<Producto> => {
  try {
    const response = await api.patch(`/producto/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al actualizar producto');
  }
};

/**
 * Eliminar un producto
 */
export const deleteProducto = async (id: string): Promise<void> => {
  try {
    await api.delete(`/producto/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al eliminar producto');
  }
};

// ============================================
// SERVICIOS AUXILIARES
// ============================================

/**
 * Obtener todas las categorías
 */
export const getAllCategorias = async (): Promise<Categoria[]> => {
  try {
    const response = await api.get('/categoria');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al cargar categorías');
  }
};

/**
 * Obtener todas las marcas
 */
export const getAllMarcas = async (): Promise<Marca[]> => {
  try {
    const response = await api.get('/marca');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al cargar marcas');
  }
};

/**
 * Obtener todos los proveedores
 */
export const getAllProveedores = async (): Promise<Proveedor[]> => {
  try {
    const response = await api.get('/proveedor');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al cargar proveedores');
  }
};