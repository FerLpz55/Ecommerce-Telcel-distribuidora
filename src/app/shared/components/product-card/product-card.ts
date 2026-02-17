import { Component, input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../../core/models/product';
import { CartService } from '../../../core/services/cart';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  product = input.required<Product>();
  private cart = inject(CartService);
  private router = inject(Router);

  get imageUrl(): string {
    return this.product().imagen_principal || 'assets/no-image.png';
  }

  addToCart(event: Event): void {
    event.stopPropagation();
    const p = this.product();
    this.cart.addItem({ id_producto: p.id_producto, nombre: p.nombre, precio: p.precio, cantidad: 1, imagen: p.imagen_principal || '', stock: p.stock });
  }

  viewDetail(): void {
    this.router.navigate(['/producto', this.product().id_producto]);
  }
}
