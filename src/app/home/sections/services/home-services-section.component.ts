import { Component } from '@angular/core';

@Component({
  selector: 'app-home-services-section',
  templateUrl: './home-services-section.component.html',
  styleUrl: './home-services-section.component.scss',
})
export class HomeServicesSectionComponent {
  readonly services = [
    {
      image: 'assets/img/Photoroom7.png',
      alt: 'บริการออกแบบบ้านอุดรธานี',
      eyebrow: 'ออกแบบบ้านอุดรธานี',
      title: 'ออกแบบบ้านให้ตรงกับการใช้ชีวิตจริง',
      description:
        'วางผัง ฟังก์ชัน และบรรยากาศของบ้านจากวิธีใช้ชีวิตของเจ้าของบ้าน ไม่ยึดแค่ภาพสวยอย่างเดียว',
    },
    {
      image: 'assets/img/Photoroom8.png',
      alt: 'บริการวางแผนสร้างบ้านอุดรธานี',
      eyebrow: 'วางแผนโครงการ',
      title: 'สำรวจพื้นที่และช่วยวางกรอบการตัดสินใจ',
      description:
        'ดูข้อจำกัดของพื้นที่และงบประมาณตั้งแต่ต้น เพื่อให้การเริ่มโครงการชัดเจนและคุยรายละเอียดได้ง่ายขึ้น',
    },
    {
      image: 'assets/img/Photoroom5.png',
      alt: 'บริการรับสร้างบ้านอุดรธานี',
      eyebrow: 'สร้างบ้านอุดรธานี',
      title: 'ก่อสร้างและควบคุมงานอย่างเป็นระบบ',
      description:
        'ติดตามคุณภาพและบริหารความคืบหน้าในแต่ละช่วง เพื่อให้งานก่อสร้างเดินไปอย่างมั่นคง',
    },
    {
      image: 'assets/img/Photoroom1.png',
      alt: 'บริการดูแลหลังส่งมอบบ้าน',
      eyebrow: 'ดูแลต่อเนื่อง',
      title: 'ตรวจรับ ส่งมอบ และดูแลหลังบ้านเสร็จ',
      description:
        'ยังให้คำแนะนำและช่วยดูแลต่อหลังส่งมอบ เพื่อให้เจ้าของบ้านมั่นใจในการอยู่อาศัยจริง',
    },
  ];

  readonly serviceKeywords = [
    'ออกแบบบ้านอุดรธานี',
    'สร้างบ้านอุดรธานี',
    'ผู้รับเหมาสร้างบ้านอุดรธานี',
  ];
}
