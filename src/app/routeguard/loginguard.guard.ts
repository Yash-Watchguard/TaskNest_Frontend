import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';

export const loginguardGuard: CanActivateFn = (route, state) => {
  const rout=inject(Router)
  const userservice=inject(AuthService)
  const user=userservice.getCurrentUser()
  if(user){
      rout.navigate(['dashboard'])
  }
  return true;
};
