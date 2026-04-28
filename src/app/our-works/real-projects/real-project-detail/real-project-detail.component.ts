import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, switchMap, map, tap } from 'rxjs';
import { CanonicalService } from '../../../_service/canonical.service';
import { JsonLdService } from '../../../_service/json-ld.service';
import { RealProjectsService } from '../../../_service/real-projects.service';
import { RealProject } from '../../../_model/real-project';
import { environment } from '../../../../environments/environment';
import Aos from 'aos';

interface RealProjectDetailViewModel {
  project?: RealProject;
  relatedProjects: RealProject[];
}

@Component({
  selector: 'app-real-project-detail',
  templateUrl: './real-project-detail.component.html',
  styleUrl: './real-project-detail.component.scss',
})
export class RealProjectDetailComponent implements OnDestroy {
  selectedGalleryImage?: string;
  selectedGalleryIndex = 0;
  isGalleryLightboxClosing = false;
  private galleryCloseTimeout?: ReturnType<typeof setTimeout>;

  readonly vm$: Observable<RealProjectDetailViewModel> = this.route.paramMap.pipe(
    switchMap((params) => {
      const slug = params.get('slug') ?? '';
      return this.realProjectsService.getProjectBySlug(slug);
    }),
    switchMap((project) => {
      if (!project) {
        this.jsonLdService.removeSchema('real-project-detail');
        this.setProjectNotFoundSeo();
        return of({ project: undefined, relatedProjects: [] });
      }

      this.setProjectSeo(project);

      return this.realProjectsService.getRelatedProjects(project, 3).pipe(
        map((relatedProjects) => ({ project, relatedProjects }))
      );
    }),
    tap(({ project }) => {
      if (project) {
        this.refreshAos();
      }
    })
  );

  constructor(
    private route: ActivatedRoute,
    private realProjectsService: RealProjectsService,
    private title: Title,
    private meta: Meta,
    private canonical: CanonicalService,
    private jsonLdService: JsonLdService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnDestroy(): void {
    if (this.galleryCloseTimeout) {
      clearTimeout(this.galleryCloseTimeout);
    }

    this.jsonLdService.removeSchema('real-project-detail');
  }

  trackByImage(index: number, image: string): string {
    return image;
  }

  trackByText(index: number, text: string): string {
    return text;
  }

  trackByProject(index: number, project: RealProject): string {
    return project.id;
  }

  openGalleryImage(image: string, index: number): void {
    if (this.galleryCloseTimeout) {
      clearTimeout(this.galleryCloseTimeout);
    }

    this.selectedGalleryImage = image;
    this.selectedGalleryIndex = index;
    this.isGalleryLightboxClosing = false;
  }

  closeGalleryImage(): void {
    if (!this.selectedGalleryImage || this.isGalleryLightboxClosing) {
      return;
    }

    this.isGalleryLightboxClosing = true;
    this.galleryCloseTimeout = setTimeout(() => {
      this.selectedGalleryImage = undefined;
      this.isGalleryLightboxClosing = false;
    }, 240);
  }

  @HostListener('document:keydown.escape')
  onEscapeGallery(): void {
    this.closeGalleryImage();
  }

  private refreshAos(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => Aos.refreshHard());
    });
  }

  private setProjectSeo(project: RealProject): void {
    const url = `${environment.siteUrl}/ourworks/real-projects/${project.slug}`;
    const title = `${project.title} | ผลงานจริง Twentysix House`;

    const imageUrl = this.toAbsoluteAssetUrl(project.coverImage);
    const galleryImages = project.gallery.map((image) => this.toAbsoluteAssetUrl(image));
    const keywords = [...new Set([...project.categories, ...project.tags, 'Twentysix House'])].join(', ');
    const description = this.trimDescription(project.excerpt);

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: keywords });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Twentysix House' });
    this.meta.updateTag({ property: 'og:locale', content: 'th_TH' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
    this.canonical.setCanonicalURL(url);

    this.jsonLdService.insertSchema('real-project-detail', {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CreativeWork',
          '@id': `${url}#project`,
          name: project.title,
          headline: project.title,
          description: project.excerpt,
          image: galleryImages,
          url,
          keywords,
          mainEntityOfPage: url,
          creator: {
            '@id': `${environment.siteUrl}/#localbusiness`,
          },
          locationCreated: {
            '@type': 'Place',
            name: project.location,
          },
          about: project.categories.map((category) => ({
            '@type': 'Thing',
            name: category,
          })),
          inLanguage: 'th-TH',
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
              item: `${environment.siteUrl}/ourworks/real-projects`,
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: project.category,
              item: url,
            },
          ],
        },
      ],
    });
  }

  private setProjectNotFoundSeo(): void {
    const url = `${environment.siteUrl}/ourworks/real-projects`;
    const title = 'ไม่พบผลงานจริง | Twentysix House';
    const description = 'ไม่พบรายละเอียดผลงานจริงที่คุณต้องการ กรุณากลับไปเลือกดูผลงานจริงทั้งหมดของ Twentysix House';

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: 'noindex, follow' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Twentysix House' });
    this.meta.updateTag({ property: 'og:locale', content: 'th_TH' });
    this.canonical.setCanonicalURL(url);
  }

  private toAbsoluteAssetUrl(pathOrUrl: string): string {
    if (/^https?:\/\//i.test(pathOrUrl)) {
      return pathOrUrl;
    }

    return `${environment.siteUrl}/${pathOrUrl.replace(/^\/+/, '')}`;
  }

  private trimDescription(description: string): string {
    return description.replace(/\s+/g, ' ').trim().slice(0, 155);
  }
}
