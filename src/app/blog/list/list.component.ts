import { Component, Inject, PLATFORM_ID } from '@angular/core';

import { LoadingBarService } from '@ngx-loading-bar/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Blog } from '../../_model/blog';
import { Meta } from '@angular/platform-browser';
import { BlogService } from '../../_service/blog.service';


@Component({
  standalone: false,
  selector: 'app-list',


  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  getBlogs: Blog[] = [];

  constructor(
    private loadingBar: LoadingBarService,
    private blogService: BlogService,
    private router: Router,
    private meta: Meta,
    @Inject(PLATFORM_ID) private platformId: Object,

  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      //   this.updateTag();
      this.retrieveBlog();
    }
  }
  onDetail(id: string) {
    this.router.navigate(['/blogs/detail', id]);
  }

  retrieveBlog() {
    this.loadingBar.start();
    this.blogService.getAll()
      .subscribe({
        next: (data) => {

          this.getBlogs = data;

          this.loadingBar.complete();
        },
        error: (err) => {
          console.log(err);

        }
      });
  }

  updateTag() {
    this.meta.updateTag({ name: 'title', content: 'Twentysix.House | รับสร้างบ้านอุดรธานี ออกแบบพร้อมสร้างบ้าน' });
    this.meta.updateTag({ name: 'description', content: 'Twentysix.House บริษัทรับสร้างบ้านพร้อมออกแบบบ้าน แบบ One Stop Service ครบจบในที่เดียวด้วยทีมงานมืออาชีพ สร้างบ้านในฝันที่คุณต้องการ งบประมาณไม่บานปลาย พร้อมรับรองคุณภาพด้วยมาตรฐาน' });
    this.meta.updateTag({ name: 'keywords', content: 'Twentysix.House รับสร้างบ้านอุดรธานี ออกแบบพร้อมสร้างบ้าน ครบจบในที่เดียว สร้างบ้านอุดรธานี' });
    this.meta.updateTag({ property: 'og:title', content: 'Twentysix.House | รับสร้างบ้านอุดรธานี ออกแบบพร้อมสร้างบ้าน' });
    this.meta.updateTag({ property: 'og:description', content: 'Twentysix.House บริษัทรับสร้างบ้านพร้อมออกแบบบ้าน แบบ One Stop Service ครบจบในที่เดียวด้วยทีมงานมืออาชีพ สร้างบ้านในฝันที่คุณต้องการ งบประมาณไม่บานปลาย พร้อมรับรองคุณภาพด้วยมาตรฐาน' });
    this.meta.updateTag({ property: 'og:image', content: 'https://twentysix.house/assets/img/seo/blog-hero-1600.webp' });
    this.meta.updateTag({ property: 'og:url', content: 'https://twentysix.house/blogs' });
  }

}
