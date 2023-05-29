import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {IUserAccount} from "../models/IUserAccount";
import {HttpClient} from "@angular/common/http";

const URL = 'http://localhost:9000/userAccounts';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = URL;
  }

  public getAll(): Observable<IUserAccount[]> {
    return this.http.get<IUserAccount[]>(this.baseUrl);
  }

  public findByUsername(username: string): Observable<IUserAccount> {
    return this.http.get<IUserAccount>(`${this.baseUrl}/username/${username}`);
  }

  public insert(user: IUserAccount): Observable<IUserAccount> {
    return this.http.post<IUserAccount>(this.baseUrl, user);
  }

  public update(user: IUserAccount): Observable<IUserAccount> {
    return this.http.put<IUserAccount>(`${this.baseUrl}/${user.id}`, user);
  }
}
