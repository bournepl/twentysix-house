import { Component } from '@angular/core';

@Component({
  selector: 'app-about-facts-section',
  templateUrl: './about-facts-section.component.html',
  styleUrl: './about-facts-section.component.scss'
})
export class AboutFactsSectionComponent {
  readonly quickPoints = [
    'จดทะเบียนในนามบริษัทอย่างถูกต้อง',
    'มีทีมงานที่ติดต่อและนัดหมายได้จริง',
    'ดูแลงานในอุดรธานีและพื้นที่ใกล้เคียง'
  ];

  readonly facts = [
    {
      label: 'ชื่อบริษัท',
      value: 'บริษัท ทเวนตี้ซิกซ์ ดีเวลล็อปเมนท์ จำกัด',
      description: 'ชื่อบริษัทที่ใช้ในการติดต่อ ประสานงาน และดำเนินงานอย่างเป็นทางการ'
    },
    {
      label: 'พื้นที่ให้บริการ',
      value: 'จังหวัดอุดรธานี และพื้นที่ใกล้เคียง',
      description: 'รองรับงานออกแบบและก่อสร้างบ้านในพื้นที่หลักของบริษัทและโซนใกล้เคียง'
    },
    {
      label: 'เบอร์โทร',
      value: '099-470-8877',
      description: 'ช่องทางติดต่อโดยตรงสำหรับพูดคุยรายละเอียด นัดหมาย และขอคำปรึกษาเบื้องต้น'
    },
    {
      label: 'ที่ตั้งบริษัท',
      value: '127/2 ถนนโพนพิสัย อำเภอเมือง จังหวัดอุดรธานี 41000',
      description: 'ที่ตั้งสำหรับติดต่อบริษัท นัดหมาย หรือเข้ามาพูดคุยกับทีมงานได้โดยตรง'
    }
  ];
}
