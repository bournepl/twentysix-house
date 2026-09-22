import { routes } from './app-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { LegalComponent } from './legal/legal.component';

describe('application routes', () => {
  it('keeps legacy URLs redirected to their canonical pages', () => {
    expect(routes.find(route => route.path === 'home')?.redirectTo).toBe('');
    expect(routes.find(route => route.path === 'aboutus')?.redirectTo).toBe('about');
    expect(routes.find(route => route.path === 'contactus')?.redirectTo).toBe('contact');
    expect(routes.find(route => route.path === 'collections')?.redirectTo).toBe('ourworks');
  });

  it('serves real privacy and terms pages with canonical metadata', () => {
    const privacy = routes.find(route => route.path === 'privacy-policy');
    const terms = routes.find(route => route.path === 'terms-of-use');

    expect(privacy?.component).toBe(LegalComponent);
    expect(privacy?.data?.['canonical']).toBe('/privacy-policy');
    expect(terms?.component).toBe(LegalComponent);
    expect(terms?.data?.['canonical']).toBe('/terms-of-use');
  });

  it('keeps unknown URLs out of the sitemap and search index', () => {
    const wildcard = routes.find(route => route.path === '**');
    const meta = wildcard?.data?.['meta'] as Array<{ name?: string; content: string }>;

    expect(wildcard?.component).toBe(NotFoundComponent);
    expect(wildcard?.data?.['sitemap']).toBeFalse();
    expect(meta.find(item => item.name === 'robots')?.content).toBe('noindex, follow');
  });
});
