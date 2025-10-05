import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-summary-card',
  imports: [],
  templateUrl: './summary-card.component.html',
  styleUrl: './summary-card.component.scss'
})
export class SummaryCardComponent {
   @Input({required:true}) totallength!:number;
   @Input({required:true}) iconLink!:string;
   @Input({required:true}) titel!:string
   @Input({required:true}) iconcolor!:string;
}
