export interface Order {
  id_pedido: number;
  id_usuario: number;
  id_direccion_envio: number;
  total: number;
  metodo_pago: string;
  estado_pago: string;
  estado_pedido: string;
  fecha_pedido: string;
  nombre_cliente: string;
  email_cliente: string;
  telefono_cliente: string;
}

export interface OrderDetail {
  id_detalle: number;
  id_pedido: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  nombre_producto: string;
}

export interface Address {
  id_direccion?: number;
  calle: string;
  colonia: string;
  codigo_postal: string;
  ciudad: string;
  estado: string;
  referencias: string;
  telefono_contacto: string;
}

export interface CheckoutRequest {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  calle: string;
  colonia: string;
  codigo_postal: string;
  ciudad: string;
  estado: string;
  referencias: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  id_pedido?: string;
  whatsapp_url?: string;
}
