import {
  SITE_URL,
  absoluteSiteUrl,
  breadcrumbSchema,
  itemListSchema,
  organizationSchema,
  staticPageStructuredData,
} from './structured-data';

describe('structured data helpers', () => {
  it('publishes an absolute, deployable organization logo URL', () => {
    const organization = organizationSchema();
    const logo = organization['logo'] as Record<string, string>;

    expect(logo['url']).toBe(`${SITE_URL}/assets/img/seo/brand-mark-640.webp`);
    expect(logo['contentUrl']).toBe(logo['url']);
  });

  it('normalizes local paths to the production origin', () => {
    expect(absoluteSiteUrl('/ourworks/completed/khun-aod-residence'))
      .toBe(`${SITE_URL}/ourworks/completed/khun-aod-residence`);
  });

  it('keeps breadcrumb positions and item-list image URLs valid', () => {
    const breadcrumb = breadcrumbSchema([
      { name: 'หน้าแรก', url: SITE_URL },
      { name: 'ผลงาน', url: `${SITE_URL}/ourworks` },
    ]);
    const items = itemListSchema('ผลงาน', `${SITE_URL}/ourworks`, [{
      name: 'บ้านคุณอ๊อด',
      url: `${SITE_URL}/ourworks/completed/khun-aod-residence`,
      image: 'assets/img/ourworks/completed/khun-aod-residence/card.webp',
    }]);

    const breadcrumbEntries = breadcrumb['itemListElement'] as Array<Record<string, unknown>>;
    const itemEntries = items['itemListElement'] as Array<Record<string, unknown>>;

    expect(breadcrumbEntries.map(item => item['position'])).toEqual([1, 2]);
    expect(itemEntries[0]['image']).toBe(
      `${SITE_URL}/assets/img/ourworks/completed/khun-aod-residence/card.webp`,
    );
  });

  it('provides page schema for both legal routes', () => {
    expect(staticPageStructuredData('/privacy-policy', 'Privacy', 'Privacy policy')).toBeDefined();
    expect(staticPageStructuredData('/terms-of-use', 'Terms', 'Terms of use')).toBeDefined();
  });
});
