import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

type SeoTag = {
  name?: string;
  property?: string;
  content: string;
};

type SeoConfig = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  canonicalPath?: string;
  canonicalUrl?: string;
  keywords?: string[] | string;
  robots?: string;
  ogType?: string;
  twitterCard?: string;
  extraTags?: SeoTag[];
};

const DEFAULT_OG_IMAGE =
  'https://firebasestorage.googleapis.com/v0/b/tewntysix-house.appspot.com/o/head.webp?alt=media&token=b53fc010-7a3c-49e3-8039-1cfed666e1ec';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly managedMetaSelectors = [
    'name="description"',
    'name="keywords"',
    'name="robots"',
    'name="author"',
    'name="twitter:card"',
    'name="twitter:title"',
    'name="twitter:description"',
    'name="twitter:image"',
    'property="og:title"',
    'property="og:description"',
    'property="og:url"',
    'property="og:image"',
    'property="og:type"',
    'property="og:site_name"',
    'property="og:locale"',
    'property="article:published_time"',
    'property="article:modified_time"',
  ];

  constructor(
    private meta: Meta,
    private titleService: Title,
    @Inject(DOCUMENT) private document: Document
  ) { }

  applyRouteSeo(route: ActivatedRoute, currentUrl: string): void {
    const pageTitle = route.snapshot.title;
    const routeMeta = Array.isArray(route.snapshot.data['meta']) ? [...route.snapshot.data['meta']] : [];
    const canonicalPath = route.snapshot.data['canonical'] || currentUrl;

    const description = routeMeta.find((tag: SeoTag) => tag.name === 'description')?.content;
    const image = routeMeta.find((tag: SeoTag) => tag.property === 'og:image')?.content;
    const keywords = routeMeta.find((tag: SeoTag) => tag.name === 'keywords')?.content;
    const robots = routeMeta.find((tag: SeoTag) => tag.name === 'robots')?.content;
    const ogType = routeMeta.find((tag: SeoTag) => tag.property === 'og:type')?.content;
    const extraTags = routeMeta.filter((tag: SeoTag) => {
      const key = tag.name ? `name="${tag.name}"` : `property="${tag.property}"`;
      return !this.managedMetaSelectors.includes(key);
    });

    this.updatePageSeo({
      title: pageTitle,
      description,
      image,
      keywords,
      robots,
      ogType,
      canonicalPath,
      extraTags,
    });
  }

  updatePageSeo(config: SeoConfig): void {
    const canonicalUrl = this.getCanonicalUrl(config);
    const title = config.title;
    const description = config.description;
    const image = config.image || DEFAULT_OG_IMAGE;
    const keywords = Array.isArray(config.keywords) ? config.keywords.filter(Boolean).join(', ') : config.keywords;
    const robots = config.robots || 'index, follow';
    const ogType = config.ogType || 'website';
    const twitterCard = config.twitterCard || 'summary_large_image';
    const metaTags: SeoTag[] = [
      { name: 'robots', content: robots },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:type', content: ogType },
      { property: 'og:site_name', content: 'Twentysix House' },
      { property: 'og:locale', content: 'th_TH' },
      { name: 'twitter:card', content: twitterCard },
    ];

    if (title) {
      this.titleService.setTitle(title);
      metaTags.push(
        { property: 'og:title', content: title },
        { name: 'twitter:title', content: title },
      );
    }

    if (description) {
      metaTags.push(
        { name: 'description', content: description },
        { property: 'og:description', content: description },
        { name: 'twitter:description', content: description },
      );
    }

    if (image) {
      metaTags.push(
        { property: 'og:image', content: image },
        { name: 'twitter:image', content: image },
      );
    }

    if (keywords) {
      metaTags.push({ name: 'keywords', content: keywords });
    }

    this.removeManagedMetaTags();
    [...metaTags, ...(config.extraTags || [])].forEach((tag) => this.meta.updateTag(tag));
    this.setCanonicalUrl(canonicalUrl);
  }

  removeManagedMetaTags(): void {
    this.managedMetaSelectors.forEach((selector) => this.meta.removeTag(selector));
  }

  toAbsoluteUrl(pathOrUrl: string): string {
    if (/^https?:\/\//i.test(pathOrUrl)) {
      return pathOrUrl.split('?')[0].split('#')[0];
    }

    const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
    const absoluteUrl = `${environment.siteUrl}${normalizedPath === '/' ? '' : normalizedPath}`;
    return absoluteUrl.split('?')[0].split('#')[0];
  }

  private getCanonicalUrl(config: SeoConfig): string {
    if (config.canonicalUrl) {
      return this.toAbsoluteUrl(config.canonicalUrl);
    }

    if (config.canonicalPath) {
      return this.toAbsoluteUrl(config.canonicalPath);
    }

    if (config.url) {
      return this.toAbsoluteUrl(config.url);
    }

    return this.toAbsoluteUrl(this.document.location?.pathname || '/');
  }

  private setCanonicalUrl(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }
}
