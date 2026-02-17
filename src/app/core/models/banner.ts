export interface Banner {
  id_banner: number;
  titulo: string;
  descripcion: string;
  imagen_url: string;
  enlace: string;
  ubicacion: string;
  orden: number;
  activo: boolean;
}

export interface ServiceItem {
  id_servicio: number;
  nombre: string;
  url: string;
  descripcion: string;
  imagen_portada: string;
}

export interface ContactInfo {
  id: number;
  telefono: string;
  email: string;
  whatsapp: string;
  direccion: string;
  maps_embed: string;
  maps_url: string;
  horario_inicio: string;
  horario_fin: string;
  dias_atencion: string;
  mensaje_atencion: string;
}
