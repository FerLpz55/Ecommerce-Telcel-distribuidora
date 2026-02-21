import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api';
import { Product, ProductListResponse } from '../models/product';
import { Category } from '../models/category';
import { Banner, ServiceItem } from '../models/banner';
import { MOCK_CATEGORIES, MOCK_BANNERS, MOCK_PRODUCTS } from './mock-data';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private api: ApiService) {}

  getProducts(params: {
    pagina?: number;
    buscar?: string;
    categoria?: number;
  } = {}): Observable<ProductListResponse> {
    // Para propósitos de demostración y asegurar que se usen todas las imágenes,
    // devolvemos los datos mockeados si no hay una búsqueda específica o categoría real.
    if (!params.buscar && !params.categoria) {
      return of({
        success: true,
        productos: MOCK_PRODUCTS,
        total: MOCK_PRODUCTS.length,
        pagina_actual: 1,
        total_paginas: 1
      });
    }

    const q: Record<string, string> = { accion: 'listar' };
    if (params.pagina) q['pagina'] = params.pagina.toString();
    if (params.buscar) q['buscar'] = params.buscar;
    if (params.categoria) q['categoria'] = params.categoria.toString();
    return this.api.get<ProductListResponse>('productos.php', q);
  }

  getProduct(id: number): Observable<{ success: boolean; producto: Product }> {
    const mockProduct = MOCK_PRODUCTS.find(p => p.id_producto === id);
    if (mockProduct) {
      return of({ success: true, producto: mockProduct });
    }
    return this.api.get<{ success: boolean; producto: Product }>('productos.php', {
      accion: 'obtener', id: id.toString()
    });
  }

  getCategories(): Observable<{ success: boolean; categorias: Category[] }> {
    // Siempre devolvemos las categorías mockeadas para asegurar que se vean las imágenes nuevas
    return of({ success: true, categorias: MOCK_CATEGORIES });
  }

  getBanners(): Observable<{ success: boolean; banners: Banner[] }> {
    // Siempre devolvemos los banners mockeados para asegurar que se vean las imágenes nuevas
    return of({ success: true, banners: MOCK_BANNERS });
  }

  getServices(): Observable<{ success: boolean; servicios: ServiceItem[] }> {
    return this.api.get<{ success: boolean; servicios: ServiceItem[] }>('servicios_publicos.php');
  }
}
