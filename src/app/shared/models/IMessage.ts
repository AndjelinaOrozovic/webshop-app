import {IUserAccount} from "./IUserAccount";

export interface IMessage {
  id: null;
  content: string;
  isRead: boolean;
  dateAndTime: string;
  idUserAccount: IUserAccount;
}
