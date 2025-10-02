import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router} from "@angular/router";
import {  FloatLabelModule } from "primeng/floatlabel";
import { AuthService } from '../services/auth.service';
import { LoginRequest } from '../models/login.model';
import { Role } from '../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { InputTextModule } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';



@Component({
  selector: 'app-login',
  imports: [FloatLabelModule, FormsModule, RouterLink,InputTextModule,Button,Toast],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers:[MessageService]
})
export class LoginComponent {
    private messageservice=inject(MessageService)
    username='s'
    email=''
    password=''
    loading=signal(false)
    errormessage=signal('')
    constructor(private authservice:AuthService){}
    onSubmit(){
      this.loading.set(true)
       const login=this.authservice.Login('login',{
        email:this.email,
        password:this.password
       }
      ).subscribe({
        next:(response)=>{
           const user=this.authservice.newUser()
           if(user?.Role===Role.ADMIN){
            this.authservice.router.navigate(['admindashboard'])
           }else if(user?.Role===Role.MANAGER){
            this.authservice.router.navigate(['managerdashboard'])
           }else{
            this.authservice.router.navigate(['employeeDashboard'])
           }
        },
        error:(err:HttpErrorResponse)=>{
          this.loading.set(false)
          this.messageservice.add({
            severity:'error',
            closable:true,
            summary:'Login Error',
            detail:'Invalid Email Password',
          })
        },
      
      })
      this.authservice.destroref.onDestroy(()=>{
        login.unsubscribe()
      })

    }
}
