import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register').then(m => m.RegisterComponent),
  },
  {
    path: 'tours',
    loadComponent: () => import('./tours/tours').then(m => m.ToursComponent),
    canActivate: [authGuard],
  },
  {
    path: 'tours/:id',
    loadComponent: () => import('./tour-detail/tour-detail').then(m => m.TourDetailComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '/login' },
];