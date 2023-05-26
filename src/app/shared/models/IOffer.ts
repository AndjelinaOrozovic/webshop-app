import {IUserAccount} from "./IUserAccount";
import {IProduct} from "./IProduct";

export interface IOffer {

  id: number;
  product: IProduct;
  userAccount: IUserAccount;
  isActive: boolean;
  isDeleted: boolean;
  dateAndTime: String;

}
