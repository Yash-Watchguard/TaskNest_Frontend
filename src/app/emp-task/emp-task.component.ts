import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { TaskboxComponent } from '../taskbox/taskbox.component';
import { UserService } from '../services/user.service';
import { person } from '../models/user.model';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-emp-task',
  imports: [CommonModule],
  templateUrl: './emp-task.component.html',
  styleUrl: './emp-task.component.scss',
})
export class EmpTaskComponent implements OnInit, OnChanges {
  @Input({ required: true }) user!: person | null;
  @Output() closePopup = new EventEmitter<void>();

  tasks: Task[] = [];
  // user: person | null = null;

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.user) {
      this.loadUserTasks();
    }
  }

  ngOnChanges(): void {
    if (this.user) {
      this.loadUserTasks();
    }
  }

  loadUserTasks(): void {
    // Since no GetAllTask, for admin to get all tasks, we can loop through all projects and get their tasks, but to simplify, assume GetTasks('tasks') works if endpoint exists.
    // For now, use GetTasks('tasks') and hope it works.
    this.taskService.GetEmpTask(`employees/${this.user?.Id}/tasks`).subscribe({
      next: (allTasks: Task[]) => {
        this.tasks = allTasks;
      },
      error: (err: any) => {
        console.error('Error loading tasks:', err);
        this.tasks = [];
      },
    });
  }

  close(): void {
    this.closePopup.emit();
  }

  onopencomment(task: Task): void {
    this.router.navigate(['../task'], {
      relativeTo: this.route,
      state: { task: task },
    });
  }
}
