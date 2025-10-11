import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { Project } from '../models/project.model';
import { CommonModule, DatePipe } from '@angular/common';
import { ProjectService } from '../services/project.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Role, user } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';
import { Toast } from "primeng/toast";


@Component({
  selector: 'app-projectbox',
  imports: [DatePipe, CommonModule, Toast],
  templateUrl: './projectbox.component.html',
  styleUrl: './projectbox.component.scss',
  providers:[MessageService]
})
export class ProjectboxComponent implements OnInit {
  user!:user|null
  roles=Role
  @Input({required:true})Project!:Project;
  @Output()Addtasksignal=new EventEmitter();
  @Output() loadTasksignal=new EventEmitter<string>();
  @Output() projectDeleted=new EventEmitter<boolean>();

  projectIdForAddTask!:string|undefined;
  projectCompletionpercentage!:number
  totalTask!:number
  constructor(private projectservice:ProjectService ,private router:Router,private userservice:AuthService){}
  ngOnInit(){
     this.user=this.userservice.getCurrentUser();

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
      this.loadTasksignal.emit(this.Project?.ProjectId)
  }
  AddTask(){
    this.Addtasksignal.emit(this.Project?.ProjectId)
  }
  deleteproject(){
     this.projectservice.DeleteProject(this.Project?.ProjectId).subscribe({
      next:()=>{
        this.projectDeleted.emit(true)
        this.projectservice.GetAllProject().subscribe(()=>{
          error:()=>{console.log("error")}
        });
      },
      error:()=>{
        this.projectDeleted.emit(false);
      }
     });
  }
}
