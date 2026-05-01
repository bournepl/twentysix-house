import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, of, switchMap, tap } from 'rxjs';
import Aos from 'aos';
import { HouseDesign } from '../../../_model/house-design';
import { HouseDesignsService } from '../../../_service/house-designs.service';
import { JsonLdService } from '../../../_service/json-ld.service';
import { SeoService } from '../../../_service/seo.service';
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
    private seoService: SeoService,
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
    const specSummary = this.getDesignSpecSummary(design);
    const description = this.trimDescription(`${design.excerpt} ${specSummary}`);

    this.seoService.updatePageSeo({
      title: pageTitle,
      description,
      image: this.toAbsoluteAssetUrl(design.coverImage),
      url,
      robots: 'index, follow',
      ogType: 'article',
    });
  }

  private setDesignJsonLd(design: HouseDesign): void {
    const url = `${environment.siteUrl}/ourworks/house-designs/${design.slug}`;
    const keywords = [
      ...new Set([
        ...design.categories,
        ...design.tags,
        'แบบบ้าน',
        design.usableArea,
        design.bedrooms ? `${design.bedrooms} ห้องนอน` : undefined,
        design.bathrooms ? `${design.bathrooms} ห้องน้ำ` : undefined,
        design.parking ? `${design.parking} ที่จอดรถ` : undefined,
        'Twentysix House',
      ].filter(Boolean) as string[]),
    ].join(', ');

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
          additionalProperty: this.getDesignAdditionalProperties(design),
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
              name: 'หน้าหลัก',
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
    this.seoService.updatePageSeo({
      title: 'ไม่พบแบบบ้าน | Twentysix House',
      description: 'ไม่พบแบบบ้านที่คุณกำลังค้นหา กรุณากลับไปยังหน้ารวมแบบบ้านของ Twentysix House',
      canonicalPath: '/ourworks/house-designs',
      robots: 'noindex, follow',
    });
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

  private getDesignSpecSummary(design: HouseDesign): string {
    const specs = [
      design.usableArea ? `พื้นที่ใช้สอย ${design.usableArea}` : undefined,
      design.bedrooms ? `${design.bedrooms} ห้องนอน` : undefined,
      design.bathrooms ? `${design.bathrooms} ห้องน้ำ` : undefined,
      design.parking ? `${design.parking} ที่จอดรถ` : undefined,
    ].filter(Boolean);

    return specs.length ? specs.join(' ') : '';
  }

  private getDesignAdditionalProperties(design: HouseDesign): Array<{ '@type': string; name: string; value: string | number }> {
    return [
      design.usableArea ? { '@type': 'PropertyValue', name: 'พื้นที่ใช้สอย', value: design.usableArea } : undefined,
      design.bedrooms ? { '@type': 'PropertyValue', name: 'ห้องนอน', value: design.bedrooms } : undefined,
      design.bathrooms ? { '@type': 'PropertyValue', name: 'ห้องน้ำ', value: design.bathrooms } : undefined,
      design.parking ? { '@type': 'PropertyValue', name: 'ที่จอดรถ', value: design.parking } : undefined,
    ].filter(Boolean) as Array<{ '@type': string; name: string; value: string | number }>;
  }
}
