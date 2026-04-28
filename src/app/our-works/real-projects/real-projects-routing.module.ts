import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RealProjectsComponent } from './real-projects.component';
import { RealProjectDetailComponent } from './real-project-detail/real-project-detail.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: RealProjectsComponent,
    title: 'ผลงานสร้างบ้านจริงในอุดรธานี | Twentysix House',
    data: {
      sitemap: true,
      canonical: '/ourworks/real-projects',
      meta: [
        {
          name: 'description',
          content:
            'รวมผลงานสร้างบ้านจริงของ Twentysix House ในอุดรธานี ทั้งบ้านพักอาศัย บ้านชั้นเดียว และโครงการที่ออกแบบตามโจทย์ลูกค้า',
        },
        {
          name: 'keywords',
          content:
            'ผลงานสร้างบ้านจริง, ผลงานก่อสร้างบ้านจริง, รับสร้างบ้านอุดรธานี, สร้างบ้านอุดรธานี, Twentysix House',
        },
      ]
    }
  },
  {
    path: ':slug',
    component: RealProjectDetailComponent,
    title: 'ผลงานสร้างบ้านจริง | Twentysix House',
    data: {
      sitemap: false,
      meta: [
        {
          name: 'description',
          content:
            'รายละเอียดผลงานสร้างบ้านจริงจาก Twentysix House พร้อมภาพรวมการออกแบบ ฟังก์ชันใช้งาน และแนวคิดของแต่ละโครงการ',
        },
      ]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RealProjectsRoutingModule { }
