import { Product } from '../models/product';
import { Category } from '../models/category';
import { Banner } from '../models/banner';

export const MOCK_CATEGORIES: Category[] = [
  { id_categoria: 1, nombre: 'Bocinas', descripcion: 'Bocinas Bluetooth de alta calidad', imagen: 'BocinaJBL.webp' },
  { id_categoria: 2, nombre: 'Teléfonos', descripcion: 'Los mejores equipos Telcel', imagen: 'Telefonos.webp' },
  { id_categoria: 3, nombre: 'Limpieza', descripcion: 'Kits de limpieza para tus dispositivos', imagen: 'limpieza.png' },
  { id_categoria: 4, nombre: 'Audífonos', descripcion: 'Audífonos inalámbricos y de cable', imagen: 'Audifonos.webp' }
];

export const MOCK_BANNERS: Banner[] = [
  { id_banner: 1, titulo: 'Planes Telcel Libre', descripcion: 'Descubre los mejores planes para ti', imagen_url: 'PlanesTelcelLibre.jpg', enlace: '/tienda', ubicacion: 'hero', orden: 1, activo: true },
  { id_banner: 10, titulo: 'Planes Telcel Libre', descripcion: 'Conoce nuestras ofertas en planes', imagen_url: 'BannerPlanesTelceLibreHorizontal.png', enlace: '/tienda', ubicacion: 'hero', orden: 2, activo: true },
  { id_banner: 2, titulo: 'Xiaomi Series', descripcion: 'Nuevos equipos Xiaomi disponibles', imagen_url: 'XiaomiSeries.png', enlace: '/tienda', ubicacion: 'hero', orden: 3, activo: true },
  { id_banner: 3, titulo: 'Paquetes 4 Horas', descripcion: 'Paquete Internet por tiempo ilimitado', imagen_url: 'BannerPaquete4horasHorizontal.jpg', enlace: '/tienda', ubicacion: 'hero', orden: 4, activo: true },
  { id_banner: 4, titulo: 'Planes Ultra', descripcion: 'Navega más rápido con Ultra', imagen_url: 'NuevosPlanesUltraVertical.jpg', enlace: '/tienda', ubicacion: 'hero', orden: 5, activo: true },
  { id_banner: 5, titulo: 'Portabilidad Telcel', descripcion: 'Cámbiate ya y conserva tu número', imagen_url: 'BannerPortabilidadAmigoHorizontal.jpg', enlace: '/tienda', ubicacion: 'hero', orden: 6, activo: true },
  { id_banner: 6, titulo: 'Bocinas JBL', descripcion: 'Sonido potente en cualquier lugar', imagen_url: 'BocinasJBL2.png', enlace: '/tienda', ubicacion: 'hero', orden: 7, activo: true },
  { id_banner: 7, titulo: 'Amigo Sin Límite', descripcion: 'Llamadas y SMS ilimitados', imagen_url: 'AmigoSinLimiteVertical.jpg', enlace: '/tienda', ubicacion: 'hero', orden: 8, activo: true },
  { id_banner: 8, titulo: 'Samsung Series', descripcion: 'Lo último de Samsung aquí', imagen_url: 'SamsungSeries.png', enlace: '/tienda', ubicacion: 'hero', orden: 9, activo: true },
  { id_banner: 9, titulo: 'Cómo cambiarte a Telcel', descripcion: 'Pasos sencillos para tu portabilidad', imagen_url: 'BannerQueHacerParaCambiarteatelcelHorizontal.jpg', enlace: '/tienda', ubicacion: 'hero', orden: 10, activo: true },
  { id_banner: 11, titulo: 'Cámbiate a Telcel', descripcion: 'Tu número siempre contigo', imagen_url: 'BannerQueHacerparacambiarteatelcelVertical.jpg', enlace: '/tienda', ubicacion: 'hero', orden: 11, activo: true }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id_producto: 1, nombre: 'Bose Bocina 1', marca: 'Bose', color: 'Negro', descripcion: 'Bocina premium de sonido envolvente',
    detalles_adicional: 'Bluetooth 5.0, 10h batería', precio: 3499, stock: 10, id_categoria: 1, id_subcategoria: 0,
    tipo_producto: 'Bocina', estado: 'nuevo', imagen_principal: 'BoseBocina1.webp'
  },
  {
    id_producto: 2, nombre: 'Xiaomi 17 Pro Max', marca: 'Xiaomi', color: 'Azul', descripcion: 'El smartphone más potente',
    detalles_adicional: '256GB ROM, 12GB RAM', precio: 15999, stock: 5, id_categoria: 2, id_subcategoria: 0,
    tipo_producto: 'Celular', estado: 'nuevo', imagen_principal: 'Xiaomi17ProMax.webp'
  },
  {
    id_producto: 3, nombre: 'iPhone 16 Pro', marca: 'Apple', color: 'Titanio', descripcion: 'Diseño elegante y rendimiento superior',
    detalles_adicional: 'A18 Pro chip, 5G', precio: 24999, stock: 3, id_categoria: 2, id_subcategoria: 0,
    tipo_producto: 'Celular', estado: 'nuevo', imagen_principal: 'Iphone16Pro.webp'
  },
  {
    id_producto: 4, nombre: 'Motorola G60', marca: 'Motorola', color: 'Gris', descripcion: 'Gran batería y cámara increíble',
    detalles_adicional: '108MP cámara, 6000mAh', precio: 6499, stock: 8, id_categoria: 2, id_subcategoria: 0,
    tipo_producto: 'Celular', estado: 'nuevo', imagen_principal: 'MotorolaG60.webp'
  },
  {
    id_producto: 5, nombre: 'Bocina JBL', marca: 'JBL', color: 'Azul', descripcion: 'Resistente al agua y sonido potente',
    detalles_adicional: 'IPX7, 12h batería', precio: 1999, stock: 15, id_categoria: 1, id_subcategoria: 0,
    tipo_producto: 'Bocina', estado: 'nuevo', imagen_principal: 'BocinaJBL.webp'
  },
  {
    id_producto: 6, nombre: 'Moto G60', marca: 'Motorola', color: 'Verde', descripcion: 'Rendimiento sólido día a día',
    detalles_adicional: 'Carga rápida TurboPower', precio: 5899, stock: 12, id_categoria: 2, id_subcategoria: 0,
    tipo_producto: 'Celular', estado: 'nuevo', imagen_principal: 'MotoG60.webp'
  },
  {
    id_producto: 7, nombre: 'Bose Producto 2', marca: 'Bose', color: 'Blanco', descripcion: 'Calidad de audio excepcional',
    detalles_adicional: 'Cancelación de ruido', precio: 5999, stock: 4, id_categoria: 1, id_subcategoria: 0,
    tipo_producto: 'Bocina', estado: 'nuevo', imagen_principal: 'BoseProducto2.webp'
  },
  {
    id_producto: 8, nombre: 'Honor Producto', marca: 'Honor', color: 'Plata', descripcion: 'Elegancia y funcionalidad',
    detalles_adicional: 'Pantalla OLED', precio: 7999, stock: 6, id_categoria: 2, id_subcategoria: 0,
    tipo_producto: 'Celular', estado: 'nuevo', imagen_principal: 'CelularHonorProducto.jpeg'
  },
  {
    id_producto: 9, nombre: 'Audífonos Bluetooth', marca: 'Generica', color: 'Negro', descripcion: 'Comodidad sin cables',
    detalles_adicional: 'Controles táctiles', precio: 899, stock: 20, id_categoria: 4, id_subcategoria: 0,
    tipo_producto: 'Accesorio', estado: 'nuevo', imagen_principal: 'AudifonosBluetoothProducto.jpeg'
  },
  {
    id_producto: 10, nombre: 'Cargador GaN 20W', marca: 'Ugreen', color: 'Blanco', descripcion: 'Carga rápida y compacta',
    detalles_adicional: 'USB-C + USB-A', precio: 450, stock: 25, id_categoria: 4, id_subcategoria: 0,
    tipo_producto: 'Cargador', estado: 'nuevo', imagen_principal: 'CargadorGaN20W_2puertos.jpeg'
  },
  {
    id_producto: 11, nombre: 'Nebro Audífonos', marca: 'Nebro', color: 'Blanco', descripcion: 'Sonido cristalino',
    detalles_adicional: 'Ergonómicos', precio: 1299, stock: 10, id_categoria: 4, id_subcategoria: 0,
    tipo_producto: 'Accesorio', estado: 'nuevo', imagen_principal: 'NebroAudifonosInalambricos.jpeg'
  },
  {
    id_producto: 12, nombre: 'Kit de Limpieza', marca: 'Limpiex', color: 'N/A', descripcion: 'Manten tus equipos impecables',
    detalles_adicional: 'Spray + Paño Microfibra', precio: 150, stock: 50, id_categoria: 3, id_subcategoria: 0,
    tipo_producto: 'Limpieza', estado: 'nuevo', imagen_principal: 'Limpieza.png'
  },
  {
    id_producto: 13, nombre: 'Fundas para Celular', marca: 'Varios', color: 'Multi', descripcion: 'Protección con estilo',
    detalles_adicional: 'Varios modelos disponibles', precio: 250, stock: 100, id_categoria: 2, id_subcategoria: 0,
    tipo_producto: 'Accesorio', estado: 'nuevo', imagen_principal: '../Fundas_para_celular.png'
  },
  {
    id_producto: 14, nombre: 'Audífonos Pro', marca: 'Varios', color: 'Blanco', descripcion: 'Alta fidelidad',
    detalles_adicional: 'Cancelación activa', precio: 2200, stock: 5, id_categoria: 4, id_subcategoria: 0,
    tipo_producto: 'Accesorio', estado: 'nuevo', imagen_principal: '../Audifonos.png'
  },
  {
    id_producto: 15, nombre: 'Celular Honor Especial', marca: 'Honor', color: 'Negro', descripcion: 'Edición especial',
    detalles_adicional: 'Cámara mejorada', precio: 8500, stock: 2, id_categoria: 2, id_subcategoria: 0,
    tipo_producto: 'Celular', estado: 'nuevo', imagen_principal: '../CelularHonor.jpeg'
  },
  {
    id_producto: 16, nombre: 'Cargador Rápido', marca: 'Telcel', color: 'Blanco', descripcion: 'Carga segura',
    detalles_adicional: 'Original', precio: 350, stock: 30, id_categoria: 4, id_subcategoria: 0,
    tipo_producto: 'Accesorio', estado: 'nuevo', imagen_principal: '../Cargador.png'
  }
];
