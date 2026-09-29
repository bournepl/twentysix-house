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

  private readonly routeSubscription: Subscription;

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
              { name: 'ผลงานออกแบบ', url: 'https://twentysix.house/ourworks' },
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
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
