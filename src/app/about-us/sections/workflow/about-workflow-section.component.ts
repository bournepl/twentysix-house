import { Component } from '@angular/core';

@Component({
  selector: 'app-about-workflow-section',
  templateUrl: './about-workflow-section.component.html',
  styleUrl: './about-workflow-section.component.scss'
})
export class AboutWorkflowSectionComponent {
  readonly collaborationTags = [
    'ทีมออกแบบ',
    'ทีมหน้างาน',
    'ผู้ดูแลโครงการ'
  ];

  readonly steps = [
    {
      label: 'DISCOVERY',
      title: 'เริ่มจากการฟังความต้องการ',
      description: 'เราให้ความสำคัญกับรูปแบบการใช้ชีวิต งบประมาณ และเป้าหมายของเจ้าของบ้านก่อนเริ่มคิดเรื่องแบบเสมอ'
    },
    {
      label: 'PLANNING',
      title: 'พัฒนาแบบและวางแผนอย่างชัดเจน',
      description: 'การออกแบบ รายละเอียดวัสดุ และทิศทางโครงการถูกวางให้สอดคล้องกัน เพื่อให้ทุกฝ่ายเห็นภาพเดียวกัน'
    },
    {
      label: 'DELIVERY',
      title: 'ติดตามและดูแลงานต่อเนื่องจนส่งมอบ',
      description: 'ทีมงานดูแลตั้งแต่ช่วงเตรียมงาน หน้างานจริง ไปจนถึงการส่งมอบ เพื่อให้โครงการเดินหน้าอย่างมั่นใจ'
    }
  ];
}
