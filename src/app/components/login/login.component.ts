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

  constructor(public authService: AuthService, private router: Router) {}

  onLogin() {
    if (this.authService.isLoggedIn()) {
      // Đã đăng nhập, chuyển hướng đến trang chính
      this.router.navigate(['']);
    } else {
      if (this.authService.authenticate(this.username!, this.password!)) {
        this.authService.currentUser = this.username;
        this.router.navigate(['']);
      } else {
        console.log('Invalid username or password');
      }
    }
  }

  logout() {
    this.authService.logout();
  }
}
