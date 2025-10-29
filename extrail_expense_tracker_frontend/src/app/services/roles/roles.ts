import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RolesModel } from '../../models/roles.model';

@Injectable({
  providedIn: 'root'
})
export class Roles {
  private baseUrl = 'http://18.179.152.175:8081/roles';

  constructor(private http: HttpClient) {}

  createRole(role: RolesModel): Observable<RolesModel> {
    return this.http.post<RolesModel>(`${this.baseUrl}/create-role`, role);
  }

  getRoleById(roleId: number): Observable<RolesModel> {
    const params = new HttpParams().set('roleId', roleId);
    return this.http.get<RolesModel>(`${this.baseUrl}/get-role-by-id`, { params });
  }

  getAllRoles(): Observable<RolesModel[]> {
    return this.http.get<RolesModel[]>(`${this.baseUrl}/get-all-roles`);
  }

  updateRole(roleId: number, update: RolesModel): Observable<RolesModel> {
    const params = new HttpParams().set('roleId', roleId);
    return this.http.put<RolesModel>(`${this.baseUrl}/update-role`, update, { params });
  }

  deleteRole(roleId: number): Observable<void> {
    const params = new HttpParams().set('roleId', roleId);
    return this.http.delete<void>(`${this.baseUrl}/delete-role`, { params });
  }

  getRoleByName(roleName: string): Observable<RolesModel> {
    const params = new HttpParams().set('roleName', roleName);
    return this.http.get<RolesModel>(`${this.baseUrl}/get-role-by-name`, { params });
  }

  assignRole(userId: number, roleName: string): Observable<void> {
    const params = new HttpParams().set('userId', userId).set('roleName', roleName);
    return this.http.put<void>(`${this.baseUrl}/assign-role`, null, { params });
  }

  revokeRole(userId: number, roleName: string): Observable<void> {
    const params = new HttpParams().set('userId', userId).set('roleName', roleName);
    return this.http.put<void>(`${this.baseUrl}/revoke-role`, null, { params });
  }
}
