import {ICategory} from "./ICategory";
import {IImage} from "./IImage";

export interface IProduct {

  id: number;
  shortName: string;
  description: string;
  price: number;
  isNew: boolean;
  address: string;
  contact: string;
  images: IImage[];
  category: ICategory;

}
