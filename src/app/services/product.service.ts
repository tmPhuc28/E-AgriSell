import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { PRODUCTS } from '../data/products.data';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = PRODUCTS;

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
  // Hiển thị những sản phẩm có loại là "Máy phun thuốc trừ sâu"
  getSprayers(): Product[] {
    return this.products.filter(
      (product) => product.type === 'Máy phun thuốc trừ sâu'
    );
  }

  // Lấy tối đa 4 sản phẩm ngẫu nhiên của mỗi loại
  getProductsByType(): Product[] {
    const productsByType: { [type: string]: Product[] } = {};

    for (const product of this.products) {
      if (!productsByType[product.type]) {
        productsByType[product.type] = [];
      }

      productsByType[product.type].push(product);
    }

    const products: Product[] = [];

    for (const type in productsByType) {
      if (Object.prototype.hasOwnProperty.call(productsByType, type)) {
        const typeProducts = productsByType[type];
        const randomProducts = this.shuffleArray(typeProducts).slice(0, 4);
        products.push(...randomProducts);
      }
    }

    return products;
  }

  // Hàm đảo ngẫu nhiên một mảng
  private shuffleArray(array: any[]): any[] {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }

  // Lấy ngẫu nhiên một sản phẩm từ một mảng sản phẩm
  getRandomProduct(products: Product[]): Product | undefined {
    const randomIndex = Math.floor(Math.random() * products.length);
    return products[randomIndex];
  }

  getRandomProducts(): Product[] {
    // Đảo ngẫu nhiên mảng sản phẩm
    const shuffledProducts = this.shuffleArray(this.products);

    // Lấy 3 sản phẩm đầu tiên sau khi đảo ngẫu nhiên
    const randomProducts = shuffledProducts.slice(0, 3);

    return randomProducts;
  }
}
