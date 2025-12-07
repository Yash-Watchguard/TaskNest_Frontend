import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, map, Observable, take, tap } from 'rxjs';
import {
  getAllUsersApiRes,
  getUsersApiRes,
  person,
  Role,
  UpdateProfileDetails,
  user,
} from '../models/user.model';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  private allusersobject = new BehaviorSubject<person[]>([]);
  AllUsers$ = this.allusersobject.asObservable();
  httpClient = inject(HttpClient);

  userProfile = signal<person>({
    Id: '',
    Name: '',
    Email: '',
    PhoneNumber: '',
    Role: '',
  });

  baseUrl= 'https://j7hf8pxvdk.execute-api.ap-south-1.amazonaws.com/v5/'
  baseUrl2= 'https://vv2zl4jl7h.execute-api.ap-south-1.amazonaws.com/v6/'

  GetAllUsers() {
    return this.httpClient.get<getAllUsersApiRes>(this.baseUrl+`users`).pipe(
      map((response) => {
        return response.data.map(
          (user) =>
            ({
              Id: user.Id,
              Name: user.Name,
              Email: user.Email,
              PhoneNumber: user.PhoneNumber,
              Role: user.Role as string,
            } as person)
        );
      }),
      tap((users) => {
        this.allusersobject.next(users);
      })
    );
  }

  Deleteuser(email:string): Observable<any> {
    return this.httpClient.delete(this.baseUrl2+`user/${email}/delete`);
  }

  PromoteUser(email: string) {
    return this.httpClient.patch(this.baseUrl2+`users/promote/${email}`, null);
  }

  GetProfile(userId: string) {
    return this.httpClient.get<getUsersApiRes>(this.baseUrl+`users/${userId}`).pipe(
      tap((res) => {
        this.userProfile.set(res.data);
      })
    );
  }

  updateUserProfile(userId: string, data: UpdateProfileDetails) {
    return this.httpClient.patch(this.baseUrl+`users/${userId}`, data);
  }

  GetAllEmployee() {
    return this.httpClient.get<getAllUsersApiRes>(this.baseUrl+`employees`);
  }
}
