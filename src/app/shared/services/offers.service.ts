import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IOffer} from "../models/IOffer";

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  baseUrl: string;
  constructor(private http: HttpClient) {

    this.baseUrl = 'http://localhost:9000/offers';

  }

  public getAll(): Observable<IOffer[]> {
    return this.http.get<IOffer[]>(this.baseUrl);
  }

  public getOfferByProductName(name: string): Observable<IOffer[]> {
    return this.http.get<IOffer[]>(this.baseUrl + '/product/' + name);
  }

  public getOffersByCategoryId(id: number): Observable<IOffer[]> {
    return this.http.get<IOffer[]>(this.baseUrl + '/idCategory/' + id);
  }

  public getOffersByProductNameAndCategoryId(name: String, id: number): Observable<IOffer[]> {
    return this.http.get<IOffer[]>(this.baseUrl + '/product/' + name + '/idCategory/' + id);
  }
}
