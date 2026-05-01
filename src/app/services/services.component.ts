import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { JsonLdService } from '../_service/json-ld.service';
import Rellax from 'rellax';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit, OnDestroy {

  isBrowser = false;
  private rellaxInstance?: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private jsonLd: JsonLdService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.insertLocalBusinessJsonLd();
    this.insertWebsiteJsonLd();
    this.insertServicePageJsonLd();
    this.insertServiceSchema();
    this.insertBreadcrumbJsonLd();

    if (this.isBrowser) {
      this.initLayout();
      this.rellaxInstance = new Rellax('.rellax-header');
    }
  }

  ngOnDestroy(): void {
    this.jsonLd.removeSchema('local-business');
    this.jsonLd.removeSchema('website');
    this.jsonLd.removeSchema('service-page');
    this.jsonLd.removeSchema('service');
    this.jsonLd.removeSchema('breadcrumb');
    this.rellaxInstance?.destroy();
    this.rellaxInstance = undefined;

    if (!this.isBrowser) return;

    this.renderer.removeClass(this.document.body, 'services-page-body');
  }

  private initLayout(): void {
    this.renderer.addClass(this.document.body, 'services-page-body');
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

    this.jsonLd.insertSchema('local-business', jsonLd);
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

    this.jsonLd.insertSchema('website', jsonLd);
  }

  private insertServicePageJsonLd(): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${environment.siteUrl}/services#webpage`,
      url: `${environment.siteUrl}/services`,
      name: 'บริการรับสร้างบ้านอุดรธานี | Twentysix House',
      description: 'บริการรับสร้างบ้านอุดรธานี ออกแบบบ้าน วางแผนงบประมาณ ก่อสร้าง ตกแต่งภายใน และดูแลหลังส่งมอบโดย Twentysix House',
      isPartOf: {
        '@id': `${environment.siteUrl}/#website`
      },
      about: {
        '@id': `${environment.siteUrl}/services#service`
      },
      inLanguage: 'th-TH'
    };

    this.jsonLd.insertSchema('service-page', jsonLd);
  }

  private insertServiceSchema(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${environment.siteUrl}/services#service`,
      name: 'บริการรับสร้างบ้านอุดรธานี',
      description: 'บริการออกแบบบ้าน วางแผนงบประมาณ รับเหมาก่อสร้าง ตกแต่งภายใน และดูแลหลังส่งมอบของ Twentysix House ในจังหวัดอุดรธานี',
      url: `${environment.siteUrl}/services`,
      provider: {
        '@id': `${environment.siteUrl}/#localbusiness`
      },
      areaServed: {
        '@type': 'AdministrativeArea',
        name: 'อุดรธานี และภาคอีสานตอนบน'
      },
      audience: {
        '@type': 'Audience',
        audienceType: 'เจ้าของบ้านที่ต้องการบริการออกแบบและก่อสร้างบ้านครบวงจร'
      },
      serviceType: [
        'รับสร้างบ้านอุดรธานี',
        'ออกแบบบ้านอุดรธานี',
        'วางแผนงบประมาณสร้างบ้าน',
        'รับเหมาก่อสร้างบ้าน',
        'ตกแต่งภายใน',
        'บริการหลังการขาย'
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'บริการหลักของ Twentysix House',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'ปรึกษาเรื่องบ้านและวางแผนงบประมาณ'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'ออกแบบบ้านและเขียนแบบ'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'รับเหมาก่อสร้างบ้านและดูแลหลังส่งมอบ'
            }
          }
        ]
      }
    };

    this.jsonLd.insertSchema('service', schema);
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
          name: 'บริการของเรา',
          item: `${environment.siteUrl}/services`
        }
      ]
    };

    this.jsonLd.insertSchema('breadcrumb', jsonLd);
  }
}
