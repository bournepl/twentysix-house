import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { JsonLdService } from '../_service/json-ld.service';
import { environment } from '../../environments/environment';

type ContactChannel = {
  label: string;
  value: string;
  description: string;
  href: string;
  icon: string;
  external?: boolean;
  primary?: boolean;
};

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent implements OnInit, OnDestroy {
  readonly isBrowser: boolean;

  readonly contactChannels: ContactChannel[] = [
    {
      label: 'โทรหาเรา',
      value: '099-470-8877',
      description: 'เหมาะสำหรับคุยเรื่องงบประมาณ ระยะเวลา และนัดหมายเข้าพบทีมงาน',
      href: 'tel:0994708877',
      icon: 'fa fa-phone',
      primary: true,
    },
    {
      label: 'คุยผ่าน Line',
      value: 'ส่งโจทย์บ้านและรูปที่ดิน',
      description: 'ส่งรูปที่ดิน แบบบ้านที่ชอบ หรือรายละเอียดเบื้องต้นให้ทีมงานดูได้สะดวก',
      href: 'https://lin.ee/jzuOAtF',
      icon: 'fab fa-line',
      external: true,
    },
    {
      label: 'Facebook',
      value: 'Twentysix House',
      description: 'ดูความเคลื่อนไหว ผลงาน และทักข้อความเพื่อสอบถามข้อมูลเพิ่มเติม',
      href: 'https://www.facebook.com/share/19APWzVgu7/?mibextid=wwXIfr',
      icon: 'fab fa-facebook',
      external: true,
    },
    {
      label: 'แผนที่บริษัท',
      value: 'เปิด Google Maps',
      description: 'ใช้สำหรับนำทางมายังสำนักงาน Twentysix Development จังหวัดอุดรธานี',
      href: 'https://maps.app.goo.gl/AgjTg2jRSc3iaYa46',
      icon: 'fa fa-map-marker-alt',
      external: true,
    },
  ];

  readonly preparationItems = [
    'ขนาดและตำแหน่งที่ดิน หรือรูปถ่ายหน้างาน',
    'งบประมาณโดยประมาณที่ตั้งใจไว้',
    'จำนวนสมาชิกและพื้นที่ใช้งานที่ต้องการ',
    'แบบบ้าน รูปบ้าน หรือสไตล์ที่ชอบ',
  ];

  readonly trustItems = [
    'ดูแลตั้งแต่การวางโจทย์ ออกแบบ และงานก่อสร้าง',
    'มีทีมงานช่วยประเมินความเป็นไปได้ของงบประมาณ',
    'สื่อสารขั้นตอนงานให้เจ้าของบ้านเข้าใจง่าย',
    'เน้นบ้านพักอาศัยที่ใช้งานจริงในพื้นที่อุดรธานี',
  ];

  constructor(
    private jsonLdService: JsonLdService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.insertSchemas();
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.jsonLdService.removeSchema('contact-page');
    }
  }

  trackByLabel(index: number, item: { label?: string } | string): string {
    return typeof item === 'string' ? item : item.label || `${index}`;
  }

  private insertSchemas(): void {
    const url = `${environment.siteUrl}/contact`;
    const logo = `${environment.siteUrl}/assets/img/logobg.png`;
    const image = `${environment.siteUrl}/assets/img/head.webp`;

    this.jsonLdService.insertSchema('contact-page', {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ContactPage',
          '@id': `${url}#webpage`,
          url,
          name: 'ติดต่อบริษัทรับสร้างบ้านในอุดรธานี | Twentysix House',
          description: 'ช่องทางติดต่อ Twentysix House สำหรับปรึกษาออกแบบบ้านและรับสร้างบ้านในจังหวัดอุดรธานี',
          inLanguage: 'th-TH',
          about: {
            '@id': `${environment.siteUrl}/#business`,
          },
        },
        {
          '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
          '@id': `${environment.siteUrl}/#business`,
          name: 'Twentysix Development Co., Ltd.',
          alternateName: 'Twentysix House',
          url: environment.siteUrl,
          telephone: '+66994708877',
          email: 'twentysix.desk@gmail.com',
          logo,
          image,
          priceRange: '$$',
          areaServed: [
            {
              '@type': 'AdministrativeArea',
              name: 'อุดรธานี',
            },
          ],
          address: {
            '@type': 'PostalAddress',
            streetAddress: '127/2 ถนนโพนพิสัย',
            addressLocality: 'อำเภอเมือง',
            addressRegion: 'อุดรธานี',
            postalCode: '41000',
            addressCountry: 'TH',
          },
          contactPoint: [
            {
              '@type': 'ContactPoint',
              telephone: '+66994708877',
              contactType: 'customer service',
              areaServed: 'TH',
              availableLanguage: ['Thai'],
            },
          ],
          sameAs: [
            'https://lin.ee/jzuOAtF',
            'https://www.facebook.com/share/19APWzVgu7/?mibextid=wwXIfr',
            'https://maps.app.goo.gl/AgjTg2jRSc3iaYa46',
          ],
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${url}#breadcrumb`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'หน้าแรก',
              item: `${environment.siteUrl}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'ติดต่อเรา',
              item: url,
            },
          ],
        },
      ],
    });
  }
}
