import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { SeoService } from '../_service/seo.service';
import { JsonLdService } from '../_service/json-ld.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CanonicalService } from '../_service/canonical.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent implements OnInit, OnDestroy {

  isBrowser = false;

  constructor(
    private title: Title,
    private meta: Meta,
    private jsonLdService: JsonLdService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {

    /* ===== META ===== */
    this.title.setTitle('ติดต่อบริษัทรับสร้างบ้าน Twentysix.House จังหวัดอุดรธานี');

    this.meta.updateTag({
      name: 'description',
      content: 'ติดต่อบริษัทรับสร้างบ้านในอุดรธานี Twentysix.House ให้คำปรึกษาออกแบบและก่อสร้างบ้านครบวงจร ประสบการณ์กว่า 10 ปี'
    });

    this.meta.updateTag({
      property: 'og:title',
      content: 'ติดต่อบริษัทรับสร้างบ้าน Twentysix.House จังหวัดอุดรธานี'
    });

    this.meta.updateTag({
      property: 'og:description',
      content: 'บริษัทรับสร้างบ้านในอุดรธานี ให้บริการออกแบบและก่อสร้างครบวงจร ติดต่อทีมงาน Twentysix.House'
    });

    this.meta.updateTag({
      property: 'og:type',
      content: 'website'
    });

    if (this.isBrowser) {
      this.insertSchemas();
    }
  }

  private insertSchemas(): void {

    /* ===== Local Business Schema ===== */
    this.jsonLdService.insertSchema('local-business', {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Twentysix Development Co., Ltd.",
      "url": "https://twentysix.house/contact",
      "telephone": "+66994708877",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "127/2 ถ.โพนพิสัย",
        "addressLocality": "อ.เมือง",
        "addressRegion": "อุดรธานี",
        "postalCode": "41000",
        "addressCountry": "TH"
      }
    });

    /* ===== Breadcrumb Schema ===== */
    this.jsonLdService.insertSchema('breadcrumb-contact', {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "หน้าแรก",
          "item": "https://twentysix.house"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "ติดต่อเรา",
          "item": "https://twentysix.house/contact"
        }
      ]
    });
  }

  ngOnDestroy(): void {
    this.jsonLdService.removeSchema('local-business');
    this.jsonLdService.removeSchema('breadcrumb-contact');
  }
}
