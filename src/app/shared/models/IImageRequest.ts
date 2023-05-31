import {IProduct} from "./IProduct";

export interface IImageRequest {
  id: number;
  url: string;
  product: IProduct;
}
