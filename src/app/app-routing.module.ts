import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  /* =========================
      HOME
   ========================= */
  {
    path: '',
    title: 'Twentysix.House | บริษัทรับสร้างบ้านในจังหวัดอุดรธานี',
    data: {
      sitemap: true,
      meta: [
        {
          name: 'description',
          content:
            'Twentysix.House บริษัทรับสร้างบ้านในจังหวัดอุดรธานี รับออกแบบและก่อสร้างบ้านครบวงจร ประสบการณ์กว่า 10 ปี มีผลงานสร้างบ้านจริงมากกว่า 20 หลัง'
        },
        {
          property: 'og:title',
          content: 'Twentysix.House | บริษัทรับสร้างบ้านในจังหวัดอุดรธานี'
        },
        {
          property: 'og:description',
          content:
            'บริษัทรับสร้างบ้านอุดรธานี รับออกแบบและก่อสร้างบ้านครบวงจร โดยทีมงานมืออาชีพ ประสบการณ์มากกว่า 10 ปี'
        },
        {
          property: 'og:url',
          content: 'https://twentysix.house/'
        },
        {
          property: 'og:image',
          content: 'https://twentysix.house/assets/img/head.png'
        }
      ]
    },
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomeModule)
  },

  {
    path: 'รับสร้างบ้าน-อุดรธานี',
    title: 'รับสร้างบ้านอุดรธานี | บริษัทรับสร้างบ้าน Twentysix.House',
    data: {
      sitemap: true,
      meta: [
        {
          name: 'description',
          content:
            'รับสร้างบ้านอุดรธานี โดยบริษัท Twentysix.House รับออกแบบและก่อสร้างบ้านครบวงจร ประสบการณ์กว่า 10 ปี มีผลงานสร้างบ้านจริงในจังหวัดอุดรธานีและพื้นที่ใกล้เคียง'
        },
        {
          property: 'og:title',
          content: 'รับสร้างบ้านอุดรธานี | Twentysix.House'
        },
        {
          property: 'og:description',
          content:
            'บริการรับสร้างบ้านในจังหวัดอุดรธานี ออกแบบพร้อมก่อสร้าง ดูแลทุกขั้นตอนโดยทีมงานมืออาชีพจาก Twentysix.House'
        },
        {
          property: 'og:url',
          content: 'https://twentysix.house/รับสร้างบ้าน-อุดรธานี'
        },
        {
          property: 'og:image',
          content: 'https://twentysix.house/assets/img/head.png'
        }
      ]
    },
    loadChildren: () =>
      import('./landing-udon/landing-udon.module')
        .then(m => m.LandingUdonModule)
  }
  ,

  /* =========================
     ABOUT
  ========================= */
  {
    path: 'about',
    title: 'เกี่ยวกับเรา | บริษัทรับสร้างบ้าน Twentysix.House อุดรธานี',
    data: {
      sitemap: true,
      meta: [
        {
          name: 'description',
          content:
            'เกี่ยวกับบริษัท ทเวนตี้ซิกซ์ ดีเวลล็อปเมนท์ จำกัด บริษัทรับสร้างบ้านในจังหวัดอุดรธานี ที่ให้ความสำคัญกับคุณภาพ โครงสร้าง และความปลอดภัยในการอยู่อาศัย'
        },
        {
          property: 'og:title',
          content: 'เกี่ยวกับเรา | Twentysix.House'
        },
        {
          property: 'og:description',
          content:
            'รู้จัก Twentysix.House บริษัทรับสร้างบ้านอุดรธานี ที่มีประสบการณ์มากกว่า 10 ปี พร้อมผลงานก่อสร้างบ้านจริง'
        },
        {
          property: 'og:url',
          content: 'https://twentysix.house/about'
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
    title: 'บริการรับสร้างบ้าน | ออกแบบและก่อสร้างบ้านครบวงจร',
    data: {
      sitemap: true,
      meta: [
        {
          name: 'description',
          content:
            'บริการรับสร้างบ้านครบวงจรในจังหวัดอุดรธานี ตั้งแต่ให้คำปรึกษา ออกแบบบ้าน สำรวจหน้างาน ก่อสร้าง ควบคุมคุณภาพ และรับประกันงานโครงสร้าง'
        },
        {
          property: 'og:title',
          content: 'บริการรับสร้างบ้านครบวงจร | Twentysix.House'
        },
        {
          property: 'og:description',
          content:
            'Twentysix.House ให้บริการออกแบบและรับสร้างบ้านครบวงจร ดูแลทุกขั้นตอนโดยทีมวิศวกรและสถาปนิก'
        },
        {
          property: 'og:url',
          content: 'https://twentysix.house/services'
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
    title: 'ผลงานรับสร้างบ้าน | ตัวอย่างบ้านจริงและงานออกแบบ',
    data: {
      sitemap: true,
      meta: [
        {
          name: 'description',
          content:
            'ตัวอย่างผลงานรับสร้างบ้านและผลงานออกแบบบ้านของ Twentysix.House ในจังหวัดอุดรธานี แสดงแนวคิดการออกแบบและมาตรฐานงานก่อสร้าง'
        },
        {
          property: 'og:title',
          content: 'ผลงานรับสร้างบ้าน | Twentysix.House'
        },
        {
          property: 'og:description',
          content:
            'รวมผลงานรับสร้างบ้านและงานออกแบบบ้านโดย Twentysix.House บริษัทรับสร้างบ้านอุดรธานี'
        },
        {
          property: 'og:url',
          content: 'https://twentysix.house/collections'
        }
      ]
    },
    loadChildren: () =>
      import('./collections/collections.module').then(
        (m) => m.CollectionsModule
      )
  },

  /* =========================
     BLOGS
  ========================= */
  {
    path: 'blogs',
    title: 'บทความเรื่องบ้าน | ความรู้ด้านการสร้างบ้านและออกแบบบ้าน',
    data: {
      sitemap: true,
      meta: [
        {
          name: 'description',
          content:
            'บทความและสาระความรู้เกี่ยวกับการสร้างบ้าน การออกแบบบ้าน การเลือกวัสดุ และประสบการณ์จากทีมงาน Twentysix.House'
        },
        {
          property: 'og:title',
          content: 'บทความเรื่องบ้าน | Twentysix.House'
        },
        {
          property: 'og:description',
          content:
            'รวมบทความความรู้ด้านการสร้างบ้าน ออกแบบบ้าน และการอยู่อาศัย จากบริษัทรับสร้างบ้าน Twentysix.House'
        },
        {
          property: 'og:url',
          content: 'https://twentysix.house/blogs'
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
      meta: [
        {
          name: 'description',
          content:
            'ติดต่อบริษัทรับสร้างบ้าน Twentysix.House จังหวัดอุดรธานี โทร 099-470-8877 ที่ตั้งบริษัท ถนนโพนพิสัย อำเภอเมือง'
        },
        {
          property: 'og:title',
          content: 'ติดต่อเรา | Twentysix.House'
        },
        {
          property: 'og:description',
          content:
            'ช่องทางติดต่อบริษัทรับสร้างบ้าน Twentysix.House อุดรธานี พร้อมแผนที่และข้อมูลบริษัท'
        },
        {
          property: 'og:url',
          content: 'https://twentysix.house/contact'
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export { routes };
