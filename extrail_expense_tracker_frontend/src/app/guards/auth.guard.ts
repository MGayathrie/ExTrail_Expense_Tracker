import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Auth } from '../services/auth/auth';

// export const authGuard: CanActivateFn = () => {
//   const auth = inject(Auth);
//   const router = inject(Router);
//   const token = auth.retrieveToken();
//   if (token) {
//     return true;
//   }
//   router.navigate(['/login']);
//   return false;
// };

// export const authgGuard: CanActivateFn = (route, state) => {
//   return true;
// };

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: Auth, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}