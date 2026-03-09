import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';


import { LoadingBarService } from '@ngx-loading-bar/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Blog } from '../../_model/blog';
import { QuillModule } from 'ngx-quill';
import { Meta, Title } from '@angular/platform-browser';
import { BlogService } from '../../_service/blog.service';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { JsonLdService } from '../../_service/json-ld.service';
import { CanonicalService } from '../../_service/canonical.service';
import { SeoService } from '../../_service/seo.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit, OnDestroy {

  private routeSub!: Subscription;

  getBlogsById!: Blog;
  getBlogs: Blog[] = [];
  isBrowser = false;

  constructor(
    private loadingBar: LoadingBarService,
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private meta: Meta,
    private jsonLdService: JsonLdService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /* =====================
     INIT
  ===================== */
  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      const id = params['id'];
      if (!id) {
        this.router.navigate(['/blogs']);
        return;
      }
      this.loadBlog(id);
    });
  }

  /* =====================
     LOAD BLOG DETAIL
  ===================== */
  private loadBlog(id: string): void {
    this.loadingBar.start();

    this.blogService.getById(id).subscribe({
      next: (blog) => {
        if (!blog) {
          this.router.navigate(['/blogs']);
          return;
        }

        this.getBlogsById = blog;
        this.setMeta(blog);
        this.insertSchemas(blog, id);
        this.loadRelatedBlogs(blog._id.$oid);
        this.loadingBar.complete();
      },
      error: () => {
        this.router.navigate(['/blogs']);
        this.loadingBar.complete();
      }
    });
  }

  /* =====================
     RELATED BLOGS
  ===================== */
  private loadRelatedBlogs(currentId: string): void {
    this.blogService.getAll().subscribe({
      next: (blogs) => {
        this.getBlogs = blogs
          .filter(b => b._id.$oid !== currentId)
          .slice(0, 3);
      }
    });
  }

  /* =====================
     META TAGS
  ===================== */
  private setMeta(blog: Blog): void {
    const url = `https://twentysix.house/blogs/detail/${blog._id.$oid}`;

    this.title.setTitle(`${blog.title} | Twentysix.House`);

    this.meta.updateTag({ name: 'description', content: blog.subTitle });
    this.meta.updateTag({ property: 'og:title', content: blog.title });
    this.meta.updateTag({ property: 'og:description', content: blog.subTitle });
    this.meta.updateTag({
      property: 'og:image',
      content: blog.pictureUrl || 'https://twentysix.house/assets/img/head.png'
    });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:url', content: url });
  }

  /* =====================
     SCHEMA
  ===================== */
  private insertSchemas(blog: Blog, id: string): void {
    if (!this.isBrowser) return;

    // clear old
    this.jsonLdService.removeSchema('blog-posting');
    this.jsonLdService.removeSchema('breadcrumb');

    /* --- BlogPosting --- */
    this.jsonLdService.insertSchema('blog-posting', {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": blog.subTitle,
      "image": blog.pictureUrl,
      "datePublished": blog.date,
      "dateModified": blog.date,
      "author": {
        "@type": "Organization",
        "name": "Twentysix.House"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Twentysix.House",
        "logo": {
          "@type": "ImageObject",
          "url": "https://twentysix.house/assets/img/logobg.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://twentysix.house/blogs/detail/${id}`
      }
    });

    /* --- Breadcrumb --- */
    this.jsonLdService.insertSchema('breadcrumb', {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "หน้าแรก",
          "item": "https://twentysix.house"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "บทความ",
          "item": "https://twentysix.house/blogs"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": blog.title,
          "item": `https://twentysix.house/blogs/detail/${id}`
        }
      ]
    });
  }

  trackById(index: number, blog: Blog): string {
    return blog._id.$oid;
  }

  /* =====================
     DESTROY
  ===================== */
  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.jsonLdService.removeSchema('blog-posting');
    this.jsonLdService.removeSchema('breadcrumb');
  }
}
