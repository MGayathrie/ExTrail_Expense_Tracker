import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransactionsModel } from '../../models/transactions.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private baseUrl = 'http://localhost:8080/transactions';

  constructor(private http: HttpClient) {}

  createTransaction(tx: TransactionsModel): Observable<TransactionsModel> {
    return this.http.post<TransactionsModel>(`${this.baseUrl}/create-transaction`, tx);
  }

  getTransactionById(transactionId: number): Observable<TransactionsModel> {
    const params = new HttpParams().set('transactionId', transactionId);
    return this.http.get<TransactionsModel>(`${this.baseUrl}/get-transaction-by-id`, { params });
  }

  getAllTransactions(): Observable<TransactionsModel[]> {
    return this.http.get<TransactionsModel[]>(`${this.baseUrl}/get-all-transactions`);
  }

  getTransactionsByUser(userId: number): Observable<TransactionsModel[]> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<TransactionsModel[]>(`${this.baseUrl}/get-transactions-by-user`, { params });
  }

  getByTransferGroupId(transferGroupId: string): Observable<TransactionsModel[]> {
    const params = new HttpParams().set('transferGroupId', transferGroupId);
    return this.http.get<TransactionsModel[]>(`${this.baseUrl}/get-by-transfer-group-id`, { params });
  }

  listRecent(userId: number, limit = 20): Observable<TransactionsModel[]> {
    const params = new HttpParams().set('userId', userId).set('limit', limit);
    return this.http.get<TransactionsModel[]>(`${this.baseUrl}/list-recent`, { params });
  }

  listByAccount(userId: number, accountId: number): Observable<TransactionsModel[]> {
    const params = new HttpParams().set('userId', userId).set('accountId', accountId);
    return this.http.get<TransactionsModel[]>(`${this.baseUrl}/list-by-account`, { params });
  }

  listByCategory(userId: number, categoryId: number): Observable<TransactionsModel[]> {
    const params = new HttpParams().set('userId', userId).set('categoryId', categoryId);
    return this.http.get<TransactionsModel[]>(`${this.baseUrl}/list-by-category`, { params });
  }

  updateTransaction(transactionId: number, update: Partial<TransactionsModel>): Observable<TransactionsModel> {
    const params = new HttpParams().set('transactionId', transactionId);
    return this.http.put<TransactionsModel>(`${this.baseUrl}/update-transaction`, update, { params });
  }

  deleteTransactionById(transactionId: number): Observable<void> {
    const params = new HttpParams().set('transactionId', transactionId);
    return this.http.delete<void>(`${this.baseUrl}/delete-transaction-by-id`, { params });
  }

  deleteTransaction(userId: number, transactionId: number): Observable<void> {
    const params = new HttpParams().set('userId', userId).set('transactionId', transactionId);
    return this.http.delete<void>(`${this.baseUrl}/delete-transaction`, { params });
  }

  transfer(
    userId: number,
    fromAccountId: number,
    toAccountId: number,
    amount: number,
    dateIso: string,
    note?: string
  ): Observable<void> {
    let params = new HttpParams()
      .set('userId', userId)
      .set('fromAccountId', fromAccountId)
      .set('toAccountId', toAccountId)
      .set('amount', amount)
      .set('date', dateIso);
    if (note) params = params.set('note', note);
    return this.http.post<void>(`${this.baseUrl}/transfer`, null, { params });
  }
}
