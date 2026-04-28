import { Component, OnDestroy, OnInit, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

interface NavbarLink {
  label: string;
  path: string;
  exact: boolean;
  children?: NavbarLink[];
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  private toggleButton: HTMLElement | undefined;
  private navbarRoot: HTMLElement | null = null;
  private scrollContainer: HTMLElement | null = null;
  private removeEventListeners: Array<() => void> = [];

  sidebarVisible = false;
  private routerSubscription?: Subscription;
  openDropdownPath: string | null = null;
  isScrolled = false;
  private isMobileViewport = false;

  private readonly transparentRoutePrefixes = [
    '/',
    '/about',
    '/services',
    '/ourworks',
    '/รับสร้างบ้าน-อุดรธานี',
  ];

  readonly navLinks: NavbarLink[] = [
    { label: 'หน้าแรก', path: '/', exact: true },
    { label: 'เกี่ยวกับเรา', path: '/about', exact: true },
    { label: 'บริการของเรา', path: '/services', exact: true },
    {
      label: 'ผลงานของเรา',
      path: '/ourworks',
      exact: false,
      children: [
        { label: 'ผลงานของเรา', path: '/ourworks', exact: true },
        { label: 'ผลงานจริง', path: '/ourworks/real-projects', exact: false },
        { label: 'ผลงานออกแบบ', path: '/ourworks/house-designs', exact: false },
      ],
    },
    { label: 'บทความ', path: '/blogs', exact: false },
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private element: ElementRef
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const navbar: HTMLElement = this.element.nativeElement;
      this.navbarRoot = navbar.querySelector('nav');
      this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0] as HTMLElement | undefined;
      this.updateViewportState();
      this.refreshScrollBindings();
      this.resetMobileNavState();
      this.updateScrollState();

      this.routerSubscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.resetMobileNavState();
          this.updateViewportState();
          this.refreshScrollBindings();
          this.updateScrollState();
          setTimeout(() => {
            this.updateViewportState();
            this.refreshScrollBindings();
            this.updateScrollState();
          });
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
    this.removeEventListeners.forEach((removeListener) => removeListener());
  }

  sidebarOpen(): void {
    const toggleButton = this.toggleButton;
    if (!toggleButton || !isPlatformBrowser(this.platformId)) return;

    toggleButton.classList.add('toggled');
    this.document.body.style.overflow = 'hidden';
    this.sidebarVisible = true;
    this.updateScrollState();
  }

  sidebarClose(): void {
    this.resetMobileNavState();
  }

  sidebarToggle(): void {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }

  openDropdown(path: string): void {
    this.openDropdownPath = path;
  }

  closeDropdown(path?: string): void {
    if (!path || this.openDropdownPath === path) {
      this.openDropdownPath = null;
    }
  }

  onDropdownFocusOut(event: FocusEvent, path: string): void {
    const nextTarget = event.relatedTarget as Node | null;
    const currentTarget = event.currentTarget as HTMLElement | null;

    if (!currentTarget || !nextTarget || !currentTarget.contains(nextTarget)) {
      this.closeDropdown(path);
    }
  }

  onNavSelection(event?: Event): void {
    this.closeDropdown();
    this.resetMobileNavState();

    const target = event?.currentTarget as HTMLElement | null;
    target?.blur();
  }

  isCurrentRoute(path: string): boolean {
    const currentUrl = this.router.url.split('?')[0];
    return currentUrl === path;
  }

  isRouteActive(path: string, exact = false): boolean {
    const currentUrl = this.router.url.split('?')[0];
    if (exact) {
      return currentUrl === path;
    }

    return currentUrl === path || currentUrl.startsWith(`${path}/`);
  }

  private resetMobileNavState(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.toggleButton?.classList.remove('toggled');
    this.document.body.style.overflow = '';
    this.sidebarVisible = false;
    this.updateScrollState();

    const bodyClick = this.document.getElementById('bodyClick');
    if (bodyClick?.parentNode) {
      bodyClick.parentNode.removeChild(bodyClick);
    }
  }

  private updateScrollState(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const currentWrapper = this.document.querySelector('.wrapper') as HTMLElement | null;
    if (currentWrapper && currentWrapper !== this.scrollContainer) {
      this.scrollContainer = currentWrapper;
    }

    const scrollCandidates = [
      this.document.defaultView?.scrollY,
      this.document.defaultView?.pageYOffset,
      this.scrollContainer?.scrollTop,
      this.document.scrollingElement?.scrollTop,
      this.document.documentElement?.scrollTop,
      this.document.body?.scrollTop,
      Math.abs(this.document.body?.getBoundingClientRect?.().top ?? 0),
    ].filter((value): value is number => typeof value === 'number' && !Number.isNaN(value));

    const scrollTop = scrollCandidates.length ? Math.max(...scrollCandidates) : 0;
    const shouldStartTransparent = this.shouldStartTransparent();
    this.isScrolled = this.sidebarVisible || !shouldStartTransparent || scrollTop > 60;
    this.navbarRoot?.classList.toggle('navbar-solid', this.isScrolled);
    this.navbarRoot?.classList.toggle('navbar-transparent', !this.isScrolled);
    this.applyMobileNavbarStyle();
  }

  private shouldStartTransparent(): boolean {
    const currentUrl = this.router.url.split('?')[0];

    return this.transparentRoutePrefixes.some((prefix) => {
      if (prefix === '/') {
        return currentUrl === '/';
      }

      return currentUrl === prefix || currentUrl.startsWith(`${prefix}/`);
    });
  }

  private refreshScrollBindings(): void {
    this.removeEventListeners.forEach((removeListener) => removeListener());
    this.removeEventListeners = [];

    this.scrollContainer = this.document.querySelector('.wrapper') as HTMLElement | null;
    const viewport = this.document.defaultView;
    if (!viewport) return;

    const syncScrollState = () => {
      this.updateViewportState();
      this.updateScrollState();
    };
    const listeners: Array<[EventTarget, string]> = [
      [viewport, 'scroll'],
      [viewport, 'touchmove'],
      [viewport, 'resize'],
      [this.document, 'scroll'],
      [this.document, 'touchmove'],
    ];

    if (this.document.scrollingElement) {
      listeners.push([this.document.scrollingElement, 'scroll']);
    }

    if (viewport.visualViewport) {
      listeners.push([viewport.visualViewport, 'scroll']);
      listeners.push([viewport.visualViewport, 'resize']);
    }

    if (this.scrollContainer) {
      listeners.push([this.scrollContainer, 'scroll']);
      listeners.push([this.scrollContainer, 'touchmove']);
    }

    listeners.forEach(([target, eventName]) => {
      target.addEventListener(eventName, syncScrollState, { passive: true });
      this.removeEventListeners.push(() => target.removeEventListener(eventName, syncScrollState));
    });
  }

  private updateViewportState(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isMobileViewport = (this.document.defaultView?.innerWidth ?? window.innerWidth) <= 991.98;
  }

  private applyMobileNavbarStyle(): void {
    if (!this.navbarRoot) return;

    if (this.isMobileViewport && this.isScrolled) {
      this.navbarRoot.style.background = 'rgba(9, 24, 38, 0.97)';
      this.navbarRoot.style.boxShadow = '0 14px 34px rgba(4, 10, 18, 0.32)';
      this.navbarRoot.style.backdropFilter = 'blur(14px)';
      (this.navbarRoot.style as CSSStyleDeclaration & { webkitBackdropFilter?: string }).webkitBackdropFilter =
        'blur(14px)';
      return;
    }

    this.navbarRoot.style.background = '';
    this.navbarRoot.style.boxShadow = '';
    this.navbarRoot.style.backdropFilter = '';
    (this.navbarRoot.style as CSSStyleDeclaration & { webkitBackdropFilter?: string }).webkitBackdropFilter = '';
  }
}
