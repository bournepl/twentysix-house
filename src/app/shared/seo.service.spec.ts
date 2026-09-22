import { Title } from '@angular/platform-browser';

import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;

  beforeEach(() => {
    service = new SeoService(new Title(document), document);
    service.clearPageSeo();
  });

  afterEach(() => service.clearPageSeo());

  it('converts relative asset paths to production URLs', () => {
    expect(service.absoluteUrl('assets/img/seo/brand-mark-640.webp'))
      .toBe('https://twentysix.house/assets/img/seo/brand-mark-640.webp');
  });

  it('normalizes canonical URLs and writes social metadata', () => {
    service.updatePage({
      title: 'หน้าทดสอบ | Twentysix House',
      description: 'คำอธิบายหน้าทดสอบ',
      url: '/about/?source=test#team',
      image: 'assets/img/seo/about-hero-1600.webp',
    });

    expect(document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href)
      .toBe('https://twentysix.house/about');
    expect(document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.content)
      .toBe('https://twentysix.house/about');
    expect(document.querySelector<HTMLMetaElement>('meta[property="og:image"]')?.content)
      .toBe('https://twentysix.house/assets/img/seo/about-hero-1600.webp');
  });

  it('removes canonical and image metadata from non-canonical pages', () => {
    service.updatePage({
      title: 'ไม่พบหน้า',
      description: 'ไม่พบหน้าที่ค้นหา',
      canonical: false,
      image: null,
      robots: 'noindex, follow',
    });

    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.querySelector('meta[property="og:image"]')).toBeNull();
    expect(document.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content)
      .toBe('noindex, follow');
  });

  it('escapes markup characters in JSON-LD and manages hero preloads', () => {
    service.updatePage({
      title: 'หน้าทดสอบ',
      description: 'คำอธิบาย',
      preloadImage: 'assets/img/seo/home-hero-1920.webp',
      structuredData: { name: '</script><script>alert(1)</script>' },
    });

    const script = document.querySelector<HTMLScriptElement>('script[data-seo-structured-data="true"]');
    const preload = document.getElementById('page-hero-preload') as HTMLLinkElement;

    expect(script?.textContent).toContain('\\u003c/script>');
    expect(script?.textContent).not.toContain('</script>');
    expect(preload.href).toBe('https://twentysix.house/assets/img/seo/home-hero-1920.webp');
    expect(preload.getAttribute('fetchpriority')).toBe('high');
  });
});
