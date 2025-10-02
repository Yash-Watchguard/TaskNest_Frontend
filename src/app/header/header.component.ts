import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private router=inject(Router)
logout(){
  alert("are you sure!")
  this.router.navigate(['/login'])
  localStorage.clear()
}
}
