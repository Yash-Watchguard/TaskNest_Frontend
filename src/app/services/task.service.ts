import { inject, Injectable } from "@angular/core";
import { InjectSetupWrapper } from "@angular/core/testing";
import { BehaviorSubject,map,tap } from "rxjs";
import { priority, Task, TaskApiResponse, TaskStatus } from "../models/task.model";
import { HttpClient, HttpParams } from "@angular/common/http";


@Injectable({ providedIn: 'root' })
export class TaskService {
  private httpClient = inject(HttpClient);
  private taskObject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.taskObject.asObservable();
  private gettaskurl=''
  GetTasks(url: string) {
    this.gettaskurl=url
    return this.httpClient.get<TaskApiResponse>(url).pipe(
      map((response) => {
        return response.data.map((t) => ({
          TaskId: t.task_id,
          Title: t.title,
          Description: t.description,
          AcceptanceCriteria: t.acceptance_criteria,
          Deadline: new Date(t.deadline),
          TaskPriority: t.taskpriority as priority,
          TaskStatus: t.taskstatus as TaskStatus,
          AssignedTo: t.assigned_to,
          ProjectId: t.project_id,
          CreatedBy: t.created_by,
        }) as Task);
      }),
      tap((tasks) => {
        this.taskObject.next(tasks);
      })
    );
  }

  UpdateStatus(url: string, update: string) {
    return this.httpClient.patch(url, {
      "status": update 
    }).pipe(tap(response => {
      this.GetTasks(this.gettaskurl).subscribe()
    }))
  }
}
