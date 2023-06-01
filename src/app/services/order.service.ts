import { Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private customerName: string = '';
  private customerEmail: string = '';
  private customerAddress: string = '';
  private customerPhone: string = '';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}
  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000, // Thời gian hiển thị (milliseconds)
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
  placeOrder() {
    // Kiểm tra xem thông tin khách hàng đã được cung cấp đầy đủ hay chưa
    if (this.isCustomerInfoValid()) {
      // Nếu đặt hàng thành công
      if (this.performOrder()) {
        // Hiển thị thông báo thành công
        this.openSnackBar('Đặt hàng thành công', '');

        // Lưu đơn hàng vào sessionStorage
        const order = {
          customerName: this.customerName,
          customerEmail: this.customerEmail,
          customerAddress: this.customerAddress,
          customerPhone: this.customerPhone,
          cartItems: this.cartService.getItems(),
        };
        sessionStorage.setItem('order', JSON.stringify(order));
        // Xóa giỏ hàng
        this.cartService.clearCart();
        window.location.reload();
      } else {
        // Hiển thị thông báo lỗi
        this.openSnackBar('Đặt hàng thất bại', '');
      }
    } else {
      // Hiển thị thông báo lỗi về thông tin khách hàng chưa đầy đủ
      this.openSnackBar('Vui lòng điền đầy đủ thông tin đật hàng', '');
    }
  }

  // Kiểm tra xem thông tin khách hàng đã được cung cấp đầy đủ hay chưa
  private isCustomerInfoValid(): boolean {
    return (
      this.customerName !== '' &&
      this.customerEmail !== '' &&
      this.customerAddress !== '' &&
      this.customerPhone !== ''
    );
  }

  // Thực hiện đặt hàng
  private performOrder(): boolean {
    return true;
    // Xử lý đặt hàng
    // Trả về true nếu đặt hàng thành công, false nếu đặt hàng thất bại
  }

  setCustomerInfo(name: string, email: string, address: string, phone: string) {
    this.customerName = name;
    this.customerEmail = email;
    this.customerAddress = address;
    this.customerPhone = phone;
  }
}
