import { Routes } from '@angular/router';
import { Dashboard } from './components/router-outlet/dashboard/dashboard';
import { Accounts } from './components/router-outlet/accounts/accounts';
import { Transactions } from './components/router-outlet/transactions/transactions';
import { Budgets } from './components/router-outlet/budgets/budgets';
import { Categories } from './components/router-outlet/categories/categories';
import { Analysis } from './components/router-outlet/analysis/analysis';
import { Profile } from './components/router-outlet/profile/profile';
import { Authmodule } from './components/router-outlet/authmodule/authmodule';
import { Login } from './components/router-outlet/authmodule/login/login';
import { Register } from './components/router-outlet/authmodule/register/register';
import { AuthGuard } from './guards/auth.guard';
import { AdminLayout } from './components/admin/admin-layout/admin-layout';
import { AdminGuard } from './guards/admin.guard';
import { AdminDashboard } from './components/admin/admin-dashboard/admin-dashboard';
import { AdminUsers } from './components/admin/admin-users/admin-users';
import { AdminCategories } from './components/admin/admin-categories/admin-categories';
import { AdminProfile } from './components/admin/admin-profile/admin-profile';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'logout', component: Authmodule },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'accounts', component: Accounts, canActivate: [AuthGuard] },
  { path: 'transactions', component: Transactions, canActivate: [AuthGuard] },
  { path: 'budgets', component: Budgets, canActivate: [AuthGuard] },
  { path: 'categories', component: Categories, canActivate: [AuthGuard] },
  { path: 'analysis', component: Analysis, canActivate: [AuthGuard] },
  { path: 'profile', component: Profile, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboard },
      { path: 'users', component: AdminUsers },
      { path: 'categories', component: AdminCategories },
      { path: 'profile', component: AdminProfile }
    ]
  }
];
