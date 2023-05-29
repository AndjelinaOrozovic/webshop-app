import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IMail} from "../models/IMail";
import {Observable} from "rxjs";

const URL = 'http://localhost:9000/email';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  baseUrl = "";
  constructor(private http: HttpClient) {
    this.baseUrl = URL;
  }

  public send(mail: IMail): Observable<IMail> {
    return this.http.post<IMail>(this.baseUrl, mail);
  }
}
