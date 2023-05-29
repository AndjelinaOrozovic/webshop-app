import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {IOffer} from "../models/IOffer";

const URL = 'http://localhost:9000/offers';

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  baseUrl: string;

  dataSource: any = new BehaviorSubject<any>({});
  offer = this.dataSource.asObservable();
  constructor(private http: HttpClient) {

    this.baseUrl = URL;

  }

  public getAll(): Observable<IOffer[]> {
    return this.http.get<IOffer[]>(this.baseUrl);
  }

  public getOfferByProductName(name: string): Observable<IOffer[]> {
    return this.http.get<IOffer[]>(`${this.baseUrl}/product/${name}`);
  }

  public getOffersByCategoryId(id: number): Observable<IOffer[]> {
    return this.http.get<IOffer[]>(`${this.baseUrl}/idCategory/${id}`);
  }

  public getOffersByProductNameAndCategoryId(name: String, id: number): Observable<IOffer[]> {
    return this.http.get<IOffer[]>(`${this.baseUrl}/product/${name}/idCategory/${id}`);
  }

  public getOfferDetails(id: number): Observable<IOffer> {
    return this.http.get<IOffer>(`${this.baseUrl}/${id}`);
  }

  public updateOffer(offer: IOffer): Observable<IOffer> {
    return this.http.put<IOffer>(`${this.baseUrl}/${offer.id}`, offer);
    }

  public setOffer(offer: IOffer): void {
    this.dataSource.next(offer);
  }

}
