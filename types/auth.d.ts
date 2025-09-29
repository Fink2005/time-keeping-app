export type LoginAccountCenterReq = {
  email: string;
  password: string;
  key: string;
};

export type LoginReq = {
  token: string;
  name?: string;
};

export type RegisterAccountCenterReq = LoginAccountCenterReq & {
  confirmPassword: string;
};

export type RegisterRes = {
  message: string;
  email: string;
};

export type LoginAccountCenterRes = {
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

export type LoginRes = {
  tokens: LoginAccountCenterRes['data'];
  user: User;
};
