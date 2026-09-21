import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

export interface SeoPageConfig {
  title: string;
  description: string;
  url?: string;
  canonicalPath?: string;
  canonical?: boolean;
  image?: string | null;
  imageAlt?: string;
  preloadImage?: string;
  preloadImageSrcset?: string;
  preloadImageSizes?: string;
  type?: 'website' | 'article' | 'product';
  keywords?: string;
  robots?: string;
  publishedTime?: string;
  modifiedTime?: string;
  structuredData?: object | readonly object[];
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly siteUrl = 'https://twentysix.house';
  private readonly siteName = 'Twentysix.House';
  private readonly defaultImage = 'assets/img/house-catalog/pure-collection/collection-hero.webp';
  private readonly structuredDataPrefix = 'page-structured-data';
  private readonly managedNames = [
    'description',
    'keywords',
    'robots',
    'twitter:card',
    'twitter:title',
    'twitter:description',
    'twitter:image',
    'twitter:image:alt',
  ];
  private readonly managedProperties = [
    'og:title',
    'og:description',
    'og:url',
    'og:type',
    'og:site_name',
    'og:locale',
    'og:image',
    'og:image:alt',
    'article:published_time',
    'article:modified_time',
  ];

  constructor(
    private readonly title: Title,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {}

  updatePage(config: SeoPageConfig): void {
    const canonicalUrl = this.getCanonicalUrl(config);
    const image = config.image === null
      ? undefined
      : this.absoluteUrl(config.image || this.defaultImage);
    const imageAlt = config.imageAlt || config.title;

    this.title.setTitle(config.title);
    this.clearManagedMeta();

    this.addMeta('name', 'description', config.description);
    this.addMeta('name', 'robots', config.robots || 'index, follow');
    if (config.keywords) {
      this.addMeta('name', 'keywords', config.keywords);
    }

    this.addMeta('property', 'og:title', config.title);
    this.addMeta('property', 'og:description', config.description);
    this.addMeta('property', 'og:url', canonicalUrl);
    this.addMeta('property', 'og:type', config.type || 'website');
    this.addMeta('property', 'og:site_name', this.siteName);
    this.addMeta('property', 'og:locale', 'th_TH');

    this.addMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    this.addMeta('name', 'twitter:title', config.title);
    this.addMeta('name', 'twitter:description', config.description);

    if (image) {
      this.addMeta('property', 'og:image', image);
      this.addMeta('property', 'og:image:alt', imageAlt);
      this.addMeta('name', 'twitter:image', image);
      this.addMeta('name', 'twitter:image:alt', imageAlt);
    }

    if (config.type === 'article' && config.publishedTime) {
      this.addMeta('property', 'article:published_time', config.publishedTime);
    }
    if (config.type === 'article' && config.modifiedTime) {
      this.addMeta('property', 'article:modified_time', config.modifiedTime);
    }

    if (config.canonical === false) {
      this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.remove();
    } else {
      this.updateCanonical(canonicalUrl);
    }
    this.updateImagePreload(
      config.preloadImage,
      config.preloadImageSrcset,
      config.preloadImageSizes,
    );
    this.updateStructuredData(config.structuredData);
  }

  absoluteUrl(path: string): string {
    return new URL(path, `${this.siteUrl}/`).href;
  }

  clearPageSeo(): void {
    this.clearManagedMeta();
    this.clearStructuredData();
    this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.remove();
    this.document.getElementById('page-hero-preload')?.remove();
  }

  clearStructuredData(): void {
    this.document
      .querySelectorAll<HTMLScriptElement>('script[data-seo-structured-data="true"]')
      .forEach(script => script.remove());
    this.document.getElementById(this.structuredDataPrefix)?.remove();
  }

  private getCanonicalUrl(config: SeoPageConfig): string {
    const requestedUrl = config.url || config.canonicalPath || '/';
    const url = new URL(requestedUrl, `${this.siteUrl}/`);
    url.hash = '';
    url.search = '';

    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1);
    }

    return url.href;
  }

  private clearManagedMeta(): void {
    this.managedNames.forEach(name => this.removeMeta('name', name));
    this.managedProperties.forEach(property => this.removeMeta('property', property));
  }

  private removeMeta(attribute: 'name' | 'property', key: string): void {
    this.document.head
      .querySelectorAll<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
      .forEach(tag => tag.remove());
  }

  private addMeta(attribute: 'name' | 'property', key: string, content: string): void {
    const tag = this.document.createElement('meta');
    tag.setAttribute(attribute, key);
    tag.setAttribute('content', content);
    tag.setAttribute('data-seo-managed', 'true');
    this.document.head.appendChild(tag);
  }

  private updateCanonical(url: string): void {
    let canonical = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.appendChild(canonical);
    }

    canonical.href = url;
  }

  private updateImagePreload(image?: string, srcset?: string, sizes?: string): void {
    const id = 'page-hero-preload';
    let preload = this.document.getElementById(id) as HTMLLinkElement | null;

    if (!image) {
      preload?.remove();
      return;
    }

    if (!preload) {
      preload = this.document.createElement('link');
      preload.id = id;
      preload.rel = 'preload';
      preload.as = 'image';
      this.document.head.appendChild(preload);
    }

    preload.href = this.absoluteUrl(image);
    preload.setAttribute('fetchpriority', 'high');

    if (srcset) {
      preload.setAttribute('imagesrcset', srcset);
    } else {
      preload.removeAttribute('imagesrcset');
    }

    if (sizes) {
      preload.setAttribute('imagesizes', sizes);
    } else {
      preload.removeAttribute('imagesizes');
    }
  }

  private updateStructuredData(data?: object | readonly object[]): void {
    this.clearStructuredData();

    if (!data) {
      return;
    }

    const entries = Array.isArray(data) ? data : [data];
    entries.forEach((entry, index) => {
      const script = this.document.createElement('script');
      script.id = `${this.structuredDataPrefix}-${index + 1}`;
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-structured-data', 'true');
      script.textContent = JSON.stringify(entry).replace(/</g, '\\u003c');
      this.document.head.appendChild(script);
    });
  }
}
