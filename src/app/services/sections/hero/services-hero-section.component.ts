import { Component } from '@angular/core';

@Component({
  selector: 'app-services-hero-section',
  templateUrl: './services-hero-section.component.html',
  styleUrl: './services-hero-section.component.scss'
})
export class ServicesHeroSectionComponent {
  readonly breadcrumbs = [
    { label: 'หน้าหลัก', path: '/' },
    { label: 'บริการของเรา' }
  ];

  readonly trustPoints = [
    'ปรึกษา ออกแบบ และวางแผนงบประมาณ',
    'รับเหมาก่อสร้างบ้านพักอาศัยในอุดรธานี',
    'ตรวจงาน ส่งมอบ และดูแลหลังบ้านเสร็จ'
  ];
}
