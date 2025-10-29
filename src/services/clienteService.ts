// src/services/clienteService.ts
import api from '../api/axios';

export interface NuevoCliente {
  nombre: string;
  telefono: string;
  dni: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  dni: string;
}

/**
 * Obtener todos los clientes
 */
export const getAllClientes = async (): Promise<Cliente[]> => {
  try {
    const response = await api.get('/cliente');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al cargar los clientes');
  }
};

/**
 * Obtener un cliente por ID
 */
export const getClienteById = async (id: string): Promise<Cliente> => {
  try {
    const response = await api.get(`/cliente/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener el cliente');
  }
};

export const createNuevoCliente = async (data: NuevoCliente): Promise<Cliente> => {
  try {
    const response = await api.post('/cliente', data);
    return response.data; // aquí el backend devuelve el Cliente con id
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al registrar cliente');
  }
};

/**
 * Crear un nuevo cliente
 */
export const createCliente = async (data: Cliente): Promise<Cliente> => {
  try {
    const response = await api.post('/cliente', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al registrar cliente');
  }
};

/**
 * Actualizar un cliente
 */
export const updateCliente = async (id: string, data: Partial<Cliente>): Promise<Cliente> => {
  try {
    const response = await api.patch(`/cliente/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al actualizar cliente');
  }
};

/**
 * Eliminar un cliente
 */
export const deleteCliente = async (id: string): Promise<void> => {
  try {
    await api.delete(`/cliente/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al eliminar cliente');
  }
};