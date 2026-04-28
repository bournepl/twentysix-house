import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OurWorksRoutingModule } from './our-works-routing.module';
import { OurWorksComponent } from './our-works.component';


@NgModule({
  declarations: [
    OurWorksComponent
  ],
  imports: [
    CommonModule,
    OurWorksRoutingModule
  ]
})
export class OurWorksModule { }
