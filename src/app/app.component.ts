import { Component, Inject, OnDestroy, OnInit, ViewChild, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { NavbarComponent } from './shared/navbar/navbar.component';
import Aos from 'aos';
import { Meta, Title } from '@angular/platform-browser';
import { CanonicalService } from './_service/canonical.service';
import { GtmService } from './_service/gtm.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'twentysix-house';
  private _router: Subscription;
  private readonly managedMetaSelectors = [
    'name="description"',
    'name="keywords"',
    'name="robots"',
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
  ];

  @ViewChild(NavbarComponent) navbar: NavbarComponent;

  isLoggedIn = false;

  constructor(
    private canonical: CanonicalService,
    private gtm: GtmService,
    private titleService: Title,
    private metaService: Meta,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object) {

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const route = this.getChild(this.activatedRoute);
        this.applyRouteSeo(route, event.urlAfterRedirects);
      });
  }

  getChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) route = route.firstChild;
    return route;
  }

  private applyRouteSeo(route: ActivatedRoute, currentUrl: string): void {
    const pageTitle = route.snapshot.title;
    const routeMeta = Array.isArray(route.snapshot.data['meta']) ? [...route.snapshot.data['meta']] : [];
    const canonicalPath = route.snapshot.data['canonical'] || currentUrl;
    const canonicalUrl = this.toAbsoluteUrl(canonicalPath);

    if (pageTitle) {
      this.titleService.setTitle(pageTitle);
    }

    const description = routeMeta.find((tag: any) => tag.name === 'description')?.content;
    const ogImage = routeMeta.find((tag: any) => tag.property === 'og:image')?.content;

    if (!routeMeta.some((tag: any) => tag.property === 'og:url')) {
      routeMeta.push({ property: 'og:url', content: canonicalUrl });
    }

    if (!routeMeta.some((tag: any) => tag.property === 'og:type')) {
      routeMeta.push({ property: 'og:type', content: 'website' });
    }

    if (!routeMeta.some((tag: any) => tag.property === 'og:site_name')) {
      routeMeta.push({ property: 'og:site_name', content: 'Twentysix House' });
    }

    if (!routeMeta.some((tag: any) => tag.property === 'og:locale')) {
      routeMeta.push({ property: 'og:locale', content: 'th_TH' });
    }

    if (!routeMeta.some((tag: any) => tag.name === 'twitter:card')) {
      routeMeta.push({ name: 'twitter:card', content: 'summary_large_image' });
    }

    if (pageTitle && !routeMeta.some((tag: any) => tag.name === 'twitter:title')) {
      routeMeta.push({ name: 'twitter:title', content: pageTitle });
    }

    if (description && !routeMeta.some((tag: any) => tag.name === 'twitter:description')) {
      routeMeta.push({ name: 'twitter:description', content: description });
    }

    if (ogImage && !routeMeta.some((tag: any) => tag.name === 'twitter:image')) {
      routeMeta.push({ name: 'twitter:image', content: ogImage });
    }

    this.managedMetaSelectors.forEach((selector) => this.metaService.removeTag(selector));
    routeMeta.forEach((tag: any) => this.metaService.updateTag(tag));
    this.canonical.setCanonicalURL(canonicalUrl);
  }

  private toAbsoluteUrl(pathOrUrl: string): string {
    if (/^https?:\/\//i.test(pathOrUrl)) {
      return pathOrUrl;
    }

    const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
    return `${environment.siteUrl}${normalizedPath === '/' ? '' : normalizedPath}`;
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.gtm.initGtm();
      Aos.init({
        duration: 800,
        disable: () => window.innerWidth <= 991.98,
      });
      this._router = this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe((event) => {
          (window as any).dataLayer = (window as any).dataLayer || [];
          (window as any).dataLayer.push({
            event: 'page_view',
            page_path: event.urlAfterRedirects,
          });

          this.navbar.sidebarClose();
          this.scrollToTop();
          requestAnimationFrame(() => Aos.refreshHard());
        });
    }
  }

  private scrollToTop(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const runScrollTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      const wrapper = document.querySelector('.wrapper') as HTMLElement | null;
      if (wrapper) {
        wrapper.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        wrapper.scrollTop = 0;
      }
    };

    runScrollTop();
    requestAnimationFrame(runScrollTop);
    setTimeout(runScrollTop, 0);
  }

  ngOnDestroy() {
    this._router?.unsubscribe();
  }
}
