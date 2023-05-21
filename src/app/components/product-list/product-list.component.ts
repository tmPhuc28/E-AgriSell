import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  searchKeyword: string = '';
  filteredProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchKeyword = params['search'] || '';
      this.searchProducts();
    });
  }

  searchProducts(): void {
    if (this.searchKeyword.trim() === '') {
      this.filteredProducts = this.productService.getAllProducts();
    } else {
      this.filteredProducts = this.productService.searchProducts(
        this.searchKeyword.toLowerCase()
      );
    }

    this.currentPage = 1;
    this.updateDisplayedProducts();
  }

  updateDisplayedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.products = this.filteredProducts.slice(startIndex, endIndex);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedProducts();
    }
  }

  goToNextPage(): void {
    const totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.updateDisplayedProducts();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }
}
