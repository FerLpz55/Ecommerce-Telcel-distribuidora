export interface Category {
  id_categoria: number;
  nombre: string;
  descripcion: string;
  imagen: string;
}

export interface Subcategory {
  id_subcategoria: number;
  id_categoria: number;
  nombre: string;
}
