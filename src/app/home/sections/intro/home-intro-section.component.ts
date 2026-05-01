import { Component } from '@angular/core';

@Component({
  selector: 'app-home-intro-section',
  templateUrl: './home-intro-section.component.html',
  styleUrl: './home-intro-section.component.scss',
})
export class HomeIntroSectionComponent {
  readonly highlights = [
    {
      title: 'ฟังโจทย์และงบประมาณก่อนเริ่มออกแบบ',
    },
    {
      title: 'วางฟังก์ชันให้เหมาะกับการใช้ชีวิตจริง',
    },
    {
      title: 'ดูแลงานด้วยมาตรฐานจนถึงวันที่ส่งมอบ',
    },
  ];
}
