import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import Aos from 'aos';
import Rellax from 'rellax';
import { Blog } from '../../_model/blog';
import { BlogService } from '../../_service/blog.service';
import { JsonLdService } from '../../_service/json-ld.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit, OnDestroy {
  readonly allCategory = 'ทั้งหมด';
  readonly isBrowser: boolean;
  readonly pageSize = 6;
  readonly breadcrumbs = [
    { label: 'หน้าแรก', path: '/' },
    { label: 'บทความ' },
  ];

  readonly heroPoints = [
    {
      title: 'เริ่มวางแผนสร้างบ้านให้ชัดขึ้น',
      description: 'รวมเรื่องที่เจ้าของบ้านควรรู้ก่อนคุยแบบ งบประมาณ และขั้นตอนก่อสร้าง',
    },
    {
      title: 'อ่านจากมุมมองทีมทำงานจริง',
      description: 'คัดเรื่องออกแบบบ้าน งานโครงสร้าง และการเลือกวัสดุที่เจอบ่อยในงานบ้านพักอาศัย',
    },
    {
      title: 'ต่อยอดไปคุยโครงการได้ง่าย',
      description: 'ใช้บทความเป็นจุดตั้งต้นในการถามทีมงานและเตรียมโจทย์บ้านของคุณ',
    },
  ];

  readonly ctaPoints = [
    'คุยโจทย์ที่ดินและงบประมาณ',
    'ช่วยแนะนำแนวทางออกแบบบ้าน',
    'ต่อยอดจากบทความไปสู่แผนงานจริง',
  ];

  blogs: Blog[] = [];
  categories: string[] = [this.allCategory];
  selectedCategory = this.allCategory;
  page = 1;
  private rellaxInstance?: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private blogService: BlogService,
    private jsonLd: JsonLdService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.loadBlogs();

    if (!this.isBrowser) {
      return;
    }

    this.renderer.addClass(this.document.body, 'blogs-page');
    this.rellaxInstance = new Rellax('.rellax-header');
  }

  ngOnDestroy(): void {
    this.jsonLd.removeSchema('blog-list');
    this.rellaxInstance?.destroy();
    this.rellaxInstance = undefined;

    if (this.isBrowser) {
      this.renderer.removeClass(this.document.body, 'blogs-page');
    }
  }

  loadBlogs(): void {
    this.blogService.getAll().subscribe((data: Blog[]) => {
      this.blogs = data
        .filter((blog) => blog.status !== false)
        .sort((a, b) => this.getBlogTime(b) - this.getBlogTime(a));
      this.categories = [
        this.allCategory,
        ...Array.from(new Set(this.blogs.map((blog) => this.getCategoryName(blog)).filter(Boolean))),
      ];

      this.insertBlogListSchema();
      this.refreshAos();
    });
  }

  get filteredBlogs(): Blog[] {
    if (this.selectedCategory === this.allCategory) {
      return this.blogs;
    }

    return this.blogs.filter((blog) => this.getCategoryName(blog) === this.selectedCategory);
  }

  get featuredBlog(): Blog | undefined {
    return this.filteredBlogs[0];
  }

  get articleBlogs(): Blog[] {
    return this.filteredBlogs;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.page = 1;
    this.scrollToArticleCatalog();
    this.refreshAos();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.scrollToArticleCatalog();
    this.refreshAos();
  }

  trackById(index: number, blog: Blog): string {
    return blog._id?.$oid || blog.bId;
  }

  trackByCategory(index: number, category: string): string {
    return category;
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

  private insertBlogListSchema(): void {
    const url = `${environment.siteUrl}/blogs`;

    this.jsonLd.insertSchema('blog-list', {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': `${url}#webpage`,
          name: 'บทความสร้างบ้านและออกแบบบ้าน | Twentysix House',
          description:
            'รวมบทความสร้างบ้าน ออกแบบบ้าน งานโครงสร้าง และคำแนะนำสำหรับเจ้าของบ้านในอุดรธานีจาก Twentysix House',
          url,
          inLanguage: 'th-TH',
          mainEntity: {
            '@id': `${url}#itemlist`,
          },
        },
        {
          '@type': 'ItemList',
          '@id': `${url}#itemlist`,
          numberOfItems: this.blogs.length,
          itemListElement: this.blogs.map((blog, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${url}/${this.getBlogSlug(blog)}`,
            name: blog.title,
            image: blog.pictureUrl,
          })),
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${url}#breadcrumb`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'หน้าแรก',
              item: `${environment.siteUrl}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'บทความ',
              item: url,
            },
          ],
        },
      ],
    });
  }

  private getBlogTime(blog: Blog): number {
    const timestamp = Number((blog as Blog & { dateFormat?: string }).dateFormat);
    if (!Number.isNaN(timestamp) && timestamp > 0) {
      return timestamp;
    }

    return new Date(blog.date).getTime() || 0;
  }

  private refreshAos(): void {
    if (!this.isBrowser) {
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => Aos.refreshHard());
    });
  }

  private scrollToArticleCatalog(): void {
    if (!this.isBrowser) {
      return;
    }

    requestAnimationFrame(() => {
      const list = this.document.querySelector('.blogs-list') as HTMLElement | null;

      if (!list) {
        return;
      }

      const offset = 96;
      window.scrollTo({
        top: window.scrollY + list.getBoundingClientRect().top - offset,
        behavior: 'smooth',
      });
    });
  }
}
