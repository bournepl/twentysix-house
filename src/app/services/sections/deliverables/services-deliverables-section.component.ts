import { Component } from '@angular/core';

@Component({
  selector: 'app-services-deliverables-section',
  templateUrl: './services-deliverables-section.component.html',
  styleUrl: './services-deliverables-section.component.scss'
})
export class ServicesDeliverablesSectionComponent {
  readonly assurancePoints = [
    'สิ่งที่ได้รับชัดเจน',
    'ใช้ตัดสินใจได้จริง',
    'ต่อยอดสู่การก่อสร้างได้'
  ];

  readonly deliverables = [
    {
      label: 'PROJECT DIRECTION',
      icon: 'fas fa-lightbulb',
      title: 'ภาพรวมแนวคิดและทิศทางของโครงการ',
      description: 'ช่วยให้เห็นภาพรวมของบ้านและแนวทางที่เหมาะกับการใช้ชีวิตก่อนเริ่มพัฒนาแบบจริง'
    },
    {
      label: 'HOUSE DESIGN',
      icon: 'fas fa-pencil-ruler',
      title: 'แบบบ้านและแปลนการใช้งาน',
      description: 'สรุปแนวทางของพื้นที่ใช้สอยและองค์ประกอบสำคัญของบ้านให้เข้าใจง่ายขึ้น'
    },
    {
      label: 'BUDGET FRAME',
      icon: 'fas fa-wallet',
      title: 'ขอบเขตงานและกรอบงบประมาณ',
      description: 'ช่วยให้วางแผนงบประมาณและลำดับการตัดสินใจได้ชัดก่อนเริ่มงานก่อสร้าง'
    },
    {
      label: 'WORKFLOW PLAN',
      icon: 'fas fa-calendar-alt',
      title: 'แผนการดำเนินงานในแต่ละช่วง',
      description: 'ทำให้เห็นลำดับของงานและช่วงสำคัญของโครงการอย่างเป็นระบบมากขึ้น'
    },
    {
      label: 'PROJECT UPDATE',
      icon: 'fas fa-comments',
      title: 'การอัปเดตความคืบหน้าและการประสานงาน',
      description: 'ช่วยให้เจ้าของบ้านติดตามภาพรวมของโครงการและสื่อสารกับทีมได้ต่อเนื่อง'
    },
    {
      label: 'AFTER HANDOVER',
      icon: 'fas fa-shield-alt',
      title: 'ข้อมูลการรับประกันและการดูแลหลังส่งมอบ',
      description: 'เพิ่มความมั่นใจหลังบ้านพร้อมอยู่ด้วยข้อมูลสำคัญที่ใช้งานต่อได้จริง'
    }
  ];
}
