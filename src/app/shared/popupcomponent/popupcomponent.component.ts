import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-popupcomponent',
  imports: [RouterOutlet],
  templateUrl: './popupcomponent.component.html',
  styleUrl: './popupcomponent.component.scss'
})
export class PopupcomponentComponent {
  constructor(private route:Router){

  }
closePopup(){
  this.route.navigate()
}
}
