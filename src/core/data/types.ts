export type User = {
  uuid: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phonenumber: string;
  checkings: number;
  savings: number;
  role: string;
  transactions: {};
};

export type UserLogin = {
  username: string;
  password: string;
};

export type UserResetPassword = {
  username: string;
  newPassword: string;
  role: string;
};

export type SendMoneyToMyself = {
  username: string;
  password: string;
  amount: number;
};
