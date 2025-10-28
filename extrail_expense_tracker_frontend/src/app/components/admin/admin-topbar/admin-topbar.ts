import { Component } from '@angular/core';
import { Auth } from '../../../services/auth/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-topbar',
  imports: [CommonModule],
  templateUrl: './admin-topbar.html',
  styleUrl: './admin-topbar.css',
})
export class AdminTopbar {
  userName: string = '';

  constructor(private router: Router, private auth: Auth) {
    const user = this.auth.getUser();
    this.userName = user?.userName || 'Admin';
  }

  goToProfile(): void {
    this.router.navigate(['/admin/profile']);
  }
}
