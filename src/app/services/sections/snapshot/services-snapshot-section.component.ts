import { Component } from '@angular/core';

@Component({
  selector: 'app-services-snapshot-section',
  templateUrl: './services-snapshot-section.component.html',
  styleUrl: './services-snapshot-section.component.scss'
})
export class ServicesSnapshotSectionComponent {
  snapshots = [
    {
      icon: 'fas fa-comments',
      title: 'เริ่มจากการคุยโจทย์',
      description: 'สรุปความต้องการ งบประมาณ และทิศทางของบ้านให้ชัดก่อนเริ่มงาน'
    },
    {
      icon: 'fas fa-ruler-combined',
      title: 'ออกแบบและวางแผน',
      description: 'พัฒนาแบบบ้านและลำดับการตัดสินใจให้สอดคล้องกับการใช้งานจริง'
    },
    {
      icon: 'fas fa-hard-hat',
      title: 'ก่อสร้างอย่างเป็นระบบ',
      description: 'ดูแลงานหน้างานและควบคุมคุณภาพให้โครงการเดินไปอย่างต่อเนื่อง'
    },
    {
      icon: 'fas fa-key',
      title: 'ส่งมอบพร้อมดูแลต่อ',
      description: 'บ้านพร้อมอยู่ พร้อมข้อมูลสำคัญและการดูแลหลังส่งมอบที่ชัดเจน'
    }
  ];
}
