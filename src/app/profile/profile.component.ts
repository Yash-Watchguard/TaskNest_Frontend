import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { person, UpdateProfileDetails, user } from '../models/user.model';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  NgForm,
} from '@angular/forms';
import { from } from 'rxjs';
import { Button } from 'primeng/button';
import { UserService } from '../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  OpenProfileBar = true;
  OpenEditMenu = false;

  user = signal<person>({
    Id: '',
    Name: '',
    Email: '',
    PhoneNumber: '',
    Role: '',
  });

  updatedDetails!: UpdateProfileDetails;
  constructor(private userservice: UserService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId') as string;
    this.userservice.GetProfile(userId).subscribe({
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
    this.user = this.userservice.userProfile;
    this.updatedDetails = {
      name: this.user().Name,
      phoneNumber: this.user().PhoneNumber,
      email: this.user().Email,
    };
  }

  toggleEditMode(): void {
    this.OpenProfileBar = false;
    this.OpenEditMenu = true;
  }

  toggleProfileMode(form: NgForm): void {
    this.OpenProfileBar = true;
    this.OpenEditMenu = false;
    form.resetForm();
  }

  saveChanges(): void {
    this.userservice
      .updateUserProfile(this.user().Id, this.updatedDetails)
      .subscribe({
        next: () => {
          this.userservice.GetProfile(this.user().Id).subscribe({
            error: (err: HttpErrorResponse) => {
              console.log(err);
            },
          });
        },
      });
  }

  cancelEdit() {}
}
