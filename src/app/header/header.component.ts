import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { user } from '../models/user.model';
import { DialogModule } from 'primeng/dialog';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-header',
  imports: [Dialog],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  constructor(private authservice:AuthService){}
  private router=inject(Router)
  user!: user|null
  ngOnInit(){
    this.user = this.authservice.getCurrentUser()
  }
logout(){
  alert("are you sure!")
  this.router.navigate(['/login'])
  localStorage.clear()
}
 visible: boolean = false;
    onclick(){
      this.visible=true;
    }
}
