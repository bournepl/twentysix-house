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
      title: 'บ้านทุกหลังคือพื้นที่สำคัญของครอบครัว',
      description: 'เราจึงดูแลงานออกแบบและก่อสร้างด้วยความใส่ใจทั้งคุณภาพ รายละเอียด และการอยู่อาศัยจริง'
    },
    {
      title: 'การสื่อสารที่ชัดเจนช่วยให้ตัดสินใจง่ายขึ้น',
      description: 'ทั้งแบบบ้าน งบประมาณ และขอบเขตงานจะถูกอธิบายอย่างตรงไปตรงมา เพื่อให้เจ้าของบ้านเห็นภาพรวมได้ชัด'
    },
    {
      title: 'คุณภาพงานต้องรองรับการอยู่อาศัยในระยะยาว',
      description: 'ทุกโปรเจกต์จึงถูกมองทั้งเรื่องความสวยงาม การใช้งานจริง และมาตรฐานงานก่อสร้างที่ตรวจสอบได้'
    }
  ];
}
