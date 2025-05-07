import { Routes } from '@angular/router';
import { StartsiteComponent } from './main-content/startsite/startsite.component';
import { HomepageComponent } from './main-content/homepage/homepage.component';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { AuthGuard } from '../guards/auth.guard';

export const routes: Routes = [
  {path: '', component: HomepageComponent, canActivate: [AuthGuard]},
  {path: 'startsite', component: StartsiteComponent},
  {path: 'home', component: HomepageComponent, canActivate: [AuthGuard]},

  {path: 'movie/:id', loadComponent: () => import('./main-content/movie/movie.component').then(m => m.MovieComponent), canActivate: [AuthGuard]},

  {path: 'login', component: LoginComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'forget-password', loadComponent: () => import('./auth/forget-password/forget-password.component').then(m => m.ForgetPasswordComponent)},
  {path: 'new-password', loadComponent: () => import('./auth/new-password/new-password.component').then(m => m.NewPasswordComponent)},
  {path: 'email-verify', loadComponent: () => import('./auth/email-verify/email-verify.component').then(m => m.EmailVerifyComponent)},

  {path: 'imprint', loadComponent: () => import('./imprint/imprint/imprint.component').then(m => m.ImprintComponent)},
  {path: 'data-protection', loadComponent: () => import('./imprint/data-protection/data-protection.component').then(m => m.DataProtectionComponent)},
];
