import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnDestroy, ViewChild } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-site-menu',
  templateUrl: './site-menu.component.html',
  styleUrl: './site-menu.component.scss'
})
export class SiteMenuComponent implements OnDestroy {
  @ViewChild('menuButton', { read: ElementRef }) menuButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('menuPanel', { read: ElementRef }) menuPanel?: ElementRef<HTMLElement>;

  isOpen = false;
  private previouslyFocusedElement: HTMLElement | null = null;

  readonly menuItems = [
    { label: 'หน้าแรก', url: '/' },
    { label: 'เกี่ยวกับเรา', url: '/about' },
    { label: 'บริการของเรา', url: '/services' },
    { label: 'แบบบ้านของเรา', url: '/house-catalog' },
    { label: 'ผลงานของเรา', url: '/ourworks' },
    { label: 'บทความ', url: '/blogs' },
    { label: 'ติดต่อเรา', url: '/contact' },
  ];

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    this.previouslyFocusedElement = this.document.activeElement as HTMLElement | null;
    this.isOpen = true;
    this.document.body.classList.add('site-menu-open');

    queueMicrotask(() => this.getFocusableElements()[1]?.focus());
  }

  close(restoreFocus = true): void {
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;
    this.document.body.classList.remove('site-menu-open');

    if (restoreFocus) {
      const focusTarget = this.previouslyFocusedElement || this.menuButton?.nativeElement;
      queueMicrotask(() => focusTarget?.focus());
    }

    this.previouslyFocusedElement = null;
  }

  @HostListener('document:keydown', ['$event'])
  handleDocumentKeydown(event: KeyboardEvent): void {
    if (!this.isOpen) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusable = this.getFocusableElements();
    if (!focusable.length) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = this.document.activeElement;

    if (event.shiftKey && (active === first || !focusable.includes(active as HTMLElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !focusable.includes(active as HTMLElement))) {
      event.preventDefault();
      first.focus();
    }
  }

  ngOnDestroy(): void {
    this.document.body.classList.remove('site-menu-open');
  }

  private getFocusableElements(): HTMLElement[] {
    const menuButton = this.menuButton?.nativeElement;
    const panelElements = Array.from(
      this.menuPanel?.nativeElement.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') || []
    );

    return [menuButton, ...panelElements].filter((element): element is HTMLElement => Boolean(element));
  }
}
