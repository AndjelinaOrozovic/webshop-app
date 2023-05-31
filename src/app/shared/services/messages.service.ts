import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {IMessage} from "../models/IMessage";
import {HttpClient} from "@angular/common/http";

const URL = 'http://localhost:9000/messages';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = URL;
  }

  public insert(message: IMessage): Observable<IMessage> {
    return this.http.post<IMessage>(this.baseUrl, message);
  }
}
