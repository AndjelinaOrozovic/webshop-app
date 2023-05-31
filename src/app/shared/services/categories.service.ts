import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ICategory} from "../models/ICategory";
import {IAttribute} from "../models/IAttribute";

const URL = 'http://localhost:9000/categories';
const ATTRIBUTES_URL = 'http://localhost:9000/attributes';

@Injectable({
  providedIn: 'root'
})

export class CategoriesService {

  baseUrl: string;
  attributesUrl: string;
  constructor(private http: HttpClient) {

    this.baseUrl = URL;
    this.attributesUrl = ATTRIBUTES_URL;

  }

  public getAll(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(this.baseUrl);
  }

  public getCategoryAttributes(idCategory: number): Observable<IAttribute[]> {
    return this.http.get<IAttribute[]>(`${this.attributesUrl}/idCategory/${idCategory}`);
  }
}
