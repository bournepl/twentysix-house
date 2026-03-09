import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';

import { LoadingBarService } from '@ngx-loading-bar/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Blog } from '../../_model/blog';
import { Meta, Title } from '@angular/platform-browser';
import { BlogService } from '../../_service/blog.service';
import { DOCUMENT } from '@angular/common';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { JsonLdService } from '../../_service/json-ld.service';
import { CanonicalService } from '../../_service/canonical.service';
import { SeoService } from '../../_service/seo.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit, OnDestroy {

  blogs: Blog[] = [];
  isBrowser = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private title: Title,
    private meta: Meta,
    private blogService: BlogService,
    private jsonLd: JsonLdService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {

    /* ===== META ===== */
    this.title.setTitle('บทความความรู้เรื่องบ้าน | Twentysix.House');

    this.meta.updateTag({
      name: 'description',
      content:
        'บทความและสาระความรู้เรื่องการสร้างบ้าน ออกแบบบ้าน และการก่อสร้าง จากทีมงาน Twentysix.House บริษัทรับสร้างบ้านในอุดรธานี'
    });

    this.loadBlogs();
  }

  ngOnDestroy(): void {
    this.jsonLd.removeSchema('blog-list');
  }

  loadBlogs(): void {
    this.blogService.getAll().subscribe((data: Blog[]) => {
      this.blogs = data;

      if (this.isBrowser) {
        this.insertBlogListSchema();
      }
    });
  }

  trackById(index: number, blog: Blog): string {
    return blog._id.$oid;
  }

  /* ===== Schema: Blog + ItemList ===== */
  private insertBlogListSchema() {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "บทความความรู้เรื่องบ้าน - Twentysix.House",
      "publisher": {
        "@type": "Organization",
        "name": "Twentysix.House"
      },
      "blogPost": this.blogs.map((blog, index) => ({
        "@type": "BlogPosting",
        "headline": blog.title,
        "description": blog.subTitle,
        "image": blog.pictureUrl,
        "datePublished": blog.date,
        "author": {
          "@type": "Organization",
          "name": "Twentysix.House"
        },
        "url": `https://twentysix.house/blogs/detail/${blog._id.$oid}`,
        "position": index + 1
      }))
    };

    this.jsonLd.insertSchema('blog-list', schema);
  }
}
