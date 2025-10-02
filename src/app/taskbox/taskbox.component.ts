import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task, TaskStatus } from '../models/task.model';
import { NgClass, NgIf, DatePipe } from '@angular/common';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-taskbox',
  imports: [NgClass, NgIf, DatePipe],
  templateUrl: './taskbox.component.html',
  styleUrl: './taskbox.component.scss'
})
export class TaskboxComponent {
  @Input() task!: Task;
  TaskStatus = TaskStatus;

  @Output() statusChange = new EventEmitter<{ taskId: string; taskStatus: TaskStatus }>();
  @Output() openComments = new EventEmitter<Task>();

  isOverdue(deadline: Date): boolean {
    return new Date(deadline) < new Date();
  }

  onStart() {
    this.statusChange.emit({ taskId: this.task.TaskId, taskStatus: TaskStatus.InProgress });
  }

  onComplete() {
    this.statusChange.emit({ taskId: this.task.TaskId, taskStatus: TaskStatus.Done });
  }
  opencomment(){
    this.openComments.emit(this.task)
  }

}
