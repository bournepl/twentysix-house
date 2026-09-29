import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../shared/seo.service';
import { COMPLETED_HOMES } from './completed-homes.data';
import { DESIGN_PROJECTS } from './design-projects.data';
import {
  ORGANIZATION_ID,
  WEBSITE_ID,
  breadcrumbSchema,
  itemListSchema,
  structuredDataGraph,
} from '../shared/structured-data';

type WorkCategory = 'built' | 'design';

interface WorkItem {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  label: string;
}

@Component({
  standalone: false,
  selector: 'app-new-ourworks',
  templateUrl: './new-ourworks.component.html',
  styleUrl: './new-ourworks.component.scss'
})
export class NewOurworksComponent {
  activeCategory: WorkCategory = 'built';
  private readonly initialProjectCount = 4;
  private readonly visibleProjectCounts: Record<WorkCategory, number> = {
    built: this.initialProjectCount,
    design: this.initialProjectCount,
  };

  private readonly featuredBuiltProjects: WorkItem[] = [
    {
      slug: 'khun-aod-residence',
      title: 'บ้านคุณอ๊อด',
      subtitle: 'บ้านสไตล์ Modern Classic ที่ผสานรายละเอียดคลาสสิกเข้ากับการอยู่อาศัยร่วมสมัย',
      image: 'assets/img/ourworks/completed/khun-aod-residence/card.webp',
      label: 'Modern Classic Residence'
    },
    {
      slug: 'khun-pui-residence',
      title: 'บ้านคุณปุ้ย',
      subtitle: 'บ้าน Modern & Cozy ที่ออกแบบพื้นที่ให้เรียบง่าย โปร่ง และตอบโจทย์ครอบครัว',
      image: 'assets/img/ourworks/completed/khun-pui-residence/card.webp',
      label: 'Modern & Cozy Residence'
    },
    {
      slug: 'khun-looknam-residence',
      title: 'บ้านคุณลูกน้ำ',
      subtitle: 'บ้าน Nordic Style ที่ให้ความสำคัญกับรูปทรง แสงธรรมชาติ และพื้นที่ส่วนกลาง',
      image: 'assets/img/ourworks/completed/khun-looknam-residence/card.webp',
      label: 'Nordic Style Residence'
    },
    {
      slug: 'khun-tae-residence',
      title: 'บ้านคุณเต้',
      subtitle: 'บ้าน Modern Style ที่จัดองค์ประกอบอาคารและเส้นสายให้ชัดเจนในทุกมุมมอง',
      image: 'assets/img/ourworks/completed/khun-tae-residence/card.webp',
      label: 'Modern Style Residence'
    }
  ];

  private readonly featuredDesignProjects: WorkItem[] = [
    {
      slug: 'khun-win-design',
      title: 'บ้านคุณวิน',
      subtitle: 'บ้าน Modern Luxury ที่วางสัดส่วนให้สง่างามและใช้งานได้ครบ',
      image: 'assets/img/ourworks/design/khun-win-design/card.webp',
      label: 'Exterior Design'
    },
    {
      slug: 'khun-preaw-design',
      title: 'บ้านคุณแพรว',
      subtitle: 'พื้นที่ภายในโทนสว่างที่เน้นความต่อเนื่องและความเรียบสะอาด',
      image: 'assets/img/ourworks/design/khun-preaw-design/gallery-05.webp',
      label: 'Interior Design'
    },
    {
      slug: 'khun-preaw-design',
      title: 'บ้านคุณแพรว',
      subtitle: 'การจัดวางพื้นที่จากพฤติกรรมของผู้อยู่อาศัยและแสงธรรมชาติ',
      image: 'assets/img/ourworks/design/khun-preaw-design/gallery-03.webp',
      label: 'Space Planning'
    },
    {
      slug: 'khun-fai-interior-design',
      title: 'บ้านคุณฝ้าย',
      subtitle: 'งาน Built-in โทนอบอุ่นที่รักษาความเรียบและรายละเอียดของวัสดุ',
      image: 'assets/img/ourworks/design/khun-fai-interior-design/card.webp',
      label: 'Built-in Design'
    }
  ];

  readonly builtProjects: WorkItem[] = [
    ...this.featuredBuiltProjects,
    ...COMPLETED_HOMES
      .filter(project => !this.featuredBuiltProjects.some(featured => featured.slug === project.slug))
      .map(project => ({
        slug: project.slug,
        title: project.title,
        subtitle: project.description,
        image: project.image,
        label: project.style,
      })),
  ];

  readonly designProjects: WorkItem[] = [
    ...this.featuredDesignProjects.filter((project, index, projects) =>
      projects.findIndex(item => item.slug === project.slug) === index
    ),
    ...DESIGN_PROJECTS
      .filter(project => !this.featuredDesignProjects.some(featured => featured.slug === project.slug))
      .map(project => ({
        slug: project.slug,
        title: project.title,
        subtitle: project.description,
        image: project.slug === 'khun-jane-ban-dung-design'
          ? 'assets/img/ourworks/design/khun-jane-ban-dung-design/gallery-03.webp'
          : project.image,
        label: project.scope,
      })),
  ];

  constructor(seo: SeoService, route: ActivatedRoute) {
    if (route.snapshot.queryParamMap.get('category') === 'design') {
      this.activeCategory = 'design';
    }

    const hero = 'assets/img/ourworks/design/khun-win-design/gallery-03.webp';
    const url = 'https://twentysix.house/ourworks';
    const title = 'ผลงานรับสร้างบ้านและออกแบบบ้าน | Twentysix House';
    const description = 'ชมผลงานบ้านสร้างจริงและผลงานออกแบบบ้านโดยทีม Twentysix House จังหวัดอุดรธานี';
    const projects = [...this.builtProjects, ...this.designProjects]
      .filter((project, index, items) => items.findIndex(item => item.slug === project.slug) === index)
      .map(project => ({
        name: project.title,
        url: `${url}/${this.builtProjects.includes(project) ? 'completed' : 'design'}/${project.slug}`,
        image: project.image,
      }));

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
          { name: 'ผลงานของเรา', url },
        ]),
        itemListSchema('ผลงานของ Twentysix House', url, projects),
      ),
    });
  }

  get visibleProjects(): WorkItem[] {
    return this.activeProjects.slice(0, this.visibleProjectCounts[this.activeCategory]);
  }

  get hasMoreProjects(): boolean {
    return this.visibleProjects.length < this.activeProjects.length;
  }

  get activeProjects(): WorkItem[] {
    return this.activeCategory === 'built' ? this.builtProjects : this.designProjects;
  }

  setCategory(category: WorkCategory): void {
    this.activeCategory = category;
  }

  showMoreProjects(): void {
    this.visibleProjectCounts[this.activeCategory] = this.activeProjects.length;
  }

  onCategoryKeydown(event: KeyboardEvent): void {
    const categoryByKey: Partial<Record<string, WorkCategory>> = {
      ArrowLeft: 'built',
      ArrowUp: 'built',
      Home: 'built',
      ArrowRight: 'design',
      ArrowDown: 'design',
      End: 'design',
    };
    const category = categoryByKey[event.key];

    if (!category) {
      return;
    }

    event.preventDefault();
    this.setCategory(category);
    const tabId = category === 'built' ? 'works-tab-built' : 'works-tab-design';
    document.getElementById(tabId)?.focus();
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
