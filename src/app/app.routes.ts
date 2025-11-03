import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AppComponent } from './app.component';
import { EmployeedashboardComponent } from './dashbord/employeedashboard/employeedashboard.component';
import { employeeguardGuard } from './routeguard/employeeguard.guard';
import { PageNotfoundComponent } from './page-notfound/page-notfound.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { ManagerDashboardComponent } from './dashbord/manager-dashboard/manager-dashboard.component';
import { managerguardGuard } from './routeguard/managerguard.guard';
import { adminguardGuard } from './routeguard/adminguard.guard';
import { AdminDashboardComponent } from './dashbord/admin-dashboard/admin-dashboard.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { loginguardGuard } from './routeguard/loginguard.guard';
import { PopupcomponentComponent } from './shared/popupcomponent/popupcomponent.component';
import { WildcardComponent } from './wildcard/wildcard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/signup',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../app/login/login.component').then((m) => m.LoginComponent),
    canActivate: [loginguardGuard],
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('../app/signup/signup.component').then((m) => m.SignupComponent),
    canActivate: [loginguardGuard],
  },
  {
    path: 'accessdenied',
    component: AccessDeniedComponent,
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,

    children: [
      {
        path: 'manager',
        loadComponent: () =>
          import(
            '../app/dashbord/manager-dashboard/manager-dashboard.component'
          ).then((m) => m.ManagerDashboardComponent),
        canActivate: [managerguardGuard],
      },
      {
        path: 'employee',
        loadComponent: () =>
          import(
            '../app/dashbord/employeedashboard/employeedashboard.component'
          ).then((m) => m.EmployeedashboardComponent),
        canActivate: [employeeguardGuard],
      },
      {
        path: 'admin',
        loadComponent: () =>
          import(
            '../app/dashbord/admin-dashboard/admin-dashboard.component'
          ).then((m) => m.AdminDashboardComponent),
        canActivate: [adminguardGuard],
      },
      {
        path: 'task',
        loadComponent: () =>
          import('../app/task-details/task-details.component').then(
            (m) => m.TaskDetailsComponent
          ),
      },
    ],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('../app/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },
  {
    path:'**',
    component:WildcardComponent
  }
];
