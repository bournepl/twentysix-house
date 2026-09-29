import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AnalyticsConsent = 'granted' | 'denied';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsConsentService {
  private readonly storageKey = 'twentysix_analytics_consent';
  private readonly preferencesOpenSubject = new BehaviorSubject(false);

  readonly preferencesOpen$ = this.preferencesOpenSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  initialize(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.preferencesOpenSubject.next(this.readConsent() === null);
  }

  grantAnalytics(): void {
    this.saveConsent('granted');
  }

  denyAnalytics(): void {
    this.saveConsent('denied');
  }

  openPreferences(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.preferencesOpenSubject.next(true);
    }
  }

  private saveConsent(consent: AnalyticsConsent): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      window.localStorage.setItem(this.storageKey, consent);
    } catch (error) {
      // Consent still applies to the current page when storage is unavailable.
    }

    window.gtag?.('consent', 'update', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: consent,
      functionality_storage: 'granted',
      security_storage: 'granted',
    });
    window.dataLayer?.push({
      event: 'twentysix_consent_update',
      analytics_consent: consent,
    });
    this.preferencesOpenSubject.next(false);
  }

  private readConsent(): AnalyticsConsent | null {
    try {
      const value = window.localStorage.getItem(this.storageKey);
      return value === 'granted' || value === 'denied' ? value : null;
    } catch (error) {
      return null;
    }
  }
}
