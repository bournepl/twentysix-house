import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  readonly pageSize = 6;
  readonly isBrowser: boolean;
  readonly allCategory = 'ทั้งหมด';
  private readonly pageQueryParam = 'page';
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
  designs: HouseDesign[] = [];
  selectedCategory = this.allCategory;
  page = 1;

  constructor(
    private houseDesignsService: HouseDesignsService,
    private jsonLdService: JsonLdService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  get filteredDesigns(): HouseDesign[] {
    if (this.selectedCategory === this.allCategory) {
      return this.designs;
    }

    return this.designs.filter((item) => item.categories.includes(this.selectedCategory));
  }

  ngOnInit(): void {
    this.page = this.getPageFromRoute();

    this.houseDesignsService.getDesigns().subscribe((designs) => {
      this.designs = designs;
      this.categories = [
        this.allCategory,
        ...Array.from(new Set(designs.flatMap((design) => design.categories))),
      ];
      this.ensureValidPage(this.filteredDesigns.length);
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

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.page = 1;
    this.syncPageQueryParam();
    this.refreshListView();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.ensureValidPage(this.filteredDesigns.length);
    this.syncPageQueryParam();
    this.scrollToFirstCard();
    this.refreshAos();
  }

  trackByDesign(index: number, item: HouseDesign): string {
    return item.id;
  }

  private refreshListView(): void {
    this.scrollToFirstCard();
    this.refreshAos();
  }

  private getPageFromRoute(): number {
    const page = Number(this.route.snapshot.queryParamMap.get(this.pageQueryParam));

    return Number.isInteger(page) && page > 0 ? page : 1;
  }

  private ensureValidPage(totalItems: number): void {
    const maxPage = Math.max(1, Math.ceil(totalItems / this.pageSize));

    if (this.page <= maxPage) {
      return;
    }

    this.page = maxPage;
    this.syncPageQueryParam();
  }

  private syncPageQueryParam(): void {
    if (!this.isBrowser) {
      return;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        [this.pageQueryParam]: this.page > 1 ? this.page : null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private scrollToFirstCard(): void {
    if (!this.isBrowser) {
      return;
    }

    requestAnimationFrame(() => {
      const firstCard = this.document.querySelector('.house-designs-list__card') as HTMLElement | null;

      if (!firstCard) {
        return;
      }

      const offset = 100;
      const wrapper = this.document.querySelector('.wrapper') as HTMLElement | null;
      const targetTop = firstCard.getBoundingClientRect().top;

      if (wrapper && wrapper.scrollHeight > wrapper.clientHeight) {
        const wrapperTop = wrapper.getBoundingClientRect().top;
        wrapper.scrollTo({
          top: wrapper.scrollTop + targetTop - wrapperTop - offset,
          behavior: 'smooth',
        });
      }

      window.scrollTo({
        top: window.scrollY + targetTop - offset,
        behavior: 'smooth',
      });
    });
  }

  private refreshAos(): void {
    if (!this.isBrowser) {
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => Aos.refreshHard());
    });
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
