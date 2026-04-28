import { Component, Inject, OnDestroy, OnInit, ViewChild, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { NavbarComponent } from './shared/navbar/navbar.component';
import Aos from 'aos';
import { GtmService } from './_service/gtm.service';
import { SeoService } from './_service/seo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'twentysix-house';
  private _router: Subscription;

  @ViewChild(NavbarComponent) navbar: NavbarComponent;

  isLoggedIn = false;

  constructor(
    private seoService: SeoService,
    private gtm: GtmService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object) {

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const route = this.getChild(this.activatedRoute);
        this.seoService.applyRouteSeo(route, event.urlAfterRedirects);
      });
  }

  getChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) route = route.firstChild;
    return route;
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
