import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'E-ArgiSell';

  constructor(public authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      // Đã đăng nhập, chuyển hướng đến trang chính
      this.router.navigate(['']);
    }
  }
}
