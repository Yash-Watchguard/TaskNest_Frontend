import { user } from './user.model';

export type signupuserdto = {
  name: string;
  email: string;
  password: string;
  phonenumber: string;
};

export type signupresponse = {
  status: string;
  message: string;
  data: user;
};
