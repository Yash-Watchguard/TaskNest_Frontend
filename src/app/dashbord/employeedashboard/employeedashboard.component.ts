import { Component, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';

import { Observable } from 'rxjs';

import { Task, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskboxComponent } from '../../taskbox/taskbox.component';
import { CommentComponent } from '../../comment/comment.component';
import { SummaryCardComponent } from '../../shared/summary-card/summary-card.component';

@Component({
  selector: 'app-employeedashboard',
  imports: [
    TaskboxComponent,
    NgForOf,
    CommentComponent,
    NgIf,
  ],
  templateUrl: './employeedashboard.component.html',
  styleUrls: ['./employeedashboard.component.scss'],
})
export class EmployeedashboardComponent implements OnInit {
  userId: string | null = localStorage.getItem('userId');
  private tasks$!: Observable<Task[]>;
  todo: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];

  selectedTask: Task | null = null;

  showComments = false;

  constructor(
    private taskservice: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const userstring = localStorage.getItem('user');
    const user = userstring ? JSON.parse(userstring) : null;
    this.tasks$ = this.taskservice.tasks$;
    const userId = localStorage.getItem('userId');
    this.taskservice.GetTasks(`employees/${userId}/tasks`).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
    this.tasks$.subscribe((task) => {
      this.todo = task.filter((t) => t.TaskStatus === TaskStatus.Pending);
      this.inProgress = task.filter(
        (t) => t.TaskStatus === TaskStatus.InProgress
      );
      this.done = task.filter((t) => t.TaskStatus === TaskStatus.Done);
    });
  }

  onclickupdate(status: string):void {}

  onStatusChange(event: { taskId: string; taskStatus: TaskStatus }):void {
    const { taskId, taskStatus } = event;
    const taskstattus =
      taskStatus === TaskStatus.Done
        ? 'done'
        : taskStatus == TaskStatus.InProgress
        ? 'in progress'
        : 'pending';
    this.taskservice
      .UpdateStatus(`projects/${this.userId}/tasks/${taskId}`, taskstattus)
      .subscribe({
        next: () => {
          console.log('task updated success');
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
  }
  onopencomment(task: Task):void {
    //  this.showComments=true
    //  this.selectedTask=task
    this.router.navigate(['../task'], {
      relativeTo: this.route,
      state: { task: task },
    });
  }
  closecommentbox():void {
    this.showComments = false;
    this.selectedTask = null;
  }
}
