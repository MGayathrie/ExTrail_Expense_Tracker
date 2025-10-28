import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../../models/user.model';
import { Users } from '../../../services/users/users';
import { Auth } from '../../../services/auth/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit{
  user: UserModel | null = null;
  isLoading = true;
  showDeactivateModal = false;
  isDeactivating = false;
  errorMessage = '';

  constructor(
    private usersService: Users,
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getUser();
    if (currentUser?.userId) {
      this.loadUserProfile(currentUser.userId);
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadUserProfile(userId: number): void {
    this.isLoading = true;
    this.usersService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading user profile:', err);
        this.errorMessage = 'Failed to load profile';
        this.isLoading = false;
      }
    });
  }

  openDeactivateModal(): void {
    this.showDeactivateModal = true;
  }

  closeDeactivateModal(): void {
    this.showDeactivateModal = false;
  }

  confirmDeactivate(): void {
    if (!this.user?.userId) return;

    this.isDeactivating = true;
    this.errorMessage = '';

    this.usersService.deleteUser(this.user.userId).subscribe({
      next: () => {
        this.isDeactivating = false;
        this.showDeactivateModal = false;
        
        // Show success message
        alert('Your account has been deactivated successfully.');
        
        // Logout and redirect to login
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isDeactivating = false;
        this.errorMessage = 'Failed to deactivate account. Please try again.';
        console.error('Error deactivating account:', err);
      }
    });
  }

  getUserRoles(): string {
    return this.user?.roles.map(r => r.roleName).join(', ') || 'No roles';
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  onBackgroundClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeDeactivateModal();
    }
  }
}
