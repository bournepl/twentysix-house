import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import Rellax from 'rellax';
import AOS from 'aos';
import { Blog } from '../_model/blog';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { BlogService } from '../_service/blog.service';
import { Router } from '@angular/router';


@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  isBrowser = false;
  data: Date = new Date();
  focus: any;
  focus1: any;
  center: google.maps.LatLngLiteral = { lat: 17.4176173, lng: 102.8000109 };
  zoom = 15;
  markers = [
    { lat: 17.4176173, lng: 102.8000109 },

  ];

  getBlogs: Blog[] = [];

  constructor(
    private loadingBar: LoadingBarService,
    private blogService: BlogService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      AOS.init({

        duration: 800,

      });
      var rellaxHeader = new Rellax('.rellax-header');

      var body = document.getElementsByTagName('body')[0];
      body.classList.add('landing-page');
      var navbar = document.getElementsByTagName('nav')[0];
      navbar.classList.add('navbar-transparent');

      this.retrieveBlog();
    }
  }

  retrieveBlog() {
    this.loadingBar.start();
    this.blogService.getAll()
      .subscribe({
        next: (data) => {

          this.getBlogs = data;
          this.getBlogs = this.getBlogs.slice(0, 3);

          this.loadingBar.complete();
        },
        error: (err) => {
          console.log(err);

        }
      });


  }
  onDetail(id: string) {
    this.router.navigate(['/blogs/detail', id]);
  }


  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      var body = document.getElementsByTagName('body')[0];
      body.classList.remove('landing-page');
      var navbar = document.getElementsByTagName('nav')[0];
      navbar.classList.remove('navbar-transparent');
    }
  }
}
