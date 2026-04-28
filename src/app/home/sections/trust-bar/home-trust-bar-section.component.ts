import { Component } from '@angular/core';

@Component({
  selector: 'app-home-trust-bar-section',
  templateUrl: './home-trust-bar-section.component.html',
  styleUrl: './home-trust-bar-section.component.scss',
})
export class HomeTrustBarSectionComponent {
  readonly trustItems = [
    {
      value: '10+',
      label: 'ปีประสบการณ์',
      description: 'ดูแลงานออกแบบและก่อสร้างบ้านอย่างต่อเนื่อง',
    },
    {
      value: '20+',
      label: 'ผลงานบ้านจริง',
      description: 'มีผลงานในอุดรธานีและพื้นที่ใกล้เคียง',
    },
    {
      value: 'One Stop',
      label: 'ครบวงจร',
      description: 'ตั้งแต่ออกแบบ วางแผนงบ ไปจนถึงส่งมอบ',
    },
    {
      value: 'Free',
      label: 'ปรึกษาเบื้องต้น',
      description: 'เริ่มต้นพูดคุยความต้องการได้โดยไม่มีค่าใช้จ่าย',
    },
  ];
}
