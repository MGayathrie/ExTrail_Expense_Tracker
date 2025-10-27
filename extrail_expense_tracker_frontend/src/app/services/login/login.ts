import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserAuthModel } from '../../models/user-auth-model';
import { UserResponseModel } from '../../models/user-response.model';

@Injectable({
  providedIn: 'root'
})
export class Login {
  constructor(private httpclient: HttpClient) {}
  // private baseUrl = 'http://localhost:8080/auth';
  baseUrl: string = "http://localhost:8080/auth";

  // authenticate(credentials: UserAuthModel): Observable<UserResponseModel> {
  //   return this.httpclient.post<UserResponseModel>(`${this.baseUrl}/validate`, credentials);
  // }

  validateUser(User: UserAuthModel): Observable<UserResponseModel> {
    return this.httpclient.post<UserResponseModel>(`${this.baseUrl}/validate`, User);
  }
}
