import { Component, Inject, PLATFORM_ID } from '@angular/core';


import { LoadingBarService } from '@ngx-loading-bar/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Blog } from '../../_model/blog';
import { Meta, Title } from '@angular/platform-browser';
import { BlogService } from '../../_service/blog.service';

@Component({
  standalone: false,
  selector: 'app-detail',

  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {

  getBlogs: Blog[];

  getBlogsByIdAll: Blog[];

  getBlogsById: Blog;

  constructor(
    private loadingBar: LoadingBarService,
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router,
    private meta: Meta,
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: Object,

  ) { }

  ngOnInit() {

    this.retrieveBlog();
    this.retrieveNews();

  }
  retrieveNews() {
    this.loadingBar.start();

    this.route.params.subscribe((params) => {
      this.blogService.getAll().subscribe({
        next: (data) => {

          this.getBlogsByIdAll = data;
          this.getBlogsById = this.getBlogsByIdAll.find(data => data._id.$oid == params['id'])!;
          this.updateTag(this.getBlogsById, this.getBlogsById._id.$oid);

          this.loadingBar.complete();
        },
        error: (err) => {
          console.log(err);

        }
      });
    });
  }
  onDetail(id: string) {
    this.router.navigate(['/blogs/detail', id]);
  }

  retrieveBlog() {
    this.loadingBar.start();
    this.blogService.getAll()
      .subscribe({
        next: (data) => {

          this.getBlogs = data;
          this.getBlogs = this.getBlogs.slice(0, 3);
          this.loadingBar.complete();
        },
        error: (err) => {
          console.log(err);

        }
      });
  }
  updateTag(data: Blog, id: string) {

    this.titleService.setTitle(data.title);

    this.meta.updateTag({ name: 'title', content: data.title });
    this.meta.updateTag({ name: 'description', content: data.subTitle });
    this.meta.updateTag({ name: 'keywords', content: data.tags.map(e => e.replace(/\s/g, "")).join(", ") });

    this.meta.updateTag({ property: 'og:title', content: data.title });
    this.meta.updateTag({ property: 'og:description', content: data.subTitle });
    this.meta.updateTag({ property: 'og:image', content: new URL(data.pictureUrl, 'https://twentysix.house/').href });
    this.meta.updateTag({ property: 'og:url', content: 'https://twentysix.house/blogs/detail/' + id });
  }

}
