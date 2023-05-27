import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  items: { [username: string]: any } = {};
  private storageKey = 'cartItems';

  constructor(private authService: AuthService, private router: Router) {
    // Khôi phục thông tin giỏ hàng từ sessionStorage khi khởi tạo service
    const storedItems = sessionStorage.getItem(this.storageKey);
    if (storedItems) {
      this.items = JSON.parse(storedItems);
    }
  }

  addToCart(product: Product): void {
    const currentUser = this.authService.getCurrentUser()?.username || '';
    const userCart = this.items[currentUser];
    if (!this.authService.isLoggedIn()) {
      // Chuyển hướng đến trang đăng nhập
      this.router.navigate(['/login']);
      return;
    }
    if (userCart) {
      const item = userCart.find(
        (i: { product: { id: any } }) => i.product.id === product.id
      );
      if (item) {
        item.quantity++;
      } else {
        userCart.push({ product: product, quantity: 1 });
      }
    } else {
      this.items[currentUser] = [{ product: product, quantity: 1 }];
    }

    sessionStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  getItems(): any[] {
    const currentUser = this.authService.getCurrentUser()?.username || '';
    const userCart = this.items[currentUser] || [];
    return userCart;
  }

  updateQuantity(product: Product, quantity: number): void {
    const currentUser = this.authService.getCurrentUser()?.username || '';
    const userCart = this.items[currentUser];
    if (userCart) {
      const item = userCart.find(
        (i: { product: { id: any } }) => i.product.id === product.id
      );
      if (item) {
        item.quantity = quantity;
      }
    }

    sessionStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  removeItem(product: Product): void {
    const currentUser = this.authService.getCurrentUser()?.username || '';
    const userCart = this.items[currentUser];
    if (userCart) {
      const itemIndex = userCart.findIndex(
        (i: { product: { id: any } }) => i.product.id === product.id
      );
      if (itemIndex !== -1) {
        userCart.splice(itemIndex, 1);
      }
    }

    sessionStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  clearCart(): void {
    const currentUser = this.authService.getCurrentUser()?.username || '';
    delete this.items[currentUser];
    sessionStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }
}
