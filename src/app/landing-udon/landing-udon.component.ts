import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { JsonLdService } from '../_service/json-ld.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-landing-udon',
  templateUrl: './landing-udon.component.html',
  styleUrl: './landing-udon.component.scss'
})
export class LandingUdonComponent implements OnInit {

  isBrowser = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private jsonLdService: JsonLdService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.insertLocalServiceSchema();
      this.insertBreadcrumbSchema();
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.jsonLdService.removeSchema('udon-service');
      this.jsonLdService.removeSchema('udon-breadcrumb');
    }
  }

  /* ===============================
     JSON-LD: Service + Local SEO
  =============================== */
  private insertLocalServiceSchema() {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": "https://twentysix.house/รับสร้างบ้าน-อุดรธานี#service",
      "name": "รับสร้างบ้านอุดรธานี",
      "description": "บริการรับสร้างบ้านในจังหวัดอุดรธานี ออกแบบและก่อสร้างบ้านครบวงจร โดยบริษัท Twentysix.House",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Twentysix Development Co., Ltd.",
        "url": "https://twentysix.house",
        "telephone": "+66994708877",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "อุดรธานี",
          "addressRegion": "อุดรธานี",
          "postalCode": "41000",
          "addressCountry": "TH"
        }
      },
      "areaServed": {
        "@type": "AdministrativeArea",
        "name": "จังหวัดอุดรธานี"
      }
    };

    this.jsonLdService.insertSchema('udon-service', schema);
  }

  /* ===============================
     JSON-LD: Breadcrumb
  =============================== */
  private insertBreadcrumbSchema() {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "หน้าแรก",
          "item": "https://twentysix.house/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "รับสร้างบ้านอุดรธานี",
          "item": "https://twentysix.house/รับสร้างบ้าน-อุดรธานี"
        }
      ]
    };

    this.jsonLdService.insertSchema('udon-breadcrumb', schema);
  }
}
