import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-site-menu',
  templateUrl: './site-menu.component.html',
  styleUrl: './site-menu.component.scss'
})
export class SiteMenuComponent {
  isOpen = false;

  readonly menuItems = [
    { label: 'หน้าแรก', url: '/' },
    { label: 'เกี่ยวกับเรา', url: '/about' },
    { label: 'บริการของเรา', url: '/services' },
    { label: 'แบบบ้านของเรา', url: '/house-catalog' },
    { label: 'ผลงานของเรา', url: '/ourworks' },
    { label: 'บทความ', url: '/blogs' },
    { label: 'ติดต่อเรา', url: '/contact' },
  ];

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  close(): void {
    this.isOpen = false;
  }

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    this.close();
  }
}
