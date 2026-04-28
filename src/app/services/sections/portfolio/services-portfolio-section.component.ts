import { Component } from '@angular/core';

@Component({
  selector: 'app-services-portfolio-section',
  templateUrl: './services-portfolio-section.component.html',
  styleUrl: './services-portfolio-section.component.scss'
})
export class ServicesPortfolioSectionComponent {
  readonly projects = [
    {
      image: 'assets/img/Collection/collection5.webp',
      title: 'บ้านพักอาศัยสไตล์โมเดิร์นที่เริ่มจากโจทย์การอยู่อาศัยจริง',
      copy: 'สะท้อนการทำงานตั้งแต่การวางแนวคิด การพัฒนาแบบ และการดูแลรายละเอียดของพื้นที่ใช้งาน'
    },
    {
      image: 'assets/img/Collection/collection14.webp',
      title: 'บ้านที่ออกแบบเฉพาะจากรูปแบบการใช้ชีวิตของเจ้าของบ้าน',
      copy: 'แสดงให้เห็นการเชื่อมกันของงานออกแบบ ฟังก์ชัน และภาพรวมของโครงการในมุมของผู้อยู่อาศัย'
    },
    {
      image: 'assets/img/Collection/collection18.webp',
      title: 'ผลงานที่สะท้อนมาตรฐานงานก่อสร้างและการส่งมอบอย่างเป็นระบบ',
      copy: 'ทำให้เห็นว่าบริการของเราไม่ได้จบแค่แบบบ้าน แต่รวมถึงความพร้อมของบ้านก่อนเริ่มใช้งานจริง'
    }
  ];
}
