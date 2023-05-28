import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = []; // Mảng chứa thông tin giỏ hàng
  totalPriceProduct: number = 0; // Biến tổng tiền
  selectedQuantity: number = 1;
  constructor(private cartService: CartService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCartItems();
  } // Gọi phương thức để tải thông tin giỏ hàng}

  addToCart(product: any): void {
    this.cartService.addToCart(product, product.quantity);
    this.loadCartItems(); // Sau khi thêm vào giỏ hàng, cập nhật lại thông tin giỏ hàng và tổng tiền
  }

  loadCartItems(): void {
    this.cartItems = this.cartService.getItems(); // Lấy thông tin giỏ hàng từ service
    this.calculateTotalPriceProduct(); // Tính tổng tiền
  }
  calculateTotalPriceProduct(): void {
    this.totalPriceProduct = 0;
    for (const item of this.cartItems) {
      item.totalPriceProduct = item.product.price * item.quantity; // Tính tổng tiền cho mỗi sản phẩm
      this.totalPriceProduct += item.totalPriceProduct; // Cộng tổng tiền vào biến totalPrice
    }
  }
  get cartTotalPrice(): number {
    return this.cartService.getCartTotalPrice();
  }
  updateQuantity(item: any): void {
    this.cartService.updateQuantity(item.product, item.quantity);
    this.loadCartItems(); // Sau khi cập nhật số lượng, cập nhật lại thông tin giỏ hàng và tổng tiền
  }

  removeItem(item: any): void {
    this.cartService.removeItem(item.product);
    this.loadCartItems(); // Sau khi xóa sản phẩm, cập nhật lại thông tin giỏ hàng và tổng tiền
  }

  clearCart(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Bạn có chắc muốn xóa tất cả ?',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cartService.clearCart();
        this.loadCartItems(); // Sau khi xóa toàn bộ giỏ hàng, cập nhật lại thông tin giỏ hàng và tổng tiền
      }
    });
  }
  checkItem(): boolean {
    return this.cartService.getItems().length > 0;
  }
  // Kiểm tra trong input không cho nhập số âm vào không lớn lơn 99
  checkNegativeInput(event: any): void {
    this.cartService.checkNegativeInput(event);
  }
}
