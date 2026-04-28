import { Component } from '@angular/core';

@Component({
  selector: 'app-about-philosophy-section',
  templateUrl: './about-philosophy-section.component.html',
  styleUrl: './about-philosophy-section.component.scss'
})
export class AboutPhilosophySectionComponent {
  readonly focusTags = [
    'เข้าใจการใช้ชีวิตของเจ้าของบ้าน',
    'ออกแบบให้สวยและอยู่สบายจริง',
    'คุณภาพงานที่ตรวจสอบได้ทุกช่วง'
  ];

  readonly principles = [
    {
      icon: 'fas fa-comments',
      title: 'เริ่มจากความต้องการ ไม่เริ่มจากแบบสำเร็จ',
      description:
        'เราให้เวลาคุยและสรุปโจทย์อย่างละเอียด เพื่อให้ทุกพื้นที่ในบ้านตอบเป้าหมายการอยู่อาศัยจริงของแต่ละครอบครัว'
    },
    {
      icon: 'fas fa-ruler-combined',
      title: 'ฟังก์ชันและความงามต้องไปด้วยกัน',
      description:
        'งานออกแบบต้องใช้งานได้จริงในทุกวัน ทั้งเรื่องแสง ลม สัดส่วนพื้นที่ และบรรยากาศ โดยยังคงเอกลักษณ์ที่สวยเรียบและร่วมสมัย'
    },
    {
      icon: 'fas fa-clipboard-check',
      title: 'ทำงานเป็นระบบเพื่อคุณภาพระยะยาว',
      description:
        'ตั้งแต่วางแผนงบประมาณ พัฒนาแบบ ไปจนถึงควบคุมงานก่อสร้าง เราดูแลอย่างต่อเนื่องเพื่อให้บ้านพร้อมอยู่และดูแลง่ายในอนาคต'
    }
  ];
}
