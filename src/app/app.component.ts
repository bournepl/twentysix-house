import { Component, OnInit, Inject, Renderer2, ElementRef, ViewChild, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Location } from '@angular/common';

import { filter, map, mergeMap, Subscription } from 'rxjs';
import { NavbarComponent } from './shared/navbar/navbar.component';
import Aos from 'aos';
import { Meta, Title } from '@angular/platform-browser';
import { CanonicalService } from './_service/canonical.service';
import { GtmService } from './_service/gtm.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'twentysix-house';
  private _router: Subscription;

  @ViewChild(NavbarComponent) navbar: NavbarComponent;

  isLoggedIn = false;

  constructor(
    private canonical: CanonicalService,
    private gtm: GtmService,
    private titleService: Title,
    private metaService: Meta,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private router: Router, @Inject(DOCUMENT,)
    private document: any,
    @Inject(PLATFORM_ID) private platformId: any,
    private element: ElementRef,
    public location: Location) {

    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      const route = this.getChild(this.activatedRoute);
      const metaData = route.snapshot.data['meta'];
      if (metaData) {
        metaData.forEach((tag: any) => this.metaService.updateTag(tag));
      }
      if (route.snapshot.data['title']) {
        this.titleService.setTitle(route.snapshot.data['title']);
      }
    });
  }

  getChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) route = route.firstChild;
    return route;
  }
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.gtm.initGtm(); // ✅ เรียก GTM

      Aos.init({ duration: 800 });

      const navbar = this.document.querySelector('.navbar') as HTMLElement | null;
      if (!navbar) return;
      this._router = this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe((event) => {

          // ✅ canonical = path ปัจจุบัน
          this.canonical.setCanonicalURL(event.urlAfterRedirects);

          // GTM page view
          (window as any).dataLayer = (window as any).dataLayer || [];
          (window as any).dataLayer.push({
            event: 'page_view',
            page_path: event.urlAfterRedirects,
          });

          // UX
          this.navbar.sidebarClose();
        });


      this.renderer.listen('window', 'scroll', () => {
        const number = window.scrollY;
        const _location = this.location.path().split('/')[2];
        if (number > 100 || window.pageYOffset > 100) {
          navbar.classList.remove('navbar-transparent');
        } else if (_location !== 'login' && this.location.path() !== '/nucleoicons') {
          navbar.classList.add('navbar-transparent');
        }
      });
    }
  }

  ngOnDestroy() {
    this._router?.unsubscribe();
  }

}
