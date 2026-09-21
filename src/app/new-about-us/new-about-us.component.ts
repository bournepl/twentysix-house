import { Component } from '@angular/core';

@Component({
  selector: 'app-new-about-us',
  templateUrl: './new-about-us.component.html',
  styleUrl: './new-about-us.component.scss'
})
export class NewAboutUsComponent {

  readonly highlights = [
    { value: '10+', label: 'ปีประสบการณ์', detail: 'ในงานออกแบบและก่อสร้างบ้านพักอาศัย' },
    { value: '80+', label: 'ผลงานจริง', detail: 'บ้านที่ดูแลและส่งมอบให้ลูกค้า' },
    { value: 'ครบวงจร', label: 'ทีมเดียวดูแล', detail: 'ตั้งแต่แบบ งบประมาณ ก่อสร้าง ถึงส่งมอบ' },
    { value: 'ดูแลต่อเนื่อง', label: 'หลังส่งมอบบ้าน', detail: 'ให้คำปรึกษาและติดตามงานอย่างต่อเนื่อง' },
  ];

  readonly workingSteps = [
    {
      title: 'ฟังโจทย์และไลฟ์สไตล์',
      description: 'เริ่มจากการคุยวิธีใช้ชีวิต จำนวนสมาชิก ฟังก์ชันที่ต้องการ และบรรยากาศบ้านที่ชอบ',
    },
    {
      title: 'วางแผนแบบและงบประมาณ',
      description: 'ช่วยจัดลำดับโจทย์ แบบบ้าน ขอบเขตงาน และกรอบงบประมาณก่อนเริ่มก่อสร้างจริง',
    },
    {
      title: 'ดูแลงานก่อสร้างอย่างเป็นระบบ',
      description: 'ประสานงาน ควบคุมรายละเอียด อัปเดตความคืบหน้า และตรวจงานก่อนส่งมอบ',
    },
  ];

  readonly values = [
    {
      title: 'ออกแบบจากการใช้งานจริง',
      description: 'บ้านต้องสวยและตอบโจทย์ชีวิตประจำวัน ไม่ใช่เพียงภาพที่ดูดีในวันแรก',
    },
    {
      title: 'สื่อสารชัดเจน',
      description: 'เจ้าของบ้านควรเข้าใจสิ่งที่กำลังเกิดขึ้น ทั้งแบบ งบประมาณ และขั้นตอนหน้างาน',
    },
    {
      title: 'คุณภาพที่ดูแลได้ระยะยาว',
      description: 'เราให้ความสำคัญกับโครงสร้าง วัสดุ รายละเอียด และบริการหลังส่งมอบ',
    },
  ];

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
