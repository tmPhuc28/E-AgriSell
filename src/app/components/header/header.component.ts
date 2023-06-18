import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  searchKeyword: string = '';
  currentUser: string = '';
  menuItems: HTMLElement | null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.menuItems = null;
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser()?.fullName || '';
    this.menuItems = document.getElementById('MenuItems');
    if (this.menuItems) {
      this.menuItems.style.maxHeight = '0px';
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Bạn có chắc muốn đăng xuất ?',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  searchProducts(): void {
    if (this.searchKeyword.trim() !== '') {
      this.router.navigate(['/products'], {
        queryParams: { search: this.searchKeyword },
      });
      this.searchKeyword = ''; // Reset the search term after navigating
    }
  }

  menutoggle(): void {
    if (this.menuItems) {
      if (this.menuItems.style.maxHeight === '0px') {
        this.menuItems.style.maxHeight = '300px';
      } else {
        this.menuItems.style.maxHeight = '0px';
      }
    }
  }
}
