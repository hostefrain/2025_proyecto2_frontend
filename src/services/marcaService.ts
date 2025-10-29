// src/services/marcaService.ts
import api from '../api/axios';

export interface CreateMarcaDto {
  nombre: string;
  descripcion: string;
  logo: string;
}

export interface Marca {
  id_marca: string;
  nombre: string;
  descripcion: string;
  logo: string;
}

/**
 * Obtener todas las marcas
 */
export const getAllMarcas = async (): Promise<Marca[]> => {
  try {
    const response = await api.get('/marca');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al cargar las marcas');
  }
};

/**
 * Crear una nueva marca
 */
export const createMarca = async (data: CreateMarcaDto): Promise<Marca> => {
  try {
    const response = await api.post('/marca', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al crear marca');
  }
};

/**
 * Actualizar una marca
 */
export const updateMarca = async (id: string, data: Partial<CreateMarcaDto>): Promise<Marca> => {
  try {
    const response = await api.patch(`/marca/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al actualizar marca');
  }
};

/**
 * Eliminar una marca
 */
export const deleteMarca = async (id: string): Promise<void> => {
  try {
    await api.delete(`/marca/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al eliminar marca');
  }
};