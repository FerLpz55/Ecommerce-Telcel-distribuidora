import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { Product } from '../../../core/models/product';
import { Category } from '../../../core/models/category';

@Component({
  selector: 'app-product-list',
  imports: [FormsModule, ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  products: Product[] = [];
  categories: Category[] = [];
  searchTerm = '';
  selectedCategory: number | null = null;
  currentPage = 1;
  totalPages = 1;
  loading = false;

  ngOnInit(): void {
    this.productService.getCategories().subscribe({
      next: (res) => { if (res.success) this.categories = res.categorias; }
    });

    this.route.queryParams.subscribe(params => {
      if (params['categoria']) {
        this.selectedCategory = +params['categoria'];
      }
      if (params['buscar']) {
        this.searchTerm = params['buscar'];
      }
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts({
      pagina: this.currentPage,
      buscar: this.searchTerm || undefined,
      categoria: this.selectedCategory || undefined
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.products = res.productos;
          this.totalPages = res.total_paginas;
        }
      },
      error: () => this.loading = false
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  filterByCategory(catId: number | null): void {
    this.selectedCategory = catId;
    this.currentPage = 1;
    this.loadProducts();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = null;
    this.currentPage = 1;
    this.loadProducts();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadProducts();
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
