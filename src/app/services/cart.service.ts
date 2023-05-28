import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  items: { [username: string]: any } = {};
  private storageKey = 'cartItems';
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Khôi phục thông tin giỏ hàng từ sessionStorage khi khởi tạo service
    const storedItems = sessionStorage.getItem(this.storageKey);
    if (storedItems) {
      this.items = JSON.parse(storedItems);
    }
  }
  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000, // Thời gian hiển thị (milliseconds)
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
  addToCart(product: Product, quantity: number): void {
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
      const totalPriceProduct = product.price * quantity; // Tính tổng tiền sản phẩm
      if (item) {
        item.quantity += quantity;
        item.totalPriceProduct += totalPriceProduct; // Cập nhật tổng tiền sản phẩm
      } else {
        userCart.push({
          product: product,
          quantity: quantity,
          totalPriceProduct: totalPriceProduct,
        });
      }
      this.openSnackBar('Đã thêm ' + product.name + ' vào giỏ hàng', 'Đóng');
    } else {
      this.items[currentUser] = [
        { product: product, quantity: 1, totalPriceProduct: product.price },
      ];
    }

    sessionStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }
  // Tính tổng tiền giỏ hàng
  getCartTotalPrice(): number {
    const currentUser = this.authService.getCurrentUser()?.username || '';
    const userCart = this.items[currentUser] || [];
    let total = 0;
    for (const item of userCart) {
      total += item.totalPriceProduct;
    }
    return total;
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
        const totalPriceProduct = product.price * quantity;
        item.quantity = quantity;
        item.totalPriceProduct = totalPriceProduct;
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
    this.openSnackBar('Đã xóa ' + product.name, 'Đóng');
  }

  clearCart(): void {
    const currentUser = this.authService.getCurrentUser()?.username || '';
    delete this.items[currentUser];
    sessionStorage.setItem(this.storageKey, JSON.stringify(this.items));
    this.openSnackBar('Đã xóa toàn bộ', 'Đóng');
  }
  // Kiểm tra trong input không cho nhập số âm vào không lớn lơn 99
  checkNegativeInput(event: any): void {
    if (event.target.value <= 0) {
      event.target.value = 1;
    }
    const value = parseInt(event.target.value, 10);
    if (value > 99) {
      event.target.value = 99;
    }
  }
}
