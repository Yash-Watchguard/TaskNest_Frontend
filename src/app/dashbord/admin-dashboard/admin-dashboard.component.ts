import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { InputText } from 'primeng/inputtext';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Tooltip } from 'primeng/tooltip';

import { Observable } from 'rxjs';

import { AddprojectComponent } from '../../addproject/addproject.component';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskboxComponent } from '../../taskbox/taskbox.component';
import { ProjectboxComponent } from '../../projectbox/projectbox.component';
import { Project } from '../../models/project.model';
import { UserComponent } from '../../user/user.component';
import { UserService } from '../../services/user.service';
import { ProjectService } from '../../services/project.service';
import { person } from '../../models/user.model';
import { EmpTaskComponent } from '../../emp-task/emp-task.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    Tooltip,
    InputText,
    ProjectboxComponent,
    CommonModule,
    UserComponent,
    Toast,
    AddprojectComponent,
    TaskboxComponent,
    EmpTaskComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  constructor(
    private userservice: UserService,
    private projectservice: ProjectService,
    private taskservice: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  Allusers: person[] = [];
  EmployeeList: person[] = [];
  ManagersList: person[] = [];

  AllProject: Project[] = [];

  SingleProjectTask: Task[] = [];

  private userobserver$!: Observable<person[]>;
  private AllProjectObserver$!: Observable<Project[]>;
  TaskOfSingleProect$!: Observable<Task[]>;

  openAddProject = signal(false);

  shouldLoad: boolean = false;
  shouldOpenEmpTasks=false;
  SelectedUser!: person|null ;

  projectId: string = '';

  @ViewChild('secondDiv') secondDiv!: ElementRef;

  messageservice = inject(MessageService);
  ngOnInit() {
    this.userobserver$ = this.userservice.AllUsers$;
    this.userservice.GetAllUsers().subscribe({
      next: (res) => {
        console.log('all userss retrived successfully');
      },
      error: () => {
        console.log('error got');
      },
    });
    this.userobserver$.subscribe((response) => {
      this.Allusers = response.sort((a, b) => {
        if (a.Role == 'Manager' && b.Role == 'Employee') {
          return 1;
        }

        if (a.Role === 'Employee' && b.Role === 'Manager') {
          return -1;
        }

        return 0;
      });
      this.EmployeeList = response.filter((user) => user.Role === 'Employee');
      this.ManagersList = response.filter((user) => user.Role === 'Manager');
    });
    this.AllProjectObserver$ = this.projectservice.AllProjectObserver$;
    this.projectservice.GetAllProject().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
    this.AllProjectObserver$.subscribe((projects) => {
      this.AllProject = projects;
    });
  }
  PromoteEmp(userId: string): void {
    this.userservice.PromoteUser(userId).subscribe({
      next: () => {
        this.messageservice.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User Promoted Successfully',
          life: 3000,
        });
        this.userservice.GetAllUsers().subscribe({
          error: () => {},
        });
      },
      error: (err: HttpErrorResponse) => {
        this.messageservice.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Promotion Failed',
          life: 3000,
        });
      },
    });
  }

  Deleteuser(userId: string): void {
    this.userservice.Deleteuser(userId).subscribe({
      next: () => {
        this.messageservice.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User Deleted Successfully',
          life: 3000,
        });
        this.userservice.GetAllUsers().subscribe({
          error: () => {
            console.log('after userdeletion all the user fateched error');
          },
        });
      },
      error: (err: HttpErrorResponse) => {
        this.messageservice.add({
          severity: 'error',
          summary: 'Error',
          detail: `${err}`,
        });
      },
    });
  }
  AddProjectModal(): void {
    this.openAddProject.set(true);
  }
  closeAddProjectModal(): void {
    this.openAddProject.set(false);
  }

  loadTask(projectId: string): void {
    if (this.projectId != projectId) {
      this.taskservice.AprojectTask.next([]);
      this.projectId = projectId;
    } else {
      this.projectId = projectId;
    }

    this.shouldLoad = true;
    setTimeout(() => {
      this.secondDiv.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 0);
    this.TaskOfSingleProect$ = this.taskservice.ProjectTasks$;
    this.taskservice
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
  onopencomment(task: Task): void {
    this.router.navigate(['../task'], {
      relativeTo: this.route,
      state: { task: task },
    });
  }
  openEmpTask(user:person):void{
    this.SelectedUser = user;
    this.shouldOpenEmpTasks = true;
  }
  closeEmpTasks(): void {
    this.shouldOpenEmpTasks = false;
    this.SelectedUser=null;
  }
}
