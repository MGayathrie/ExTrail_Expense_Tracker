import { Injectable } from "@angular/core";
import { Auth } from "../services/auth/auth";
import { CanActivate, Router } from "@angular/router";

// src/app/guards/admin.guard.ts
@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private authService: Auth, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getUser();
    const isAdmin = user?.roles?.some((r: { roleName: string; }) => r.roleName.toUpperCase() === 'ADMIN');
    
    if (isAdmin) return true;
    
    this.router.navigate(['/dashboard']);
    return false;
  }
}
