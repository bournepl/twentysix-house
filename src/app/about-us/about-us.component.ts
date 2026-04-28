import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { JsonLdService } from '../_service/json-ld.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import Rellax from 'rellax';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent implements OnInit, OnDestroy {
  isBrowser = false;
  private rellaxInstance?: any;

  constructor(
    private jsonLdService: JsonLdService,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.insertLocalBusinessJsonLd();
    this.insertWebsiteJsonLd();
    this.insertAboutPageJsonLd();
    this.insertBreadcrumbJsonLd();

    if (this.isBrowser) {
      this.rellaxInstance = new Rellax('.rellax-header');
      this.renderer.addClass(this.document.body, 'about-page');
    }
  }

  ngOnDestroy(): void {
    this.jsonLdService.removeSchema('local-business');
    this.jsonLdService.removeSchema('website');
    this.jsonLdService.removeSchema('about-page');
    this.jsonLdService.removeSchema('breadcrumb');
    this.rellaxInstance?.destroy();
    this.rellaxInstance = undefined;

    if (this.isBrowser) {
      this.renderer.removeClass(this.document.body, 'about-page');
    }
  }

  private insertLocalBusinessJsonLd(): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${environment.siteUrl}/#localbusiness`,
      name: 'Twentysix Development Co., Ltd.',
      url: environment.siteUrl,
      logo: 'https://firebasestorage.googleapis.com/v0/b/tewntysix-house.appspot.com/o/head.webp?alt=media&token=b53fc010-7a3c-49e3-8039-1cfed666e1ec',
      image: 'https://firebasestorage.googleapis.com/v0/b/tewntysix-house.appspot.com/o/head.webp?alt=media&token=b53fc010-7a3c-49e3-8039-1cfed666e1ec',
      telephone: '+66994708877',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '127/2 ถนนโพนพิสัย',
        addressLocality: 'อำเภอเมือง',
        addressRegion: 'อุดรธานี',
        postalCode: '41000',
        addressCountry: 'TH'
      },
      areaServed: {
        '@type': 'AdministrativeArea',
        name: 'Udon Thani'
      },
      sameAs: [
        'https://www.facebook.com/share/19APWzVgu7/?mibextid=wwXIfr',
        'https://www.instagram.com/26twentysix.house',
        'https://www.tiktok.com/@twentysix.house',
        'https://lin.ee/jzuOAtF'
      ]
    };

    this.jsonLdService.insertSchema('local-business', jsonLd);
  }

  private insertWebsiteJsonLd(): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${environment.siteUrl}/#website`,
      name: 'Twentysix House',
      alternateName: 'Twentysix Development Co., Ltd.',
      url: environment.siteUrl,
      inLanguage: 'th-TH'
    };

    this.jsonLdService.insertSchema('website', jsonLd);
  }

  private insertAboutPageJsonLd(): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      '@id': `${environment.siteUrl}/about#webpage`,
      url: `${environment.siteUrl}/about`,
      name: 'เกี่ยวกับเรา | บริษัทรับสร้างบ้านอุดรธานี Twentysix House',
      description: 'รู้จัก Twentysix House บริษัทรับสร้างบ้านอุดรธานี ที่ดูแลงานออกแบบและก่อสร้างบ้านอย่างเป็นระบบ พร้อมแนวคิดการทำงานและข้อมูลบริษัทที่ตรวจสอบได้',
      isPartOf: {
        '@id': `${environment.siteUrl}/#website`
      },
      about: {
        '@id': `${environment.siteUrl}/#localbusiness`
      },
      inLanguage: 'th-TH'
    };

    this.jsonLdService.insertSchema('about-page', jsonLd);
  }

  private insertBreadcrumbJsonLd(): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'หน้าแรก',
          item: environment.siteUrl
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'เกี่ยวกับเรา',
          item: `${environment.siteUrl}/about`
        }
      ]
    };

    this.jsonLdService.insertSchema('breadcrumb', jsonLd);
  }
}
