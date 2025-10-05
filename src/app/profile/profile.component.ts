import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { user } from '../models/user.model';
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule} from '@angular/forms';
import { from } from 'rxjs';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-profile',
  imports: [CommonModule,Button,ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      name: [{ value: 'John Doe', disabled: !this.isEditMode }, Validators.required],
      email: [{ value: 'john.doe@example.com', disabled: !this.isEditMode }, [Validators.required, Validators.email]],
      phoneNumber: [{ value: '+91', disabled: !this.isEditMode }, [Validators.required, Validators.pattern(/^\+91[0-9]{10}$/)]],
    });
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.userForm.enable();
    } else {
      this.userForm.disable();
    }
  }

  saveChanges() {
    if (this.userForm.valid) {
      // Use getRawValue() to include disabled controls in the output
      console.log('Updated user data:', this.userForm.getRawValue());
      this.toggleEditMode(); // Exit edit mode after saving
    }
    const user=this.userForm.getRawValue()
    
    
  }

  cancelEdit() {
    // Reset form to its initial values and exit edit mode
    // Note: this.userForm.reset(this.userForm.getRawValue()); would also work
    this.toggleEditMode();
  }
}
