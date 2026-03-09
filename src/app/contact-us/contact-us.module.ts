import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactUsRoutingModule } from './contact-us-routing.module';
import { ContactUsComponent } from './contact-us.component';
import { GoogleMapsModule } from '@angular/google-maps';


@NgModule({
  declarations: [
    ContactUsComponent
  ],
  imports: [
    CommonModule,
    GoogleMapsModule,
    ContactUsRoutingModule
  ]
})
export class ContactUsModule { }
