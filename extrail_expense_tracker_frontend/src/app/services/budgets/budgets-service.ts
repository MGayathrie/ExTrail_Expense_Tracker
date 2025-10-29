import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BudgetsModel } from '../../models/budgets.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetsService {
  private baseUrl = 'http://18.183.241.148:8081/budgets';

  constructor(private http: HttpClient) {}

  addBudget(budget: BudgetsModel): Observable<BudgetsModel> {
    return this.http.post<BudgetsModel>(`${this.baseUrl}/add-budget`, budget);
  }

  getBudgetById(budgetId: number): Observable<BudgetsModel> {
    const params = new HttpParams().set('budgetId', budgetId);
    return this.http.get<BudgetsModel>(`${this.baseUrl}/get-budget-by-id`, { params });
  }

  getAllBudgets(): Observable<BudgetsModel[]> {
    return this.http.get<BudgetsModel[]>(`${this.baseUrl}/get-all-budgets`);
  }

  getBudgetsByUser(userId: number): Observable<BudgetsModel[]> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<BudgetsModel[]>(`${this.baseUrl}/get-budgets-by-user`, { params });
  }

  updateBudget(budgetId: number, update: Partial<BudgetsModel>): Observable<BudgetsModel> {
    const params = new HttpParams().set('budgetId', budgetId);
    return this.http.put<BudgetsModel>(`${this.baseUrl}/update-budget`, update, { params });
  }

  deleteBudget(userId: number, budgetId: number): Observable<void> {
    const params = new HttpParams().set('userId', userId).set('budgetId', budgetId);
    return this.http.delete<void>(`${this.baseUrl}/delete-budget`, { params });
  }
}
