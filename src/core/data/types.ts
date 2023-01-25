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
  role: string;
};

export type SendMoneyToMyself = {
  username: string;
  amount: number;
};

export type SendMoneyToAnotherUser = {
  userFrom: string;
  userTo: string;
  amount: number;
};

export type DeleteUser = {
  username: string;
  password: string;
};

export type PostUserToken = {
  username: string;
  role: string;
};

export type NormalUserToken = {
  username: string;
  password: string;
  role: string;
};
