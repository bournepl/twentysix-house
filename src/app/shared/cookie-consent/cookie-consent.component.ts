import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AnalyticsConsentService } from '../analytics-consent.service';

@Component({
  standalone: false,
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrl: './cookie-consent.component.scss',
})
export class CookieConsentComponent implements OnInit, OnDestroy {
  isOpen = false;

  private subscription?: Subscription;

  constructor(private readonly consent: AnalyticsConsentService) {}

  ngOnInit(): void {
    this.subscription = this.consent.preferencesOpen$.subscribe(isOpen => {
      this.isOpen = isOpen;
    });
    this.consent.initialize();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  acceptAnalytics(): void {
    this.consent.grantAnalytics();
  }

  rejectAnalytics(): void {
    this.consent.denyAnalytics();
  }
}
