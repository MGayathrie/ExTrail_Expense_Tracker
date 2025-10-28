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
import { Layout } from './components/layout/layout';

export const routes: Routes = [
  // Default redirect
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Auth routes (no layout)
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'logout', component: Authmodule },
  
  // User routes (wrapped in LayoutComponent)
  {
    path: '',
    component: Layout,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'accounts', component: Accounts },
      { path: 'transactions', component: Transactions },
      { path: 'budgets', component: Budgets },
      { path: 'categories', component: Categories },
      { path: 'analysis', component: Analysis },
      { path: 'profile', component: Profile }
    ]
  },
  
  // Admin routes (wrapped in AdminLayout)
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
  },
  
  // Wildcard redirect
  { path: '**', redirectTo: '/login' }
];
