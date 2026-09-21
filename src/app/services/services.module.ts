import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { ServicesComponent } from './services.component';
import { NgxFastMarqueeModule } from 'ngx-fast-marquee';

@NgModule({
  declarations: [
    ServicesComponent
  ],
  imports: [
    CommonModule,
    NgxFastMarqueeModule,
    ServicesRoutingModule
  ]
})
export class ServicesModule { }
