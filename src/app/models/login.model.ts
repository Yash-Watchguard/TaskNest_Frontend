export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  Status: string;
  Message: string;
  data: {
    token: string;
    name: string;
    UserId: string;
  };
};
