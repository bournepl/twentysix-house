import { Component } from '@angular/core';

@Component({
  selector: 'app-home-contact-section',
  templateUrl: './home-contact-section.component.html',
  styleUrl: './home-contact-section.component.scss',
})
export class HomeContactSectionComponent {
  readonly contactIntro = {
    kicker: 'NEXT STEP',
    title: 'เริ่มคุยเรื่องบ้านของคุณกับทีม Twentysix House',
    lead:
      'ส่งโจทย์เบื้องต้น งบประมาณ ที่ดิน หรือแบบบ้านที่ชอบมาให้เราช่วยดูแนวทางก่อนได้',
  };

  readonly contactActions = [
    {
      label: 'คุยผ่าน LINE',
      href: 'https://lin.ee/jzuOAtF',
      variant: 'primary',
      target: '_blank',
      rel: 'noopener noreferrer',
      icon: 'fab fa-line',
    },
    {
      label: 'โทร 099-470-8877',
      href: 'tel:0994708877',
      variant: 'secondary',
      icon: 'fas fa-phone-alt',
    },
    {
      label: 'ดูช่องทางติดต่อ',
      href: '/contact',
      variant: 'outline',
      icon: 'fas fa-map-marker-alt',
      isRouterLink: true,
    },
  ];

  readonly quickStarts = [
    'ขนาดที่ดินหรือทำเลที่ต้องการสร้าง',
    'งบประมาณเบื้องต้นที่วางไว้',
    'รูปบ้านหรือแบบบ้านที่ชอบ',
  ];
}
