import { Component, inject, OnChanges, OnInit, OnDestroy, SimpleChange, SimpleChanges } from '@angular/core';
import { Task, TaskStatus } from '../models/task.model';
import { Router } from '@angular/router';
import { CommonModule, DatePipe, NgClass } from "@angular/common";
import { CommentService } from '../services/comment.service';
import { Observable, Subscription } from 'rxjs';
import { comment } from '../models/comment.model';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-task-details',
  standalone:true,
  imports: [DatePipe,FormsModule,CommonModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss'
})
export class TaskDetailsComponent implements OnInit, OnDestroy{
    task!:Task;
    taskstatus=TaskStatus
   constructor(private router:Router){
    const navigation =this.router.getCurrentNavigation();
       const state=navigation?.extras.state as {task:Task};
       if(state?.task){
        this.task=state.task
       }
   }
   private commentservice=inject(CommentService)
   private comments$!:Observable<comment[]>
   allcomments:comment[]=[];
   newComment='';
   private commentSubscription?: Subscription;
   ngOnInit(){
     this.allcomments = [];
     this.loadComments()
   }

  loadComments(): void {
      this.comments$=this.commentservice.comments$;
      this.commentservice.GetComments(`projects/${this.task.ProjectId}/tasks/${this.task?.TaskId}/comments`)
      .subscribe({
        next:(response)=>{
          console.log(response)
        },
        error:(err:HttpErrorResponse)=>{
          console.log(err)
        }
      });
      if (this.commentSubscription) {
        this.commentSubscription.unsubscribe();
      }
      this.commentSubscription = this.comments$.subscribe(comments=>{
        this.allcomments = comments;
      });
  }

  addComment(): void {
    if (this.newComment.trim()) {
     
      this.commentservice.Addcomment(`projects/${this.task.ProjectId}/tasks/${this.task?.TaskId}/comments`,this.newComment).subscribe({
        next:response=>{
          console.log("added")
        },
        error:(res:HttpErrorResponse)=>{
           console.log(res)
        }
      })
       this.newComment = '';
    }
  }

  clearComment(): void {
    this.newComment = '';
  }

  ngOnDestroy(): void {
    if (this.commentSubscription) {
      this.commentSubscription.unsubscribe();
    }
  }

  //  ngOnInit(): void {
  //    const stored = localStorage.getItem('selectedTask');
  //    if (stored) {
  //      this.task = JSON.parse(stored);
  //    } else {

  //    }
  //  }
}

