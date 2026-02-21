import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart';
import { OrderService } from '../../core/services/order';
import { AuthService } from '../../core/services/auth';
import { CheckoutRequest } from '../../core/models/order';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, CurrencyPipe, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout implements OnInit {
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  private auth = inject(AuthService);
  private router = inject(Router);

  form: CheckoutRequest = {
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    calle: '',
    colonia: '',
    codigo_postal: '',
    ciudad: '',
    estado: '',
    referencias: ''
  };

  loading = false;
  orderSuccess = false;
  orderId: string | null = null;
  whatsappUrl: string | null = null;

  ngOnInit(): void {
    if (this.cartService.cartItems().length === 0) {
      this.router.navigate(['/carrito']);
      return;
    }
    const user = this.auth.user();
    if (user) {
      this.form.nombre = user.nombre;
      this.form.apellidos = `${user.apellido_paterno} ${user.apellido_materno}`;
      this.form.email = user.correo;
    }
  }

  onSubmit(): void {
    this.loading = true;
    this.orderService.procesarPedido({
      items: this.cartService.cartItems(),
      ...this.form,
      subtotal: this.cartService.subtotal(),
      envio: this.cartService.shipping(),
      total: this.cartService.total()
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.orderSuccess = true;
          this.orderId = res.id_pedido ?? null;
          this.whatsappUrl = res.whatsapp_url ?? null;
          this.cartService.clear();
        }
      },
      error: () => this.loading = false
    });
  }
}
