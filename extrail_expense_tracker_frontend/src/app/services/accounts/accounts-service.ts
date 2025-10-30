import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountsModel, AccountType } from '../../models/accounts.model';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private baseUrl = 'http://52.197.2.245:8081/accounts';

  constructor(private http: HttpClient) {}

// src/app/services/accounts/accounts.service.ts

createAccount(account: AccountsModel): Observable<AccountsModel> {
  // Change from 'add-account' to 'create-account'
  return this.http.post<AccountsModel>(`${this.baseUrl}/create-account`, account);
}


  getAccountById(accountId: number): Observable<AccountsModel> {
    const params = new HttpParams().set('accountId', accountId);
    return this.http.get<AccountsModel>(`${this.baseUrl}/get-account-by-id`, { params });
  }

  getAllAccounts(): Observable<AccountsModel[]> {
    return this.http.get<AccountsModel[]>(`${this.baseUrl}/get-all-accounts`);
  }

  getAccountsByUser(userId: number): Observable<AccountsModel[]> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<AccountsModel[]>(`${this.baseUrl}/get-accounts-by-user`, { params });
  }

  listAccountsByType(userId: number, type: AccountType): Observable<AccountsModel[]> {
    const params = new HttpParams().set('userId', userId).set('type', type);
    return this.http.get<AccountsModel[]>(`${this.baseUrl}/list-accounts-by-type`, { params });
  }

  getAccount(userId: number, accountId: number): Observable<AccountsModel> {
    const params = new HttpParams().set('userId', userId).set('accountId', accountId);
    return this.http.get<AccountsModel>(`${this.baseUrl}/get-account`, { params });
  }

  updateAccount(accountId: number, update: Partial<AccountsModel>): Observable<AccountsModel> {
    const params = new HttpParams().set('accountId', accountId);
    return this.http.put<AccountsModel>(`${this.baseUrl}/update-account`, update, { params });
  }

  deleteAccountById(accountId: number): Observable<void> {
    const params = new HttpParams().set('accountId', accountId);
    return this.http.delete<void>(`${this.baseUrl}/delete-account-by-id`, { params });
  }

  deleteAccount(userId: number, accountId: number): Observable<void> {
    const params = new HttpParams().set('userId', userId).set('accountId', accountId);
    return this.http.delete<void>(`${this.baseUrl}/delete-account`, { params });
  }

  getBalance(userId: number, accountId: number): Observable<number> {
    const params = new HttpParams().set('userId', userId).set('accountId', accountId);
    return this.http.get<number>(`${this.baseUrl}/get-balance`, { params });
  }
}
