import { Component } from '@angular/core';

@Component({
  selector: 'app-services-cta-section',
  templateUrl: './services-cta-section.component.html',
  styleUrl: './services-cta-section.component.scss'
})
export class ServicesCtaSectionComponent {
  readonly ctaPoints = [
    'คุยโจทย์และงบประมาณเบื้องต้น',
    'เลือกบริการที่เหมาะกับโครงการ',
    'ดูแนวทางจากผลงานจริง'
  ];
}
