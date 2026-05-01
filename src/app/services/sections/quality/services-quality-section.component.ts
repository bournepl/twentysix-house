import { Component } from '@angular/core';

@Component({
  selector: 'app-services-quality-section',
  templateUrl: './services-quality-section.component.html',
  styleUrl: './services-quality-section.component.scss'
})
export class ServicesQualitySectionComponent {
  readonly trustPoints = [
    'มาตรฐานงานชัดเจน',
    'ตรวจเช็กก่อนส่งมอบ',
    'มีการดูแลต่อหลังเข้าอยู่'
  ];

  readonly qualityPoints = [
    {
      icon: 'fas fa-clipboard-check',
      title: 'ตรวจคุณภาพงานตามจุดสำคัญ',
      description: 'ดูความเรียบร้อยของงานก่อสร้างให้สอดคล้องกับแบบและขอบเขตงานที่ตกลงร่วมกัน'
    },
    {
      icon: 'fas fa-home',
      title: 'เช็กความพร้อมก่อนเข้าอยู่',
      description: 'ตรวจความเรียบร้อยก่อนส่งมอบ เพื่อให้บ้านพร้อมใช้งานจริงและลดปัญหาหลังย้ายเข้า'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'สรุปการรับประกันและการดูแลต่อ',
      description: 'ให้ข้อมูลสำคัญหลังส่งมอบ เพื่อให้เจ้าของบ้านรู้ว่าควรดูแลบ้านและติดต่อทีมงานอย่างไร'
    }
  ];
}
