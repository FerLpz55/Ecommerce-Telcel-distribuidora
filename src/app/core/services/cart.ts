import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartItem, CartSummary } from '../models/cart-item';

const CART_KEY = 'telcel_cart';
const FREE_SHIPPING_THRESHOLD = 1000;
const SHIPPING_COST = 150;

@Injectable({ providedIn: 'root' })
export class CartService {
  private platformId = inject(PLATFORM_ID);
  private items = signal<CartItem[]>([]);

  readonly cartItems = this.items.asReadonly();
  readonly itemCount = computed(() => this.items().reduce((sum, i) => sum + i.cantidad, 0));
  readonly subtotal = computed(() => this.items().reduce((sum, i) => sum + i.precio * i.cantidad, 0));
  readonly shipping = computed(() => this.subtotal() >= FREE_SHIPPING_THRESHOLD ? 0 : this.items().length > 0 ? SHIPPING_COST : 0);
  readonly total = computed(() => this.subtotal() + this.shipping());

  readonly summary = computed<CartSummary>(() => ({
    items: this.items(),
    subtotal: this.subtotal(),
    envio: this.shipping(),
    total: this.total(),
    cantidad_total: this.itemCount()
  }));

  constructor() { this.loadFromStorage(); }

  addItem(item: CartItem): void {
    const current = this.items();
    const existing = current.find(i => i.id_producto === item.id_producto);
    if (existing) {
      const newQty = Math.min(existing.cantidad + item.cantidad, item.stock);
      this.items.set(current.map(i => i.id_producto === item.id_producto ? { ...i, cantidad: newQty } : i));
    } else {
      this.items.set([...current, { ...item, cantidad: Math.min(item.cantidad, item.stock) }]);
    }
    this.saveToStorage();
  }

  updateQuantity(productId: number, cantidad: number): void {
    if (cantidad <= 0) { this.removeItem(productId); return; }
    this.items.set(this.items().map(i => i.id_producto === productId ? { ...i, cantidad: Math.min(cantidad, i.stock) } : i));
    this.saveToStorage();
  }

  removeItem(productId: number): void {
    this.items.set(this.items().filter(i => i.id_producto !== productId));
    this.saveToStorage();
  }

  clear(): void {
    this.items.set([]);
    this.saveToStorage();
  }

  private saveToStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(CART_KEY, JSON.stringify(this.items()));
    }
  }

  private loadFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) { this.items.set(JSON.parse(stored)); }
    }
  }
}
