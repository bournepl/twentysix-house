import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HouseDesignDetailComponent } from './house-design-detail/house-design-detail.component';
import { HouseDesignsComponent } from './house-designs.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HouseDesignsComponent,
    title: 'แบบบ้านและแนวคิดออกแบบบ้าน | Twentysix House อุดรธานี',
    data: {
      sitemap: true,
      canonical: '/ourworks/house-designs',
      meta: [
        {
          name: 'description',
          content:
            'รวมแบบบ้านและแนวคิดออกแบบบ้านของ Twentysix House อุดรธานี เพื่อช่วยให้เห็นทิศทางเรื่องรูปทรง สัดส่วน วัสดุ แสง และบรรยากาศของบ้านก่อนเริ่มคุยโครงการจริง',
        },
        {
          name: 'keywords',
          content:
            'แบบบ้าน, แบบบ้านอุดรธานี, ผลงานออกแบบบ้าน, แนวคิดออกแบบบ้าน, แบบบ้านโมเดิร์น, แบบบ้านนอร์ดิก, รับสร้างบ้านอุดรธานี, Twentysix House',
        },
        {
          name: 'robots',
          content: 'index, follow',
        },
        {
          property: 'og:title',
          content: 'แบบบ้านและแนวคิดออกแบบบ้าน | Twentysix House อุดรธานี',
        },
        {
          property: 'og:description',
          content:
            'ดูแบบบ้านของ Twentysix House อุดรธานี เพื่อหาแนวทางเรื่องรูปทรง สัดส่วน วัสดุ แสง และบรรยากาศของบ้านก่อนเริ่มพัฒนาเป็นโครงการจริง',
        },
        {
          property: 'og:image',
          content:
            'https://firebasestorage.googleapis.com/v0/b/tewntysix-house.appspot.com/o/head.webp?alt=media&token=b53fc010-7a3c-49e3-8039-1cfed666e1ec',
        },
      ],
    },
  },
  {
    path: ':slug',
    component: HouseDesignDetailComponent,
    title: 'รายละเอียดแบบบ้าน | Twentysix House',
    data: {
      sitemap: false,
      meta: [
        {
          name: 'description',
          content: 'รายละเอียดแบบบ้าน แนวคิดการออกแบบ และบรรยากาศของบ้านจาก Twentysix House',
        },
        {
          name: 'robots',
          content: 'index, follow',
        },
        {
          property: 'og:title',
          content: 'รายละเอียดแบบบ้าน | Twentysix House',
        },
        {
          property: 'og:description',
          content: 'ดูแนวคิดของแบบบ้านและใช้เป็นจุดเริ่มต้นในการคุยโครงการกับทีม Twentysix House',
        },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HouseDesignsRoutingModule {}
