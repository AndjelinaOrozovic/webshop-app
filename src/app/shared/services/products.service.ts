import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IProduct} from "../models/IProduct";
import {Observable} from "rxjs";
import {IValue} from "../models/IValue";
import {IAttributeAndValue} from "../models/IAttributeAndValue";

const URL = 'http://localhost:9000/products';
const VALUES_URL = 'http://localhost:9000/attributeValues';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  baseUrl: string;
  valuesUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = URL;
    this.valuesUrl = VALUES_URL;
  }

  public getById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.baseUrl}/${id}`);
  }
  public insert(product: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(this.baseUrl, product);
  }

  public getAttributesAndValues(idProduct: number): Observable<IAttributeAndValue[]> {
    return this.http.get<IAttributeAndValue[]>(`${this.baseUrl}/attributesAndValues/${idProduct}`);
  }

  public insertValue(value: IValue): Observable<IValue> {
    return this.http.post<IValue>(this.valuesUrl, value);
  }
}
