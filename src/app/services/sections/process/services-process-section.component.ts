import { Component } from '@angular/core';

@Component({
  selector: 'app-services-process-section',
  templateUrl: './services-process-section.component.html',
  styleUrl: './services-process-section.component.scss'
})
export class ServicesProcessSectionComponent {
  readonly processHighlights = [
    'ลำดับงานชัดเจน',
    'ตัดสินใจเป็นช่วง',
    'อัปเดตต่อเนื่อง'
  ];

  readonly steps = [
    {
      icon: 'fas fa-comments',
      title: 'เริ่มจากการคุยโจทย์ของบ้าน',
      description: 'สรุปความต้องการ รูปแบบบ้าน งบประมาณ และข้อมูลที่ดินให้ทิศทางของโครงการชัดตั้งแต่ต้น'
    },
    {
      icon: 'fas fa-pencil-ruler',
      title: 'พัฒนาแบบและสรุปแนวทางร่วมกัน',
      description: 'พัฒนาแบบบ้านและการจัดพื้นที่ใช้งาน พร้อมสรุปแนวทางที่เหมาะกับการอยู่อาศัยจริง'
    },
    {
      icon: 'fas fa-calendar-check',
      title: 'วางแผนก่อนเริ่มงานก่อสร้าง',
      description: 'จัดลำดับงาน ช่วงตัดสินใจ และกรอบการดำเนินงานให้การเริ่มก่อสร้างเป็นระบบมากขึ้น'
    },
    {
      icon: 'fas fa-hard-hat',
      title: 'ดูแลงานก่อสร้างและติดตามความคืบหน้า',
      description: 'ควบคุมคุณภาพของงานหน้างาน พร้อมอัปเดตความคืบหน้าให้เจ้าของบ้านเห็นภาพรวมได้ต่อเนื่อง'
    },
    {
      icon: 'fas fa-key',
      title: 'ตรวจรับ ส่งมอบ และดูแลต่อหลังเข้าอยู่',
      description: 'ส่งมอบบ้านอย่างเป็นระบบ พร้อมข้อมูลสำคัญที่ช่วยให้การอยู่อาศัยมั่นใจมากขึ้น'
    }
  ];
}
