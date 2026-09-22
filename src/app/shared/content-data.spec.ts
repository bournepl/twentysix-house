import {
  ALL_HOUSE_CATALOG_ITEMS,
  HOUSE_CATALOG_COLLECTIONS,
  findHouseCatalogItem,
} from '../house-catalog/house-catalog.data';
import { COMPLETED_HOMES } from '../new-ourworks/completed-homes.data';
import { DESIGN_PROJECTS } from '../new-ourworks/design-projects.data';

describe('content data integrity', () => {
  const expectUniqueSlugs = (items: readonly { slug: string }[]): void => {
    expect(new Set(items.map(item => item.slug)).size).toBe(items.length);
  };

  it('keeps every detail-page slug unique', () => {
    expectUniqueSlugs(ALL_HOUSE_CATALOG_ITEMS);
    expectUniqueSlugs(COMPLETED_HOMES);
    expectUniqueSlugs(DESIGN_PROJECTS);
  });

  it('finds every house catalog item by its route slug', () => {
    ALL_HOUSE_CATALOG_ITEMS.forEach(item => {
      expect(findHouseCatalogItem(item.slug)).toBe(item);
    });
    expect(findHouseCatalogItem('does-not-exist')).toBeUndefined();
  });

  it('keeps collection membership and routes consistent', () => {
    HOUSE_CATALOG_COLLECTIONS.forEach(collection => {
      expect(collection.route.startsWith('/house-catalog')).toBeTrue();
      expect(collection.items.length).toBeGreaterThan(0);
      collection.items.forEach(item => expect(item.collection).toBe(collection.name));
    });
  });

  it('uses local WebP assets for cards, heroes, and galleries', () => {
    const paths = [
      ...ALL_HOUSE_CATALOG_ITEMS.flatMap(item => [item.coverImage, item.cardImage, ...item.gallery]),
      ...COMPLETED_HOMES.flatMap(item => [item.image, item.heroImage, ...item.gallery]),
      ...DESIGN_PROJECTS.flatMap(item => [item.image, item.heroImage, ...item.gallery]),
    ];

    paths.forEach(path => {
      expect(path).toMatch(/^assets\/img\/.+\.webp$/);
    });
  });
});
