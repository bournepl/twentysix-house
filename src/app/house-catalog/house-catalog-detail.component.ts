import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

import { SeoService } from '../shared/seo.service';
import { HelpfulArticle, getHelpfulArticles } from '../shared/blog-content-clusters';
import {
  ORGANIZATION_ID,
  WEBSITE_ID,
  breadcrumbSchema,
  structuredDataGraph,
} from '../shared/structured-data';
import { HOUSE_CATALOG_ITEMS, HouseCatalogItem, findHouseCatalogItem } from './house-catalog.data';

@Component({
  standalone: false,
  selector: 'app-house-catalog-detail',
  templateUrl: './house-catalog-detail.component.html',
  styleUrls: [
    '../new-ourworks/completed-home-detail/completed-home-detail.component.scss',
    './house-catalog-detail.component.scss'
  ]
})
export class HouseCatalogDetailComponent implements OnDestroy {
  house?: HouseCatalogItem;
  relatedHouses: readonly HouseCatalogItem[] = [];
  helpfulArticles: readonly HelpfulArticle[] = [];
  activeGalleryIndex = 0;

  readonly designPrinciples = [
    {
      eyebrow: 'LIVING FIRST',
      title: 'เริ่มจากรูปแบบการใช้ชีวิต',
      description: 'ผังพื้นฐานจัดลำดับพื้นที่ส่วนตัวและพื้นที่ร่วมกันให้ชัด เพื่อให้ทุกกิจกรรมในบ้านเชื่อมต่อกันอย่างเป็นธรรมชาติ',
    },
    {
      eyebrow: 'LIGHT & AIR',
      title: 'เปิดรับแสงและอากาศอย่างพอดี',
      description: 'ช่องเปิดและพื้นที่โปร่งถูกวางให้บ้านรับแสงธรรมชาติ พร้อมช่วยให้อากาศไหลเวียนและสร้างบรรยากาศที่สบายตลอดวัน',
    },
    {
      eyebrow: 'READY TO ADAPT',
      title: 'พร้อมปรับให้เข้ากับครอบครัว',
      description: 'แบบสามารถนำไปพัฒนาต่อให้เหมาะกับขนาดที่ดิน ทิศทางแดดลม ฟังก์ชัน และขอบเขตงบประมาณของเจ้าของบ้าน',
    },
  ];

  private touchStartX?: number;
  private readonly routeSubscription: Subscription;
  private readonly navigationSubscription: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly seo: SeoService,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      this.house = slug ? findHouseCatalogItem(slug) : undefined;
      this.activeGalleryIndex = 0;

      if (!this.house) {
        this.relatedHouses = [];
        this.helpfulArticles = [];
        this.updateSeo();
        return;
      }

      const currentIndex = HOUSE_CATALOG_ITEMS.indexOf(this.house);
      this.relatedHouses = [1, 2].map(offset =>
        HOUSE_CATALOG_ITEMS[(currentIndex + offset) % HOUSE_CATALOG_ITEMS.length]
      );
      this.helpfulArticles = getHelpfulArticles(this.house.style, {
        includeConstruction: true,
        limit: 2,
      });
      this.updateSeo();
    });

    this.navigationSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updateSeo());
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.navigationSubscription.unsubscribe();
    this.seo.clearStructuredData();
  }

  selectGalleryImage(index: number): void {
    this.activeGalleryIndex = index;
  }

  changeGalleryImage(direction: 'previous' | 'next'): void {
    if (!this.house) {
      return;
    }

    const offset = direction === 'next' ? 1 : -1;
    this.activeGalleryIndex =
      (this.activeGalleryIndex + offset + this.house.gallery.length) % this.house.gallery.length;
  }

  onGalleryKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.changeGalleryImage('previous');
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.changeGalleryImage('next');
    }
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0]?.clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    const endX = event.changedTouches[0]?.clientX;
    if (this.touchStartX === undefined || endX === undefined) {
      return;
    }

    const distance = endX - this.touchStartX;
    this.touchStartX = undefined;

    if (Math.abs(distance) < 45) {
      return;
    }

    this.changeGalleryImage(distance < 0 ? 'next' : 'previous');
  }

  formatBudget(value: number): string {
    const millions = value / 1000000;
    return `${millions.toLocaleString('th-TH', { maximumFractionDigits: 2 })} ล้านบาท`;
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private updateSeo(): void {
    if (!this.house) {
      this.seo.updatePage({
        title: 'ไม่พบแบบบ้าน | Twentysix House',
        description: 'ไม่พบข้อมูลแบบบ้านที่คุณกำลังค้นหา กรุณากลับไปเลือกชมแบบบ้านของเรา',
        url: `https://twentysix.house${this.router.url.split('?')[0]}`,
        robots: 'noindex, follow',
        canonical: false,
        image: null,
      });
      return;
    }

    const house = this.house;
    const url = `https://twentysix.house/house-catalog/${house.slug}`;
    const title = `แบบบ้าน ${house.name} ${house.thaiName} | Twentysix House`;
    const description = `${house.description} ${house.bedrooms} ห้องนอน ${house.bathrooms} ห้องน้ำ เริ่มต้น ${this.formatBudget(house.startingBudget)}`;

    this.seo.updatePage({
      title,
      description,
      url,
      image: house.coverImage,
      preloadImage: house.coverImage,
      type: 'product',
      keywords: [`แบบบ้าน ${house.name}`, house.thaiName, house.style, house.collection, ...house.tags].join(', '),
      structuredData: structuredDataGraph(
          breadcrumbSchema([
            { name: 'หน้าแรก', url: 'https://twentysix.house' },
            { name: 'แบบบ้านของเรา', url: 'https://twentysix.house/house-catalog' },
            { name: `${house.name} ${house.thaiName}`, url },
          ]),
          {
            '@type': 'Product',
            '@id': `${url}#house-design`,
            name: `${house.name} ${house.thaiName}`,
            alternateName: house.thaiName,
            description,
            url,
            mainEntityOfPage: { '@id': `${url}#webpage` },
            image: [house.coverImage, ...house.gallery].map(image => this.seo.absoluteUrl(image)),
            brand: { '@id': ORGANIZATION_ID },
            manufacturer: { '@id': ORGANIZATION_ID },
            category: `${house.collection} - ${house.style}`,
            offers: {
              '@type': 'Offer',
              price: house.startingBudget,
              priceCurrency: 'THB',
              url,
            },
            additionalProperty: [
              { '@type': 'PropertyValue', name: 'จำนวนชั้น', value: house.floors },
              { '@type': 'PropertyValue', name: 'ห้องนอน', value: house.bedrooms },
              { '@type': 'PropertyValue', name: 'ห้องน้ำ', value: house.bathrooms },
              { '@type': 'PropertyValue', name: 'ที่จอดรถ', value: house.parking },
            ],
          },
          {
            '@type': 'WebPage',
            '@id': `${url}#webpage`,
            url,
            name: title,
            description,
            inLanguage: 'th-TH',
            isPartOf: { '@id': WEBSITE_ID },
            mainEntity: { '@id': `${url}#house-design` },
          },
      ),
    });
  }
}
