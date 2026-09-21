import { Component } from '@angular/core';

import { SeoService } from '../../shared/seo.service';
import {
  ORGANIZATION_ID,
  WEBSITE_ID,
  breadcrumbSchema,
  itemListSchema,
  structuredDataGraph,
} from '../../shared/structured-data';
import { COMPLETED_HOMES } from '../completed-homes.data';

@Component({
  standalone: false,
  selector: 'app-completed-homes-list',
  templateUrl: './completed-homes-list.component.html',
  styleUrl: './completed-homes-list.component.scss'
})
export class CompletedHomesListComponent {
  readonly completedHomes = COMPLETED_HOMES;

  constructor(seo: SeoService) {
    const hero = 'assets/img/ourworks/completed/khun-jane-ban-dung-residence/hero.webp';
    const url = 'https://twentysix.house/ourworks/completed';
    const title = 'ผลงานบ้านสร้างจริงในอุดรธานี | Twentysix House';
    const description = 'รวมผลงานบ้านสร้างจริงที่ Twentysix House ดูแลตั้งแต่ออกแบบ วางแผน ก่อสร้าง จนถึงวันส่งมอบ';
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
          { name: 'ผลงานบ้านสร้างจริง', url },
        ]),
        itemListSchema('ผลงานบ้านสร้างจริง', url, this.completedHomes.map(project => ({
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
