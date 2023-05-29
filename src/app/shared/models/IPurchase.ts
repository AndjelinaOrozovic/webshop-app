import {IOffer} from "./IOffer";
import {IUserAccount} from "./IUserAccount";

export interface IPurchase {

  id: number,
  dateAndTime: string;
  cardNumber: string;
  offer: IOffer;
  userAccount: IUserAccount;

}
