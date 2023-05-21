import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Máy cắt cỏ',
      image: 'https://isfh.org/wp-content/uploads/2021/03/may-xoi-dat.jpg',
      description: 'Product 1 Description',
      price: 100,
    },
    {
      id: 2,
      name: 'Máy gặt lúa',
      image: 'https://isfh.org/wp-content/uploads/2021/03/may-xoi-dat.jpg',
      description: 'Product 2 Description',
      price: 200,
    },
    {
      id: 3,
      name: 'Máy phun thuốc',
      image: 'https://isfh.org/wp-content/uploads/2021/03/may-xoi-dat.jpg',
      description: 'Product 3 Description',
      price: 300,
    },
  ];

  constructor() {}

  getAllProducts(): Product[] {
    return this.products;
  }

  getProductById(id: number): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  searchProducts(searchTerm: string): Product[] {
    searchTerm = searchTerm.toLowerCase();
    return this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
  }
}
