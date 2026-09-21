import { Component } from '@angular/core';

import blogData from '../../assets/json/blog.json';
import categoryData from '../../assets/json/blogCategory.json';
import { SeoService } from '../shared/seo.service';
import {
  ORGANIZATION_ID,
  WEBSITE_ID,
  breadcrumbSchema,
  itemListSchema,
  structuredDataGraph,
} from '../shared/structured-data';

interface BlogListItem {
  _id: { $oid: string };
  title: string;
  subTitle: string;
  blogCategory: { blogCategoryName: string };
  date: string;
  dateFormat: string;
  pictureUrl: string;
  status: boolean;
  slug: string;
  publishedAt: number;
  dateLabel: string;
}

@Component({
  selector: 'app-new-blog-list',
  templateUrl: './new-blog-list.component.html',
  styleUrl: './new-blog-list.component.scss'
})
export class NewBlogListComponent {
  activeCategory = 'ทั้งหมด';

  readonly categories = [
    'ทั้งหมด',
    ...categoryData.map(category => category.blogCategoryName),
  ];

  readonly blogs: BlogListItem[] = (blogData as Omit<BlogListItem, 'publishedAt' | 'dateLabel'>[])
    .filter(blog => blog.status)
    .map(blog => ({
      ...blog,
      publishedAt: Number(blog.dateFormat),
      dateLabel: this.formatDate(Number(blog.dateFormat)),
    }))
    .sort((a, b) => b.publishedAt - a.publishedAt);

  readonly featuredBlog = this.blogs[0];

  constructor(seo: SeoService) {
    const url = 'https://twentysix.house/blogs';
    const title = 'บทความสร้างบ้านและออกแบบบ้าน | Twentysix House';
    const description = 'รวมบทความสร้างบ้าน ออกแบบบ้าน งานโครงสร้าง และคำแนะนำสำหรับเจ้าของบ้านจากทีม Twentysix House';

    seo.updatePage({
      title,
      description,
      url,
      image: this.featuredBlog?.pictureUrl,
      preloadImage: 'assets/img/seo/blog-hero-1600.webp',
      preloadImageSrcset: 'assets/img/seo/blog-hero-960.webp 960w, assets/img/seo/blog-hero-1600.webp 1600w',
      preloadImageSizes: '100vw',
      structuredData: structuredDataGraph(
        {
          '@type': 'Blog',
          '@id': `${url}#blog`,
          url,
          name: title,
          description,
          inLanguage: 'th-TH',
          isPartOf: { '@id': WEBSITE_ID },
          publisher: { '@id': ORGANIZATION_ID },
          blogPost: this.blogs.map(blog => ({ '@id': `${url}/${blog.slug}#article` })),
        },
        breadcrumbSchema([
          { name: 'หน้าแรก', url: 'https://twentysix.house' },
          { name: 'บทความ', url },
        ]),
        itemListSchema('บทความจาก Twentysix House', url, this.blogs.map(blog => ({
          name: blog.title,
          url: `${url}/${blog.slug}`,
          image: blog.pictureUrl,
        }))),
      ),
    });
  }

  get visibleBlogs(): BlogListItem[] {
    const filtered = this.activeCategory === 'ทั้งหมด'
      ? this.blogs
      : this.blogs.filter(blog => blog.blogCategory.blogCategoryName === this.activeCategory);

    return this.activeCategory === 'ทั้งหมด'
      ? filtered.filter(blog => blog._id.$oid !== this.featuredBlog?._id.$oid)
      : filtered;
  }

  selectCategory(category: string): void {
    this.activeCategory = category;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private formatDate(timestamp: number): string {
    return new Intl.DateTimeFormat('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(timestamp);
  }
}
