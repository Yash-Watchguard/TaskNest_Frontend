import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { user } from '../models/user.model';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private router = inject(Router);
  
  user!: user | null;
  openProfile = false;

  constructor(private authservice: AuthService, private route: Router) {}

  ngOnInit() {
    this.user = this.authservice.getCurrentUser();
  }

  logout():void {
    alert('are you sure!');
    localStorage.clear();
    sessionStorage.clear();
    this.authservice.newUser.set(null);
    this.user = null;
    this.router.navigate(['/login']);
  }
  visible: boolean = false;
  onclick():void {
    this.route.navigate(['profile']);
  }
  onclose():void {
    this.visible = false;
  }
}
