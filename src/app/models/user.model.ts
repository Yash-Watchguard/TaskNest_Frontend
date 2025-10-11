export type user = {
  Id: string;
  Name: string;
  Email: string;
  Role: Role;
};

export enum Role {
  ADMIN = 0,
  MANAGER = 1,
  EMPLOYEE = 2,
}

export type person = {
  Id: string;
  Name: string;
  Email: string;
  PhoneNumber: string;
  Role: string
};

export type getAllUsersApiRes={
  status:string;
  message:string;
  data:person[];
}
export type getUsersApiRes={
  status:string;
  message:string;
  data:person;
}
export type UpdateProfileDetails={
  "name"?:string,
  "phoneNumber"?:string,
  "password"?:string,
  "email"?:string
}