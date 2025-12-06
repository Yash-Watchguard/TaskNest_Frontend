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
import { ConfirmationService, MessageService } from 'primeng/api';
import { Tooltip } from 'primeng/tooltip';
import { ConfirmDialog } from 'primeng/confirmdialog';

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
    EmpTaskComponent,
    ConfirmDialog
],
providers:[ConfirmationService],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  constructor(
    private userservice: UserService,
    private projectservice: ProjectService,
    private taskservice: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationService:ConfirmationService
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
  shouldOpenEmpTasks = false;
  SelectedUser!: person | null;

  projectId: string = '';

  @ViewChild('secondDiv') secondDiv!: ElementRef;

  messageservice = inject(MessageService);
  ngOnInit(): void {
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

  PromoteEmp(email: string): void {
    this.userservice.PromoteUser(email).subscribe({
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
        // Assuming promotion might succeed despite error, refresh the list
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
    });
  }

  Deleteuser(userId: string): void {

    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Please confirm to proceed.',
      accept: () => {
    //         this.userservice.Deleteuser(userId).subscribe({
    //   next: () => {
    //     this.messageservice.add({
    //       severity: 'success',
    //       summary: 'Success',
    //       detail: 'User Deleted Successfully',
    //       life: 3000,
    //     });
    //     this.userservice.GetAllUsers().subscribe({
    //       error: () => {
    //         console.log('after userdeletion all the user fateched error');
    //       },
    //     });
    //   },
    //   error: (err: HttpErrorResponse) => {
    //     this.messageservice.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: `${err}`,
    //     });
    //   },
    // });
    this.messageservice.add({ severity: 'info', summary: 'Info', detail: 'Service Temporarily Unavailable' });
      },
    });

  }

  AddProjectModal(): void {
    this.openAddProject.set(true);
  }

  closeAddProjectModal(): void {
    this.openAddProject.set(false);
  }

  loadTask(project:Project): void {
    if (this.projectId != project.ProjectId) {
      this.taskservice.AprojectTask.next([]);
      this.projectId = project.ProjectId;
    } else {
      this.projectId = project.ProjectId;
    }

    this.shouldLoad = true;
    setTimeout(() => {
      this.secondDiv.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 0);
    this.TaskOfSingleProect$ = this.taskservice.ProjectTasks$;
    this.taskservice
      .GetAllTaskOfProject(`creator/${project.AssignedManagerId}/projects/${project.ProjectId}`)
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

  openEmpTask(user: person): void {
    this.SelectedUser = user;
    this.shouldOpenEmpTasks = true;
  }

  closeEmpTasks(): void {
    this.shouldOpenEmpTasks = false;
    this.SelectedUser = null;
  }
}
