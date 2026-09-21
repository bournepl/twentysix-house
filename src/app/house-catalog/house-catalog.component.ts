import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

import { SeoService } from '../shared/seo.service';
import {
  ORGANIZATION_ID,
  WEBSITE_ID,
  breadcrumbSchema,
  itemListSchema,
  structuredDataGraph,
} from '../shared/structured-data';

import {
  HOUSE_CATALOG_COLLECTIONS,
  HouseCatalogCollection,
  HouseCatalogItem,
} from './house-catalog.data';

type BedroomFilter = 'all' | 2 | 3 | 4;

@Component({
  standalone: false,
  selector: 'app-house-catalog',
  templateUrl: './house-catalog.component.html',
  styleUrl: './house-catalog.component.scss'
})
export class HouseCatalogComponent implements OnInit, OnDestroy {
  readonly collections = HOUSE_CATALOG_COLLECTIONS;
  readonly bedroomFilters: ReadonlyArray<{ label: string; value: BedroomFilter }> = [
    { label: 'ทั้งหมด', value: 'all' },
    { label: '2 ห้องนอน', value: 2 },
    { label: '3 ห้องนอน', value: 3 },
    { label: '4 ห้องนอน', value: 4 },
  ];

  activeBedroomFilter: BedroomFilter = 'all';
  activeCollectionSlug = this.collections[0].slug;
  private readonly queryParamSubscription: Subscription;
  private readonly navigationSubscription: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly seo: SeoService,
  ) {
    this.queryParamSubscription = this.route.queryParamMap.subscribe(params => {
      const requestedSlug = params.get('collection');

      if (requestedSlug && this.collections.some(collection => collection.slug === requestedSlug)) {
        this.activeCollectionSlug = requestedSlug;
      }
    });

    this.navigationSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updateSeo());
  }

  ngOnInit(): void {
    this.updateSeo();
  }

  get activeCollection(): HouseCatalogCollection {
    return this.collections.find(collection => collection.slug === this.activeCollectionSlug)
      ?? this.collections[0];
  }

  get activeCollectionIndex(): number {
    return Math.max(0, this.collections.findIndex(collection => collection.slug === this.activeCollectionSlug));
  }

  get filteredHouses(): readonly HouseCatalogItem[] {
    if (this.activeBedroomFilter === 'all') {
      return this.activeCollection.items;
    }

    return this.activeCollection.items.filter(item => item.bedrooms === this.activeBedroomFilter);
  }

  setCollection(slug: string): void {
    if (slug === this.activeCollectionSlug) {
      return;
    }

    this.activeCollectionSlug = slug;
    this.activeBedroomFilter = 'all';
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { collection: slug },
      queryParamsHandling: 'merge',
    });
  }

  previousCollection(): void {
    const index = (this.activeCollectionIndex - 1 + this.collections.length) % this.collections.length;
    this.setCollection(this.collections[index].slug);
  }

  nextCollection(): void {
    const index = (this.activeCollectionIndex + 1) % this.collections.length;
    this.setCollection(this.collections[index].slug);
  }

  getCollectionOffset(index: number): number {
    const total = this.collections.length;
    const rawOffset = index - this.activeCollectionIndex;

    if (rawOffset > total / 2) {
      return rawOffset - total;
    }

    if (rawOffset < -total / 2) {
      return rawOffset + total;
    }

    return rawOffset;
  }

  setBedroomFilter(filter: BedroomFilter): void {
    this.activeBedroomFilter = filter;
  }

  formatBudget(value: number): string {
    const millions = value / 1000000;
    return `${millions.toLocaleString('th-TH', { maximumFractionDigits: 2 })} ล้านบาท`;
  }

  trackBySlug(_index: number, item: HouseCatalogItem): string {
    return item.slug;
  }

  trackByCollectionSlug(_index: number, collection: HouseCatalogCollection): string {
    return collection.slug;
  }

  ngOnDestroy(): void {
    this.queryParamSubscription.unsubscribe();
    this.navigationSubscription.unsubscribe();
    this.seo.clearStructuredData();
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private updateSeo(): void {
    const url = 'https://twentysix.house/house-catalog';
    const title = 'แบบบ้านของเรา | Pure Collection | Twentysix House';
    const description = 'สำรวจแบบบ้าน Pure Collection จาก Twentysix House พร้อมข้อมูลฟังก์ชัน จำนวนห้อง และงบประมาณเริ่มต้น เพื่อนำไปปรับให้เหมาะกับที่ดินและครอบครัวของคุณ';

    this.seo.updatePage({
      title,
      description,
      url,
      image: this.collections[0].coverImage,
      preloadImage: this.collections[0].heroImage,
      keywords: 'แบบบ้านอุดรธานี, แบบบ้านโมเดิร์น, Pure Collection, รับสร้างบ้านอุดรธานี',
      structuredData: structuredDataGraph(
          {
            '@type': 'CollectionPage',
            '@id': `${url}#webpage`,
            url,
            name: title,
            description,
            inLanguage: 'th-TH',
            isPartOf: { '@id': WEBSITE_ID },
            about: { '@id': ORGANIZATION_ID },
            mainEntity: { '@id': `${url}#item-list` },
          },
          breadcrumbSchema([
            { name: 'หน้าแรก', url: 'https://twentysix.house' },
            { name: 'แบบบ้านของเรา', url },
          ]),
          itemListSchema(
            'แบบบ้าน Pure Collection',
            url,
            this.collections.flatMap(collection => collection.items).map(house => ({
              name: `${house.name} ${house.thaiName}`,
              url: `${url}/${house.slug}`,
              image: house.coverImage,
            })),
          ),
      ),
    });
  }
}
