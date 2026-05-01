import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import Aos from 'aos';
import Rellax from 'rellax';
import { HouseDesign } from '../../_model/house-design';
import { JsonLdService } from '../../_service/json-ld.service';
import { HouseDesignsService } from '../../_service/house-designs.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-house-designs',
  templateUrl: './house-designs.component.html',
  styleUrl: './house-designs.component.scss',
})
export class HouseDesignsComponent implements OnInit, OnDestroy {
  readonly loadStep = 6;
  readonly isBrowser: boolean;
  readonly allCategory = 'ทั้งหมด';
  readonly allFilter = 'ทั้งหมด';
  private rellaxInstance?: any;

  readonly breadcrumbs = [
    { label: 'หน้าแรก', path: '/' },
    { label: 'ผลงานของเรา', path: '/ourworks' },
    { label: 'แบบบ้าน' },
  ];

  readonly heroPoints = [
    {
      title: 'ดูแนวทางก่อนเริ่มคุยแบบ',
      description: 'ช่วยให้เห็นภาพรวมของบ้านที่ชอบก่อนลงรายละเอียดจริง',
    },
    {
      title: 'เทียบบรรยากาศของแต่ละแบบ',
      description: 'ดูความต่างของแสง วัสดุ และบรรยากาศของบ้านได้ง่ายขึ้น',
    },
    {
      title: 'เจอแบบที่ชอบแล้วคุยต่อได้',
      description: 'ใช้แบบบ้านที่สนใจเป็นจุดเริ่มต้นในการคุยกับทีมออกแบบได้ทันที',
    },
  ];

  readonly ctaPoints = [
    'ส่งแบบที่ชอบมาให้เราดูได้',
    'คุยเรื่องงบและการใช้งานต่อได้',
    'ต่อยอดเป็นบ้านของคุณได้จริง',
  ];

  categories: string[] = [this.allCategory];
  bedroomOptions: string[] = [this.allFilter];
  bathroomOptions: string[] = [this.allFilter];
  parkingOptions: string[] = [this.allFilter];
  designs: HouseDesign[] = [];
  selectedCategory = this.allCategory;
  selectedBedrooms = this.allFilter;
  selectedBathrooms = this.allFilter;
  selectedParking = this.allFilter;
  searchTerm = '';
  visibleCount = this.loadStep;

  constructor(
    private houseDesignsService: HouseDesignsService,
    private jsonLdService: JsonLdService,
    @Inject(PLATFORM_ID) private platformId: object,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  get filteredDesigns(): HouseDesign[] {
    const normalizedSearch = this.normalizeText(this.searchTerm);

    return this.designs.filter((design) => {
      const matchesSearch =
        !normalizedSearch ||
        this.normalizeText([
          design.title,
          design.excerpt,
          design.description,
          design.category,
          design.usableArea,
          design.concept,
          design.palette,
          design.whoItsFor,
          ...(design.categories || []),
          ...(design.tags || []),
          ...(design.highlights || []),
        ].filter(Boolean).join(' ')).includes(normalizedSearch);

      const matchesCategory =
        this.selectedCategory === this.allCategory ||
        design.categories.includes(this.selectedCategory);

      const matchesBedrooms =
        this.selectedBedrooms === this.allFilter ||
        `${design.bedrooms} ห้องนอน` === this.selectedBedrooms;

      const matchesBathrooms =
        this.selectedBathrooms === this.allFilter ||
        `${design.bathrooms} ห้องน้ำ` === this.selectedBathrooms;

      const matchesParking =
        this.selectedParking === this.allFilter ||
        `${design.parking} ที่จอดรถ` === this.selectedParking;

      return matchesSearch && matchesCategory && matchesBedrooms && matchesBathrooms && matchesParking;
    });
  }

  get visibleDesigns(): HouseDesign[] {
    return this.filteredDesigns.slice(0, this.visibleCount);
  }

  get hasMoreDesigns(): boolean {
    return this.visibleCount < this.filteredDesigns.length;
  }

  ngOnInit(): void {
    this.houseDesignsService.getDesigns().subscribe((designs) => {
      this.designs = designs;
      this.categories = [
        this.allCategory,
        ...Array.from(new Set(designs.flatMap((design) => design.categories))),
      ];
      this.bedroomOptions = [
        this.allFilter,
        ...Array.from(new Set(designs.map((design) => design.bedrooms).filter(Boolean)))
          .sort((a, b) => Number(a) - Number(b))
          .map((value) => `${value} ห้องนอน`),
      ];
      this.bathroomOptions = [
        this.allFilter,
        ...Array.from(new Set(designs.map((design) => design.bathrooms).filter(Boolean)))
          .sort((a, b) => Number(a) - Number(b))
          .map((value) => `${value} ห้องน้ำ`),
      ];
      this.parkingOptions = [
        this.allFilter,
        ...Array.from(new Set(designs.map((design) => design.parking).filter(Boolean)))
          .sort((a, b) => Number(a) - Number(b))
          .map((value) => `${value} ที่จอดรถ`),
      ];
      this.setDesignsJsonLd(designs);
      this.refreshAos();
    });

    if (!this.isBrowser) {
      return;
    }

    this.renderer.addClass(this.document.body, 'house-designs-page');
    this.rellaxInstance = new Rellax('.rellax-header');
  }

  ngOnDestroy(): void {
    this.rellaxInstance?.destroy();
    this.rellaxInstance = undefined;
    this.jsonLdService.removeSchema('house-designs-list');

    if (!this.isBrowser) {
      return;
    }

    this.renderer.removeClass(this.document.body, 'house-designs-page');
  }

  onSearchInput(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.resetListView();
  }

  onCategoryChange(event: Event): void {
    this.selectedCategory = (event.target as HTMLSelectElement).value;
    this.resetListView();
  }

  onBedroomsChange(event: Event): void {
    this.selectedBedrooms = (event.target as HTMLSelectElement).value;
    this.resetListView();
  }

  onBathroomsChange(event: Event): void {
    this.selectedBathrooms = (event.target as HTMLSelectElement).value;
    this.resetListView();
  }

  onParkingChange(event: Event): void {
    this.selectedParking = (event.target as HTMLSelectElement).value;
    this.resetListView();
  }

  loadMoreDesigns(): void {
    this.visibleCount += this.loadStep;
    this.refreshAos();
  }

  trackByDesign(index: number, item: HouseDesign): string {
    return item.id;
  }

  private resetListView(): void {
    this.visibleCount = this.loadStep;
    this.refreshAos();
  }

  private refreshAos(): void {
    if (!this.isBrowser) {
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => Aos.refreshHard());
    });
  }

  private normalizeText(value: string): string {
    return value.toLowerCase().replace(/\s+/g, '');
  }

  private setDesignsJsonLd(designs: HouseDesign[]): void {
    const url = `${environment.siteUrl}/ourworks/house-designs`;

    this.jsonLdService.insertSchema('house-designs-list', {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': `${url}#webpage`,
          name: 'แบบบ้านและแนวคิดออกแบบบ้าน | Twentysix House อุดรธานี',
          description:
            'รวมแบบบ้านและแนวคิดออกแบบบ้านของ Twentysix House เพื่อช่วยให้เจ้าของบ้านเห็นรูปแบบบ้าน ชุดสี วัสดุ แสง และบรรยากาศก่อนเริ่มคุยโครงการจริง',
          url,
          inLanguage: 'th-TH',
          mainEntity: {
            '@id': `${url}#itemlist`,
          },
        },
        {
          '@type': 'ItemList',
          '@id': `${url}#itemlist`,
          numberOfItems: designs.length,
          itemListElement: designs.map((design, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${url}/${design.slug}`,
            name: design.title,
            image: this.toAbsoluteAssetUrl(design.coverImage),
          })),
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
              name: 'ผลงานของเรา',
              item: `${environment.siteUrl}/ourworks`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'แบบบ้าน',
              item: url,
            },
          ],
        },
      ],
    });
  }

  private toAbsoluteAssetUrl(pathOrUrl: string): string {
    if (/^https?:\/\//i.test(pathOrUrl)) {
      return pathOrUrl;
    }

    return `${environment.siteUrl}/${pathOrUrl.replace(/^\/+/, '')}`;
  }
}
