import { Component } from '@angular/core';

@Component({
  selector: 'app-about-cta-section',
  templateUrl: './about-cta-section.component.html',
  styleUrl: './about-cta-section.component.scss'
})
export class AboutCtaSectionComponent {
  readonly highlights = [
    'พูดคุยกับทีมงานได้โดยตรง',
    'อธิบายขั้นตอนและขอบเขตงานชัดเจน',
    'ช่วยวางแนวทางบ้านให้เหมาะกับการใช้ชีวิตจริง'
  ];
}
