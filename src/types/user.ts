// src/types/user.ts
export interface User {
  id: string; // UUID del backend
  name: string; // Como viene del backend
  email: string;
  role: 'admin' | 'vendedor';
}