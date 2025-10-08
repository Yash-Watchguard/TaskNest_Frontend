import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SummaryCardComponent } from '../../shared/summary-card/summary-card.component';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { Project } from '../../models/project.model';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Task, TaskStatus } from '../../models/task.model';
import { ProjectboxComponent } from '../../projectbox/projectbox.component';
import { TaskboxComponent } from '../../taskbox/taskbox.component';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AddtaskComponent } from '../../addtask/addtask.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true, // Use standalone component for modern Angular
  imports: [
    SummaryCardComponent,
    ProjectboxComponent,
    TaskboxComponent,
    AddtaskComponent,
    NgIf,
  ],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.scss',
})
export class ManagerDashboardComponent implements OnInit {
  @ViewChild('secondDiv') secondDiv!: ElementRef;

  assignedProjects: Project[] = [];
  alltodotask: Task[] = [];
  allInProgresstask: Task[] = [];
  allDonetask: Task[] = [];
  SingleProjectTask: Task[] = [];
  isaddtaskopen = false;
  ProjectIdforAddTask = '';
  // The service observables should be exposed to the component
  projects$!: Observable<Project[]>;
  tasks$!: Observable<Task[]>;
  TaskOfSingleProect$!: Observable<Task[]>;
  shouldLoad: boolean = false;
  projectId: string = '';

  constructor(
    private projectservice: ProjectService,
    private taskservce: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.projects$ = this.projectservice.projects$;
    this.tasks$ = this.taskservce.allTaskOfManager$;
    const userId = localStorage.getItem('userId');

    // Trigger the projects request in the service
    this.projectservice.GetAssignedProject(`projects/${userId}`).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });

    this.projects$.subscribe((projects) => {
      this.assignedProjects = projects;
    });

    this.taskservce
      .GetAllManagerProjectTask(`projects/${userId}/tasks/manager`)
      .subscribe({
        next: () => {
          console.log('Task get successfully');
        },
        error: () => {
          console.log('error occored');
        },
      });

    this.tasks$.subscribe((task) => {
      this.allDonetask = task.filter((t) => t.TaskStatus === TaskStatus.Done);
      this.allInProgresstask = task.filter(
        (t) => t.TaskStatus === TaskStatus.InProgress
      );
      this.alltodotask = task.filter(
        (t) => t.TaskStatus === TaskStatus.Pending
      );
    });
  }

  loadTask(projectId: string) {
    const element = document.getElementById('secondDiv');
    element?.scroll({ behavior: 'smooth' });
    if (this.projectId != projectId) {
      this.taskservce.AprojectTask.next([]);
      this.projectId = projectId;
    } else {
      this.projectId = projectId;
    }

    this.shouldLoad = true;
    this.TaskOfSingleProect$ = this.taskservce.ProjectTasks$;
    this.taskservce
      .GetAllTaskOfProject(`projects/${projectId}/tasks`)
      .subscribe({
        next: () => {
          console.log('success');
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
    this.TaskOfSingleProect$.subscribe({
      next: (response) => {
        this.SingleProjectTask = response;
      },
    });
  }
  onopencomment(task: Task) {
    //  this.showComments=true
    //  this.selectedTask=task
    this.router.navigate(['../task'], {
      relativeTo: this.route,
      state: { task: task },
    });
  }
  taskdelete(event: { taskId: string; projectId: string }) {
    this.taskservce.deleteTask(event.taskId, event.projectId).subscribe({
      next: () => {
        console.log('taskdeleted succssfully');
      },
      error: () => {
        console.log('error in deleting the task');
      },
    });
  }
  openaddtask(projectId: string) {
    this.ProjectIdforAddTask=projectId
    this.isaddtaskopen = true;
  }
  oncloseaddtaskbox() {
    this.ProjectIdforAddTask=''
    this.isaddtaskopen = false;
  }
}
