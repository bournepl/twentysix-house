import { Component } from '@angular/core';

@Component({
  selector: 'app-new-contact',
  templateUrl: './new-contact.component.html',
  styleUrl: './new-contact.component.scss'
})
export class NewContactComponent {
  readonly mapUrl = 'https://maps.app.goo.gl/AgjTg2jRSc3iaYa46?g_st=com.google.maps.preview.copy';

  readonly socialLinks = [
    {
      label: 'Facebook',
      shortLabel: 'FB',
      url: 'https://www.facebook.com/share/19APWzVgu7/?mibextid=wwXIfr',
    },
    {
      label: 'Instagram',
      shortLabel: 'IG',
      url: 'https://www.instagram.com/26twentysix.house?igsh=YXFmMWt3bGhlaHpm',
    },
    {
      label: 'LINE',
      shortLabel: 'LINE',
      url: 'https://lin.ee/jzuOAtF',
    },
    {
      label: 'TikTok',
      shortLabel: 'TT',
      url: 'https://www.tiktok.com/@twentysix.house?_t=ZS-8vm31ijyhPc&_r=1',
    },
  ];

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
