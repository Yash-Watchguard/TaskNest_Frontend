import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignupComponent } from "./signup/signup.component";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TaskboxComponent } from "./taskbox/taskbox.component";
import { CommentComponent } from './comment/comment.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TaskboxComponent,CommentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'TaskNest';
}
