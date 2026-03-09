import { Component, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { JsonLdService } from '../_service/json-ld.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import Aos from 'aos';
import { SeoService } from '../_service/seo.service';
import { CanonicalService } from '../_service/canonical.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {
  isBrowser = false;

  constructor(

    private jsonLdService: JsonLdService,
    private seo: SeoService,
    private canonicalService: CanonicalService,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  ngOnInit(): void {
    if (this.isBrowser) {
      this.canonicalService.setCanonicalURL('/about');
      Aos.init({ duration: 800 });
      this.renderer.addClass(this.document.body, 'about-page');

      this.seo.updateMetaTags({
        title: 'เกี่ยวกับเรา - Twentysix.house',
        description: 'เกี่ยวกับบริษัทรับสร้างบ้าน Twentysix.House ที่เน้นคุณภาพและความใส่ใจในทุกขั้นตอน สร้างบ้านในฝันที่คุณต้องการ พร้อมรับรองคุณภาพด้วยมาตรฐาน',
        image: 'https://twentysix.house/assets/img/head.png',
        url: 'https://twentysix.house/about'
      });
    }

    this.insertOrganizationJsonLd();
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.jsonLdService.removeSchema('organization');
      this.renderer.removeClass(this.document.body, 'about-page');
    }
  }

  private insertOrganizationJsonLd() {
    const jsonLd = {
      "@id": "https://twentysix.house/#organization",
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Twentysix Development Co., Ltd.",
      "url": this.document.location.href,
      "logo": "https://twentysix.house/assets/img/head.png",
      "sameAs": [
        "https://www.facebook.com/share/19APWzVgu7/?mibextid=wwXIfr",
        "https://www.instagram.com/26twentysix.house?igsh=YXFmMWt3bGhlaHpm",
        "https://www.tiktok.com/@twentysix.house?_t=ZS-8vm31ijyhPc&_r=1",
        "https://lin.ee/jzuOAtF"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+66994708877",
        "contactType": "Customer Service",
        "areaServed": "TH",
        "availableLanguage": "Thai"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "127/2 ถ.โพนพิสัย",
        "addressLocality": "อ.เมือง",
        "addressRegion": "จ.อุดรธานี",
        "postalCode": "41000",
        "addressCountry": "TH"
      }
    };
    this.jsonLdService.insertSchema('organization', jsonLd);
  }
}
