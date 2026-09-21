import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgxFastMarqueeModule } from "ngx-fast-marquee";

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    NgxFastMarqueeModule,
    GoogleMapsModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
