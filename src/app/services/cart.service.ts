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
    // Lấy thông tin người dùng hiện tại
    const currentUser = this.authService.getCurrentUser()?.username || '';
    // Lấy giỏ hàng của người dùng
    const userCart = this.items[currentUser];
    // Kiểm tra trạng thái đăng nhập
    if (!this.authService.isLoggedIn()) {
      // Chuyển hướng đến trang đăng nhập
      this.router.navigate(['/login']);
      return;
    }
    // Thêm sản phẩm vào giỏ hàng nếu đã đăng nhập
    if (userCart) {
      const item = userCart.find(
        (i: { product: { id: any } }) => i.product.id === product.id
      );
      const cartQuantity = userCart.reduce(
        (total: number, item: any) => total + item.quantity,
        0
      ); // Tổng số lượng sản phẩm trong giỏ hàng
      if (cartQuantity >= 99) {
        this.openSnackBar(
          'Sản phẩm đã đạt số lượng tối đa trong giỏ hàng',
          'Đóng'
        );
        return;
      }
      if (item) {
        const remainingQuantity = Math.min(99 - cartQuantity, quantity); // Số lượng còn lại để thêm vào giỏ hàng
        item.quantity += remainingQuantity; // Cập nhật số lượng sản phẩm
        item.totalPriceProduct += product.price * remainingQuantity; // Cập nhật tổng tiền sản phẩm
      } else {
        const remainingQuantity = Math.min(99 - cartQuantity, quantity); // Số lượng còn lại để thêm vào giỏ hàng
        userCart.push({
          product: product,
          quantity: remainingQuantity,
          totalPriceProduct: product.price * remainingQuantity,
        });
      }
      this.openSnackBar('Đã thêm ' + product.name + ' vào giỏ hàng', 'Đóng');
    } else {
      // Nếu chưa có giỏ hàng thì mảng mới sẽ được tạo và lưu vào đó
      this.items[currentUser] = [
        { product: product, quantity: 1, totalPriceProduct: product.price },
      ];
      this.openSnackBar('Đã thêm ' + product.name + ' vào giỏ hàng', 'Đóng');
    }
    // Lưu thông tin giỏ hàng vào sessionStorage
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
  // Cập nhật số lượng sản phẩm trong giỏ hàng đồng thời cập nhật tổng tiền sản phẩm nếu thay đổi số lượng sản phẩm
  updateQuantity(product: Product, quantity: number): void {
    const currentUser = this.authService.getCurrentUser()?.username || '';
    const userCart = this.items[currentUser];
    if (userCart) {
      const item = userCart.find(
        (i: { product: { id: any } }) => i.product.id === product.id
      );
      if (item) {
        const updatedQuantity = Math.max(1, Math.min(quantity, 99)); // Giới hạn số lượng trong khoảng từ 1 đến 99
        const totalPriceProduct = product.price * updatedQuantity; // Tính lại tổng tiền sản phẩm
        item.quantity = updatedQuantity;
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
  }
  clearAllCartNotifications(): void {
    this.clearCart();
    this.openSnackBar('Đã xóa toàn bộ', 'Đóng');
  }
  // Kiểm tra trong input không cho nhập số âm vào không lớn lơn 99
  checkNegativeInput(event: any): void {
    let value = parseInt(event.target.value, 10);
    value = Math.max(1, Math.min(99, value)); // Giới hạn giá trị trong khoảng từ 1 đến 99
    event.target.value = value;
  }
  // Hàm kiểm tra trước khi thanh toán
  onCheckout() {
    const isLoggedIn = this.authService.isLoggedIn();
    const hasItemsInCart = this.getItems().length > 0;
    // Nếu đã đăng nhập mà không có sản phẩm trong giỏ hàng
    if (isLoggedIn && !hasItemsInCart) {
      this.router.navigate(['/products']);
    }
    // Nếu chưa đăng nhập
    else if (!isLoggedIn) {
      this.router.navigate(['/products']);
    }
    // Đã đăng nhập và đã có sản phẩm trong giỏ hàng
    else {
      this.router.navigate(['/checkout']);
    }
  }
}
