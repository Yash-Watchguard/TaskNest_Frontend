import { CanActivateFn, Router } from '@angular/router';
import { Role } from '../models/user.model';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const managerguardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const newuser = authService.getCurrentUser();

  if (newuser && (newuser.Role === Role.ADMIN || newuser.Role === Role.MANAGER)) {
    return true;
  }
  return router.createUrlTree(['accessdenied']);
};
