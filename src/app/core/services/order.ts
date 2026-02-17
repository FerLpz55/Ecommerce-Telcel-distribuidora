import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import { OrderResponse } from '../models/order';
import { CartItem } from '../models/cart-item';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private api: ApiService) {}

  procesarPedido(data: {
    items: CartItem[];
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
    subtotal: number;
    envio: number;
    total: number;
  }): Observable<OrderResponse> {
    return this.api.post<OrderResponse>('procesar_pedido.php', data);
  }
}
