import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserModel } from '../../../models/user.model';
import { Users } from '../../../services/users/users';

@Component({
  selector: 'app-admin-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers implements OnInit{
users: UserModel[] = [];
  filteredUsers: UserModel[] = [];
  selectedUser: UserModel | null = null;
  showUserModal = false;
  isLoading = true;
  searchTerm = '';
  filterStatus: 'all' | 'active' | 'deactivated' = 'all';

  constructor(private usersService: Users) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.usersService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.users];

    // Filter by status
    if (this.filterStatus === 'active') {
      filtered = filtered.filter(u => !u.deactivated);
    } else if (this.filterStatus === 'deactivated') {
      filtered = filtered.filter(u => u.deactivated);
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(u =>
        u.userName.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.phone.toLowerCase().includes(term)
      );
    }

    this.filteredUsers = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  viewUserDetails(user: UserModel): void {
    this.selectedUser = user;
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.selectedUser = null;
  }

  deactivateUser(userId: number): void {
    if (confirm('Are you sure you want to deactivate this user?')) {
      this.usersService.deleteUser(userId).subscribe({
        next: () => {
          this.loadUsers();
          this.closeUserModal();
        },
        error: (err) => {
          console.error('Error deactivating user:', err);
          alert('Failed to deactivate user. Please try again.');
        }
      });
    }
  }

  reactivateUser(userId: number): void {
  if (!confirm('Are you sure you want to reactivate this user account?')) {
    return;
  }

  this.usersService.reactivateUser(userId).subscribe({
    next: () => {
      alert('User account reactivated successfully!');
      this.loadUsers();
      this.closeUserModal();
    },
    error: (err) => {
      console.error('Error reactivating user:', err);
      alert('Failed to reactivate user. Please try again.');
    }
  });
}

  getUserRoles(user: UserModel): string {
    return user.roles.map(r => r.roleName).join(', ');
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  onBackgroundClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeUserModal();
    }
  }

}
