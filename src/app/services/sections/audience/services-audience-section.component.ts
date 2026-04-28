import { Component } from '@angular/core';

@Component({
  selector: 'app-services-audience-section',
  templateUrl: './services-audience-section.component.html',
  styleUrl: './services-audience-section.component.scss'
})
export class ServicesAudienceSectionComponent {
  readonly audienceTags = [
    'เจ้าของบ้านสร้างใหม่',
    'ออกแบบเฉพาะหลัง',
    'เห็นงบและขั้นตอนชัด',
    'มีทีมดูแลต่อเนื่อง'
  ];

  readonly audiences = [
    {
      icon: 'fas fa-user-friends',
      title: 'อยากมีทีมช่วยดูแลภาพรวมของโครงการ',
      description: 'ไม่ต้องคุมงานเองทุกจุด แต่ยังอยากเห็นความคืบหน้าและการตัดสินใจสำคัญอย่างชัดเจน'
    },
    {
      icon: 'fas fa-home',
      title: 'อยากได้บ้านที่ออกแบบจากการใช้ชีวิตจริง',
      description: 'ต้องการบ้านที่คิดจากโจทย์ของครอบครัว ไม่ใช่แค่เลือกแบบที่ดูสวยเพียงอย่างเดียว'
    },
    {
      icon: 'fas fa-wallet',
      title: 'อยากเห็นงบประมาณและลำดับงานชัดขึ้น',
      description: 'ต้องการเข้าใจภาพรวมของโครงการก่อนเริ่มงานจริง เพื่อวางแผนงบและการตัดสินใจได้ง่ายขึ้น'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'มองหาบริษัทที่ตรวจสอบได้และติดต่อได้จริง',
      description: 'มีผลงานให้ดู มีทีมประสานงานชัด และมีระบบการทำงานที่ช่วยให้มั่นใจมากขึ้นตลอดโครงการ'
    }
  ];
}
