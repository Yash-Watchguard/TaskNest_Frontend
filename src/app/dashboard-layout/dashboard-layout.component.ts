import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';

@Component({
  selector: 'app-dashboard-layout',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
})
export class DashboardLayoutComponent implements OnInit {
  private authservice = inject(AuthService);

  ngOnInit(): void {
    const user = this.authservice.getCurrentUser();
    if (user?.Role === Role.ADMIN) {
      this.authservice.router.navigate(['/dashboard/admin'], {
        replaceUrl: true,
      });
    }
    if (user?.Role === Role.MANAGER) {
      this.authservice.router.navigate(['/dashboard/manager'], {
        replaceUrl: true,
      });
    }
    if (user?.Role === Role.EMPLOYEE) {
      this.authservice.router.navigate(['/dashboard/employee'], {
        replaceUrl: true,
      });
    }
  }
}
