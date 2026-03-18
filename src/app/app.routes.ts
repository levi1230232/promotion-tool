import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { PromotionList } from './component/promotion-list/promotion-list';
import { VoucherList } from './component/voucher-list/voucher-list';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: '',
    component: Dashboard,
    canActivate: [authGuard],
    children: [
      { path: 'promotions', component: PromotionList },
      { path: 'vouchers', component: VoucherList },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
