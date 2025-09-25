export type LoginReq = {
  email: string;
  password: string;
};

export type RegisterRequest = LoginReq & {
  name: string;
  confirmPassword: string;
};

export type RegisterRes = {
  message: string;
  email: string;
};

export type LoginRes = {
  accessToken: string;
  refreshToken: string;
};
