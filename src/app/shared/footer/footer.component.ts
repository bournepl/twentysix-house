import { Component, OnInit } from '@angular/core';

import { AnalyticsConsentService } from '../analytics-consent.service';

@Component({
  standalone: false,
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    readonly currentYear = new Date().getFullYear();

    constructor(private readonly consent: AnalyticsConsentService) { }

    ngOnInit() {}

    openCookieSettings(): void {
      this.consent.openPreferences();
    }
}
