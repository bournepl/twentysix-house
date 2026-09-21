import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import { HOUSE_CATALOG_COLLECTIONS } from '../house-catalog/house-catalog.data';

type FeatureVideoStatus = 'idle' | 'loading' | 'ready' | 'error';

interface FeatureVideoItem {
  src: string;
  poster: string;
  title: string;
  description: string;
  transcriptSummary: string;
  captions?: string | null;
}

@Component({
  selector: 'app-new-home',
  templateUrl: './new-home.component.html',
  styleUrl: './new-home.component.scss'
})
export class NewHomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('featureVideo') featureVideo?: ElementRef<HTMLVideoElement>;
  @ViewChild('featureVideoFrame') featureVideoFrame?: ElementRef<HTMLElement>;
  @ViewChild('portfolioScroller') portfolioScroller?: ElementRef<HTMLElement>;
  @ViewChild('houseDesignScroller') houseDesignScroller?: ElementRef<HTMLElement>;

  private videoObserver?: IntersectionObserver;
  private portfolioAutoScrollFrame?: number;
  private portfolioLastFrameTime = 0;
  private portfolioResumeTimer?: ReturnType<typeof setTimeout>;
  private portfolioAutoScrollPaused = false;
  private portfolioHoverPaused = false;
  private readonly portfolioAutoSpeed = 150;
  private houseDesignAutoScrollFrame?: number;
  private houseDesignLastFrameTime = 0;
  private houseDesignResumeTimer?: ReturnType<typeof setTimeout>;
  private houseDesignAutoScrollPaused = false;
  private houseDesignHoverPaused = false;
  private readonly houseDesignAutoSpeed = 150;
  activeCatalogIndex = 0;

  readonly heroSlides = [
    {
      image: 'assets/img/seo/home-hero-1920.webp',
      title: 'Luxury Custom Home Builders',
      subtitle: 'The Precious Living For The Next Generation.',
    },
  ];

  activeFeatureVideoIndex = 0;
  videoCarouselStartIndex = 0;
  featureVideoThumbnails: Array<{ poster: string; title: string; index: number }> = [];
  featureVideoSource: string | null = null;
  featureVideoStatus: FeatureVideoStatus = 'idle';
  featureVideoHasStarted = false;
  private featureVideoIsNearViewport = false;
  private featureVideoPlayRequested = false;
  private prefersReducedMotion = false;

  readonly featureVideos: FeatureVideoItem[] = [
    {
      src: 'assets/videos/khun-fai-testimonial-1080p.mp4',
      poster: 'assets/img/videos/posters/khun-fai-testimonial.webp',
      title: 'ประสบการณ์สร้างบ้านของคุณฝ้าย',
      description: 'พูดคุยถึงประสบการณ์ระหว่างเจ้าของบ้านกับทีม ตั้งแต่การสื่อสารรายละเอียดไปจนถึงวันที่บ้านพร้อมใช้งาน',
      transcriptSummary: 'เจ้าของบ้านเล่ามุมมองต่อการทำงานร่วมกับทีมและความรู้สึกหลังเข้าอยู่อาศัยจริง',
    },
    {
      src: 'assets/videos/khun-pui-home-handover-1080p.mp4',
      poster: 'assets/img/videos/posters/khun-pui-home-handover.webp',
      title: 'ส่งมอบบ้านคุณปุ้ย',
      description: 'เรื่องราวบ้านสองชั้นที่เชื่อมพื้นที่อยู่อาศัยกับความต้องการของครอบครัว พร้อมมุมมองจากเจ้าของบ้าน',
      transcriptSummary: 'เจ้าของบ้านเล่าความรู้สึกหลังได้รับมอบบ้าน สลับกับภาพพื้นที่ภายนอกและฟังก์ชันภายใน',
    },
    {
      src: 'assets/videos/khun-tae-home-handover-720p.mp4',
      poster: 'assets/img/videos/posters/khun-tae-home-handover.webp',
      title: 'ส่งมอบบ้านคุณเท่',
      description: 'ชมบ้านและฟังประสบการณ์จากเจ้าของบ้าน ตั้งแต่มุมใช้งานภายในไปจนถึงบรรยากาศในวันส่งมอบ',
      transcriptSummary: 'เจ้าของบ้านพูดถึงความไว้วางใจและการทำงานร่วมกับทีม พร้อมภาพรายละเอียดของบ้านหลังสร้างเสร็จ',
    },
  ];

  get activeFeatureVideo() {
    return this.featureVideos[this.activeFeatureVideoIndex];
  }

  get featureVideoPoster(): string {
    return this.activeFeatureVideo.poster;
  }

  private updateFeatureVideoThumbnails(): void {
    const items = this.featureVideos
      .map((item, index) => ({
        poster: item.poster,
        title: item.title,
        index,
      }))
      .filter((item) => item.index !== this.activeFeatureVideoIndex);

    if (!items.length) {
      this.featureVideoThumbnails = [];
      return;
    }

    this.featureVideoThumbnails = [...items, ...items].slice(
      this.videoCarouselStartIndex,
      this.videoCarouselStartIndex + 2
    );
  }

  readonly services = [
    {
      image: 'assets/img/Photoroom8.png',
      title: 'ปรึกษาเรื่องบ้าน',
      description: 'คุยโจทย์เบื้องต้น งบประมาณ ที่ดิน และแนวทางเริ่มต้นโครงการ',
    },
    {
      image: 'assets/img/Photoroom4.png',
      title: 'วางแผนงบประมาณ',
      description: 'ช่วยประเมินงบประมาณเบื้องต้น เพื่อให้ตัดสินใจเรื่องแบบและขอบเขตงานง่ายขึ้น',
    },
    {
      image: 'assets/img/Photoroom7.png',
      title: 'ออกแบบบ้านและเขียนแบบ',
      description: 'วางผัง ฟังก์ชัน รูปแบบบ้าน แบบก่อสร้าง และรายละเอียดที่ต้องใช้ต่อ',
    },
    {
      image: 'assets/img/Photoroom5.png',
      title: 'รับเหมาก่อสร้างบ้าน',
      description: 'ก่อสร้างบ้านพักอาศัยตามแบบ พร้อมดูแลงานหน้าไซต์และประสานงานในระบบ',
    },
    {
      image: 'assets/img/Photoroom2.png',
      title: 'ตกแต่งภายใน',
      description: 'วางแนวทางบรรยากาศภายใน เลือกวัสดุ สี เฟอร์นิเจอร์ และรายละเอียดการใช้งาน',
    },
    {
      image: 'assets/img/Photoroom1.png',
      title: 'บริการหลังการขาย',
      description: 'ดูแลลูกค้าอย่างต่อเนื่อง ทั้งงานซ่อมบำรุง ตรวจเช็คโครงสร้าง รับประกันคุณภาพ',
    },
  ];

  readonly catalogItems = HOUSE_CATALOG_COLLECTIONS;

  readonly portfolioItems = [
    { image: 'assets/img/seo/portfolio-house-1-960.webp', title: 'Private Residence' },
    { image: 'assets/img/seo/portfolio-house-2-960.webp', title: 'Modern Family Home' },
    { image: 'assets/img/seo/portfolio-house-3-960.webp', title: 'Warm Contemporary House' },
    { image: 'assets/img/seo/portfolio-house-4-960.webp', title: 'Urban Living Home' },
    { image: 'assets/img/seo/portfolio-house-5-960.webp', title: 'Elegant Home Design' },
    { image: 'assets/img/seo/portfolio-house-6-960.webp', title: 'Twentysix House Project' },
  ];

  readonly portfolioLoopItems = [...this.portfolioItems, ...this.portfolioItems];

  houseDesignItems = [...this.catalogItems[0].items];

  houseDesignLoopItems = [...this.houseDesignItems, ...this.houseDesignItems];

  constructor(
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.updateFeatureVideoThumbnails();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.startPortfolioAutoScroll();
    this.startHouseDesignAutoScroll();
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.setupFeatureVideoLazyLoading();
  }

  ngOnDestroy(): void {
    this.videoObserver?.disconnect();
    this.stopPortfolioAutoScroll();
    this.stopHouseDesignAutoScroll();
  }

  scrollToTop(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private setupFeatureVideoLazyLoading(): void {
    const frame = this.featureVideoFrame?.nativeElement;

    if (!frame) {
      return;
    }

    this.videoObserver = new IntersectionObserver(
      ([entry]) => {
        this.featureVideoIsNearViewport = entry.isIntersecting;

        if (entry.isIntersecting) {
          this.prepareFeatureVideoSource();

          if (entry.intersectionRatio >= 0.45 && !this.prefersReducedMotion) {
            this.playFeatureVideo();
          }

          return;
        }

        if (this.featureVideoHasStarted) {
          this.featureVideo?.nativeElement.pause();
        }
      },
      { threshold: [0.01, 0.45] }
    );

    this.videoObserver.observe(frame);
  }

  private prepareFeatureVideoSource(): void {
    if (!this.featureVideoSource) {
      this.featureVideoSource = this.activeFeatureVideo.src;
    }
  }

  playFeatureVideo(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const currentVideo = this.featureVideo?.nativeElement;

    if (this.featureVideoHasStarted && currentVideo) {
      currentVideo.play().catch(() => undefined);
      return;
    }

    if (this.featureVideoPlayRequested) {
      return;
    }

    this.prepareFeatureVideoSource();
    this.featureVideoPlayRequested = true;
    this.featureVideoStatus = 'loading';

    setTimeout(() => {
      const video = this.featureVideo?.nativeElement;

      if (!video) {
        return;
      }

      video.load();
      video.play().catch(() => {
        this.featureVideoPlayRequested = false;
        this.featureVideoStatus = video.error ? 'error' : 'idle';
      });
    });
  }

  retryFeatureVideo(): void {
    this.resetFeatureVideoPlayer();
    this.playFeatureVideo();
  }

  onFeatureVideoLoadStart(): void {
    if (this.featureVideoSource && this.featureVideoPlayRequested) {
      this.featureVideoStatus = 'loading';
    }
  }

  onFeatureVideoCanPlay(): void {
    this.featureVideoStatus = 'ready';
  }

  onFeatureVideoPlaying(): void {
    this.featureVideoPlayRequested = false;
    this.featureVideoHasStarted = true;
    this.featureVideoStatus = 'ready';
  }

  onFeatureVideoWaiting(): void {
    if (this.featureVideoSource && (this.featureVideoPlayRequested || this.featureVideoHasStarted)) {
      this.featureVideoStatus = 'loading';
    }
  }

  onFeatureVideoError(): void {
    if (!this.featureVideoSource) {
      return;
    }

    this.featureVideoHasStarted = false;
    this.featureVideoPlayRequested = false;
    this.featureVideoStatus = 'error';
  }

  private resetFeatureVideoPlayer(): void {
    const video = this.featureVideo?.nativeElement;

    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }

    this.featureVideoSource = null;
    this.featureVideoStatus = 'idle';
    this.featureVideoHasStarted = false;
    this.featureVideoPlayRequested = false;
  }

  selectFeatureVideo(index: number): void {
    if (index === this.activeFeatureVideoIndex) {
      this.playFeatureVideo();
      return;
    }

    this.resetFeatureVideoPlayer();
    this.activeFeatureVideoIndex = index;
    this.videoCarouselStartIndex = 0;
    this.updateFeatureVideoThumbnails();

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.featureVideoIsNearViewport && !this.prefersReducedMotion) {
      this.playFeatureVideo();
    } else {
      this.prepareFeatureVideoSource();
    }
  }

  previousFeatureVideo(): void {
    const total = this.featureVideos.length - 1;

    if (total <= 1) {
      return;
    }

    this.videoCarouselStartIndex = (this.videoCarouselStartIndex - 1 + total) % total;
    this.updateFeatureVideoThumbnails();
  }

  nextFeatureVideo(): void {
    const total = this.featureVideos.length - 1;

    if (total <= 1) {
      return;
    }

    this.videoCarouselStartIndex = (this.videoCarouselStartIndex + 1) % total;
    this.updateFeatureVideoThumbnails();
  }

  private startPortfolioAutoScroll(): void {
    const scroller = this.portfolioScroller?.nativeElement;

    if (!scroller) {
      return;
    }

    const scroll = (timestamp: number) => {
      if (!this.portfolioLastFrameTime) {
        this.portfolioLastFrameTime = timestamp;
      }

      const elapsedSeconds = Math.min((timestamp - this.portfolioLastFrameTime) / 1000, 0.05);
      this.portfolioLastFrameTime = timestamp;

      const loopPoint = this.getPortfolioLoopPoint(scroller);

      if (!this.portfolioAutoScrollPaused && loopPoint > scroller.clientWidth) {
        scroller.scrollLeft += this.portfolioAutoSpeed * elapsedSeconds;

        if (scroller.scrollLeft >= loopPoint) {
          scroller.scrollLeft -= loopPoint;
        }
      }

      this.portfolioAutoScrollFrame = requestAnimationFrame(scroll);
    };

    this.portfolioAutoScrollFrame = requestAnimationFrame(scroll);
  }

  private stopPortfolioAutoScroll(): void {
    if (this.portfolioAutoScrollFrame) {
      cancelAnimationFrame(this.portfolioAutoScrollFrame);
    }

    if (this.portfolioResumeTimer) {
      clearTimeout(this.portfolioResumeTimer);
    }
  }

  pausePortfolioAutoScroll(): void {
    this.portfolioHoverPaused = true;
    this.portfolioAutoScrollPaused = true;

    if (this.portfolioResumeTimer) {
      clearTimeout(this.portfolioResumeTimer);
    }
  }

  resumePortfolioAutoScroll(): void {
    this.portfolioHoverPaused = false;
    this.portfolioAutoScrollPaused = false;
    this.portfolioLastFrameTime = 0;
  }

  private pausePortfolioAutoScrollTemporarily(): void {
    if (this.portfolioHoverPaused) {
      return;
    }

    this.portfolioAutoScrollPaused = true;

    if (this.portfolioResumeTimer) {
      clearTimeout(this.portfolioResumeTimer);
    }

    this.portfolioResumeTimer = setTimeout(() => {
      this.portfolioAutoScrollPaused = false;
      this.portfolioLastFrameTime = 0;
    }, 1200);
  }

  private getPortfolioStep(scroller: HTMLElement): number {
    const firstCard = scroller.querySelector<HTMLElement>('.portfolio-card');
    const styles = getComputedStyle(scroller);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 24;

    return (firstCard?.offsetWidth ?? scroller.clientWidth / 4) + gap;
  }

  private getPortfolioLoopPoint(scroller: HTMLElement): number {
    return this.getPortfolioStep(scroller) * this.portfolioItems.length;
  }

  nextCatalog(): void {
    this.activateCatalog((this.activeCatalogIndex + 1) % this.catalogItems.length);
  }

  previousCatalog(): void {
    this.activateCatalog(
      (this.activeCatalogIndex - 1 + this.catalogItems.length) % this.catalogItems.length
    );
  }

  setCatalog(index: number): void {
    this.activateCatalog(index);
  }

  private activateCatalog(index: number): void {
    this.activeCatalogIndex = index;
    this.houseDesignItems = [...this.catalogItems[index].items];
    this.houseDesignLoopItems = [...this.houseDesignItems, ...this.houseDesignItems];
    this.houseDesignLastFrameTime = 0;

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    requestAnimationFrame(() => {
      const scroller = this.houseDesignScroller?.nativeElement;

      if (scroller) {
        scroller.scrollLeft = 0;
      }
    });
  }

  getCatalogOffset(index: number): number {
    const total = this.catalogItems.length;
    const rawOffset = index - this.activeCatalogIndex;

    if (rawOffset > total / 2) {
      return rawOffset - total;
    }

    if (rawOffset < -total / 2) {
      return rawOffset + total;
    }

    return rawOffset;
  }

  scrollPortfolio(direction: 'previous' | 'next'): void {
    const scroller = this.portfolioScroller?.nativeElement;

    if (!scroller) {
      return;
    }

    this.pausePortfolioAutoScrollTemporarily();

    const step = this.getPortfolioStep(scroller);
    const loopPoint = this.getPortfolioLoopPoint(scroller);

    if (direction === 'previous' && scroller.scrollLeft <= step) {
      scroller.scrollLeft += loopPoint;
    }

    scroller.scrollBy({ left: step * (direction === 'next' ? 1 : -1), behavior: 'smooth' });
  }

  private startHouseDesignAutoScroll(): void {
    const scroller = this.houseDesignScroller?.nativeElement;

    if (!scroller) {
      return;
    }

    const scroll = (timestamp: number) => {
      if (!this.houseDesignLastFrameTime) {
        this.houseDesignLastFrameTime = timestamp;
      }

      const elapsedSeconds = Math.min((timestamp - this.houseDesignLastFrameTime) / 1000, 0.05);
      this.houseDesignLastFrameTime = timestamp;
      const loopPoint = this.getHouseDesignLoopPoint(scroller);

      if (!this.houseDesignAutoScrollPaused && scroller.scrollWidth > scroller.clientWidth + 1) {
        scroller.scrollLeft += this.houseDesignAutoSpeed * elapsedSeconds;

        if (scroller.scrollLeft >= loopPoint) {
          scroller.scrollLeft -= loopPoint;
        }
      }

      this.houseDesignAutoScrollFrame = requestAnimationFrame(scroll);
    };

    this.houseDesignAutoScrollFrame = requestAnimationFrame(scroll);
  }

  private stopHouseDesignAutoScroll(): void {
    if (this.houseDesignAutoScrollFrame) {
      cancelAnimationFrame(this.houseDesignAutoScrollFrame);
    }

    if (this.houseDesignResumeTimer) {
      clearTimeout(this.houseDesignResumeTimer);
    }
  }

  pauseHouseDesignAutoScroll(): void {
    this.houseDesignHoverPaused = true;
    this.houseDesignAutoScrollPaused = true;

    if (this.houseDesignResumeTimer) {
      clearTimeout(this.houseDesignResumeTimer);
    }
  }

  resumeHouseDesignAutoScroll(): void {
    this.houseDesignHoverPaused = false;
    this.houseDesignAutoScrollPaused = false;
    this.houseDesignLastFrameTime = 0;
  }

  private pauseHouseDesignAutoScrollTemporarily(): void {
    if (this.houseDesignHoverPaused) {
      return;
    }

    this.houseDesignAutoScrollPaused = true;

    if (this.houseDesignResumeTimer) {
      clearTimeout(this.houseDesignResumeTimer);
    }

    this.houseDesignResumeTimer = setTimeout(() => {
      this.houseDesignAutoScrollPaused = false;
      this.houseDesignLastFrameTime = 0;
    }, 1200);
  }

  private getHouseDesignStep(scroller: HTMLElement): number {
    const firstCard = scroller.querySelector<HTMLElement>('.house-design-card');
    const styles = getComputedStyle(scroller);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 24;

    return (firstCard?.offsetWidth ?? scroller.clientWidth / 4) + gap;
  }

  private getHouseDesignLoopPoint(scroller: HTMLElement): number {
    return this.getHouseDesignStep(scroller) * this.houseDesignItems.length;
  }

  scrollHouseDesign(direction: 'previous' | 'next'): void {
    const scroller = this.houseDesignScroller?.nativeElement;

    if (!scroller) {
      return;
    }

    this.pauseHouseDesignAutoScrollTemporarily();
    const step = this.getHouseDesignStep(scroller);
    const loopPoint = this.getHouseDesignLoopPoint(scroller);

    if (direction === 'previous' && scroller.scrollLeft <= step) {
      scroller.scrollLeft += loopPoint;
    }

    scroller.scrollBy({ left: step * (direction === 'next' ? 1 : -1), behavior: 'smooth' });
  }

}
