import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { LoginRequest, LoginResponse } from '../models/login.model';

import { HttpClient } from '@angular/common/http';
import { Header } from 'primeng/api';
import { catchError, tap, throwError } from 'rxjs';
import { signupresponse, signupuserdto } from '../models/signup.model';
import { Role, user } from '../models/user.model';
import { jwt } from '../models/jwt.model';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
   router=inject(Router)
   destroref=inject(DestroyRef)
  signupsignal=signal<boolean>(false)
  HttpClient = inject(HttpClient);
  newUser=signal<user|null>(null)
  Signup(url: string, UserDetails: signupuserdto) {
    return this.HttpClient.post<signupresponse>('signup', UserDetails);
  }

  Login(url:string,userDetails:LoginRequest){
      return this.HttpClient.post<LoginResponse>(url,{
         name:userDetails.name,
         email:userDetails.email,
         password:userDetails.password
      }).pipe(tap(response=>{
          try{
            const user =this.jwtDecoder(response.data.token,response.data.userId,userDetails)
         this.newUser.set(user)
         localStorage.setItem('user',JSON.stringify(user))
         localStorage.setItem('token',response.data.token)
          }catch(e){
             console.log(e)
          }
      }
      ))
  }

  private jwtDecoder(token:string,id:string,userDetails:LoginRequest):user{
     const decode=jwtDecode<jwt>(token)
     return {
      Id:decode.userId,
      Name:userDetails.name,
      Email:userDetails.email,
      Role:decode.role == 0?Role.ADMIN:decode.role==1?Role.MANAGER:Role.EMPLOYEE
     }
  }

  getCurrentUser(): user | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }
}
