import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  currentUser = '';

  private users = [
    { username: 'admin', password: 'admin' },
    { username: 'user', password: 'user' },
    { username: 'phuc', password: '123' },
  ];

  authenticate(username: string, password: string): boolean {
    const user = this.users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      return (this.isAuthenticated = true);
    }
    return false;
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
    this.isAuthenticated = false;
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

  constructor() {}

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }
}
