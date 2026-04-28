import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RealProjectsComponent } from './real-projects.component';
import { RealProjectDetailComponent } from './real-project-detail/real-project-detail.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: RealProjectsComponent,
    title: 'ผลงานบ้านจริงอุดรธานี | ตัวอย่างบ้านที่สร้างโดย Twentysix House',
    data: {
      sitemap: true,
      canonical: '/ourworks/real-projects',
      meta: [
        {
          name: 'description',
          content:
            'รวมผลงานบ้านที่สร้างจริงโดย Twentysix House อุดรธานี เพื่อให้เห็นคุณภาพงานก่อสร้าง รายละเอียดของบ้าน และบรรยากาศการอยู่อาศัยจากโครงการจริง'
        },
        {
          name: 'keywords',
          content:
            'ผลงานจริง, ผลงานบ้านจริง, ตัวอย่างบ้านจริง, รับสร้างบ้านอุดรธานี, ผลงานก่อสร้างบ้าน, Twentysix House'
        },
        {
          name: 'robots',
          content: 'index, follow'
        },
        {
          property: 'og:title',
          content: 'ผลงานบ้านจริงอุดรธานี | ตัวอย่างบ้านที่สร้างโดย Twentysix House'
        },
        {
          property: 'og:description',
          content:
            'ดูตัวอย่างบ้านที่สร้างจริงโดย Twentysix House อุดรธานี เพื่อเห็นคุณภาพงานก่อสร้าง รายละเอียดของบ้าน และแนวทางการอยู่อาศัยจากโครงการจริง'
        },
        {
          property: 'og:image',
          content: 'https://firebasestorage.googleapis.com/v0/b/tewntysix-house.appspot.com/o/head.webp?alt=media&token=b53fc010-7a3c-49e3-8039-1cfed666e1ec'
        }
      ]
    }
  },
  {
    path: ':slug',
    component: RealProjectDetailComponent,
    title: 'รายละเอียดผลงานจริง | Twentysix House',
    data: {
      sitemap: false,
      meta: [
        {
          name: 'description',
          content:
            'รายละเอียดผลงานบ้านที่สร้างจริงโดย Twentysix House พร้อมภาพรวมโครงการ แนวคิดการออกแบบ และข้อมูลสำหรับใช้คุยต่อกับทีมงาน'
        },
        {
          name: 'robots',
          content: 'index, follow'
        },
        {
          property: 'og:title',
          content: 'รายละเอียดผลงานจริง | Twentysix House'
        },
        {
          property: 'og:description',
          content:
            'ดูรายละเอียดผลงานบ้านที่สร้างจริงโดย Twentysix House พร้อมข้อมูลโครงการและแนวคิดการออกแบบ'
        },
        {
          property: 'og:image',
          content: 'https://firebasestorage.googleapis.com/v0/b/tewntysix-house.appspot.com/o/head.webp?alt=media&token=b53fc010-7a3c-49e3-8039-1cfed666e1ec'
        }
      ]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RealProjectsRoutingModule { }
