import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HouseDesignDetailComponent } from './house-design-detail/house-design-detail.component';
import { HouseDesignsComponent } from './house-designs.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HouseDesignsComponent,
    title: 'แบบบ้านพร้อมแนวคิดการออกแบบ | Twentysix House',
    data: {
      sitemap: true,
      canonical: '/ourworks/house-designs',
      meta: [
        {
          name: 'description',
          content:
            'รวมแบบบ้านและแนวคิดการออกแบบจาก Twentysix House สำหรับเจ้าของบ้านที่หาไอเดียฟังก์ชัน พื้นที่ใช้สอย และสไตล์บ้าน',
        },
        {
          name: 'keywords',
          content:
            'แบบบ้าน, แบบบ้านพร้อมสร้าง, ผลงานออกแบบบ้าน, ออกแบบบ้านอุดรธานี, แบบบ้านโมเดิร์น, แบบบ้านนอร์ดิก, รับสร้างบ้านอุดรธานี, Twentysix House',
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
          content: 'รายละเอียดแบบบ้านพร้อมแนวคิดการออกแบบ ฟังก์ชันใช้งาน และภาพรวมของแต่ละแบบจาก Twentysix House',
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
