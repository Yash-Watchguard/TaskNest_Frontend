import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Project } from '../models/project.model';
import { CommonModule, DatePipe } from '@angular/common';
import { ProjectService } from '../services/project.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AddtaskComponent } from "../addtask/addtask.component";


@Component({
  selector: 'app-projectbox',
  imports: [DatePipe, AddtaskComponent,CommonModule],
  templateUrl: './projectbox.component.html',
  styleUrl: './projectbox.component.scss'
})
export class ProjectboxComponent implements OnInit {
  @Input({required:true})Project!:Project|null;
  @Output()Addtasksignal=new EventEmitter()
  @Output() loadTasksignal=new EventEmitter<string>()
  projectIdForAddTask!:string|undefined;
  projectCompletionpercentage!:number
  totalTask!:number
  constructor(private projectservice:ProjectService ,private router:Router){}
  ngOnInit(){
     this.projectservice.GetProjectStatuas(`projects/status/${this.Project?.ProjectId}`).subscribe({
      next:(response)=>{
        this.projectCompletionpercentage=response.data.completionPercentage;
        this.totalTask=response.data.totalTasks
      },
      error:(err:HttpErrorResponse)=>{
         console.log("error in getting the project completion percentage")
      }
     });
  }

  loadTasks(){
    console.log('clicked')
      this.loadTasksignal.emit(this.Project?.ProjectId)
  }
  

  AddTask(){
    this.Addtasksignal.emit(this.Project?.ProjectId)
  }
}
