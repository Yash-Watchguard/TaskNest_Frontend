export type user ={
  Id:string
  Name:string
  Email:string
  Role:Role;
}

export enum Role{
  ADMIN=0,
  MANAGER=1,
  EMPLOYEE=2
}
