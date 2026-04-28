import { Component } from '@angular/core';

@Component({
  selector: 'app-about-hero-section',
  templateUrl: './about-hero-section.component.html',
  styleUrl: './about-hero-section.component.scss'
})
export class AboutHeroSectionComponent {
  readonly breadcrumbs = [
    { label: 'หน้าแรก', path: '/' },
    { label: 'เกี่ยวกับเรา' }
  ];
}
