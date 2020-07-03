export class Account {
  public id: number;
  public name: string;
  public lastname: string;
  public email: string;
  public username: string;
  public birthday: Date;
  public password: string
}

export interface IAccount {
  name: string;
  lastname: string;
  email: string;
  username: string;
  birthday: string;
  password: string
  id: number;
}
