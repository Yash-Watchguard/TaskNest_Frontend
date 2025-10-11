import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { Observable } from 'rxjs';

import { Task, TaskStatus } from '../../models/task.model';
import { ProjectboxComponent } from '../../projectbox/projectbox.component';
import { TaskboxComponent } from '../../taskbox/taskbox.component';

import { AddtaskComponent } from '../../addtask/addtask.component';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { Project } from '../../models/project.model';
@Component({
  selector: 'app-manager-dashboard',
  standalone: true, // Use standalone component for modern Angular
  imports: [
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
  shouldLoad: boolean = false;

  ProjectIdforAddTask = '';
  projectId: string = '';
  
  projects$!: Observable<Project[]>;

  tasks$!: Observable<Task[]>;
  TaskOfSingleProect$!: Observable<Task[]>;

  isaddtask=signal(false)

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
      .GetAllManagerProjectTask(`project/${userId}/tasks/manager`)
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

  loadTask(projectId: string):void {
    if (this.projectId != projectId) {
      this.taskservce.AprojectTask.next([]);
      this.projectId = projectId;
    } else {
      this.projectId = projectId;
    }

    this.shouldLoad = true;
    setTimeout(() => {
      this.secondDiv.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 0);
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
  onopencomment(task: Task):void {
    this.router.navigate(['../task'], {
      relativeTo: this.route,
      state: { task: task },
    });
  }
  taskdelete(event: { taskId: string; projectId: string }):void {
    this.taskservce.deleteTask(event.taskId, event.projectId).subscribe({
      next: () => {
          
      },
      error: () => {
        console.log('error in deleting the task');
      },
    });
  }
  openaddtask(projectId: string):void {
    this.ProjectIdforAddTask=projectId;
    this.isaddtaskopen = true;
  }
  oncloseaddtaskbox() :void{
    this.ProjectIdforAddTask='';
    this.isaddtaskopen = false;
  }
}
