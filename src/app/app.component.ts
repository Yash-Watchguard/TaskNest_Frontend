import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PopupcomponentComponent } from "./shared/popupcomponent/popupcomponent.component";
import { LoaderComponent } from "./loader/loader.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'TaskNest';
}
