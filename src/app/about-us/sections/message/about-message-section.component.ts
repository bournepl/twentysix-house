import { Component } from '@angular/core';

@Component({
  selector: 'app-about-message-section',
  templateUrl: './about-message-section.component.html',
  styleUrl: './about-message-section.component.scss'
})
export class AboutMessageSectionComponent {
  readonly founder = {
    portrait: 'assets/img/user-profile.jpg'
  };

  readonly messagePoints = [
    {
      title: 'ฟังโจทย์ก่อนเริ่มออกแบบ',
      description: 'ทำความเข้าใจรูปแบบการใช้ชีวิต งบประมาณ และความต้องการจริงของเจ้าของบ้านก่อนวางแนวทาง'
    },
    {
      title: 'สื่อสารให้เห็นภาพตรงกัน',
      description: 'อธิบายแบบบ้าน ขอบเขตงาน และงบประมาณให้ชัด เพื่อให้เจ้าของบ้านรู้ว่ากำลังตัดสินใจเรื่องอะไร'
    },
    {
      title: 'ดูแลงานให้ใช้งานได้จริง',
      description: 'มองทั้งความสวยงาม ฟังก์ชัน และคุณภาพงานก่อสร้าง เพื่อให้บ้านอยู่สบายและดูแลต่อได้ในระยะยาว'
    }
  ];
}
