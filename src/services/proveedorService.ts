// src/services/proveedorService.ts
import api from '../api/axios';

export interface CreateProveedorDto {
  nombre: string;
}

export interface Proveedor {
  id_proveedor: string;
  nombre: string;
}

/**
 * Obtener todos los proveedores
 */
export const getAllProveedores = async (): Promise<Proveedor[]> => {
  try {
    const response = await api.get('/proveedor');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al cargar los proveedores');
  }
};

/**
 * Crear un nuevo proveedor
 */
export const createProveedor = async (data: CreateProveedorDto): Promise<Proveedor> => {
  try {
    const response = await api.post('/proveedor', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al crear proveedor');
  }
};

/**
 * Actualizar un proveedor
 */
export const updateProveedor = async (id: string, data: Partial<CreateProveedorDto>): Promise<Proveedor> => {
  try {
    const response = await api.patch(`/proveedor/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al actualizar proveedor');
  }
};

/**
 * Eliminar un proveedor
 */
export const deleteProveedor = async (id: string): Promise<void> => {
  try {
    await api.delete(`/proveedor/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al eliminar proveedor');
  }
};