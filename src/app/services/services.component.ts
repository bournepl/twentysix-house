import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { SeoService } from '../_service/seo.service';
import { JsonLdService } from '../_service/json-ld.service';
import { CanonicalService } from '../_service/canonical.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit, OnDestroy {

  isBrowser = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private title: Title,
    private meta: Meta,
    private jsonLd: JsonLdService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.title.setTitle('บริการรับสร้างบ้านแบบครบวงจร | Twentysix.House');

    this.meta.updateTag({
      name: 'description',
      content: 'บริการรับสร้างบ้านแบบครบวงจรในจังหวัดอุดรธานี ออกแบบ ก่อสร้าง ควบคุมงาน และส่งมอบ โดยบริษัท Twentysix.House'
    });

    if (this.isBrowser) {
      this.insertServiceSchema();
    }
  }

  ngOnDestroy(): void {
    this.jsonLd.removeSchema('service');
  }

  private insertServiceSchema() {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "บริการรับสร้างบ้านแบบครบวงจร",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Twentysix.House",
        "address": {
          "@type": "PostalAddress",
          "addressRegion": "อุดรธานี",
          "addressCountry": "TH"
        }
      },
      "areaServed": {
        "@type": "AdministrativeArea",
        "name": "อุดรธานี และภาคอีสานตอนบน"
      },
      "serviceType": [
        "รับสร้างบ้าน",
        "ออกแบบบ้าน",
        "ก่อสร้างบ้าน",
        "ควบคุมงานก่อสร้าง"
      ]
    };

    this.jsonLd.insertSchema('service', schema);
  }
}
