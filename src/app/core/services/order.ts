import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { OrderResponse } from '../models/order';
import { CartItem } from '../models/cart-item';
import { SupabaseService } from './supabase.service';
import { SupabaseAuthService } from './supabase-auth.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(
    private supabaseService: SupabaseService,
    private supabaseAuth: SupabaseAuthService,
  ) {}

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
    return from(this.procesarPedidoSupabase(data));
  }

  private async procesarPedidoSupabase(data: {
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
  }): Promise<OrderResponse> {
    const supabase = this.supabaseService.getClient();
    const user = this.supabaseAuth.currentUser;
    if (!user) {
      throw { error: { message: 'Debes iniciar sesión para procesar el pedido.' } };
    }

    const { data: orderRow, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: data.total,
        status: 'pending',
        payment_method: 'transferencia',
        proof_url: null,
      })
      .select('id')
      .single();

    if (orderError || !orderRow?.id) {
      throw { error: { message: orderError?.message || 'No se pudo guardar el pedido.' } };
    }

    const orderItems = data.items.map((item) => ({
      order_id: orderRow.id,
      // Tu carrito usa ids numéricos legacy; como product_id es UUID y nullable,
      // lo dejamos en null hasta migrar catálogo completo a la tabla products.
      product_id: null as string | null,
      quantity: item.cantidad,
      price_at_purchase: item.precio,
    }));

    if (orderItems.length > 0) {
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) {
        throw { error: { message: itemsError.message || 'No se pudieron guardar los productos del pedido.' } };
      }
    }

    const whatsappMsg =
      `Hola, realicé el pedido ${orderRow.id}. ` +
      `Nombre: ${data.nombre} ${data.apellidos}. ` +
      `Total: $${data.total.toFixed(2)} MXN.`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`;

    return {
      success: true,
      message: 'Pedido registrado correctamente.',
      id_pedido: orderRow.id,
      whatsapp_url: whatsappUrl,
    };
  }
}
