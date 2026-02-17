export interface User {
  id_u: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  rol: 'admin' | 'super_admin' | 'empleado' | 'cliente';
  fecha_registro?: string;
  email_verified?: boolean;
  ultimo_acceso?: string;
}

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  contrasena: string;
  confirmar_contrasena: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  permisos?: string[];
  redirect?: string;
}
