// src/services/authService.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Interfaz para las respuestas
interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

// ============================================
// SERVICIOS DE AUTENTICACIÓN
// ============================================

/**
 * Registrar un nuevo usuario
 */
export const registerUser = async (data: RegisterData): Promise<void> => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error en el registro');
  }
};

/**
 * Iniciar sesión
 */
export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error en el login');
  }
};

/**
 * Solicitar recuperación de contraseña
 */
export const forgotPassword = async (data: ForgotPasswordData): Promise<{ message: string }> => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al solicitar recuperación');
  }
};

/**
 * Restablecer contraseña con token
 */
export const resetPassword = async (data: ResetPasswordData): Promise<{ message: string }> => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al restablecer contraseña');
  }
};

/**
 * Obtener perfil del usuario
 */
export const getUserProfile = async (token: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener perfil');
  }
};