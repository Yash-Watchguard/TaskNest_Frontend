import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';

export const employeeguardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const newuser = authService.getCurrentUser();

  if (newuser && (newuser.Role === Role.EMPLOYEE)) {
    return true;
  }
  return router.navigate(['accessdenied']);
};
