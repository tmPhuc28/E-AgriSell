import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { USERS } from '../data/users.data';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = '';

  private users: User[] = USERS;

  authenticate(username: string, password: string): boolean {
    const user = this.users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
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
}
