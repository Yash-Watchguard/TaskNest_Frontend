import { Component, EventEmitter, Input, Output } from '@angular/core';
import { person } from '../models/user.model';
import { NgIf } from '@angular/common';
import { UserService } from '../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { Tooltip } from 'primeng/tooltip';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-user',
  imports: [NgIf, Tooltip],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  @Input({ required: true }) user!: person;
  @Output() PromoteEmployeeSignal=new EventEmitter();
  @Output() DeleteUserSignal=new EventEmitter();

  constructor(
    private userservice: UserService,
    private msgservice: MessageService
  ) {}

  
  promoteemployee() {
    this.PromoteEmployeeSignal.emit(this.user?.Id);
  }
  deleteuser() {
    this.DeleteUserSignal.emit(this.user?.Id);
  }
}
