import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PopupcomponentComponent } from "./shared/popupcomponent/popupcomponent.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PopupcomponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'TaskNest';
}
