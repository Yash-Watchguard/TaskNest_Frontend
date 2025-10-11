import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, tap } from "rxjs";
import { AddProjectRequest, Project, projectresponse, viewprojectresponse } from "../models/project.model";

@Injectable({providedIn:'root'})
export class ProjectService{
    private httpclient=inject(HttpClient)

    private ProjectObject=new BehaviorSubject<Project[]>([]);

    projects$ =this.ProjectObject.asObservable();

    private getprojecturl='';

    currentptojectid:any=''

    GetAssignedProject(url:string){
        this.getprojecturl=url;
        return this.httpclient.get<viewprojectresponse>(url).pipe(
            map((response)=>{
             return response.data.map((p: projectresponse)=>({
                ProjectId:p.project_id,
                ProjectName:p.project_name,
                ProjectDes:p.project_description,
                Deadline:new Date(p.deadline),
                CreatedBy:p.created_by,
                AssignedManagerId:p.assigned_manager_id
             })as Project)
            }),
            tap((projects)=>{
                this.ProjectObject.next(projects)
            })
        )
    }

    Addproject(project:AddProjectRequest){
       return this.httpclient.post(`projects`,project);
    }

    GetProjectStatuas(url:string){
      return this.httpclient.get<{
        status:string
        message:string
        data:{
            projectId:string
            completedTasks:string
            totalTasks:number
            completionPercentage:number
        }
       }>(url);
    }
    
    private AllprojectSubject=new BehaviorSubject<Project[]>([]);
    AllProjectObserver$=this.AllprojectSubject.asObservable();
    GetAllProject(){
        return this.httpclient.get<viewprojectresponse>(`projects`).pipe(
            map((response)=>{
             return response.data.map((p)=>({
                ProjectId:p.project_id,
                ProjectName:p.project_name,
                ProjectDes:p.project_description,
                Deadline:new Date(p.deadline),
                CreatedBy:p.created_by,
                AssignedManagerId:p.assigned_manager_id
             })as Project)
            }),
            tap((projects)=>{
                this.AllprojectSubject.next(projects);
            }),
        );
    }

    DeleteProject(projectId:string){
       return this.httpclient.delete(`projects/${projectId}`)
    }
    
}