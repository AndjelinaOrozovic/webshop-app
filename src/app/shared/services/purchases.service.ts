import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IPurchase} from "../models/IPurchase";
import {Observable} from "rxjs";

const URL = 'http://localhost:9000/purchases'

@Injectable({
  providedIn: 'root'
})
export class PurchasesService {

  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = URL;
  }

  postPurchase(purchase: IPurchase): Observable<IPurchase> {
    return this.http.post<IPurchase>(this.baseUrl, purchase);
  }

  findPurchaseByUserId(id: number): Observable<IPurchase[]> {
    return this.http.get<IPurchase[]>(`${this.baseUrl}/${id}`);
  }
}
