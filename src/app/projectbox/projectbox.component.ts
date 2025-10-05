import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Project } from '../models/project.model';
import { DatePipe } from '@angular/common';
import { ProjectService } from '../services/project.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-projectbox',
  imports: [DatePipe],
  templateUrl: './projectbox.component.html',
  styleUrl: './projectbox.component.scss'
})
export class ProjectboxComponent implements OnInit {
  @Input({required:true})Project!:Project|null

  @Output() loadTasksignal=new EventEmitter<string>()
  projectCompletionpercentage!:string
  totalTask!:number
  constructor(private projectservice:ProjectService){}
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
}
