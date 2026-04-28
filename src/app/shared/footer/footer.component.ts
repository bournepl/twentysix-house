import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  readonly year = new Date().getFullYear();

  readonly quickLinks = [
    { label: 'หน้าแรก', path: '/' },
    { label: 'เกี่ยวกับเรา', path: '/about' },
    { label: 'บริการของเรา', path: '/services' },
    { label: 'ผลงานของเรา', path: '/ourworks' },
    { label: 'บทความ', path: '/blogs' },
    { label: 'ติดต่อเรา', path: '/contact' },
  ];
}
