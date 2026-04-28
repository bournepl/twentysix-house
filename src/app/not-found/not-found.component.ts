import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) { }

  ngOnInit(): void {
    this.title.setTitle('404 - ไม่พบหน้าเว็บ | Twentysix.House');
    this.meta.updateTag({ name: 'description', content: 'ขออภัย ไม่พบหน้าที่คุณร้องขอ' });
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
  }
}
