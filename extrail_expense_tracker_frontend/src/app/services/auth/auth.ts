import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserAuthModel } from '../../models/user-auth-model';
import { UserResponseModel } from '../../models/user-response.model';
import { UserModel } from '../../models/user.model';
import { RolesModel } from '../../models/roles.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  // // private baseUrl = 'http://localhost:8080/auth';
  // private userSubject = new BehaviorSubject<UserModel | null>(this.retrieveUserInfo());
  // user$ = this.userSubject.asObservable();

  // // constructor(private http: HttpClient) {}

  // // validate(credentials: UserAuthModel): Observable<UserResponseModel> {
  // //   return this.http.post<UserResponseModel>(`${this.baseUrl}/validate`, credentials);
  // // }

  // isLoggedIn(): boolean {
  //   return false;
  // }

  // // logout(): void {
  // //   this.deleteToken();
  // //   this.deleteUserInfo();
  // //   sessionStorage.clear();
  // // }

  // // Token helpers
  // storeToken(token: string): void {
  //   localStorage.setItem('jwtToken', token);
  // }
  // deleteToken(): void {
  //   localStorage.removeItem('jwtToken');
  // }
  // retrieveToken(): string | null {
  //   return localStorage.getItem('jwtToken');
  // }

  // // User helpers
  // storeUserInfo(user: UserModel): void {
  //   localStorage.setItem('userInfo', JSON.stringify(user));
  //   this.userSubject.next(user);
  // }
  // deleteUserInfo(): void {
  //   localStorage.removeItem('userInfo');
  //   this.userSubject.next(null);
  // }
  // retrieveUserInfo(): UserModel | null {
  //   const data = localStorage.getItem('userInfo');
  //   return data ? JSON.parse(data) as UserModel : null;
  // }

  // // Role helpers
  // // retrieveRole() {
  // //   return this.retrieveUserInfo()?.roles;
  // // }
  // // isAdmin(): boolean {
  // //   const u = this.retrieveUserInfo();
  // //   return !!u?.roles?.find(r => (r as any).roleId === 1);
  // // }
  // // isUser(): boolean {
  // //   const u = this.retrieveUserInfo();
  // //   return !!u?.roles?.find(r => (r as any).roleId === 2);
  // // }
  //   retrieveRole(): RolesModel[] | undefined {
  //     let user = this.retrieveUserInfo();
  //     return user?.roles;
  //   // return this.retrieveUserInfo()?.roles;
  // }
  // isAdmin(): boolean {
  //   let user=this .retrieveUserInfo();
  //   // const u = this.retrieveUserInfo();
  //   // return !!u?.roles?.find(r => (r as any).roleId === 1);
  //   if(user?.roles.find((roles) => roles.roleId === 1)){
  //     return true;
  //   }
  //   return false;
  // }

  // isUser(): boolean {
  //   const user = this.retrieveUserInfo();
  //   if(user?.roles.find((roles) => roles.roleId === 2)){
  //     return true;
  //   }
  //   return false;  }
private apiUrl = 'http://3.114.12.199:8081/auth';
  private tokenKey = 'jwt_token';
  private userKey = 'current_user';
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // Register new user
  register(username: string, email: string, password: string, phone?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      userName: username,
      email: email,
      passwordHash: password,
      phone: phone || '',
      roles: [] // Will be set to USER by default in backend
    });
  }

  // Login user
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {
      userName: username,
      passwordHash: password
    }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.setToken(response.token);
          this.setUser(response.user);
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  // Logout user
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  // Token management
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  // User management
  private setUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // src/app/services/auth/auth.ts - ADD THESE METHODS

// Check if current user is admin
isAdmin(): boolean {
  const user = this.getUser();
  if (!user || !user.roles) return false;
  
  return user.roles.some((role: any) => 
    role.roleName && role.roleName.toUpperCase() === 'ADMIN'
  );
}

// Get user role names as array
getUserRoles(): string[] {
  const user = this.getUser();
  if (!user || !user.roles) return [];
  
  return user.roles.map((role: any) => role.roleName);
}

}
