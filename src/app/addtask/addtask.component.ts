import { Component, EventEmitter, inject, Input, OnDestroy, Output, StreamingResourceOptions} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DatePicker } from 'primeng/datepicker';
import { AddTask, priority } from '../models/task.model';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TaskService } from '../services/task.service';


import { ProjectService } from '../services/project.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api'

@Component({
  selector: 'app-addtask',
  imports: [FormsModule,AutoCompleteModule,DatePicker,ToastModule],
  templateUrl: './addtask.component.html',
  styleUrl: './addtask.component.scss',
})
export class AddtaskComponent implements OnDestroy{
  @Input({required:true}) ProjectId!:string 
  messageservice=inject(MessageService)
  constructor(private taskservice:TaskService ,private projectservice:ProjectService){}

 items:any[]=['Low','Medium','High'];

  priority!: string;

  // ................................
  @Output() closepopup=new EventEmitter();
  close(){
    this.closepopup.emit();
  }
  titel:string='';
  destcription:string='';
  acceptance_criteria='';
  employeeId:string='';
  date!: Date;
  minDate: Date | undefined;
   
  
  ngOnInit(){
    const today=new Date();
    this.minDate=today
    this.minDate?.setMonth(today.getMonth())
    this.minDate?.setFullYear(today.getFullYear())
  }
  addnewtask(){
    const taskdetails:AddTask={
      title:this.titel,
      description:this.destcription,
      acceptance_criteria:this.acceptance_criteria,
      deadline:this.date?.toISOString().split('T')[0],
      priority:this.priority,
      assigned_to:this.employeeId
    }  

    this.taskservice.addTask(this.ProjectId,taskdetails).subscribe({
      next:(response)=>{
           this.messageservice.add({ severity: 'success', summary: 'Success', detail: 'Task Added Successfully' });
      },
      error:(err:HttpErrorResponse)=>{
           this.messageservice.add({ severity: 'error', summary: 'Error', detail: 'Task Add Fail' });
         
      }
    })
  }
  ngOnDestroy(): void {
    console.log(this.date?.toISOString().split('T')[0])
  }

}
