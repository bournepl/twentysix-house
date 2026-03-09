import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingUdonRoutingModule } from './landing-udon-routing.module';
import { LandingUdonComponent } from './landing-udon.component';


@NgModule({
  declarations: [
    LandingUdonComponent
  ],
  imports: [
    CommonModule,
    LandingUdonRoutingModule
  ]
})
export class LandingUdonModule { }
