import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  /* =========================
      HOME
   ========================= */
  {
    path: '',
    title: 'รับสร้างบ้านอุดรธานี | บริษัทรับสร้างบ้านอุดรธานี Twentysix House',
    data: {
      sitemap: true,
      canonical: '/',
      meta: [
        {
          name: 'description',
          content:
            'Twentysix House บริษัทรับสร้างบ้านอุดรธานี ให้บริการออกแบบและก่อสร้างบ้านครบวงจร ดูแลงานตั้งแต่วางแนวคิด ออกแบบ วางแผนงบประมาณ ไปจนถึงก่อสร้างและส่งมอบบ้าน'
        },
        {
          name: 'keywords',
          content:
            'รับสร้างบ้านอุดรธานี, บริษัทรับสร้างบ้านอุดรธานี, ออกแบบบ้านอุดรธานี, สร้างบ้านอุดรธานี, ผู้รับเหมาสร้างบ้านอุดรธานี, Twentysix House'
        },
        {
          name: 'robots',
          content: 'index, follow'
        },
        {
          property: 'og:title',
          content: 'รับสร้างบ้านอุดรธานี | บริษัทรับสร้างบ้านอุดรธานี Twentysix House'
        },
        {
          property: 'og:description',
          content:
            'บริษัทรับสร้างบ้านอุดรธานี รับออกแบบและก่อสร้างบ้านครบวงจร พร้อมผลงานจริง ขั้นตอนการทำงานชัดเจน และช่องทางปรึกษาทีมงานได้โดยตรง'
        },
        {
          property: 'og:image',
          content:
            'https://firebasestorage.googleapis.com/v0/b/tewntysix-house.appspot.com/o/head.webp?alt=media&token=b53fc010-7a3c-49e3-8039-1cfed666e1ec'
        }
      ]
    },
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomeModule)
  },

  {
    path: 'รับสร้างบ้าน-อุดรธานี',
    redirectTo: '',
    pathMatch: 'full',
  },

  /* =========================
     ABOUT
  ========================= */
  {
    path: 'about',
    title: 'เกี่ยวกับเรา | บริษัทรับสร้างบ้านอุดรธานี Twentysix House',
    data: {
      sitemap: true,
      canonical: '/about',
      meta: [
        {
          name: 'description',
          content:
            'เกี่ยวกับ Twentysix House บริษัทรับสร้างบ้านอุดรธานี ดูแลงานออกแบบและก่อสร้างบ้านอย่างเป็นระบบ พร้อมแนวคิดการทำงาน ข้อมูลบริษัท และมาตรฐานของทีม'
        },
        {
          name: 'keywords',
          content:
            'เกี่ยวกับเรา Twentysix House, บริษัทรับสร้างบ้านอุดรธานี, ออกแบบและก่อสร้างบ้านอุดรธานี, ข้อมูลบริษัทรับสร้างบ้าน, ทีมรับสร้างบ้านอุดรธานี'
        },
        {
          name: 'robots',
          content: 'index, follow'
        },
        {
          property: 'og:title',
          content: 'เกี่ยวกับเรา | บริษัทรับสร้างบ้านอุดรธานี Twentysix House'
        },
        {
          property: 'og:description',
          content:
            'รู้จัก Twentysix House บริษัทรับสร้างบ้านอุดรธานี ผ่านแนวคิดการทำงาน วิธีดูแลลูกค้า ข้อมูลบริษัท และผลงานที่สะท้อนมาตรฐานการออกแบบและก่อสร้างบ้าน'
        },
        {
          property: 'og:image',
          content: 'https://firebasestorage.googleapis.com/v0/b/tewntysix-house.appspot.com/o/head.webp?alt=media&token=b53fc010-7a3c-49e3-8039-1cfed666e1ec'
        }
      ]
    },
    loadChildren: () =>
      import('./about-us/about-us.module').then((m) => m.AboutUsModule)
  },

  /* =========================
     SERVICES
  ========================= */
  {
    path: 'services',
    title: 'บริการออกแบบและสร้างบ้านครบวงจร | บริษัทรับสร้างบ้านอุดรธานี Twentysix House',
    data: {
      sitemap: true,
      canonical: '/services',
      meta: [
        {
          name: 'description',
          content:
            'รวมบริการออกแบบและสร้างบ้านครบวงจรของ Twentysix House ในอุดรธานี ตั้งแต่การคุยโจทย์ ออกแบบบ้าน วางแผนงบประมาณ ก่อสร้าง ควบคุมคุณภาพ ไปจนถึงการส่งมอบบ้าน'
        },
        {
          name: 'keywords',
          content:
            'บริการรับสร้างบ้านอุดรธานี, ออกแบบและสร้างบ้านครบวงจร, ออกแบบบ้านอุดรธานี, ก่อสร้างบ้านอุดรธานี, บริษัทรับสร้างบ้านอุดรธานี, Twentysix House'
        },
        {
          name: 'robots',
          content: 'index, follow'
        },
        {
          property: 'og:title',
          content: 'บริการออกแบบและสร้างบ้านครบวงจร | บริษัทรับสร้างบ้านอุดรธานี Twentysix House'
        },
        {
          property: 'og:description',
          content:
            'Twentysix House ดูแลงานตั้งแต่การให้คำปรึกษา ออกแบบ วางแผนงบประมาณ ก่อสร้าง ควบคุมคุณภาพ และส่งมอบบ้าน เพื่อให้เจ้าของบ้านเห็นภาพรวมของโครงการชัดขึ้นในทุกขั้นตอน'
        },
        {
          property: 'og:image',
          content: 'https://firebasestorage.googleapis.com/v0/b/tewntysix-house.appspot.com/o/head.webp?alt=media&token=b53fc010-7a3c-49e3-8039-1cfed666e1ec'
        }
      ]
    },
    loadChildren: () =>
      import('./services/services.module').then((m) => m.ServicesModule)
  },

  /* =========================
     PROJECT / COLLECTIONS
  ========================= */
  {
    path: 'collections',
    redirectTo: 'ourworks',
    pathMatch: 'full'
  },
  {
    path: 'ourworks',
    title: 'ผลงานรับสร้างบ้านอุดรธานี | บ้านจริงและแบบบ้าน Twentysix House',
    data: {
      sitemap: true,
      canonical: '/ourworks',
      meta: [
        {
          name: 'description',
          content:
            'รวมผลงานรับสร้างบ้านอุดรธานี ทั้งบ้านที่สร้างจริงและแบบบ้านของ Twentysix House เพื่อช่วยให้เห็นคุณภาพงาน แนวคิดการออกแบบ และตัวอย่างก่อนเริ่มคุยโครงการ'
        },
        {
          name: 'keywords',
          content:
            'ผลงานรับสร้างบ้าน, ผลงานบ้านจริง, ผลงานออกแบบบ้าน, แบบบ้านอุดรธานี, รับสร้างบ้านอุดรธานี, Twentysix House'
        },
        {
          name: 'robots',
          content: 'index, follow'
        },
        {
          property: 'og:title',
          content: 'ผลงานรับสร้างบ้านอุดรธานี | บ้านจริงและแบบบ้าน Twentysix House'
        },
        {
          property: 'og:description',
          content:
            'เลือกดูผลงานบ้านจริงและแบบบ้านของ Twentysix House อุดรธานี เพื่อเห็นคุณภาพงาน แนวคิดการออกแบบ และตัวอย่างบ้านที่นำไปคุยต่อได้'
        },
        {
          property: 'og:image',
          content: 'https://firebasestorage.googleapis.com/v0/b/tewntysix-house.appspot.com/o/head.webp?alt=media&token=b53fc010-7a3c-49e3-8039-1cfed666e1ec'
        }
      ]
    },
    loadChildren: () =>
      import('./our-works/our-works.module').then(
        (m) => m.OurWorksModule
      )
  },

  /* =========================
     BLOGS
  ========================= */
  {
    path: 'blogs',
    title: 'บทความสร้างบ้านและออกแบบบ้าน | รับสร้างบ้านอุดรธานี Twentysix House',
    data: {
      sitemap: true,
      canonical: '/blogs',
      meta: [
        {
          name: 'description',
          content:
            'รวมบทความสร้างบ้าน ออกแบบบ้าน งานโครงสร้าง และคำแนะนำสำหรับเจ้าของบ้านในอุดรธานี จากทีมรับออกแบบและก่อสร้างบ้าน Twentysix House'
        },
        {
          name: 'keywords',
          content:
            'บทความสร้างบ้าน, ความรู้สร้างบ้าน, ออกแบบบ้านอุดรธานี, รับสร้างบ้านอุดรธานี, งานโครงสร้างบ้าน, Twentysix House'
        },
        {
          name: 'robots',
          content: 'index, follow'
        },
        {
          property: 'og:title',
          content: 'บทความสร้างบ้านและออกแบบบ้าน | Twentysix House'
        },
        {
          property: 'og:description',
          content:
            'รวมความรู้เรื่องสร้างบ้าน ออกแบบบ้าน วัสดุ และงานโครงสร้าง จากบริษัทรับสร้างบ้านอุดรธานี Twentysix House'
        },
        {
          property: 'og:image',
          content: 'https://firebasestorage.googleapis.com/v0/b/tewntysix-house.appspot.com/o/head.webp?alt=media&token=b53fc010-7a3c-49e3-8039-1cfed666e1ec'
        }
      ]
    },
    loadChildren: () =>
      import('./blog/blog.module').then((m) => m.BlogModule)
  },

  /* =========================
     CONTACT
  ========================= */
  {
    path: 'contact',
    title: 'ติดต่อบริษัทรับสร้างบ้านในอุดรธานี | Twentysix.House',
    data: {
      sitemap: true,
      canonical: '/contact',
      meta: [
        {
          name: 'description',
          content:
            'ติดต่อ Twentysix House บริษัทรับสร้างบ้านอุดรธานี โทร 099-470-8877 ปรึกษาออกแบบบ้าน วางงบประมาณ และนัดคุยโครงการกับทีมงานในพื้นที่'
        },
        {
          name: 'keywords',
          content:
            'ติดต่อรับสร้างบ้านอุดรธานี, ปรึกษาสร้างบ้านอุดรธานี, บริษัทรับสร้างบ้านอุดรธานี, ออกแบบบ้านอุดรธานี, Twentysix House'
        },
        {
          name: 'robots',
          content: 'index, follow'
        },
        {
          property: 'og:title',
          content: 'ติดต่อบริษัทรับสร้างบ้านอุดรธานี | Twentysix House'
        },
        {
          property: 'og:description',
          content:
            'โทร 099-470-8877 หรือคุยผ่าน Line เพื่อปรึกษาออกแบบบ้าน รับสร้างบ้าน และวางงบประมาณกับทีม Twentysix House จังหวัดอุดรธานี'
        },
        {
          property: 'og:image',
          content: 'https://firebasestorage.googleapis.com/v0/b/tewntysix-house.appspot.com/o/head.webp?alt=media&token=b53fc010-7a3c-49e3-8039-1cfed666e1ec'
        }
      ]
    },
    loadChildren: () =>
      import('./contact-us/contact-us.module').then(
        (m) => m.ContactUsModule
      )
  },

  /* =========================
     404
  ========================= */
  {
    path: '**',
    title: 'ไม่พบหน้า | Twentysix.House',
    loadChildren: () =>
      import('./not-found/not-found.module').then(
        (m) => m.NotFoundModule
      )
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export { routes };
