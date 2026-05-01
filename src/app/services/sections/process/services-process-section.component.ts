import { Component } from '@angular/core';

@Component({
  selector: 'app-services-process-section',
  templateUrl: './services-process-section.component.html',
  styleUrl: './services-process-section.component.scss'
})
export class ServicesProcessSectionComponent {
  readonly steps = [
    {
      title: 'คุยโจทย์และงบประมาณ',
      description: 'สรุปความต้องการ รูปแบบบ้าน งบประมาณ และข้อมูลที่ดินให้ทิศทางของโครงการชัดตั้งแต่ต้น'
    },
    {
      title: 'สำรวจข้อมูลที่ดิน',
      description: 'ดูเงื่อนไขพื้นที่ ขนาดที่ดิน ทิศทางแดดลม และข้อจำกัดที่มีผลต่อการออกแบบบ้าน'
    },
    {
      title: 'ออกแบบและสรุปแบบก่อสร้าง',
      description: 'พัฒนาแบบบ้าน ฟังก์ชัน พื้นที่ใช้สอย และรายละเอียดที่ต้องใช้สำหรับเริ่มงานก่อสร้าง'
    },
    {
      title: 'วางแผนงานและเริ่มก่อสร้าง',
      description: 'จัดลำดับงานหน้างาน ประสานทีม และดูแลงานก่อสร้างให้เดินตามแผนอย่างเป็นระบบ'
    },
    {
      title: 'ตรวจรับ ส่งมอบ และดูแลต่อ',
      description: 'ตรวจเช็กความเรียบร้อย ส่งมอบบ้าน และให้ข้อมูลสำคัญสำหรับการดูแลหลังเข้าอยู่'
    }
  ];
}
