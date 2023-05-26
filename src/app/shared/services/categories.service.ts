import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ICategory} from "../models/ICategory";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  baseUrl: string;
  constructor(private http: HttpClient) {

    this.baseUrl = 'http://localhost:9000/categories';

  }

  public getAll(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(this.baseUrl);
  }
}
