import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  /**
   * Creates an instance of NavbarComponent.
   * @param router - Router for navigation
   * @param snackBar - Service for displaying notifications
   */
  constructor(public router: Router, public snackBar: MatSnackBar) {}

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  ngOnInit(): void {}

  /**
   * Navigates to the movies page.
   */
  public openMovieCard(): void {
    this.router.navigate(['movies']);
  }

  /**
   * Navigates to the profile page.
   */
  public openProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * Logs out the user.
   */
  public logoutUser(): void {
    localStorage.setItem('user', '');
    localStorage.setItem('token', '');
    this.router.navigate(['welcome']);
    this.snackBar.open('User logout successful', 'OK', {
      duration: 2000,
    });
  }
}
