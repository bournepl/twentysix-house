import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(
    private meta: Meta,
    private titleService: Title,
    @Inject(DOCUMENT) private doc: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  updateMetaTags(config: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    keywords?: string[];
  }) {
    this.removeMetaTags();
    if (config.title) {
      this.titleService.setTitle(config.title);
      this.meta.updateTag({ name: 'title', content: config.title });
      this.meta.updateTag({ property: 'og:title', content: config.title });
      this.meta.updateTag({ name: 'twitter:title', content: config.title });
    }

    if (config.description) {
      this.meta.updateTag({ name: 'description', content: config.description });
      this.meta.updateTag({ property: 'og:description', content: config.description });
      this.meta.updateTag({ name: 'twitter:description', content: config.description });
    }

    if (config.image) {
      this.meta.updateTag({ property: 'og:image', content: config.image });
      this.meta.updateTag({ name: 'twitter:image', content: config.image });
    }

    if (config.url) {
      this.meta.updateTag({ property: 'og:url', content: config.url });
    }

    if (config.keywords?.length) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords.join(', ') });
    }

    // Common meta tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
  }

  removeMetaTags(): void {
    const metaNames = [
      'title', 'description', 'keywords',
      'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'
    ];

    const metaProperties = [
      'og:title', 'og:description', 'og:image', 'og:url', 'og:type'
    ];

    // Remove by name
    metaNames.forEach(name => {
      this.meta.removeTag(`name="${name}"`);
    });

    // Remove by property
    metaProperties.forEach(prop => {

      this.meta.removeTag(`property="${prop}"`);
    });
  }
}
