import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, map, take, tap } from 'rxjs';
import { getAllUsersApiRes, getUsersApiRes, person, Role, UpdateProfileDetails, user } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  private allusersobject = new BehaviorSubject<person[]>([]);
  AllUsers$ = this.allusersobject.asObservable();
  httpClient = inject(HttpClient);

  userProfile=signal<person>({
    Id:'',
    Name:'',
    Email:'',
    PhoneNumber:'',
    Role:'',
  })

  GetAllUsers() {
     return this.httpClient.get<getAllUsersApiRes>(`users`).pipe(
      map((response) => {
        return response.data.map(
          (user) =>
            ({
              Id: user.Id,
              Name: user.Name,
              Email: user.Email,
              PhoneNumber: user.PhoneNumber,
              Role: user.Role as string,
            })as person);
      }),
      tap((users)=>{
        this.allusersobject.next(users);
      }),
    );
  }

  Deleteuser(userId:string|undefined){
      return this.httpClient.delete(`users/${userId}`);
  }
  PromoteUser(userId:string){
     return this.httpClient.put(`users/${userId}/promote`,null)
  }
  GetProfile(userId:string){
    return this.httpClient.get<getUsersApiRes>(`users/${userId}`).pipe(
     tap((res)=>{
        this.userProfile.set(res.data);
     })
    );
  }
  updateUserProfile(userId:string,data:UpdateProfileDetails){
    return this.httpClient.patch(`users/${userId}`,data);
  }

  GetAllEmployee(){
    return this.httpClient.get<getAllUsersApiRes>(`employees`)
  }
}
