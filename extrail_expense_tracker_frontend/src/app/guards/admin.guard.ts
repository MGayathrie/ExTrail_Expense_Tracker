import { Injectable } from "@angular/core";
import { Auth } from "../services/auth/auth";
import { CanActivate, Router } from "@angular/router";

// src/app/guards/admin.guard.ts
@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private authService: Auth, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getUser();
    console.log('AdminGuard - User:', user); // DEBUG LOG
    
    if (user && user.roles && Array.isArray(user.roles)) {
      const isAdmin = user.roles.some((role: any) => 
        role.roleName?.toUpperCase() === 'ADMIN'
      );
      
      console.log('AdminGuard - Is Admin?', isAdmin); // DEBUG LOG
      
      if (isAdmin) {
        return true;
      }
    }
    
    console.log('AdminGuard - Redirecting to /dashboard'); // DEBUG LOG
    this.router.navigate(['/dashboard']);
    return false;
  }
}
