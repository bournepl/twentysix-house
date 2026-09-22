import { ElementRef } from '@angular/core';
import { fakeAsync, flushMicrotasks } from '@angular/core/testing';

import { SiteMenuComponent } from './site-menu.component';

describe('SiteMenuComponent accessibility', () => {
  let component: SiteMenuComponent;
  let menuButton: HTMLButtonElement;
  let panel: HTMLElement;

  beforeEach(() => {
    component = new SiteMenuComponent(document);
    menuButton = document.createElement('button');
    panel = document.createElement('aside');
    panel.innerHTML = '<a href="/">หน้าแรก</a><a href="/contact">ติดต่อเรา</a>';
    document.body.append(menuButton, panel);
    component.menuButton = new ElementRef(menuButton);
    component.menuPanel = new ElementRef(panel);
  });

  afterEach(() => {
    component.ngOnDestroy();
    menuButton.remove();
    panel.remove();
  });

  it('locks page scrolling, moves focus into the menu, and restores it on close', fakeAsync(() => {
    menuButton.focus();
    component.open();
    flushMicrotasks();

    expect(component.isOpen).toBeTrue();
    expect(document.body.classList.contains('site-menu-open')).toBeTrue();
    expect(document.activeElement).toBe(panel.querySelector('a'));

    component.close();
    flushMicrotasks();

    expect(component.isOpen).toBeFalse();
    expect(document.body.classList.contains('site-menu-open')).toBeFalse();
    expect(document.activeElement).toBe(menuButton);
  }));

  it('traps tab focus and closes on Escape', fakeAsync(() => {
    component.open();
    flushMicrotasks();
    const links = panel.querySelectorAll<HTMLAnchorElement>('a');
    links[1].focus();

    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    component.handleDocumentKeydown(tabEvent);
    expect(tabEvent.defaultPrevented).toBeTrue();
    expect(document.activeElement).toBe(menuButton);

    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
    component.handleDocumentKeydown(escapeEvent);
    flushMicrotasks();
    expect(component.isOpen).toBeFalse();
  }));
});
