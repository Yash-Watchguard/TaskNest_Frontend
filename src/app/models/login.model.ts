export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  status: string;
  UserId: string;
  name: string;
  token: string;
};
