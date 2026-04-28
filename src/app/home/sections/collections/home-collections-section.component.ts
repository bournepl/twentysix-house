import { Component } from '@angular/core';

@Component({
  selector: 'app-home-collections-section',
  templateUrl: './home-collections-section.component.html',
  styleUrl: './home-collections-section.component.scss',
})
export class HomeCollectionsSectionComponent {
  readonly collections: Array<{
    sequence: string;
    name: string;
    title: string;
    description: string;
    coverImage: string;
    coverAlt: string;
    coverCaption: string;
    previews: Array<{
      image: string;
      alt: string;
      label: string;
      title: string;
    }>;
  }> = [
    {
      sequence: 'Design 01',
      name: 'Pure House Design',
      title: 'ผลงานออกแบบที่โดดเด่นด้วยเส้นสายแนวยาวอันเรียบง่าย สงบนิ่ง และมีจังหวะของความสงบที่ยังมีชีวิต',
      description:
        'Pure House Design คือจุดเริ่มต้นของบทสนทนาเรื่องบ้านที่เรียบง่ายอย่างมีระดับ สงบนิ่ง แต่ยังมีเสน่ห์พอให้รู้สึกอยากกลับมาใช้ชีวิตในทุกวัน',
      coverImage: 'assets/img/Collection/collection6.webp',
      coverAlt: 'ภาพปกของ Pure House Design โดย Twentysix House',
      coverCaption: 'สงบ เรียบง่าย แต่เปี่ยมด้วยเสน่ห์',
      previews: [
        {
          image: 'assets/img/Collection/collection16.webp',
          alt: 'ภาพตัวอย่าง Yu Sook จาก Pure House Design',
          label: 'Yu Sook',
          title: 'สงบ เรียบ และอบอุ่นอย่างมีระดับ',
        },
        {
          image: 'assets/img/Collection/collection13.webp',
          alt: 'ภาพตัวอย่าง Yu Sabai จาก Pure House Design',
          label: 'Yu Sabai',
          title: 'ชัดเจน เท่ และอยู่สบายในทุกวัน',
        },
        {
          image: 'assets/img/Collection/collection6.webp',
          alt: 'ภาพตัวอย่าง Yu Plearn จาก Pure House Design',
          label: 'Yu Plearn',
          title: 'โปร่ง โล่ง และเชื่อมธรรมชาติ',
        },
        {
          image: 'assets/img/Collection/collection20.webp',
          alt: 'ภาพตัวอย่าง Yu Yen จาก Pure House Design',
          label: 'Yu Yen',
          title: 'พอดี เรียบง่าย และร่วมสมัย',
        },
      ],
    },
  ];
}
