import { Component, Input } from '@angular/core';
import { Blog } from '../../../_model/blog';
import { BlogService } from '../../../_service/blog.service';

@Component({
  selector: 'app-home-blogs-section',
  templateUrl: './home-blogs-section.component.html',
  styleUrl: './home-blogs-section.component.scss',
})
export class HomeBlogsSectionComponent {
  @Input() blogs: Blog[] = [];

  constructor(private blogService: BlogService) {}

  trackById(index: number, blog: Blog): string {
    return this.blogService.getBlogId(blog);
  }

  getBlogUrl(blog: Blog): string[] {
    return ['/blogs', this.blogService.getBlogSlug(blog)];
  }
}
