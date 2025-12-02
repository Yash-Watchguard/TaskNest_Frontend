import { Component, DestroyRef, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    FloatLabelModule,
    FormsModule,
    RouterLink,
    InputTextModule,
    Button,
    Toast,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService],
})
export class LoginComponent {
  constructor(
    private authservice: AuthService,
    private messageservice: MessageService
  ) {}

  username = '';
  email = '';
  password = '';

  loading = signal(false);
  errormessage = signal('');

  onSubmit(): void {
    this.loading.set(true);
    const login = this.authservice
      .Login('login', {
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: (response) => {
          console.log("hi")
          this.authservice.router.navigate(['dashboard'], {
            replaceUrl: true,
          });
        },
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          this.messageservice.add({
            severity: 'error',
            closable: true,
            summary: 'Login Error',
            detail: 'Invalid Email Password',
          });
        },
      });
    this.authservice.destroref.onDestroy(() => {
      login.unsubscribe();
    });
  }
}
