import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Aos from 'aos';
import Rellax from 'rellax';
import { RealProject } from '../../_model/real-project';
import { JsonLdService } from '../../_service/json-ld.service';
import { RealProjectsService } from '../../_service/real-projects.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-real-projects',
  templateUrl: './real-projects.component.html',
  styleUrl: './real-projects.component.scss',
})
export class RealProjectsComponent implements OnInit, OnDestroy {
  readonly pageSize = 6;
  readonly allCategory = 'ทั้งหมด';
  readonly isBrowser: boolean;
  private readonly pageQueryParam = 'page';
  readonly heroPoints = [
    {
      title: 'ดูคุณภาพงานจากบ้านที่สร้างจริง',
      description: 'ช่วยให้เห็นมาตรฐานงานก่อสร้าง รายละเอียดหน้างาน และภาพรวมของบ้านหลังสร้างเสร็จอย่างชัดเจน',
    },
    {
      title: 'เปรียบเทียบประเภทบ้านได้ง่าย',
      description: 'ดูความต่างของบ้านแต่ละแนว ทั้งขนาด พื้นที่ใช้สอย และบรรยากาศการอยู่อาศัยจากโครงการจริง',
    },
    {
      title: 'ใช้เป็นจุดเริ่มต้นในการคุยโครงการ',
      description: 'เมื่อเจอบ้านที่ใกล้กับสิ่งที่ต้องการ สามารถหยิบไปคุยเรื่องงบประมาณ พื้นที่ใช้งาน และทิศทางงานต่อได้ทันที',
    },
  ];
  readonly ctaPoints = [
    'คุยโจทย์การใช้งานจริงก่อนเริ่มออกแบบ',
    'ช่วยมองภาพรวมงบประมาณ และลำดับการทำงาน',
    'ดูแนวทางออกแบบและก่อสร้างจากทีมเดียวกัน',
  ];
  private rellaxInstance?: any;

  readonly breadcrumbs = [
    { label: 'หน้าแรก', path: '/' },
    { label: 'ผลงานของเรา', path: '/ourworks' },
    { label: 'ผลงานจริง' },
  ];

  categories: string[] = [this.allCategory];
  projects: RealProject[] = [];
  selectedCategory = this.allCategory;
  page = 1;

  constructor(
    private realProjectsService: RealProjectsService,
    private jsonLdService: JsonLdService,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.page = this.getPageFromRoute();

    this.realProjectsService.getProjects().subscribe((projects) => {
      this.projects = projects;
      this.categories = [
        this.allCategory,
        ...Array.from(new Set(projects.flatMap((project) => project.categories))),
      ];
      this.ensureValidPage(this.filteredProjects.length);
      this.setProjectsJsonLd(projects);
    });

    if (!this.isBrowser) {
      return;
    }

    this.renderer.addClass(this.document.body, 'real-projects-page');
    this.rellaxInstance = new Rellax('.rellax-header');
  }

  ngOnDestroy(): void {
    this.rellaxInstance?.destroy();
    this.rellaxInstance = undefined;

    if (!this.isBrowser) {
      return;
    }

    this.renderer.removeClass(this.document.body, 'real-projects-page');
    this.jsonLdService.removeSchema('real-projects-list');
  }

  get filteredProjects(): RealProject[] {
    if (this.selectedCategory === this.allCategory) {
      return this.projects;
    }

    return this.projects.filter((project) => project.categories.includes(this.selectedCategory));
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.page = 1;
    this.syncPageQueryParam();
    this.refreshListView();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.ensureValidPage(this.filteredProjects.length);
    this.syncPageQueryParam();
    this.scrollToFirstCard();
    this.refreshAos();
  }

  trackByProject(index: number, project: RealProject): string {
    return project.id;
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
      const firstCard = this.document.querySelector('.real-projects-list__card') as HTMLElement | null;

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

  private setProjectsJsonLd(projects: RealProject[]): void {
    const url = `${environment.siteUrl}/ourworks/real-projects`;

    this.jsonLdService.insertSchema('real-projects-list', {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': `${url}#webpage`,
          name: 'ผลงานจริง | Twentysix House',
          description: 'รวมผลงานบ้านที่สร้างจริงโดย Twentysix House พร้อมรายละเอียดโครงการและภาพตัวอย่าง',
          url,
          inLanguage: 'th-TH',
          mainEntity: {
            '@id': `${url}#itemlist`,
          },
        },
        {
          '@type': 'ItemList',
          '@id': `${url}#itemlist`,
          numberOfItems: projects.length,
          itemListElement: projects.map((project, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${url}/${project.slug}`,
            name: project.title,
            image: this.toAbsoluteAssetUrl(project.coverImage),
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
              name: 'ผลงานจริง',
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
