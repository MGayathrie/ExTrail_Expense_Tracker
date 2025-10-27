import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Auth } from '../services/auth/auth';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

// export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
//   const auth: Auth = inject(Auth);
//   let token = auth.retrieveToken();
//   if (token != null) {
//     let authReq = req.clone({
//       setHeaders: { Authorization: `Bearer ${token}` },
//     });
//     return next(authReq);
//   }
//   return next(req);
// };

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const router = inject(Router);
  const token = authService.getToken();

  // Clone request and add Authorization header if token exists
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Handle the request and catch errors
  return next(req).pipe(
    catchError((error) => {
      // Handle 401 Unauthorized (token expired or invalid)
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }
      // Handle 403 Forbidden (insufficient permissions)
      if (error.status === 403) {
        console.error('Access denied');
      }
      return throwError(() => error);
    })
  );
};