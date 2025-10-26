import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserAuthModel } from '../../models/user-auth-model';
import { UserResponseModel } from '../../models/user-response.model';

@Injectable({
  providedIn: 'root'
})
export class Login {
  private baseUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  authenticate(credentials: UserAuthModel): Observable<UserResponseModel> {
    return this.http.post<UserResponseModel>(`${this.baseUrl}/validate`, credentials);
  }
}
