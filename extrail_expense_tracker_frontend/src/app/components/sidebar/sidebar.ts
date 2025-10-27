import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth/auth';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  constructor(private router: Router, private auth: Auth) {}
  // logout() {
  //   // Example: Remove tokens from localStorage/sessionStorage
  //   localStorage.removeItem('token');
  //   sessionStorage.clear();
  //   // Add any service logout logic (e.g., clear auth state/caches)
  //   this.router.navigate(['/login']);
  // }

   logout() {
    this.auth.logout(); // This will clear token and redirect to login
  }
}
