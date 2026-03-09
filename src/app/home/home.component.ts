import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import Rellax from 'rellax';
import AOS from 'aos';
import { Blog } from '../_model/blog';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { BlogService } from '../_service/blog.service';
import { Router } from '@angular/router';
import { CanonicalService } from '../_service/canonical.service';
import { JsonLdService } from '../_service/json-ld.service';
import { finalize } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  isBrowser = false;
  today: Date = new Date();

  COMPANY_LOCATION = { lat: 17.4176173, lng: 102.8000109 };
  center: google.maps.LatLngLiteral = { ...this.COMPANY_LOCATION };
  zoom = 15;
  markers = [{ ...this.COMPANY_LOCATION }];

  getBlogs: Blog[] = [];

  constructor(
    private renderer: Renderer2,
    private loadingBar: LoadingBarService,
    private blogService: BlogService,
    private router: Router,
    private jsonLdService: JsonLdService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /* =============================
     LIFECYCLE
  ============================= */

  ngOnInit(): void {


    /** ✅ ใส่ LocalBusiness schema (ทำงานได้ทั้ง SSR + Browser) */
    this.insertLocalBusinessJsonLd();

    if (!this.isBrowser) return;

    /** Browser-only effects */
    this.initAnimations();
    this.initLayout();
    this.loadHomeBlogs();
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    this.jsonLdService.removeSchema('home-blog-list');
    this.jsonLdService.removeSchema('local-business');

    this.renderer.removeClass(this.document.body, 'landing-page');
    const navbar = this.document.getElementsByTagName('nav')[0];
    if (navbar) {
      this.renderer.removeClass(navbar, 'navbar-transparent');
    }
  }

  /* =============================
     UI / EFFECTS
  ============================= */

  private initAnimations(): void {
    AOS.init({ duration: 800 });
    new Rellax('.rellax-header');
  }

  private initLayout(): void {
    this.renderer.addClass(this.document.body, 'landing-page');
    const navbar = this.document.getElementsByTagName('nav')[0];
    if (navbar) {
      this.renderer.addClass(navbar, 'navbar-transparent');
    }
  }

  /* =============================
     BLOG (HOME PREVIEW)
  ============================= */

  private loadHomeBlogs(): void {
    this.loadingBar.start();

    this.blogService.getAll()
      .pipe(finalize(() => this.loadingBar.complete()))
      .subscribe({
        next: (data) => {
          this.getBlogs = data.slice(0, 3);

          /** Home = ItemList เท่านั้น */
          this.jsonLdService.insertSchema(
            'home-blog-list',
            this.generateBlogItemListJsonLd(this.getBlogs)
          );
        },
        error: (err) => console.error(err)
      });
  }

  onDetail(id: string): void {
    this.router.navigate(['/blogs/detail', id]);
  }

  trackById(index: number, blog: Blog): string {
    return blog._id.$oid;
  }

  /* =============================
     JSON-LD
  ============================= */

  /**
   * ✅ Home Blog = ItemList (ถูกต้องตาม Google)
   */
  private generateBlogItemListJsonLd(blogs: Blog[]) {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "บทความและสาระเรื่องบ้าน - Twentysix.House",
      "itemListElement": blogs.map((blog: any, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://twentysix.house/blogs/detail/${blog._id.$oid}`,
        "name": blog.title,
        "description": blog.subTitle,
        "image": blog.pictureUrl
      }))
    };
  }

  /**
   * ✅ LocalBusiness (แรงกว่า Organization สำหรับ Local SEO)
   */
  private insertLocalBusinessJsonLd(): void {

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://twentysix.house/#localbusiness",
      "name": "Twentysix Development Co., Ltd.",
      "url": "https://twentysix.house",
      "logo": "https://twentysix.house/assets/img/head.png",
      "image": "https://twentysix.house/assets/img/head.png",
      "telephone": "+66994708877",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "127/2 ถนนโพนพิสัย",
        "addressLocality": "อำเภอเมือง",
        "addressRegion": "อุดรธานี",
        "postalCode": "41000",
        "addressCountry": "TH"
      },
      "areaServed": {
        "@type": "AdministrativeArea",
        "name": "Udon Thani"
      },
      "sameAs": [
        "https://www.facebook.com/share/19APWzVgu7/?mibextid=wwXIfr",
        "https://www.instagram.com/26twentysix.house",
        "https://www.tiktok.com/@twentysix.house",
        "https://lin.ee/jzuOAtF"
      ]
    };

    this.jsonLdService.insertSchema('local-business', jsonLd);
  }
}
