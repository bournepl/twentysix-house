import { Component } from '@angular/core';

@Component({
  selector: 'app-about-portfolio-section',
  templateUrl: './about-portfolio-section.component.html',
  styleUrl: './about-portfolio-section.component.scss'
})
export class AboutPortfolioSectionComponent {
  readonly highlightTags = [
    'บ้านพักอาศัย',
    'ออกแบบและก่อสร้าง',
    'ผลงานจริงในอุดรธานี'
  ];

  readonly items = [
    {
      image: 'assets/img/photo1.jpg',
      title: 'บ้านพักอาศัยสไตล์โมเดิร์น',
      copy: 'งานออกแบบและก่อสร้างที่สะท้อนความเรียบง่าย ใช้งานจริง และดูแลรายละเอียดในทุกมุมของการอยู่อาศัย'
    },
    {
      image: 'assets/img/photo14.jpg',
      title: 'บ้านที่ออกแบบจากจังหวะการใช้ชีวิต',
      copy: 'แนวคิดของงานถูกพัฒนาจากการใช้พื้นที่จริง เพื่อให้ความสวยงามและฟังก์ชันเดินไปพร้อมกัน'
    },
    {
      image: 'assets/img/457442700.png',
      title: 'ผลงานที่สะท้อนมาตรฐานของทีม',
      copy: 'บ้านทุกหลังถูกถ่ายทอดผ่านกระบวนการที่เป็นระบบ ตั้งแต่แนวคิดแบบไปจนถึงการส่งมอบ'
    }
  ];
}
