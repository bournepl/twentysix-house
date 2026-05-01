import { Component } from '@angular/core';

@Component({
  selector: 'app-about-cta-section',
  templateUrl: './about-cta-section.component.html',
  styleUrl: './about-cta-section.component.scss'
})
export class AboutCtaSectionComponent {
  readonly highlights = [
    'ปรึกษาเบื้องต้นกับทีมงาน',
    'วางกรอบงบประมาณก่อนเริ่มแบบ',
    'ดูแนวทางจากผลงานจริง'
  ];
}
