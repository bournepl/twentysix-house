import { Component } from '@angular/core';

@Component({
  selector: 'app-about-trust-section',
  templateUrl: './about-trust-section.component.html',
  styleUrl: './about-trust-section.component.scss'
})
export class AboutTrustSectionComponent {
  readonly reasons = [
    {
      icon: 'fas fa-comments',
      label: 'LISTEN FIRST',
      title: 'รับฟังโจทย์ก่อนเสนอทางเลือก',
      description: 'เราไม่รีบพาไปที่คำตอบเดียว แต่ช่วยค่อย ๆ จัดลำดับความต้องการเพื่อให้เจ้าของบ้านตัดสินใจได้อย่างเหมาะสม'
    },
    {
      icon: 'fas fa-eye',
      label: 'MAKE IT CLEAR',
      title: 'ทำให้เรื่องยากกลายเป็นภาพที่เข้าใจง่าย',
      description: 'ไม่ว่าจะเป็นงบประมาณ ขอบเขตงาน หรือแนวคิดการออกแบบ เราพยายามอธิบายให้เห็นภาพรวมได้ชัดตั้งแต่ต้น'
    },
    {
      icon: 'fas fa-handshake',
      label: 'WORK AS PARTNERS',
      title: 'สื่อสารแบบเป็นพาร์ตเนอร์ ไม่ใช่แค่ผู้รับจ้าง',
      description: 'เป้าหมายของเราคือช่วยให้เจ้าของบ้านรู้สึกว่ามีทีมที่เดินไปด้วยกัน และพร้อมคุยกันได้จริงในทุกช่วงสำคัญ'
    },
    {
      icon: 'fas fa-heart',
      label: 'DESIGN FOR LIVING',
      title: 'มองบ้านในฐานะพื้นที่ชีวิตระยะยาว',
      description: 'เราจึงให้ความสำคัญกับความสบายในการอยู่อาศัย การดูแลง่าย และรายละเอียดเล็ก ๆ ที่ส่งผลกับชีวิตประจำวัน'
    },
    {
      icon: 'fas fa-balance-scale',
      label: 'DECIDE WITH CONFIDENCE',
      title: 'ให้ข้อมูลเพื่อชั่งน้ำหนักได้อย่างมั่นใจ',
      description: 'ไม่ว่าจะเป็นงบประมาณ ขอบเขตงาน หรือแนวทางออกแบบ เราพยายามอธิบายอย่างตรงไปตรงมาเพื่อให้เปรียบเทียบและตัดสินใจได้ง่าย'
    },
    {
      icon: 'fas fa-seedling',
      label: 'GROW STEP BY STEP',
      title: 'ค่อย ๆ พาโปรเจกต์เติบโตไปพร้อมเจ้าของบ้าน',
      description: 'เราให้ความสำคัญกับจังหวะการตัดสินใจของลูกค้า เพื่อให้บ้านค่อย ๆ ชัดขึ้นอย่างเป็นธรรมชาติ ไม่กดดันและไม่เร่งรีบเกินไป'
    }
  ];
}
