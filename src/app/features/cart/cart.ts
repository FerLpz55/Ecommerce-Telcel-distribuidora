import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  cartService = inject(CartService);

  remove(productId: number): void {
    this.cartService.removeItem(productId);
  }

  increment(productId: number, current: number, stock: number): void {
    if (current < stock) this.cartService.updateQuantity(productId, current + 1);
  }

  decrement(productId: number, current: number): void {
    if (current > 1) this.cartService.updateQuantity(productId, current - 1);
    else this.remove(productId);
  }
}
