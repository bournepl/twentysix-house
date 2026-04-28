import { Component } from '@angular/core';

@Component({
  selector: 'app-home-contact-section',
  templateUrl: './home-contact-section.component.html',
  styleUrl: './home-contact-section.component.scss',
})
export class HomeContactSectionComponent {
  readonly contactIntro = {
    kicker: 'Contact',
    title: 'พร้อมเริ่มคุยเรื่องบ้านกับทีมงานที่ดูแลได้ตั้งแต่แนวคิดจนถึงวันส่งมอบ',
    lead:
      'หากคุณกำลังมองหาบริษัทรับสร้างบ้านอุดรธานีที่มีตัวตนจริง พร้อมคุยเรื่องแบบบ้าน งบประมาณ และแนวทางเริ่มต้นโครงการอย่างเป็นระบบ เราพร้อมช่วยให้คุณเห็นภาพได้ชัดขึ้นตั้งแต่ครั้งแรกที่คุยกัน',
  };

  readonly contactActions = [
    {
      label: 'โทรหาเรา',
      href: 'tel:0994708877',
      variant: 'primary',
    },
    {
      label: 'คุยผ่าน Line',
      href: 'https://lin.ee/jzuOAtF',
      variant: 'outline',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  ];

  readonly contactInfo = [
    {
      label: 'โทรศัพท์',
      value: '099-470-8877',
      href: 'tel:0994708877',
    },
    {
      label: 'อีเมล',
      value: 'twentysix.desk@gmail.com',
      href: 'mailto:twentysix.desk@gmail.com',
    },
    {
      label: 'ที่ตั้ง',
      value: '127/2 ถนนโพนพิสัย อำเภอเมือง จังหวัดอุดรธานี 41000',
      href: 'https://maps.app.goo.gl/AgjTg2jRSc3iaYa46',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  ];

  readonly socials = [
    {
      label: 'Facebook',
      icon: 'fab fa-facebook-square',
      href: 'https://www.facebook.com/share/19APWzVgu7/?mibextid=wwXIfr',
    },
    {
      label: 'Instagram',
      icon: 'fab fa-instagram',
      href: 'https://www.instagram.com/26twentysix.house?igsh=YXFmMWt3bGhlaHpm',
    },
    {
      label: 'Line',
      icon: 'fab fa-line',
      href: 'https://lin.ee/jzuOAtF',
    },
    {
      label: 'Tiktok',
      icon: 'fab fa-tiktok',
      href: 'https://www.tiktok.com/@twentysix.house?_t=ZS-8vm31ijyhPc&_r=1',
    },
  ];
}
