import { Component, Inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import { filter } from 'rxjs';
import { SeoPageConfig, SeoService } from './shared/seo.service';
import { staticPageStructuredData } from './shared/structured-data';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'twentysix-house';

  isLoggedIn = false;

  constructor(
    private seo: SeoService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Inject(DOCUMENT,)
    private document: any,
  ) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.updateRouteSeo();
    });
  }

  private updateRouteSeo(): void {
    const routeChain: ActivatedRoute[] = [];
    let route: ActivatedRoute | null = this.activatedRoute;

    while (route) {
      routeChain.push(route);
      route = route.firstChild;
    }

    if (routeChain.some(item => item.snapshot.data['seoManagedByComponent'])) {
      return;
    }

    const seoRoute = [...routeChain]
      .reverse()
      .find(item => item.snapshot.data['seo'] || item.snapshot.data['meta']);

    if (!seoRoute) {
      this.seo.clearPageSeo();
      return;
    }

    const data = seoRoute.snapshot.data;
    const explicitConfig = data['seo'] as Partial<SeoPageConfig> | undefined;
    const legacyMeta = (data['meta'] as Array<Record<string, string>> | undefined) || [];
    const metaContent = (attribute: 'name' | 'property', key: string): string | undefined =>
      legacyMeta.find(tag => tag[attribute] === key)?.['content'];
    const title = explicitConfig?.title || seoRoute.snapshot.title || this.document.title;
    const description = explicitConfig?.description || metaContent('name', 'description') || '';
    const image = explicitConfig && Object.prototype.hasOwnProperty.call(explicitConfig, 'image')
      ? explicitConfig.image
      : metaContent('property', 'og:image');
    const canonicalPath = explicitConfig?.canonicalPath || data['canonical'] || this.router.url;

    this.seo.updatePage({
      ...explicitConfig,
      title,
      description,
      canonicalPath,
      image,
      type: explicitConfig?.type || metaContent('property', 'og:type') as SeoPageConfig['type'],
      keywords: explicitConfig?.keywords || metaContent('name', 'keywords'),
      robots: explicitConfig?.robots || metaContent('name', 'robots'),
      structuredData: explicitConfig?.structuredData
        || staticPageStructuredData(canonicalPath.split('?')[0], title, description),
    });
  }
}
