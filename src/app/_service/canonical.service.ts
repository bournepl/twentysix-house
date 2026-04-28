import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CanonicalService {

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) { }

  /**
   * ✅ Set canonical URL (absolute, clean, SEO-safe)
   */
  setCanonicalURL(path?: string): void {
    const head = this.document.head;
    const origin = this.document.location?.origin || environment.siteUrl;

    // 1️⃣ Normalize URL
    let canonicalUrl = origin;

    if (path) {
      canonicalUrl = /^https?:\/\//i.test(path)
        ? path
        : `${origin}${path.startsWith('/') ? path : `/${path}`}`;
    } else {
      canonicalUrl += this.document.location?.pathname || '/';
    }

    // 2️⃣ Remove query & hash
    canonicalUrl = canonicalUrl.split('?')[0].split('#')[0];

    // 3️⃣ Remove trailing slash (except root)
    if (canonicalUrl.endsWith('/') && canonicalUrl !== origin + '/') {
      canonicalUrl = canonicalUrl.slice(0, -1);
    }

    // 4️⃣ Create or update canonical tag
    let link: HTMLLinkElement | null =
      this.document.querySelector("link[rel='canonical']");

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }

    link.setAttribute('href', canonicalUrl);
  }

  /**
   * ❌ Remove canonical tag (rarely needed)
   */
  removeCanonicalTag(): void {
    const link = this.document.querySelector("link[rel='canonical']");
    if (link) {
      link.remove();
    }
  }
}
