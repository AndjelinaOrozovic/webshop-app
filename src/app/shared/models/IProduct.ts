import {ICategory} from "./ICategory";

export interface IProduct {
  id: number,
  shortName: string,
  description: string,
  price: number,
  isNew: boolean,
  address: string,
  contact: string,
  picture: string,
  category: ICategory
}
