import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Blog } from '../_model/blog';
import { map } from 'rxjs';

const URL_API = '/assets/json/blog.json';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Blog[]> {
    return this.http.get<Blog[]>(URL_API, {
      responseType: 'json',
    });
  }

  getById(id: string): Observable<Blog | undefined> {
    return this.getAll().pipe(
      map((blogs) => blogs.find(blog => blog._id.$oid === id))
    );
  }

}
