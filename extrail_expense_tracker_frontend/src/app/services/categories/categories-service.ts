import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CategoriesModel,
  CategoryScope,
  CategoryType,
  CreateGlobalCategoryRequest,
  CreateUserCategoryRequest,
} from '../../models/categories.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private baseUrl = 'http://52.197.2.245:8081/categories';

  constructor(private http: HttpClient) {}

  createCategory(category: CategoriesModel): Observable<CategoriesModel> {
    return this.http.post<CategoriesModel>(`${this.baseUrl}/create-category`, category);
  }

  createUserCategory(req: CreateUserCategoryRequest): Observable<CategoriesModel> {
    return this.http.post<CategoriesModel>(`${this.baseUrl}/create-user-category`, req);
  }

  createGlobalCategory(req: CreateGlobalCategoryRequest): Observable<CategoriesModel> {
    return this.http.post<CategoriesModel>(`${this.baseUrl}/create-global-category`, req);
  }

  getCategoryById(categoryId: number): Observable<CategoriesModel> {
    const params = new HttpParams().set('categoryId', categoryId);
    return this.http.get<CategoriesModel>(`${this.baseUrl}/get-category-by-id`, { params });
  }

  getAllCategories(): Observable<CategoriesModel[]> {
    return this.http.get<CategoriesModel[]>(`${this.baseUrl}/get-all-categories`);
  }

  getByScope(scope: CategoryScope): Observable<CategoriesModel[]> {
    const params = new HttpParams().set('scope', scope);
    return this.http.get<CategoriesModel[]>(`${this.baseUrl}/get-by-scope`, { params });
  }

  getByOwner(ownerUserId: number): Observable<CategoriesModel[]> {
    const params = new HttpParams().set('ownerUserId', ownerUserId);
    return this.http.get<CategoriesModel[]>(`${this.baseUrl}/get-by-owner`, { params });
  }

  listForUser(userId: number, type: CategoryType): Observable<CategoriesModel[]> {
    const params = new HttpParams().set('userId', userId).set('type', type);
    return this.http.get<CategoriesModel[]>(`${this.baseUrl}/list-for-user`, { params });
  }

  updateCategory(categoryId: number, update: Partial<CategoriesModel>): Observable<CategoriesModel> {
    const params = new HttpParams().set('categoryId', categoryId);
    return this.http.put<CategoriesModel>(`${this.baseUrl}/update-category`, update, { params });
  }

  renameCategory(actorUserId: number, categoryId: number, newName: string): Observable<CategoriesModel> {
    const params = new HttpParams()
      .set('actorUserId', actorUserId)
      .set('categoryId', categoryId)
      .set('newName', newName);
    return this.http.put<CategoriesModel>(`${this.baseUrl}/rename-category`, null, { params });
  }

  deleteCategoryById(categoryId: number): Observable<void> {
    const params = new HttpParams().set('categoryId', categoryId);
    return this.http.delete<void>(`${this.baseUrl}/delete-category-by-id`, { params });
  }

  deleteCategory(actorUserId: number, categoryId: number): Observable<void> {
    const params = new HttpParams().set('actorUserId', actorUserId).set('categoryId', categoryId);
    return this.http.delete<void>(`${this.baseUrl}/delete-category`, { params });
  }
}
