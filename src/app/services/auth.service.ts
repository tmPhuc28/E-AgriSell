import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { USERS } from '../data/users.data';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = '';
  UserRegister = '';

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 1500, // Thời gian hiển thị (milliseconds)
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  private users: User[] = USERS;

  authenticate(username: string, password: string): boolean {
    let user: User | undefined;
    // Kiểm tra trong danh sách người dùng
    user = this.users.find(
      (u) => u.username === username && u.password === password
    );
    // Nếu không tìm thấy trong danh sách, kiểm tra trong sessionStorage
    if (!user) {
      const userRegisterStr = sessionStorage.getItem('UserRegister');
      if (userRegisterStr !== null) {
        const userRegister: User = JSON.parse(userRegisterStr);
        if (
          userRegister.username === username &&
          userRegister.password === password
        ) {
          user = userRegister;
        }
      }
    }
    if (user) {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      this.openSnackBar('Xin chào ' + user.fullName, 'Đóng');
      return true;
    }
    return false;
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
    this.openSnackBar('Đã đăng xuất', 'Đóng');
  }

  getCurrentUser() {
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr !== null) {
      return JSON.parse(userStr);
    } else {
      return null;
    }
  }

  isLoggedIn() {
    return !!sessionStorage.getItem('currentUser');
  }

  register(user: User): boolean {
    const existingUser = this.users.find((u) => u.username === user.username);
    if (existingUser) {
      return false; // Tên đăng nhập đã tồn tại
    }

    this.users.push(user);
    sessionStorage.setItem('UserRegister', JSON.stringify(user));
    this.openSnackBar('Đăng nhập thành công', 'Đóng');
    return true; // Đăng ký thành công
  }
}
