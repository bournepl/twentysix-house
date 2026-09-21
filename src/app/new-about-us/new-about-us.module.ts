import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewAboutUsRoutingModule } from './new-about-us-routing.module';
import { NewAboutUsComponent } from './new-about-us.component';
import { SharedUiModule } from '../shared/shared-ui.module';

@NgModule({
  declarations: [
    NewAboutUsComponent
  ],
  imports: [
    CommonModule,
    NewAboutUsRoutingModule,
    SharedUiModule
  ]
})
export class NewAboutUsModule { }
