import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import { Product, ProductListResponse } from '../models/product';
import { Category } from '../models/category';
import { Banner, ServiceItem } from '../models/banner';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private api: ApiService) {}

  getProducts(params: {
    pagina?: number;
    buscar?: string;
    categoria?: number;
  } = {}): Observable<ProductListResponse> {
    const q: Record<string, string> = { accion: 'listar' };
    if (params.pagina) q['pagina'] = params.pagina.toString();
    if (params.buscar) q['buscar'] = params.buscar;
    if (params.categoria) q['categoria'] = params.categoria.toString();
    return this.api.get<ProductListResponse>('productos.php', q);
  }

  getProduct(id: number): Observable<{ success: boolean; producto: Product }> {
    return this.api.get<{ success: boolean; producto: Product }>('productos.php', {
      accion: 'obtener', id: id.toString()
    });
  }

  getCategories(): Observable<{ success: boolean; categorias: Category[] }> {
    return this.api.get<{ success: boolean; categorias: Category[] }>('categorias_publicas.php');
  }

  getBanners(): Observable<{ success: boolean; banners: Banner[] }> {
    return this.api.get<{ success: boolean; banners: Banner[] }>('banners_publicos.php');
  }

  getServices(): Observable<{ success: boolean; servicios: ServiceItem[] }> {
    return this.api.get<{ success: boolean; servicios: ServiceItem[] }>('servicios_publicos.php');
  }
}
