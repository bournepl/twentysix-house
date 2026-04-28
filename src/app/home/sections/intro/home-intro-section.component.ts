import { Component } from '@angular/core';

@Component({
  selector: 'app-home-intro-section',
  templateUrl: './home-intro-section.component.html',
  styleUrl: './home-intro-section.component.scss',
})
export class HomeIntroSectionComponent {
  readonly highlights = [
    {
      title: 'เริ่มจากการฟังความต้องการ',
      description: 'เราให้ความสำคัญกับวิถีชีวิต งบประมาณ และเป้าหมายของเจ้าของบ้านก่อนเริ่มคิดเรื่องแบบเสมอ',
    },
    {
      title: 'ออกแบบให้ใช้ชีวิตได้จริง',
      description: 'ทุกพื้นที่ถูกคิดจากการใช้งานระยะยาว ไม่ใช่แค่ภาพรวมที่ดูสวยในวันแรกที่เห็น',
    },
    {
      title: 'ดูแลงานด้วยมาตรฐานที่ชัดเจน',
      description: 'เราใส่ใจทั้งรายละเอียดของแบบ โครงสร้าง และคุณภาพหน้างาน เพื่อให้บ้านออกมาสมบูรณ์มากที่สุด',
    },
  ];
}
