import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  username = '';
  email = '';
  password = '';
  fullName = '';
  errorMessage: string = '';

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {}
  onRegister() {
    if (!this.username || !this.email || !this.password || !this.fullName) {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin';
      return;
    }

    const user: User = {
      username: this.username,
      email: this.email,
      password: this.password,
      fullName: this.fullName,
    };

    if (this.authService.register(user)) {
      this.clearForm();
    } else {
      this.errorMessage = 'Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.';
    }
    this.router.navigate(['/login']);
  }
  clearForm() {
    this.username = '';
    this.email = '';
    this.password = '';
    this.fullName = '';
    this.errorMessage = '';
  }
}
