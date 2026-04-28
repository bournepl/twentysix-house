import { Component } from '@angular/core';

@Component({
  selector: 'app-home-hero-section',
  templateUrl: './home-hero-section.component.html',
  styleUrl: './home-hero-section.component.scss',
})
export class HomeHeroSectionComponent {
  readonly keywordPills = [
    'บริษัทรับสร้างบ้านอุดรธานี',
    'ออกแบบบ้านอุดรธานี',
    'สร้างบ้านอุดรธานี',
  ];

  readonly trustPoints = [
    'ออกแบบและก่อสร้างครบวงจร',
    'มีผลงานจริงในอุดรธานีและใกล้เคียง',
    'ปรึกษาเบื้องต้นฟรี',
  ];

  readonly proofItems = [
    {
      value: '10+',
      label: 'ปีประสบการณ์',
      detail: 'ในงานออกแบบและก่อสร้างบ้าน',
    },
    {
      value: '20+',
      label: 'ผลงานจริง',
      detail: 'บ้านที่ดูแลและส่งมอบให้ลูกค้า',
    },
    {
      value: 'ครบวงจร',
      label: 'ตั้งแต่ต้นจนจบ',
      detail: 'ตั้งแต่แนวคิด แบบบ้าน ไปจนถึงส่งมอบ',
    },
  ];
}
