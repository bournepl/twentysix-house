import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { map, of, switchMap, tap } from 'rxjs';
import Aos from 'aos';
import { HouseDesign } from '../../../_model/house-design';
import { CanonicalService } from '../../../_service/canonical.service';
import { HouseDesignsService } from '../../../_service/house-designs.service';
import { JsonLdService } from '../../../_service/json-ld.service';
import { environment } from '../../../../environments/environment';

interface HouseDesignDetailViewModel {
  design?: HouseDesign;
  relatedDesigns: HouseDesign[];
}

@Component({
  selector: 'app-house-design-detail',
  templateUrl: './house-design-detail.component.html',
  styleUrl: './house-design-detail.component.scss',
})
export class HouseDesignDetailComponent implements OnInit, OnDestroy {
  design?: HouseDesign;
  relatedDesigns: HouseDesign[] = [];
  selectedGalleryImage?: string;
  selectedGalleryIndex = 0;
  isGalleryLightboxClosing = false;
  private galleryCloseTimeout?: ReturnType<typeof setTimeout>;
  readonly isBrowser: boolean;

  constructor(
    private route: ActivatedRoute,
    private houseDesignsService: HouseDesignsService,
    private title: Title,
    private meta: Meta,
    private canonical: CanonicalService,
    private jsonLdService: JsonLdService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const slug = params.get('slug') ?? '';
          return this.houseDesignsService.getDesignBySlug(slug);
        }),
        switchMap((design) => {
          if (!design) {
            this.setNotFoundSeo();
            return of({ design: undefined, relatedDesigns: [] } as HouseDesignDetailViewModel);
          }

          this.setSeo(design);
          this.setDesignJsonLd(design);

          return this.houseDesignsService.getRelatedDesigns(design, 3).pipe(
            map((relatedDesigns) => ({ design, relatedDesigns }))
          );
        }),
        tap((vm) => {
          this.design = vm.design;
          this.relatedDesigns = vm.relatedDesigns;

          if (vm.design && this.isBrowser) {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => Aos.refreshHard());
            });
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    if (this.galleryCloseTimeout) {
      clearTimeout(this.galleryCloseTimeout);
    }

    this.jsonLdService.removeSchema('house-design-detail');
  }

  trackByText(index: number, item: string): string {
    return item;
  }

  trackByDesign(index: number, item: HouseDesign): string {
    return item.id;
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

  private setSeo(design: HouseDesign): void {
    const url = `/ourworks/house-designs/${design.slug}`;
    const pageTitle = `${design.title} | แบบบ้าน Twentysix House`;
    const description = this.trimDescription(design.excerpt);

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: this.toAbsoluteAssetUrl(design.coverImage) });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:url', content: `${environment.siteUrl}${url}` });
    this.meta.updateTag({ property: 'og:site_name', content: 'Twentysix House' });
    this.meta.updateTag({ property: 'og:locale', content: 'th_TH' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: this.toAbsoluteAssetUrl(design.coverImage) });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.canonical.setCanonicalURL(url);
  }

  private setDesignJsonLd(design: HouseDesign): void {
    const url = `${environment.siteUrl}/ourworks/house-designs/${design.slug}`;
    const keywords = [...new Set([...design.categories, ...design.tags, 'แบบบ้าน', 'Twentysix House'])].join(', ');

    this.jsonLdService.insertSchema('house-design-detail', {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CreativeWork',
          '@id': `${url}#design`,
          name: design.title,
          headline: design.title,
          description: design.description,
          image: design.gallery.map((image) => this.toAbsoluteAssetUrl(image)),
          url,
          keywords,
          creator: {
            '@id': `${environment.siteUrl}/#localbusiness`,
          },
          about: design.categories.map((category) => ({
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
              name: 'แบบบ้าน',
              item: `${environment.siteUrl}/ourworks/house-designs`,
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: design.category,
              item: url,
            },
          ],
        },
      ],
    });
  }

  private setNotFoundSeo(): void {
    this.title.setTitle('ไม่พบแบบบ้าน | Twentysix House');
    this.meta.updateTag({
      name: 'description',
      content: 'ไม่พบแบบบ้านที่คุณกำลังค้นหา กรุณากลับไปยังหน้ารวมแบบบ้านของ Twentysix House',
    });
    this.meta.updateTag({ name: 'robots', content: 'noindex, follow' });
    this.canonical.setCanonicalURL('/ourworks/house-designs');
    this.jsonLdService.removeSchema('house-design-detail');
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
