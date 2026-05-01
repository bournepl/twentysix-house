import { Component } from '@angular/core';

@Component({
  selector: 'app-home-process-section',
  templateUrl: './home-process-section.component.html',
  styleUrl: './home-process-section.component.scss',
})
export class HomeProcessSectionComponent {
  readonly steps = [
    {
      number: '01',
      icon: 'far fa-comments',
      kicker: 'Brief',
      title: 'พูดคุยความต้องการ งบประมาณ และเป้าหมายของบ้าน',
    },
    {
      number: '02',
      icon: 'fas fa-map-marked-alt',
      kicker: 'Survey',
      title: 'สำรวจพื้นที่จริงและดูข้อจำกัดของหน้างาน',
    },
    {
      number: '03',
      icon: 'fas fa-drafting-compass',
      kicker: 'Design',
      title: 'พัฒนาแบบและจัดฟังก์ชันบ้านให้เหมาะกับการใช้งาน',
    },
    {
      number: '04',
      icon: 'far fa-file-alt',
      kicker: 'Budget',
      title: 'สรุปแบบ รายละเอียดงาน และกรอบงบประมาณ',
    },
    {
      number: '05',
      icon: 'fas fa-hard-hat',
      kicker: 'Build',
      title: 'ก่อสร้างและควบคุมงานตามแผนที่วางไว้',
    },
    {
      number: '06',
      icon: 'fas fa-clipboard-check',
      kicker: 'Handover',
      title: 'ตรวจรับ ส่งมอบ และดูแลหลังบ้านสร้างเสร็จ',
    },
  ];
}
