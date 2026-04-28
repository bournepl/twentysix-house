import { Component } from '@angular/core';

@Component({
  selector: 'app-services-pillars-section',
  templateUrl: './services-pillars-section.component.html',
  styleUrl: './services-pillars-section.component.scss'
})
export class ServicesPillarsSectionComponent {
  readonly serviceTags = [
    'ออกแบบบ้าน',
    'ก่อสร้างครบวงจร',
    'ควบคุมคุณภาพ',
    'ส่งมอบพร้อมดูแล'
  ];

  readonly pillars = [
    {
      icon: 'fas fa-comments',
      title: 'คุยโจทย์และวางทิศทางโครงการ',
      description: 'เริ่มจากความต้องการของครอบครัว งบประมาณ และเงื่อนไขของที่ดิน เพื่อให้แนวทางของบ้านชัดก่อนเริ่มแบบ',
      points: ['สรุปความต้องการ', 'วางกรอบงบประมาณ']
    },
    {
      icon: 'fas fa-ruler-combined',
      title: 'ออกแบบบ้านให้ตอบการใช้งานจริง',
      description: 'พัฒนาแบบบ้านและพื้นที่ใช้สอยให้เหมาะกับการอยู่อาศัยจริง พร้อมลำดับการตัดสินใจที่เข้าใจง่ายขึ้น',
      points: ['พัฒนาแบบบ้าน', 'จัดฟังก์ชันการใช้งาน']
    },
    {
      icon: 'fas fa-hard-hat',
      title: 'ก่อสร้างและควบคุมงานอย่างเป็นระบบ',
      description: 'ดูแลงานก่อสร้างให้เดินไปตามแผน พร้อมติดตามคุณภาพและความคืบหน้าในแต่ละช่วงของโครงการ',
      points: ['ควบคุมคุณภาพ', 'ติดตามความคืบหน้า']
    },
    {
      icon: 'fas fa-house-user',
      title: 'ส่งมอบบ้านพร้อมข้อมูลที่สำคัญต่อการใช้งาน',
      description: 'เมื่อบ้านพร้อมอยู่ ลูกค้าจะได้รับการส่งมอบอย่างเป็นระบบ พร้อมรายละเอียดที่ช่วยให้ดูแลบ้านต่อได้มั่นใจ',
      points: ['ตรวจรับก่อนส่งมอบ', 'ดูแลหลังส่งมอบ']
    }
  ];
}
