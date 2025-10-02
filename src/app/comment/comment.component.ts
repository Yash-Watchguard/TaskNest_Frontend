import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../models/task.model';
import { comment } from '../models/comment.model';
import { CommentService } from '../services/comment.service';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  providers: [DatePipe]
})
export class CommentComponent implements OnChanges{
  @Input() task: Task|null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() commentAdded = new EventEmitter<void>();
  private commentservice=inject(CommentService)
  private comments$!:Observable<comment[]>
  allcomments: comment[] = [];
  newComment = '';
  constructor(private datePipe: DatePipe) {}
   ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.task?.TaskId) {
      this.loadComments();
    }
    this.allcomments=[]
  }

  loadComments(): void {
      this.comments$=this.commentservice.comments$;
      this.commentservice.GetComments(`projects/${334}/tasks/${this.task?.TaskId}/comments`)
      .subscribe({
        next:(response)=>{
          console.log(response)
        },
        error:(err:HttpErrorResponse)=>{
          console.log(err)
        }
      });
      this.comments$.subscribe(comments=>{
        this.allcomments=[...this.allcomments,...comments]
      });
  }

  addComment(): void {
    if (this.newComment.trim()) {
     
      this.commentservice.Addcomment(`projects/:${123}/tasks/${this.task?.TaskId}/comments`,this.newComment).subscribe({
        next:response=>{
          console.log("added")
        },
        error:(res:HttpErrorResponse)=>{
           console.log(res)
        }
      })
       this.newComment = '';
       this.commentAdded.emit();
    }
  }

  clearComment(): void {
    this.newComment = '';
  }

  closeDialog(): void {
    this.close.emit();
    this.allcomments =[];
    this.newComment = '';
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeDialog();
    }
  }
}
