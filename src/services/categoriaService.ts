// src/services/categoriaService.ts
import api from '../api/axios';

export interface NuevaCategoria {
  nombre: string;
  descripcion: string;
}

export interface Categoria {
  id_categoria: string;
  nombre: string;
  descripcion: string;
}

/**
 * Obtener todas las categorías
 */
export const getAllCategorias = async (): Promise<Categoria[]> => {
  try {
    const response = await api.get('/categoria');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al cargar las categorías');
  }
};

/**
 * Obtener una categoría por ID
 */
export const getCategoriaById = async (id: string): Promise<Categoria> => {
  try {
    const response = await api.get(`/categoria/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener la categoría');
  }
};

/**
 * Crear una nueva categoría (sin id)
 */
export const createNuevaCategoria = async (data: NuevaCategoria): Promise<Categoria> => {
  try {
    const response = await api.post('/categoria', data);
    return response.data; // aquí el backend devuelve la Categoria con id_categoria
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al crear categoría');
  }
};

/**
 * Crear una nueva categoría (completa)
 */
export const createCategoria = async (data: Categoria): Promise<Categoria> => {
  try {
    const response = await api.post('/categoria', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al crear categoría');
  }
};

/**
 * Actualizar una categoría
 */
export const updateCategoria = async (id: string, data: Partial<Categoria>): Promise<Categoria> => {
  try {
    const response = await api.patch(`/categoria/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al actualizar categoría');
  }
};

/**
 * Eliminar una categoría
 */
export const deleteCategoria = async (id: string): Promise<void> => {
  try {
    await api.delete(`/categoria/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al eliminar categoría');
  }
};