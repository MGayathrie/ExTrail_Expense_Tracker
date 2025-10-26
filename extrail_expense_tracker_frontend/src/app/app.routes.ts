import { Routes } from '@angular/router';
import { Dashboard } from './components/router-outlet/dashboard/dashboard';
import { Accounts } from './components/router-outlet/accounts/accounts';
import { Transactions } from './components/router-outlet/transactions/transactions';
import { Budgets } from './components/router-outlet/budgets/budgets';
import { Categories } from './components/router-outlet/categories/categories';
import { Analysis } from './components/router-outlet/analysis/analysis';
import { Profile } from './components/router-outlet/profile/profile';
import { Authmodule } from './components/router-outlet/authmodule/authmodule';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'login', component: Authmodule },
    { path: 'dashboard', component: Dashboard },
    { path: 'accounts', component: Accounts },
    { path: 'transactions', component: Transactions },
    { path: 'budgets', component: Budgets },
    { path: 'categories', component: Categories },
    { path: 'analysis', component: Analysis },
    { path: 'profile', component: Profile }
];
