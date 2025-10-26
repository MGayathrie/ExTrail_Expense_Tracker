import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserAuthModel } from '../../models/user-auth-model';
import { UserResponseModel } from '../../models/user-response.model';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private baseUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  validate(credentials: UserAuthModel): Observable<UserResponseModel> {
    return this.http.post<UserResponseModel>(`${this.baseUrl}/validate`, credentials);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
  }
}
