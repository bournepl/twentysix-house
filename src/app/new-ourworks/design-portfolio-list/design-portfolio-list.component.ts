import { Component } from '@angular/core';

import { SeoService } from '../../shared/seo.service';
import {
  ORGANIZATION_ID,
  WEBSITE_ID,
  breadcrumbSchema,
  itemListSchema,
  structuredDataGraph,
} from '../../shared/structured-data';
import { DESIGN_PROJECTS } from '../design-projects.data';

@Component({
  standalone: false,
  selector: 'app-design-portfolio-list',
  templateUrl: './design-portfolio-list.component.html',
  styleUrls: [
    '../completed-homes-list/completed-homes-list.component.scss',
    './design-portfolio-list.component.scss'
  ]
})
export class DesignPortfolioListComponent {
  readonly designProjects = DESIGN_PROJECTS;

  constructor(seo: SeoService) {
    const hero = 'assets/img/ourworks/design/khun-win-design/hero.webp';
    const url = 'https://twentysix.house/ourworks/design';
    const title = 'ผลงานออกแบบบ้านในอุดรธานี | Twentysix House';
    const description = 'รวมผลงานออกแบบสถาปัตยกรรมและตกแต่งภายในที่พัฒนาจากการใช้ชีวิตจริงของเจ้าของบ้าน';
    seo.updatePage({
      title,
      description,
      url,
      image: hero,
      preloadImage: hero,
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
          { name: 'ผลงานของเรา', url: 'https://twentysix.house/ourworks' },
          { name: 'ผลงานออกแบบ', url },
        ]),
        itemListSchema('ผลงานออกแบบบ้าน', url, this.designProjects.map(project => ({
          name: project.title,
          url: `${url}/${project.slug}`,
          image: project.image,
        }))),
      ),
    });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
