import { Component } from '@angular/core';

@Component({
  selector: 'app-services-cta-section',
  templateUrl: './services-cta-section.component.html',
  styleUrl: './services-cta-section.component.scss'
})
export class ServicesCtaSectionComponent {
  readonly ctaPoints = [
    'คุยโจทย์ของบ้านและงบประมาณเบื้องต้น',
    'เช็กแนวทางที่เหมาะกับที่ดินและการใช้งานจริง',
    'เริ่มต้นพูดคุยกับทีมได้โดยตรง'
  ];
}
