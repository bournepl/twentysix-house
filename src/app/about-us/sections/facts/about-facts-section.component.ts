import { Component } from '@angular/core';

@Component({
  selector: 'app-about-facts-section',
  templateUrl: './about-facts-section.component.html',
  styleUrl: './about-facts-section.component.scss'
})
export class AboutFactsSectionComponent {
  readonly quickPoints = [
    'จดทะเบียนในนามบริษัท',
    'ติดต่อและนัดหมายได้จริง',
    'ดูแลงานในอุดรธานีและพื้นที่ใกล้เคียง'
  ];

  readonly facts = [
    {
      icon: 'business_badge',
      label: 'ชื่อบริษัท',
      value: 'บริษัท ทเวนตี้ซิกซ์ ดีเวลล็อปเมนท์ จำกัด',
      description: 'ใช้สำหรับติดต่อ ประสานงาน และดำเนินงานอย่างเป็นทางการ'
    },
    {
      icon: 'location_pin',
      label: 'พื้นที่ให้บริการ',
      value: 'จังหวัดอุดรธานี และพื้นที่ใกล้เคียง',
      description: 'รองรับงานออกแบบและก่อสร้างบ้านในพื้นที่หลักของบริษัท'
    },
    {
      icon: 'tech_mobile',
      label: 'เบอร์โทร',
      value: '099-470-8877',
      description: 'ติดต่อทีมงานเพื่อคุยโจทย์ นัดหมาย หรือขอคำปรึกษาเบื้องต้น'
    },
    {
      icon: 'location_map-big',
      label: 'ที่ตั้งบริษัท',
      value: '127/2 ถนนโพนพิสัย อำเภอเมือง จังหวัดอุดรธานี 41000',
      description: 'ที่ตั้งสำหรับนัดหมายหรือเข้ามาพูดคุยกับทีมงานได้โดยตรง'
    }
  ];
}
