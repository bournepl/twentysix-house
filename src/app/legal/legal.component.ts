import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

type LegalPageType = 'privacy' | 'terms';

@Component({
  standalone: false,
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styleUrl: './legal.component.scss',
})
export class LegalComponent {
  readonly pageType: LegalPageType;
  readonly lastUpdated = '29 กันยายน 2569';

  constructor(route: ActivatedRoute) {
    this.pageType = route.snapshot.data['legalPage'] as LegalPageType;
  }
}
