import { Component } from '@angular/core';
import { Auth } from '../../../services/auth/auth';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css',
})
export class AdminSidebar {
  constructor(private router: Router, private auth: Auth) {}

  logout(): void {
    this.auth.logout();
  }
}
