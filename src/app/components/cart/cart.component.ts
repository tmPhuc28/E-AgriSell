import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  addToCart(product: any): void {
    if (!this.authService.isLoggedIn()) {
      // Chuyển hướng đến trang đăng nhập
      this.router.navigate(['/login']);
      return;
    }
    // Thêm sản phẩm vào giỏ hàng
    this.cartService.addToCart(product);
  }

  getItems(): any[] {
    if (this.authService.isLoggedIn()) {
      return this.cartService.getItems();
    } else {
      return [];
    }
  }

  updateQuantity(item: any): void {
    this.cartService.updateQuantity(item.product, item.quantity);
  }

  removeItem(item: any): void {
    this.cartService.removeItem(item.product);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
