import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canLoad: [LoginGuard],
    canActivate: [LoginGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canLoad: [LoginGuard],
    canActivate: [LoginGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
