import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserCreateModel, UserModel } from '../../models/user.model';
import { UserPasswordUpdateModel } from '../../models/user-password-update.model';

@Injectable({
  providedIn: 'root'
})
export class Users {
  private baseUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.baseUrl}/get-all-users`);
  }

  getExistingUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.baseUrl}/get-existing-users`);
  }

  getUserById(userId: number): Observable<UserModel> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<UserModel>(`${this.baseUrl}/get-user-by-id`, { params });
  }

  getUserByUserName(userName: string): Observable<UserModel> {
    const params = new HttpParams().set('userName', userName);
    return this.http.get<UserModel>(`${this.baseUrl}/get-user-by-username`, { params });
  }

  addUser(newUser: UserCreateModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.baseUrl}/add-user`, newUser);
  }

  updateUser(updatedUser: Partial<UserCreateModel> & { userId: number }): Observable<UserModel> {
    return this.http.put<UserModel>(`${this.baseUrl}/update-user`, updatedUser);
  }

  updatePassword(updatedPassword: UserPasswordUpdateModel): Observable<UserModel> {
    return this.http.put<UserModel>(`${this.baseUrl}/update-password`, updatedPassword);
  }

  deleteUser(userId: number): Observable<void> {
    const params = new HttpParams().set('userId', userId);
    return this.http.delete<void>(`${this.baseUrl}/delete-user`, { params });
  }

  getUserByRole(roleName: string): Observable<UserModel[]> {
    const params = new HttpParams().set('roleName', roleName);
    return this.http.get<UserModel[]>(`${this.baseUrl}/get-user-by-role`, { params });
  }
}
