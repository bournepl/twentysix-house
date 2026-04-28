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
      icon: 'fas fa-ruler-combined',
      label: 'QUALITY STANDARD',
      title: 'มาตรฐานงานก่อสร้างและการตรวจคุณภาพ',
      description: 'ทุกช่วงของงานก่อสร้างถูกดูแลอย่างเป็นระบบ เพื่อให้คุณภาพของงานหน้างานสอดคล้องกับแบบและแนวทางที่ตกลงร่วมกันไว้'
    },
    {
      icon: 'fas fa-clipboard-check',
      label: 'BEFORE HANDOVER',
      title: 'การตรวจเช็กก่อนส่งมอบและความพร้อมของบ้าน',
      description: 'ก่อนบ้านพร้อมอยู่จะมีการตรวจเช็กความเรียบร้อยของงานในจุดสำคัญ เพื่อให้การส่งมอบเป็นขั้นตอนที่มั่นใจได้มากขึ้น'
    },
    {
      icon: 'fas fa-shield-alt',
      label: 'AFTER CARE',
      title: 'ข้อมูลรับประกันและการดูแลหลังส่งมอบ',
      description: 'เจ้าของบ้านจะได้รับข้อมูลสำคัญเกี่ยวกับการรับประกันและแนวทางการดูแลต่อ เพื่อให้การอยู่อาศัยหลังส่งมอบต่อเนื่องอย่างมั่นใจ'
    }
  ];
}
