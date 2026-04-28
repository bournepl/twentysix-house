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

  readonly paths = [
    {
      kicker: 'REAL PROJECTS',
      title: 'ดูบ้านที่สร้างเสร็จจริง เพื่อเห็นคุณภาพงานก่อนตัดสินใจ',
      description:
        'เหมาะกับคนที่อยากเห็นบรรยากาศบ้านหลังสร้างเสร็จ รายละเอียดงาน และมาตรฐานการดูแลงานก่อสร้างของเรา',
      highlights: ['ดูบ้านที่สร้างเสร็จจริง', 'เห็นบรรยากาศและรายละเอียดงาน', 'ต่อยอดไปหน้ารายละเอียดโครงการได้'],
      image: 'assets/img/home/16127.webp',
      alt: 'ผลงานบ้านจริงของ Twentysix House',
      link: '/ourworks/real-projects',
      buttonLabel: 'ดูผลงานจริง',
    },
    {
      kicker: 'HOUSE DESIGNS',
      title: 'ดูแบบบ้านเพื่อหาแนวทางที่ใกล้กับบ้านในใจของคุณ',
      description:
        'เหมาะกับคนที่ยังอยู่ในช่วงหาแรงบันดาลใจ อยากเห็นรูปแบบบ้าน การจัดพื้นที่ และบรรยากาศที่ชอบก่อนเริ่มคุยรายละเอียด',
      highlights: ['ดูรูปแบบและบรรยากาศบ้าน', 'เทียบแนวคิดของแต่ละแบบ', 'ต่อยอดไปหน้ารายละเอียดแบบบ้านได้'],
      image: 'assets/img/Collection/collection18.webp',
      alt: 'แบบบ้านของ Twentysix House',
      link: '/ourworks/house-designs',
      buttonLabel: 'ดูแบบบ้าน',
    },
  ];

  readonly guideItems = [
    {
      icon: 'now-ui-icons business_bank',
      title: 'ดูบ้านจริงเพื่อเช็กคุณภาพ',
      description: 'เหมาะกับการดูภาพรวมของบ้านหลังสร้างเสร็จ ทั้งรายละเอียดงาน บรรยากาศ และมาตรฐานการก่อสร้าง',
    },
    {
      icon: 'now-ui-icons design-2_ruler-pencil',
      title: 'ดูแบบบ้านเพื่อหาแนวทาง',
      description: 'เหมาะกับการหาไอเดียเรื่องรูปแบบบ้าน การจัดพื้นที่ แสง และบรรยากาศที่อยากให้เกิดขึ้นในบ้านของคุณ',
    },
    {
      icon: 'now-ui-icons ui-2_chat-round',
      title: 'เจอแบบที่ชอบแล้วคุยต่อได้',
      description: 'ใช้ผลงานที่สนใจเป็นตัวอย่างในการคุยเรื่องที่ดิน งบประมาณ พื้นที่ใช้งาน และแนวทางออกแบบกับทีมของเราได้เลย',
    },
  ];

  readonly trustItems = [
    'เห็นทั้งบ้านที่สร้างจริงและแนวคิดจากแบบบ้าน',
    'ช่วยเลือกทิศทางก่อนคุยเรื่องงบและพื้นที่',
    'เก็บงานที่ชอบไว้เป็นตัวอย่างสำหรับคุยต่อได้',
  ];

  readonly ctaHighlights = [
    'ส่งตัวอย่างงานที่ชอบมาให้เราดูได้',
    'คุยต่อเรื่องที่ดิน งบประมาณ และพื้นที่ใช้งาน',
    'ช่วยปรับแนวทางให้เข้ากับบ้านของคุณ',
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
      description: 'หมวดผลงานบ้านที่สร้างจริงและผลงานออกแบบบ้านของ Twentysix House',
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
          name: 'ผลงานออกแบบบ้าน',
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
          name: 'หน้าแรก',
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
