import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, map, tap } from "rxjs";
import { Project, viewprojectresponse } from "../models/project.model";

@Injectable({providedIn:'root'})
export class ProjectService{
    private httpclient=inject(HttpClient)

    private ProjectObject=new BehaviorSubject<Project[]>([])

    projects$ =this.ProjectObject.asObservable();

    private getprojecturl='';

    currentptojectid:any=''

    // behaviour subject for the projectstatus
    // private projectStatusobject$=new BehaviorSubject<{
    //         projectId:string
    //         completedTasks:string
    //         totalTasks:number
    //         completionPercentage:number
    //     }[]>([]);
    //     projectStatus=this.projectStatusobject$.asObservable();

    GetAssignedProject(url:string){
        this.getprojecturl=url;
        return this.httpclient.get<viewprojectresponse>(url).pipe(
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
                this.ProjectObject.next(projects)
            })
        )
    }

    Addproject(){

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
       }>(url)
    //    .pipe(
    //     map((response)=>{
    //         return response.data.map((t)=>({
    //             projectId:t.projectId,
    //             completedTasks:t.completedTasks,
    //             totalTasks:t.totalTasks,
    //             completionPercentage:t.completionPercentage
    //         }) as {
    //         projectId:string
    //         completedTasks:string
    //         totalTasks:number
    //         completionPercentage:number
    //     } );
    //     }),
    //     tap((projectstatus)=>{
    //           this.projectStatusobject$.next(projectstatus)
    //     })
    //    )
    }
    
}