import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

// Declare MyPaginatorIntl class here
export class MyPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Số mục mỗi trang:';
  override nextPageLabel = 'Trang tiếp theo';
  override previousPageLabel = 'Trang trước đó';
  override firstPageLabel = 'Trang đầu tiên';
  override lastPageLabel = 'Trang cuối cùng';

  // Override the getRangeLabel method to modify the range label
  override getRangeLabel: (
    page: number,
    pageSize: number,
    length: number
  ) => string = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `Không có mục nào`;
    }

    length = Math.max(length, 0);

    const startIndex = page * pageSize + 1;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize - 1, length)
        : startIndex + pageSize - 1;

    return `${startIndex} – ${endIndex} : Tổng ${length} sản phẩm`;
  };
}
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers: [{ provide: MatPaginatorIntl, useClass: MyPaginatorIntl }],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentPage: number = 1;
  pageSize: number = 8;
  searchKeyword: string = '';
  filteredProducts: Product[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selectedQuantity: number = 1;
  selectedSortOrder: string = 'default';

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
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.currentPage = this.paginator.pageIndex + 1;
        this.updateDisplayedProducts();
      });
    }
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

  handlePageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.updateDisplayedProducts();
  }

  updateDisplayedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.products = this.filteredProducts.slice(startIndex, endIndex);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, this.selectedQuantity);
  }

  sortProducts(sortOrder: string): void {
    this.selectedSortOrder = sortOrder;
    this.products.sort((a, b) => {
      if (this.selectedSortOrder === 'asc') {
        return a.price - b.price; // Sắp xếp từ thấp đến cao
      } else {
        return b.price - a.price; // Sắp xếp từ cao đến thấp
      }
    });
  }
}
