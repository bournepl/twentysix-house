import { Component } from '@angular/core';

@Component({
  selector: 'app-services-pillars-section',
  templateUrl: './services-pillars-section.component.html',
  styleUrl: './services-pillars-section.component.scss'
})
export class ServicesPillarsSectionComponent {
  readonly serviceTags = [
    'ปรึกษาเรื่องบ้าน',
    'ออกแบบบ้านและเขียนแบบ',
    'รับเหมาก่อสร้างบ้าน',
    'ตกแต่งภายใน',
    'บริการหลังการขาย'
  ];

  readonly pillars = [
    {
      image: 'assets/img/Photoroom2.png',
      alt: 'บริการให้คำปรึกษาเรื่องบ้านในจังหวัดอุดรธานี',
      title: 'ปรึกษาเรื่องบ้าน',
      description: 'คุยโจทย์เบื้องต้น งบประมาณ ที่ดิน และแนวทางเริ่มต้นโครงการ'
    },
    {
      image: 'assets/img/Photoroom4.png',
      alt: 'บริการวางแผนงบประมาณและประเมินราคาสร้างบ้าน',
      title: 'วางแผนงบประมาณ',
      description: 'ช่วยประเมินกรอบงบประมาณเบื้องต้น เพื่อให้ตัดสินใจเรื่องแบบและขอบเขตงานง่ายขึ้น'
    },
    {
      image: 'assets/img/Photoroom7.png',
      alt: 'บริการออกแบบบ้านและเขียนแบบบ้านอุดรธานี',
      title: 'ออกแบบบ้านและเขียนแบบ',
      description: 'วางผัง ฟังก์ชัน รูปแบบบ้าน แบบก่อสร้าง และรายละเอียดที่ต้องใช้ต่อ'
    },
    {
      image: 'assets/img/Photoroom3.png',
      alt: 'บริการรับเหมาก่อสร้างบ้านอุดรธานี',
      title: 'รับเหมาก่อสร้างบ้าน',
      description: 'ก่อสร้างบ้านพักอาศัยตามแบบ พร้อมดูแลงานหน้างานและประสานงานเป็นระบบ'
    },
    {
      image: 'assets/img/Photoroom5.png',
      alt: 'บริการตกแต่งภายในและเลือกวัสดุสำหรับบ้าน',
      title: 'ตกแต่งภายใน',
      description: 'วางแนวทางบรรยากาศภายใน เลือกวัสดุ สี เฟอร์นิเจอร์ และรายละเอียดการใช้งาน'
    },
    {
      image: 'assets/img/Photoroom1.png',
      alt: 'บริการหลังการขาย ซ่อมบำรุง ตรวจเช็กโครงสร้าง และรับประกันคุณภาพ',
      title: 'บริการหลังการขาย',
      description: 'ดูแลลูกค้าอย่างต่อเนื่อง ทั้งงานซ่อมบำรุง ตรวจเช็กโครงสร้าง รับประกันคุณภาพ'
    }
  ];
}
