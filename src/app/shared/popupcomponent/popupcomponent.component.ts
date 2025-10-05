import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-popupcomponent',
  imports: [RouterOutlet],
  templateUrl: './popupcomponent.component.html',
  styleUrls: ['./popupcomponent.component.scss'],
})
export class PopupcomponentComponent {
  private router = inject(Router);

  closePopup() {
    this.router.navigate([{ outlets: { popup: null } }]);
  }
}