import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { user } from '../models/user.model';
import { ProfileComponent } from "../profile/profile.component";
import { ConfirmDialog } from "primeng/confirmdialog";
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-header',
  imports: [ProfileComponent, ConfirmDialog],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers:[ConfirmationService,MessageService]
})
export class HeaderComponent implements OnInit {
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService)

  user!: user | null;

  openProfile = false;
  visible = false;

  @Output() loading = new EventEmitter<boolean>();

  constructor(private authservice: AuthService, private route: Router) {}

  ngOnInit(): void {
    this.user = this.authservice.getCurrentUser();
  }

  logout(): void {
    this.confirmationService.confirm({
    header: 'Confirm Logout',
message: 'Do you really want to log out from your account?',
      accept: () => {
        
            localStorage.clear();
    sessionStorage.clear();
    this.authservice.newUser.set(null);
    this.user = null;
    this.router.navigate(['/login']);
      }
    });
    
  }

  onclick(): void {
    this.loading.emit(true);
    
      this.loading.emit(false);
      this.route.navigate(['profile']);
    
  }

  onclose(): void {
    this.visible = false;
  }
}
