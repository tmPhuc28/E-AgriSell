import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage: string = '';

  constructor(public authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      // Đã đăng nhập, chuyển hướng đến trang chính
      this.router.navigate(['']);
    }
  }

  onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Vui lòng nhập tên tài khoản và mật khẩu';
      return;
    }
    if (!this.username) {
      this.errorMessage = 'Vui lòng nhập tên tài khoản';
      return;
    }
    if (!this.password) {
      this.errorMessage = 'Vui lòng nhập mật khẩu';
      return;
    }
    if (this.authService.authenticate(this.username!, this.password!)) {
      this.authService.currentUser = this.username;
      this.router.navigate(['']);
      this.reloadPage();
    } else {
      this.errorMessage = 'Tên tài khoản hoặc mật khẩu không đúng';
    }
  }

  reloadPage() {
    window.location.reload();
  }
}
