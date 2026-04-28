import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Subscription } from 'rxjs';
import { Blog } from '../../_model/blog';
import { BlogService } from '../../_service/blog.service';
import { JsonLdService } from '../../_service/json-ld.service';
import { SeoService } from '../../_service/seo.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit, OnDestroy {
  private routeSub?: Subscription;

  getBlogsById?: Blog;
  getBlogs: Blog[] = [];
  readonly isBrowser: boolean;

  constructor(
    private loadingBar: LoadingBarService,
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router,
    private seoService: SeoService,
    private jsonLdService: JsonLdService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      const id = params['slug'] || params['id'];

      if (!id) {
        this.router.navigate(['/blogs']);
        return;
      }

      this.loadBlog(id);
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.jsonLdService.removeSchema('blog-detail');
  }

  private loadBlog(id: string): void {
    if (this.isBrowser) {
      this.loadingBar.start();
    }

    this.blogService.getById(id).subscribe({
      next: (blog) => {
        if (!blog || blog.status === false) {
          this.router.navigate(['/blogs']);
          return;
        }

        if (this.isBrowser && this.shouldReplaceWithSlugUrl(id, blog)) {
          this.completeLoading();
          this.router.navigate(this.getBlogUrl(blog), { replaceUrl: true });
          return;
        }

        this.getBlogsById = blog;
        this.setMeta(blog);
        this.insertSchemas(blog);
        this.loadRelatedBlogs(blog);
        this.completeLoading();
      },
      error: () => {
        this.router.navigate(['/blogs']);
        this.completeLoading();
      }
    });
  }

  private loadRelatedBlogs(currentBlog: Blog): void {
    const currentId = this.getBlogId(currentBlog);
    const currentCategory = this.getCategoryName(currentBlog);

    this.blogService.getAll().subscribe({
      next: (blogs) => {
        const activeBlogs = blogs
          .filter((blog) => blog.status !== false && this.getBlogId(blog) !== currentId)
          .sort((a, b) => this.getBlogTime(b) - this.getBlogTime(a));

        const sameCategory = activeBlogs.filter((blog) => this.getCategoryName(blog) === currentCategory);
        const otherCategory = activeBlogs.filter((blog) => this.getCategoryName(blog) !== currentCategory);

        this.getBlogs = [...sameCategory, ...otherCategory].slice(0, 3);
      }
    });
  }

  private setMeta(blog: Blog): void {
    const url = this.getAbsoluteBlogUrl(blog);
    const image = this.toAbsoluteAssetUrl(blog.pictureUrl || 'assets/img/head.webp');
    const description = this.trimDescription(blog.subTitle || blog.title);
    const keywords = [
      blog.title,
      this.getCategoryName(blog),
      ...(blog.tags || []),
      'รับสร้างบ้านอุดรธานี',
      'สร้างบ้านอุดรธานี',
      'ออกแบบบ้านอุดรธานี',
      'Twentysix House'
    ].filter(Boolean);

    this.seoService.updatePageSeo({
      title: `${blog.title} | บทความสร้างบ้าน Twentysix House`,
      description,
      image,
      url,
      keywords,
      robots: 'index, follow, max-image-preview:large',
      ogType: 'article',
      extraTags: [
        { name: 'author', content: 'Twentysix House' },
        { property: 'article:published_time', content: this.getBlogDateIso(blog) },
        { property: 'article:modified_time', content: this.getBlogDateIso(blog) },
      ],
    });
  }

  private insertSchemas(blog: Blog): void {
    const url = this.getAbsoluteBlogUrl(blog);
    const image = this.toAbsoluteAssetUrl(blog.pictureUrl || 'assets/img/head.webp');

    this.jsonLdService.insertSchema('blog-detail', {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          '@id': `${url}#article`,
          headline: blog.title,
          description: this.trimDescription(blog.subTitle || blog.title),
          image: [image],
          datePublished: this.getBlogDateIso(blog),
          dateModified: this.getBlogDateIso(blog),
          inLanguage: 'th-TH',
          articleSection: this.getCategoryName(blog),
          keywords: (blog.tags || []).join(', '),
          author: {
            '@type': 'Organization',
            name: 'Twentysix House',
            url: environment.siteUrl,
          },
          publisher: {
            '@type': 'Organization',
            name: 'Twentysix House',
            logo: {
              '@type': 'ImageObject',
              url: `${environment.siteUrl}/assets/img/logobg.png`,
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url,
          },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${url}#breadcrumb`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'หน้าหลัก',
              item: `${environment.siteUrl}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'บทความ',
              item: `${environment.siteUrl}/blogs`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: blog.title,
              item: url,
            },
          ],
        },
      ],
    });
  }

  getBlogId(blog: Blog): string {
    return this.blogService.getBlogId(blog);
  }

  getBlogSlug(blog: Blog): string {
    return this.blogService.getBlogSlug(blog);
  }

  getCategoryName(blog: Blog): string {
    return blog.blogCategory?.blogCategoryName || 'บทความ';
  }

  getBlogUrl(blog: Blog): string[] {
    return ['/blogs', this.getBlogSlug(blog)];
  }

  getAbsoluteBlogUrl(blog: Blog): string {
    return `${environment.siteUrl}/blogs/${this.getBlogSlug(blog)}`;
  }

  getBlogTime(blog: Blog): number {
    const timestamp = Number(blog.dateFormat);

    if (!Number.isNaN(timestamp) && timestamp > 0) {
      return timestamp;
    }

    return new Date(blog.date).getTime() || 0;
  }

  trackById(index: number, blog: Blog): string {
    return blog._id?.$oid || blog.bId;
  }

  private getBlogDateIso(blog: Blog): string {
    const timestamp = this.getBlogTime(blog);

    if (timestamp > 0) {
      return new Date(timestamp).toISOString();
    }

    return new Date().toISOString();
  }

  private trimDescription(description: string): string {
    return description.replace(/\s+/g, ' ').trim().slice(0, 155);
  }

  private toAbsoluteAssetUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    return `${environment.siteUrl}/${path.replace(/^\/+/, '')}`;
  }

  private shouldReplaceWithSlugUrl(routeValue: string, blog: Blog): boolean {
    return this.route.snapshot.routeConfig?.path === 'detail/:id' || routeValue !== this.getBlogSlug(blog);
  }

  private completeLoading(): void {
    if (this.isBrowser) {
      this.loadingBar.complete();
    }
  }
}
