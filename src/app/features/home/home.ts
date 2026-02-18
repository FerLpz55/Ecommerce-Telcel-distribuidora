import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product';
import { Product } from '../../core/models/product';
import { Banner } from '../../core/models/banner';
import { Category } from '../../core/models/category';
import { ProductCard } from '../../shared/components/product-card/product-card';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private productService = inject(ProductService);
  banners = signal<Banner[]>([]);
  featuredProducts = signal<Product[]>([]);
  categories = signal<Category[]>([]);

  ngOnInit(): void {
    this.productService.getBanners().subscribe(res => this.banners.set(res.banners));
    this.productService.getProducts({ pagina: 1 }).subscribe(res => this.featuredProducts.set(res.productos.slice(0, 8)));
    this.productService.getCategories().subscribe(res => this.categories.set(res.categorias));
  }

  get heroBanner(): Banner | null {
    return this.banners().length > 0 ? this.banners()[0] : null;
  }
}
