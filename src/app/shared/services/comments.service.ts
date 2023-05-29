import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IComment} from "../models/IComment";

const URL = 'http://localhost:9000/comments';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = URL;
  }

  public getCommentsForOffer(id: number): Observable<IComment[]> {
    return this.http.get<IComment[]>(`${this.baseUrl}/idOffer/${id}`);
  }

  public postComment(comment: IComment): Observable<IComment> {
    return this.http.post<IComment>(this.baseUrl, comment);
  }
}
