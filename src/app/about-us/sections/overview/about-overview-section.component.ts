import { Component } from '@angular/core';

@Component({
  selector: 'app-about-overview-section',
  templateUrl: './about-overview-section.component.html',
  styleUrl: './about-overview-section.component.scss'
})
export class AboutOverviewSectionComponent {
  readonly highlights = [
    'รับฟังโจทย์ก่อนเริ่มออกแบบ',
    'วางแผนงบประมาณและขอบเขตงานให้ชัด',
    'ดูแลงานก่อสร้างจนถึงวันส่งมอบ'
  ];

  readonly directions = [
    {
      label: 'VISION',
      title: 'วิสัยทัศน์ของเรา',
      description:
        'เป็นบริษัทรับสร้างบ้านในอุดรธานีที่เจ้าของบ้านไว้วางใจ ตั้งแต่การออกแบบ วางแผนงบประมาณ ไปจนถึงส่งมอบบ้านที่อยู่สบายและดูแลได้ในระยะยาว'
    },
    {
      label: 'MISSION',
      title: 'สิ่งที่เราตั้งใจทำ',
      description:
        'รับฟังโจทย์ของเจ้าของบ้าน วางแผนงานอย่างเป็นระบบ สื่อสารตรงไปตรงมา และดูแลคุณภาพงานก่อสร้างให้ตอบโจทย์การใช้ชีวิตจริง'
    }
  ];

  readonly stats = [
    { value: '10+', label: 'ปีประสบการณ์งานออกแบบและก่อสร้าง' },
    { value: '80+', label: 'ผลงานบ้านจริงที่ดูแลและส่งมอบในพื้นที่' },
    { value: '100%', label: 'โครงการที่ดูแลโดยทีมงานอย่างเป็นระบบ' }
  ];
}
