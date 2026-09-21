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
import { DESIGN_PROJECTS, DesignProject } from '../design-projects.data';

@Component({
  standalone: false,
  selector: 'app-design-project-detail',
  templateUrl: './design-project-detail.component.html',
  styleUrls: [
    '../completed-home-detail/completed-home-detail.component.scss',
    './design-project-detail.component.scss'
  ]
})
export class DesignProjectDetailComponent implements OnDestroy {
  project?: DesignProject;
  relatedProjects: DesignProject[] = [];
  helpfulArticles: readonly HelpfulArticle[] = [];
  editorialImageIndexes = [1, 2, 3];
  editorialImageChanging = [false, false, false];
  editorialPendingImageIndexes: Array<number | null> = [null, null, null];
  editorialSlideDirections: Array<'previous' | 'next'> = ['next', 'next', 'next'];

  readonly editorialSections = [
    {
      eyebrow: 'DESIGN INTENT',
      title: 'แนวคิดที่เริ่มจากวิถีชีวิต',
      description: 'โจทย์การอยู่อาศัยถูกแปลเป็นลำดับพื้นที่ สัดส่วน และบรรยากาศ เพื่อให้แบบบ้านตอบชีวิตจริงก่อนเติมรายละเอียดด้านความงาม',
    },
    {
      eyebrow: 'FORM & SPACE',
      title: 'รูปทรงและพื้นที่ที่ทำงานร่วมกัน',
      description: 'มวลอาคาร ช่องเปิด และความสัมพันธ์ของแต่ละห้องถูกพัฒนาไปพร้อมกัน เพื่อให้ภาพภายนอกและประสบการณ์ภายในเป็นเรื่องเดียวกัน',
    },
    {
      eyebrow: 'MATERIAL & MOOD',
      title: 'วัสดุที่กำหนดอารมณ์ของบ้าน',
      description: 'โทนสี พื้นผิว และแสงเงาถูกเลือกให้เสริมบุคลิกของโครงการ พร้อมคำนึงถึงความเหมาะสมต่อการใช้งานและการดูแลระยะยาว',
    },
  ];

  private readonly routeSubscription: Subscription;
  private readonly slideTimers: Array<number | undefined> = [];

  constructor(private readonly route: ActivatedRoute, private readonly seo: SeoService) {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.project = DESIGN_PROJECTS.find(item => item.slug === params.get('slug'));
      const projectIndex = this.project ? DESIGN_PROJECTS.indexOf(this.project) : -1;
      this.relatedProjects = projectIndex >= 0
        ? [1, 2].map(offset => DESIGN_PROJECTS[(projectIndex + offset) % DESIGN_PROJECTS.length])
        : [];
      this.helpfulArticles = this.project
        ? getHelpfulArticles(this.project.style, { includeConstruction: false, limit: 2 })
        : [];
      this.editorialImageIndexes = [1, 2, 3];
      this.editorialImageChanging = [false, false, false];
      this.editorialPendingImageIndexes = [null, null, null];
      if (this.project) {
        const url = `https://twentysix.house/ourworks/design/${this.project.slug}`;
        const title = `${this.project.title} | ผลงานออกแบบบ้าน | Twentysix House`;
        this.seo.updatePage({
          title,
          description: this.project.description,
          url,
          image: this.project.heroImage,
          preloadImage: this.project.heroImage,
          type: 'article',
          structuredData: structuredDataGraph(
            breadcrumbSchema([
              { name: 'หน้าแรก', url: 'https://twentysix.house' },
              { name: 'ผลงานของเรา', url: 'https://twentysix.house/ourworks' },
              { name: 'ผลงานออกแบบ', url: 'https://twentysix.house/ourworks/design' },
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
          title: 'ไม่พบผลงานออกแบบ | Twentysix House',
          description: 'ไม่พบข้อมูลผลงานออกแบบที่ต้องการ',
          url: `https://twentysix.house/ourworks/design/${params.get('slug') ?? ''}`,
          robots: 'noindex, follow',
          canonical: false,
          image: null,
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.slideTimers.forEach(timer => {
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
    this.slideTimers[sectionIndex] = window.setTimeout(() => {
      const pending = this.editorialPendingImageIndexes[sectionIndex];
      if (pending === null) {
        return;
      }

      this.editorialImageIndexes[sectionIndex] = pending;
      this.editorialPendingImageIndexes[sectionIndex] = null;
      this.editorialImageChanging[sectionIndex] = false;
    }, transitionDuration);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
