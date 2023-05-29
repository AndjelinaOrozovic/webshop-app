import {IOffer} from "./IOffer";
import {IUserAccount} from "./IUserAccount";

export interface IComment {
  id: number;
  content: string;
  dateAndTime: string;
  offer: IOffer;
  userAccount: IUserAccount;
}
