import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import Rellax from 'rellax';
import { JsonLdService } from '../_service/json-ld.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-our-works',
  templateUrl: './our-works.component.html',
  styleUrl: './our-works.component.scss',
})
export class OurWorksComponent implements OnInit, OnDestroy {
  readonly isBrowser: boolean;
  private rellaxInstance?: any;

  readonly breadcrumbs = [
    { label: 'หน้าหลัก', path: '/' },
    { label: 'ผลงานของเรา' },
  ];

  readonly heroTrustItems = [
    'บ้านที่สร้างเสร็จจริง',
    'แบบบ้านสำหรับเริ่มวางแนวทาง',
    'ใช้เป็นตัวอย่างคุยงบและพื้นที่ได้'
  ];

  readonly paths = [
    {
      modifier: 'real',
      kicker: 'REAL PROJECTS',
      title: 'บ้านที่สร้างเสร็จจริง',
      typeLabel: 'ภาพถ่ายจากบ้านจริง',
      shortDescription: 'ดูบรรยากาศบ้านที่สร้างเสร็จจริง รายละเอียดหน้างาน วัสดุ และการใช้งานจริงหลังส่งมอบ',
      shortPoints: ['บ้านจริง', 'พื้นที่จริง', 'รายละเอียดงานก่อสร้าง'],
      image: 'assets/img/real-project/house9/1.jpg',
      alt: 'ผลงานบ้านจริงของ Twentysix House',
      link: '/ourworks/real-projects',
      buttonLabel: 'ดูผลงานจริง',
    },
    {
      modifier: 'design',
      kicker: 'HOUSE DESIGNS',
      title: 'แบบบ้านและแนวทางออกแบบ',
      typeLabel: 'ภาพแนวคิดและแบบบ้าน',
      shortDescription: 'ดูแนวทางรูปทรงบ้าน การจัดพื้นที่ และบรรยากาศที่ใช้เป็นต้นแบบก่อนเริ่มออกแบบจริง',
      shortPoints: ['ไอเดียบ้าน', 'รูปทรงและบรรยากาศ', 'ต่อยอดเป็นแบบจริง'],
      image: 'assets/img/house-design/collection1/1.jpg',
      alt: 'แบบบ้านของ Twentysix House',
      link: '/ourworks/house-designs',
      buttonLabel: 'ดูแบบบ้าน',
    },
  ];

  readonly ctaHighlights = [
    'ส่งตัวอย่างบ้านที่ชอบได้',
    'คุยต่อเรื่องที่ดินและงบประมาณ',
    'เลือกดูทั้งบ้านจริงและแบบบ้าน',
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private jsonLdService: JsonLdService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.insertLocalBusinessJsonLd();
    this.insertWebsiteJsonLd();
    this.insertOurWorksPageJsonLd();
    this.insertOurWorksItemListJsonLd();
    this.insertBreadcrumbJsonLd();

    if (!this.isBrowser) return;

    this.initLayout();
    this.rellaxInstance = new Rellax('.rellax-header');
  }

  ngOnDestroy(): void {
    this.jsonLdService.removeSchema('local-business');
    this.jsonLdService.removeSchema('website');
    this.jsonLdService.removeSchema('ourworks-page');
    this.jsonLdService.removeSchema('ourworks-item-list');
    this.jsonLdService.removeSchema('breadcrumb');
    this.rellaxInstance?.destroy();
    this.rellaxInstance = undefined;

    if (!this.isBrowser) return;

    this.renderer.removeClass(this.document.body, 'ourworks-page');
  }

  private initLayout(): void {
    this.renderer.addClass(this.document.body, 'ourworks-page');
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

  private insertOurWorksPageJsonLd(): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${environment.siteUrl}/ourworks#webpage`,
      url: `${environment.siteUrl}/ourworks`,
      name: 'ผลงานรับสร้างบ้านอุดรธานี | บ้านจริงและแบบบ้าน Twentysix House',
      description:
        'รวมผลงานรับสร้างบ้านอุดรธานี ทั้งบ้านที่สร้างจริงและแบบบ้านของ Twentysix House เพื่อช่วยให้เจ้าของบ้านเห็นคุณภาพงาน แนวคิดการออกแบบ และตัวอย่างที่นำไปคุยรายละเอียดโครงการได้ง่ายขึ้น',
      isPartOf: {
        '@id': `${environment.siteUrl}/#website`
      },
      about: {
        '@id': `${environment.siteUrl}/#localbusiness`
      },
      inLanguage: 'th-TH'
    };

    this.jsonLdService.insertSchema('ourworks-page', jsonLd);
  }

  private insertOurWorksItemListJsonLd(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${environment.siteUrl}/ourworks#itemlist`,
      name: 'หมวดผลงานของเรา',
      description: 'หมวดผลงานบ้านที่สร้างจริงและแบบบ้านของ Twentysix House',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'ผลงานจริง',
          url: `${environment.siteUrl}/ourworks/real-projects`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'แบบบ้าน',
          url: `${environment.siteUrl}/ourworks/house-designs`,
        },
      ],
    };

    this.jsonLdService.insertSchema('ourworks-item-list', schema);
  }

  private insertBreadcrumbJsonLd(): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'หน้าหลัก',
          item: environment.siteUrl
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'ผลงานของเรา',
          item: `${environment.siteUrl}/ourworks`
        }
      ]
    };

    this.jsonLdService.insertSchema('breadcrumb', jsonLd);
  }
}
