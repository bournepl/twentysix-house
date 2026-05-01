import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
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
  readonly loadStep = 6;
  readonly allCategory = 'ทั้งหมด';
  readonly allFilter = 'ทั้งหมด';
  readonly isBrowser: boolean;
  readonly heroTrustItems = [
    'ภาพถ่ายจากบ้านจริง',
    'รายละเอียดพื้นที่และฟังก์ชัน',
    'ใช้เป็นตัวอย่างคุยโครงการได้'
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
  bedroomOptions: string[] = [this.allFilter];
  bathroomOptions: string[] = [this.allFilter];
  parkingOptions: string[] = [this.allFilter];
  projects: RealProject[] = [];
  selectedCategory = this.allCategory;
  selectedBedrooms = this.allFilter;
  selectedBathrooms = this.allFilter;
  selectedParking = this.allFilter;
  searchTerm = '';
  visibleCount = this.loadStep;

  constructor(
    private realProjectsService: RealProjectsService,
    private jsonLdService: JsonLdService,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.realProjectsService.getProjects().subscribe((projects) => {
      this.projects = projects;
      this.categories = [
        this.allCategory,
        ...Array.from(new Set(projects.flatMap((project) => project.categories))),
      ];
      this.bedroomOptions = [
        this.allFilter,
        ...Array.from(new Set(projects.map((project) => project.bedrooms).filter(Boolean)))
          .sort((a, b) => Number(a) - Number(b))
          .map((value) => `${value} ห้องนอน`),
      ];
      this.bathroomOptions = [
        this.allFilter,
        ...Array.from(new Set(projects.map((project) => project.bathrooms).filter(Boolean)))
          .sort((a, b) => Number(a) - Number(b))
          .map((value) => `${value} ห้องน้ำ`),
      ];
      this.parkingOptions = [
        this.allFilter,
        ...Array.from(new Set(projects.map((project) => project.parking).filter(Boolean)))
          .sort((a, b) => Number(a) - Number(b))
          .map((value) => `${value} ที่จอดรถ`),
      ];
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
    const normalizedSearch = this.normalizeText(this.searchTerm);

    return this.projects.filter((project) => {
      const matchesSearch =
        !normalizedSearch ||
        this.normalizeText([
          project.title,
          project.excerpt,
          project.description,
          project.category,
          project.location,
          project.usableArea,
          project.scope,
          project.status,
          ...(project.categories || []),
          ...(project.tags || []),
          ...(project.highlights || []),
        ].filter(Boolean).join(' ')).includes(normalizedSearch);

      const matchesCategory =
        this.selectedCategory === this.allCategory ||
        project.categories.includes(this.selectedCategory);

      const matchesBedrooms =
        this.selectedBedrooms === this.allFilter ||
        `${project.bedrooms} ห้องนอน` === this.selectedBedrooms;

      const matchesBathrooms =
        this.selectedBathrooms === this.allFilter ||
        `${project.bathrooms} ห้องน้ำ` === this.selectedBathrooms;

      const matchesParking =
        this.selectedParking === this.allFilter ||
        `${project.parking} ที่จอดรถ` === this.selectedParking;

      return matchesSearch && matchesCategory && matchesBedrooms && matchesBathrooms && matchesParking;
    });
  }

  get visibleProjects(): RealProject[] {
    return this.filteredProjects.slice(0, this.visibleCount);
  }

  get hasMoreProjects(): boolean {
    return this.visibleCount < this.filteredProjects.length;
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

  loadMoreProjects(): void {
    this.visibleCount += this.loadStep;
    this.refreshAos();
  }

  trackByProject(index: number, project: RealProject): string {
    return project.id;
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

  private setProjectsJsonLd(projects: RealProject[]): void {
    const url = `${environment.siteUrl}/ourworks/real-projects`;

    this.jsonLdService.insertSchema('real-projects-list', {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': `${url}#webpage`,
          name: 'ผลงานรับสร้างบ้านจริงในอุดรธานี | Twentysix House',
          description: 'รวมผลงานบ้านที่สร้างเสร็จจริงโดย Twentysix House พร้อมพื้นที่ใช้สอย จำนวนห้อง ทำเล รายละเอียดโครงการ และภาพตัวอย่างจากบ้านจริง',
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
