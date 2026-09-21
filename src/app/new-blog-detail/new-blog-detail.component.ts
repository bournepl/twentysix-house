import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import blogData from '../../assets/json/blog.json';
import { SeoService } from '../shared/seo.service';
import {
  BlogResourceLink,
  getBlogResourceLinks,
  getBlogTopic,
  getBlogTopicLabel,
} from '../shared/blog-content-clusters';
import {
  ORGANIZATION_ID,
  WEBSITE_ID,
  breadcrumbSchema,
  structuredDataGraph,
} from '../shared/structured-data';

interface BlogDetailItem {
  _id: { $oid: string };
  title: string;
  subTitle: string;
  content: string;
  blogCategory: { blogCategoryName: string };
  date: string;
  dateFormat: string;
  modifiedDateFormat?: string;
  pictureUrl: string;
  status: boolean;
  slug: string;
  tags: string[];
  publishedAt: number;
  modifiedAt: number;
  publishedIso: string;
  modifiedIso: string;
  dateLabel: string;
}

@Component({
  standalone: false,
  selector: 'app-new-blog-detail',
  templateUrl: './new-blog-detail.component.html',
  styleUrl: './new-blog-detail.component.scss'
})
export class NewBlogDetailComponent implements OnInit, OnDestroy {
  copied = false;
  blog?: BlogDetailItem;
  relatedBlogs: BlogDetailItem[] = [];
  topicLabel = '';
  contextualLinks: readonly BlogResourceLink[] = [];

  private readonly blogs: BlogDetailItem[] = (blogData as Omit<
    BlogDetailItem,
    'publishedAt' | 'modifiedAt' | 'publishedIso' | 'modifiedIso' | 'dateLabel'
  >[])
    .filter(item => item.status)
    .map(item => ({
      ...item,
      tags: item.tags ?? [],
      publishedAt: Number(item.dateFormat),
      modifiedAt: Number(item.modifiedDateFormat || item.dateFormat),
      publishedIso: new Date(Number(item.dateFormat)).toISOString(),
      modifiedIso: new Date(Number(item.modifiedDateFormat || item.dateFormat)).toISOString(),
      dateLabel: this.formatDate(Number(item.dateFormat)),
    }))
    .sort((a, b) => b.publishedAt - a.publishedAt);

  private routeSubscription?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly seo: SeoService,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const routeValue = params.get('slug') ?? params.get('id') ?? '';
      this.blog = this.blogs.find(item => item.slug === routeValue || item._id.$oid === routeValue);
      this.relatedBlogs = this.getRelatedBlogs(this.blog);
      this.topicLabel = this.blog ? getBlogTopicLabel(this.blog.slug) : '';
      this.contextualLinks = this.blog ? getBlogResourceLinks(this.blog.slug) : [];

      if (this.blog) {
        this.updateMetaTags(this.blog);
        if (params.has('id') && isPlatformBrowser(this.platformId)) {
          this.router.navigate(['/blogs', this.blog.slug], { replaceUrl: true });
        }
      } else {
        this.seo.updatePage({
          title: 'ไม่พบบทความ | Twentysix House',
          description: 'ไม่พบบทความที่คุณกำลังค้นหา',
          url: `https://twentysix.house${this.router.url.split('?')[0]}`,
          robots: 'noindex, follow',
          canonical: false,
          image: null,
        });
      }

      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  async copyArticleLink(): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(window.location.href);
    this.copied = true;
    window.setTimeout(() => this.copied = false, 1800);
  }

  private getRelatedBlogs(current?: BlogDetailItem): BlogDetailItem[] {
    if (!current) {
      return [];
    }

    const remaining = this.blogs.filter(item => item._id.$oid !== current._id.$oid);
    const currentTags = new Set(current.tags);

    return remaining
      .map(item => ({
        item,
        score:
          (getBlogTopic(item.slug) === getBlogTopic(current.slug) ? 6 : 0)
          + (item.blogCategory.blogCategoryName === current.blogCategory.blogCategoryName ? 3 : 0)
          + item.tags.filter(tag => currentTags.has(tag)).length,
      }))
      .sort((a, b) => b.score - a.score || b.item.publishedAt - a.item.publishedAt)
      .slice(0, 3)
      .map(result => result.item);
  }

  private updateMetaTags(blog: BlogDetailItem): void {
    const url = `https://twentysix.house/blogs/${blog.slug}`;
    const keywords = blog.tags.map(tag => tag.replace(/\s/g, '')).join(', ');
    const publishedTime = blog.publishedIso;

    this.seo.updatePage({
      title: `${blog.title} | Twentysix House`,
      description: blog.subTitle,
      url,
      image: blog.pictureUrl,
      type: 'article',
      keywords,
      publishedTime,
      modifiedTime: blog.modifiedIso,
      structuredData: structuredDataGraph(
        breadcrumbSchema([
          { name: 'หน้าแรก', url: 'https://twentysix.house' },
          { name: 'บทความ', url: 'https://twentysix.house/blogs' },
          { name: blog.title, url },
        ]),
        {
          '@type': 'WebPage',
          '@id': `${url}#webpage`,
          url,
          name: blog.title,
          description: blog.subTitle,
          inLanguage: 'th-TH',
          isPartOf: { '@id': WEBSITE_ID },
          mainEntity: { '@id': `${url}#article` },
        },
        {
          '@type': 'BlogPosting',
          '@id': `${url}#article`,
          headline: blog.title,
          description: blog.subTitle,
          image: blog.pictureUrl,
          author: { '@id': ORGANIZATION_ID },
          publisher: { '@id': ORGANIZATION_ID },
          datePublished: publishedTime,
          dateModified: blog.modifiedIso,
          mainEntityOfPage: { '@id': `${url}#webpage` },
          articleSection: blog.blogCategory.blogCategoryName,
          keywords: blog.tags,
          inLanguage: 'th-TH',
        },
      ),
    });
  }

  private formatDate(timestamp: number): string {
    return new Intl.DateTimeFormat('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(timestamp);
  }
}
