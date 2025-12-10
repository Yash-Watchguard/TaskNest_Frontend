import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { FloatLabelModule, FloatLabelStyle } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Role, user } from '../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { buffer } from 'rxjs';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-signup',
  imports: [FloatLabelModule, RouterLink, FormsModule,Button,Toast],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  providers:[MessageService]
})
export class SignupComponent {
  private messageservice=inject(MessageService)

  private authservice = inject(AuthService);
  isSignup = this.authservice.signupsignal;
  constructor() {
    effect(() => {
      if (this.isSignup()) {
        this.callLogin();
      }
    });
  }
  loading=signal(false)
  name: string = '';
  email: string = '';
  phonenumber: string = '';
  password: string = '';
  errorMessage: string = '';
  onSubmit() {
    this.loading.set(true)
    this.errorMessage = '';
    const signupsub = this.authservice
      .Signup('signup', {
        name: this.name,
        email: this.email,
        phonenumber: this.phonenumber,
        password: this.password,
      })
      .subscribe({
        next: (response) => {
          this.authservice.signupsignal.set(true);
          console.log(response);
          console.log(response);
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false)
          if (error.status === 409) {
            this.errorMessage = 'User already exists. Please try logging in.';
          } else {
            this.errorMessage =
              'An error occurred during signup. Please try again.';
          }
          this.messageservice.add({
            severity:'error',
            closable:true,
            summary:'Signup Error',
            detail:'Signup Failed'
          })
        },
      });
    this.authservice.destroref.onDestroy(() => {
      signupsub.unsubscribe();
    });
  }

  callLogin():void {
    const loginsub = this.authservice
      .Login('login', {
        email: this.email,
        password: this.password,
      })
      .subscribe((response) => {
        const user = this.authservice.newUser();

       this.authservice.router.navigate(['dashboard'], {
            replaceUrl: true,
          });
      });
    this.authservice.destroref.onDestroy(() => {
      loginsub.unsubscribe();
    });
  }
}
