import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './not-found/not-found.component';
import { LegalComponent } from './legal/legal.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'รับสร้างบ้านอุดรธานี | Twentysix House',
    data: {
      sitemap: true,
      canonical: '/',
      seo: {
        preloadImage: 'assets/img/seo/home-hero-1920.webp',
        preloadImageSrcset: 'assets/img/seo/home-hero-960.webp 960w, assets/img/seo/home-hero-1920.webp 1920w',
        preloadImageSizes: '100vw',
      },
      meta: [
        { name: 'description', content: 'Twentysix House บริษัทรับสร้างบ้านอุดรธานี ดูแลงานออกแบบ วางงบประมาณ ก่อสร้าง และส่งมอบบ้าน พร้อมผลงานจริงและทีมงานให้คำปรึกษา' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: 'รับสร้างบ้านอุดรธานี | Twentysix House' },
        { property: 'og:description', content: 'บริษัทรับสร้างบ้านอุดรธานี รับออกแบบและก่อสร้างบ้านครบวงจร พร้อมผลงานจริงและขั้นตอนการทำงานที่ชัดเจน' },
        { property: 'og:url', content: 'https://twentysix.house' },
      ],
    },
    loadChildren: () => import('./new-home/new-home.module').then(m => m.NewHomeModule),
  },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'รับสร้างบ้าน-อุดรธานี', redirectTo: '', pathMatch: 'full' },
  {
    path: 'about',
    title: 'เกี่ยวกับ Twentysix House | รับสร้างบ้านอุดรธานี',
    data: {
      sitemap: true,
      canonical: '/about',
      seo: {
        preloadImage: 'assets/img/seo/about-hero-1600.webp',
        preloadImageSrcset: 'assets/img/seo/about-hero-960.webp 960w, assets/img/seo/about-hero-1600.webp 1600w',
        preloadImageSizes: '100vw',
      },
      meta: [
        { name: 'description', content: 'รู้จัก Twentysix House บริษัทรับสร้างบ้านอุดรธานี ดูแลงานออกแบบ วางแผนงบประมาณ และก่อสร้างบ้านอย่างเป็นระบบ' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: 'เกี่ยวกับ Twentysix House | รับสร้างบ้านอุดรธานี' },
        { property: 'og:url', content: 'https://twentysix.house/about' },
      ],
    },
    loadChildren: () => import('./new-about-us/new-about-us.module').then(m => m.NewAboutUsModule),
  },
  { path: 'aboutus', redirectTo: 'about', pathMatch: 'full' },
  {
    path: 'services',
    title: 'บริการรับสร้างบ้านอุดรธานี | Twentysix House',
    data: {
      sitemap: true,
      canonical: '/services',
      seo: {
        preloadImage: 'assets/img/seo/services-hero-1600.webp',
        preloadImageSrcset: 'assets/img/seo/services-hero-960.webp 960w, assets/img/seo/services-hero-1600.webp 1600w',
        preloadImageSizes: '100vw',
      },
      meta: [
        { name: 'description', content: 'บริการรับสร้างบ้านอุดรธานี ออกแบบบ้าน วางแผนงบประมาณ ก่อสร้าง ตกแต่งภายใน และดูแลหลังส่งมอบโดย Twentysix House' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: 'บริการรับสร้างบ้านอุดรธานี | Twentysix House' },
        { property: 'og:url', content: 'https://twentysix.house/services' },
      ],
    },
    loadChildren: () => import('./new-services/new-services.module').then(m => m.NewServicesModule),
  },
  {
    path: 'ourworks',
    title: 'ผลงานรับสร้างบ้านและออกแบบบ้าน | Twentysix House',
    data: {
      sitemap: true,
      canonical: '/ourworks',
      meta: [
        { name: 'description', content: 'ชมผลงานออกแบบและผลงานสร้างบ้านจริงของ Twentysix House ตั้งแต่แนวคิด การออกแบบ จนถึงส่งมอบบ้าน' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: 'ผลงานรับสร้างบ้านและออกแบบบ้าน | Twentysix House' },
        { property: 'og:url', content: 'https://twentysix.house/ourworks' },
      ],
    },
    loadChildren: () => import('./new-ourworks/new-ourworks.module').then(m => m.NewOurworksModule),
  },
  { path: 'collections', redirectTo: 'ourworks', pathMatch: 'full' },
  {
    path: 'house-catalog',
    title: 'แบบบ้านของเรา | Twentysix House',
    data: {
      sitemap: true,
      canonical: '/house-catalog',
      meta: [
        { name: 'description', content: 'เลือกชมแบบบ้าน Pure Collection พร้อมข้อมูลฟังก์ชัน จำนวนห้อง และงบประมาณเริ่มต้น เพื่อนำไปปรับให้เหมาะกับครอบครัวและที่ดิน' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: 'แบบบ้านของเรา | Twentysix House' },
        { property: 'og:url', content: 'https://twentysix.house/house-catalog' },
      ],
    },
    loadChildren: () => import('./house-catalog/house-catalog.module').then(m => m.HouseCatalogModule),
  },
  {
    path: 'blogs',
    title: 'บทความสร้างบ้านและออกแบบบ้าน | Twentysix House',
    data: {
      sitemap: true,
      canonical: '/blogs',
      meta: [
        { name: 'description', content: 'รวมบทความสร้างบ้าน ออกแบบบ้าน งานโครงสร้าง และคำแนะนำสำหรับเจ้าของบ้านจากทีม Twentysix House' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: 'บทความสร้างบ้านและออกแบบบ้าน | Twentysix House' },
        { property: 'og:url', content: 'https://twentysix.house/blogs' },
      ],
    },
    loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule),
  },
  {
    path: 'contact',
    title: 'ติดต่อบริษัทรับสร้างบ้านในอุดรธานี | Twentysix House',
    data: {
      sitemap: true,
      canonical: '/contact',
      seo: {
        preloadImage: 'assets/img/seo/contact-hero-1440.webp',
        preloadImageSrcset: 'assets/img/seo/contact-hero-960.webp 960w, assets/img/seo/contact-hero-1440.webp 1440w',
        preloadImageSizes: '100vw',
      },
      meta: [
        { name: 'description', content: 'ติดต่อ Twentysix House โทร 099-470-8877 เพื่อปรึกษาออกแบบบ้าน วางงบประมาณ และนัดคุยโครงการกับทีมงานในอุดรธานี' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: 'ติดต่อบริษัทรับสร้างบ้านในอุดรธานี | Twentysix House' },
        { property: 'og:url', content: 'https://twentysix.house/contact' },
      ],
    },
    loadChildren: () => import('./new-contact/new-contact.module').then(m => m.NewContactModule),
  },
  { path: 'contactus', redirectTo: 'contact', pathMatch: 'full' },
  {
    path: 'privacy-policy',
    component: LegalComponent,
    title: 'นโยบายความเป็นส่วนตัว | Twentysix House',
    data: {
      legalPage: 'privacy',
      sitemap: true,
      canonical: '/privacy-policy',
      seo: { image: 'assets/img/seo/home-hero-1920.webp' },
      meta: [
        { name: 'description', content: 'นโยบายความเป็นส่วนตัวของ Twentysix House อธิบายการรับ ใช้ จัดเก็บ และสิทธิในข้อมูลส่วนบุคคลของผู้ติดต่อ' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: 'นโยบายความเป็นส่วนตัว | Twentysix House' },
        { property: 'og:url', content: 'https://twentysix.house/privacy-policy' },
      ],
    },
  },
  {
    path: 'terms-of-use',
    component: LegalComponent,
    title: 'ข้อกำหนดการใช้งาน | Twentysix House',
    data: {
      legalPage: 'terms',
      sitemap: true,
      canonical: '/terms-of-use',
      seo: { image: 'assets/img/seo/home-hero-1920.webp' },
      meta: [
        { name: 'description', content: 'ข้อกำหนดการใช้งานเว็บไซต์ Twentysix House ครอบคลุมข้อมูลแบบบ้าน ราคาอ้างอิง ทรัพย์สินทางปัญญา และลิงก์ภายนอก' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: 'ข้อกำหนดการใช้งาน | Twentysix House' },
        { property: 'og:url', content: 'https://twentysix.house/terms-of-use' },
      ],
    },
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'ไม่พบหน้า | Twentysix House',
    data: {
      sitemap: false,
      seo: { canonical: false, image: null },
      meta: [
        { name: 'description', content: 'ไม่พบหน้าที่คุณกำลังค้นหา' },
        { name: 'robots', content: 'noindex, follow' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled',
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

export { routes };
