import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Blog } from '../_model/blog';
import { map } from 'rxjs';

const URL_API = '/assets/json/blog.json';

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
      map((blogs) => {
        const normalizedKey = this.normalizeSlug(id);

        return blogs.find((blog) => {
          const blogId = this.getBlogId(blog);

          return blogId === id || blog.bId === id || this.getBlogSlug(blog) === normalizedKey;
        });
      })
    );
  }

  getBlogId(blog: Blog): string {
    return blog._id?.$oid || blog.bId;
  }

  getBlogSlug(blog: Blog): string {
    const slug = this.normalizeSlug(blog.slug || blog.title);

    return slug || this.getBlogId(blog);
  }

  private normalizeSlug(value: string): string {
    return this.decodeSlug(value)
      .normalize('NFKC')
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{M}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '');
  }

  private decodeSlug(value: string): string {
    try {
      return decodeURIComponent(value || '');
    } catch {
      return value || '';
    }
  }

}
