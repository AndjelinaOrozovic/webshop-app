import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IImage} from "../models/IImage";
import {IImageRequest} from "../models/IImageRequest";

const URL = 'http://localhost:9000/images';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = URL;
  }

  public insert(image: IImageRequest): Observable<IImage> {
    if(image.url !== '' && image.url !== null) {
      return this.http.post<IImage>(this.baseUrl, image);
    }
    return null;
  }
}
