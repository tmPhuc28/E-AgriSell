import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.model';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: Product[] | undefined;
  productsByType: Product[] = [];
  randomProduct: Product | undefined;
  randomProducts: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.products = this.productService.getSprayers();
    this.productsByType = this.productService.getProductsByType();
    this.getRandomProduct();
    this.getRandomProducts();
  }
  getRandomProduct(): void {
    const products = this.productService.getAllProducts();
    this.randomProduct = this.productService.getRandomProduct(products);
  }
  getRandomProducts(): void {
    this.randomProducts = this.productService.getRandomProducts();
  }
}
