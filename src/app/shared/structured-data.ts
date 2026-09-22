export const SITE_URL = 'https://twentysix.house';
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ItemListEntry {
  name: string;
  url: string;
  image?: string;
}

export function absoluteSiteUrl(path: string): string {
  return new URL(path, `${SITE_URL}/`).href;
}

export function organizationSchema(): Record<string, unknown> {
  return {
    '@type': ['Organization', 'LocalBusiness'],
    '@id': ORGANIZATION_ID,
    name: 'Twentysix House',
    alternateName: 'TWENTYSIX.HOUSE',
    legalName: 'บริษัท ทเวนตี้ซิกซ์ ดีเวลล็อปเมนท์ จำกัด',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#logo`,
      url: absoluteSiteUrl('assets/img/seo/brand-mark-640.webp'),
      contentUrl: absoluteSiteUrl('assets/img/seo/brand-mark-640.webp'),
      caption: 'Twentysix House',
    },
    image: absoluteSiteUrl('assets/img/house-catalog/pure-collection/collection-hero.webp'),
    telephone: '+66-99-470-8877',
    email: 'twentysix.desk@gmail.com',
    hasMap: 'https://maps.app.goo.gl/AgjTg2jRSc3iaYa46?g_st=com.google.maps.preview.copy',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '127/2 ถนนโพนพิสัย',
      addressLocality: 'อำเภอเมืองอุดรธานี',
      addressRegion: 'อุดรธานี',
      postalCode: '41000',
      addressCountry: 'TH',
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'จังหวัดอุดรธานี' },
      { '@type': 'AdministrativeArea', name: 'จังหวัดหนองคาย' },
    ],
    sameAs: [
      'https://www.facebook.com/share/19APWzVgu7/?mibextid=wwXIfr',
      'https://www.instagram.com/26twentysix.house?igsh=YXFmMWt3bGhlaHpm',
      'https://lin.ee/jzuOAtF',
      'https://www.tiktok.com/@twentysix.house?_t=ZS-8vm31ijyhPc&_r=1',
    ],
  };
}

export function websiteSchema(): Record<string, unknown> {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: 'Twentysix House',
    inLanguage: 'th-TH',
    publisher: { '@id': ORGANIZATION_ID },
  };
}

export function breadcrumbSchema(items: readonly BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${items[items.length - 1]?.url || SITE_URL}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function itemListSchema(
  name: string,
  url: string,
  items: readonly ItemListEntry[],
): Record<string, unknown> {
  return {
    '@type': 'ItemList',
    '@id': `${url}#item-list`,
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
      ...(item.image ? { image: absoluteSiteUrl(item.image) } : {}),
    })),
  };
}

export function structuredDataGraph(...entities: readonly object[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema(), ...entities],
  };
}

export function staticPageStructuredData(
  canonicalPath: string,
  title: string,
  description: string,
): Record<string, unknown> | undefined {
  const url = absoluteSiteUrl(canonicalPath);
  const page = (type: string): Record<string, unknown> => ({
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: 'th-TH',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
  });
  const breadcrumbs = (name: string) => breadcrumbSchema([
    { name: 'หน้าแรก', url: SITE_URL },
    { name, url },
  ]);

  switch (canonicalPath) {
    case '/':
      return structuredDataGraph(
        websiteSchema(),
        page('WebPage'),
      );
    case '/about':
      return structuredDataGraph(
        websiteSchema(),
        { ...page('AboutPage'), mainEntity: { '@id': ORGANIZATION_ID } },
        breadcrumbs('เกี่ยวกับเรา'),
      );
    case '/services':
      return structuredDataGraph(
        websiteSchema(),
        page('WebPage'),
        {
          '@type': 'Service',
          '@id': `${url}#service`,
          name: 'บริการออกแบบและรับสร้างบ้านครบวงจร',
          description,
          url,
          provider: { '@id': ORGANIZATION_ID },
          areaServed: ['จังหวัดอุดรธานี', 'จังหวัดหนองคาย'],
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'บริการของ Twentysix House',
            itemListElement: [
              'ออกแบบสถาปัตยกรรมและตกแต่งภายใน',
              'วางแผนงบประมาณและขอบเขตงาน',
              'ก่อสร้างและควบคุมคุณภาพ',
              'ตรวจสอบและส่งมอบบ้าน',
            ].map(name => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name },
            })),
          },
        },
        breadcrumbs('บริการของเรา'),
      );
    case '/contact':
      return structuredDataGraph(
        websiteSchema(),
        { ...page('ContactPage'), mainEntity: { '@id': ORGANIZATION_ID } },
        breadcrumbs('ติดต่อเรา'),
      );
    case '/privacy-policy':
      return structuredDataGraph(
        websiteSchema(),
        page('WebPage'),
        breadcrumbs('นโยบายความเป็นส่วนตัว'),
      );
    case '/terms-of-use':
      return structuredDataGraph(
        websiteSchema(),
        page('WebPage'),
        breadcrumbs('ข้อกำหนดการใช้งาน'),
      );
    default:
      return undefined;
  }
}
