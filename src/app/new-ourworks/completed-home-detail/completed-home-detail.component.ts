import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { SeoService } from '../../shared/seo.service';
import { HelpfulArticle, getHelpfulArticles } from '../../shared/blog-content-clusters';
import {
  ORGANIZATION_ID,
  WEBSITE_ID,
  absoluteSiteUrl,
  breadcrumbSchema,
  structuredDataGraph,
} from '../../shared/structured-data';
import { COMPLETED_HOMES, CompletedHome } from '../completed-homes.data';

@Component({
  standalone: false,
  selector: 'app-completed-home-detail',
  templateUrl: './completed-home-detail.component.html',
  styleUrl: './completed-home-detail.component.scss'
})
export class CompletedHomeDetailComponent implements OnDestroy {
  project?: CompletedHome;
  relatedProjects: CompletedHome[] = [];
  helpfulArticles: readonly HelpfulArticle[] = [];
  private readonly routeSubscription: Subscription;
  editorialImageIndexes = [1, 2, 3];
  editorialImageChanging = [false, false, false];
  editorialPendingImageIndexes: Array<number | null> = [null, null, null];
  editorialSlideDirections: Array<'previous' | 'next'> = ['next', 'next', 'next'];
  private readonly editorialSlideTimers: Array<number | undefined> = [];

  readonly editorialSections = [
    {
      eyebrow: 'ARCHITECTURE & CHARACTER',
      title: 'รูปทรงที่สะท้อนตัวตนของบ้าน',
      description: 'องค์ประกอบภายนอกถูกจัดวางให้มีจังหวะ เรียบชัด และสัมพันธ์กับบริบทของพื้นที่ เพื่อสร้างภาพจำโดยไม่ลดทอนการใช้งานจริง',
    },
    {
      eyebrow: 'SPACE & NATURAL LIGHT',
      title: 'พื้นที่ที่เปิดรับแสงและการใช้ชีวิต',
      description: 'ช่องเปิดและพื้นที่ส่วนกลางช่วยเชื่อมกิจกรรมของสมาชิกในบ้าน พร้อมรับแสงธรรมชาติในปริมาณที่เหมาะสมตลอดวัน',
    },
    {
      eyebrow: 'MATERIAL & CRAFT',
      title: 'รายละเอียดที่เรียบหรูและดูแลได้',
      description: 'วัสดุ สี และงานเก็บรายละเอียดถูกเลือกให้ทำงานร่วมกันอย่างสงบ เพื่อให้บ้านยังคงสวยและใช้งานได้ดีในระยะยาว',
    },
  ];

  constructor(private readonly route: ActivatedRoute, private readonly seo: SeoService) {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.project = COMPLETED_HOMES.find(item => item.slug === params.get('slug'));
      const projectIndex = this.project ? COMPLETED_HOMES.indexOf(this.project) : -1;
      this.relatedProjects = projectIndex >= 0
        ? [1, 2].map(offset => COMPLETED_HOMES[(projectIndex + offset) % COMPLETED_HOMES.length])
        : [];
      this.helpfulArticles = this.project
        ? getHelpfulArticles(this.project.style, { includeConstruction: true, limit: 2 })
        : [];
      this.editorialImageIndexes = [1, 2, 3];
      this.editorialImageChanging = [false, false, false];
      this.editorialPendingImageIndexes = [null, null, null];
      if (this.project) {
        const url = `https://twentysix.house/ourworks/completed/${this.project.slug}`;
        const title = `${this.project.title} | ผลงานบ้านสร้างจริง | Twentysix House`;
        this.seo.updatePage({
          title,
          description: this.project.description,
          url,
          image: this.project.socialImage || this.project.heroImage,
          preloadImage: this.project.heroImage,
          type: 'article',
          structuredData: structuredDataGraph(
            breadcrumbSchema([
              { name: 'หน้าแรก', url: 'https://twentysix.house' },
              { name: 'ผลงานของเรา', url: 'https://twentysix.house/ourworks' },
              { name: 'ผลงานบ้านสร้างจริง', url: 'https://twentysix.house/ourworks/completed' },
              { name: this.project.title, url },
            ]),
            {
              '@type': 'WebPage',
              '@id': `${url}#webpage`,
              url,
              name: title,
              description: this.project.description,
              inLanguage: 'th-TH',
              isPartOf: { '@id': WEBSITE_ID },
              mainEntity: { '@id': `${url}#project` },
            },
            {
              '@type': 'CreativeWork',
              '@id': `${url}#project`,
              name: this.project.title,
              description: this.project.description,
              url,
              creator: { '@id': ORGANIZATION_ID },
              locationCreated: this.project.location,
              image: [this.project.heroImage, ...this.project.gallery].map((image, index) => ({
                '@type': 'ImageObject',
                '@id': `${url}#image-${index + 1}`,
                contentUrl: absoluteSiteUrl(image),
                caption: `${this.project!.title} - ${this.project!.style}`,
              })),
              mainEntityOfPage: { '@id': `${url}#webpage` },
            },
          ),
        });
      } else {
        this.seo.updatePage({
          title: 'ไม่พบโครงการ | Twentysix House',
          description: 'ไม่พบข้อมูลผลงานบ้านสร้างจริงที่ต้องการ',
          url: `https://twentysix.house/ourworks/completed/${params.get('slug') ?? ''}`,
          robots: 'noindex, follow',
          canonical: false,
          image: null,
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.editorialSlideTimers.forEach(timer => {
      if (timer) {
        window.clearTimeout(timer);
      }
    });
  }

  changeEditorialImage(sectionIndex: number, direction: 'previous' | 'next'): void {
    if (!this.project || this.editorialImageChanging[sectionIndex]) {
      return;
    }

    const total = this.project.gallery.length;
    const current = this.editorialImageIndexes[sectionIndex] ?? 0;
    const offset = direction === 'next' ? 1 : -1;

    this.editorialSlideDirections[sectionIndex] = direction;
    this.editorialPendingImageIndexes[sectionIndex] = (current + offset + total) % total;
    this.editorialImageChanging[sectionIndex] = true;

    const transitionDuration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 520;
    this.editorialSlideTimers[sectionIndex] = window.setTimeout(() => {
      const pendingIndex = this.editorialPendingImageIndexes[sectionIndex];
      if (pendingIndex === null) {
        return;
      }

      this.editorialImageIndexes[sectionIndex] = pendingIndex;
      this.editorialPendingImageIndexes[sectionIndex] = null;
      this.editorialImageChanging[sectionIndex] = false;
    }, transitionDuration);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
