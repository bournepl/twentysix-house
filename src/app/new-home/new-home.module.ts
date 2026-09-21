import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewHomeRoutingModule } from './new-home-routing.module';
import { NewHomeComponent } from './new-home.component';
import { SharedUiModule } from '../shared/shared-ui.module';


@NgModule({
  declarations: [
    NewHomeComponent
  ],
  imports: [
    CommonModule,
    NewHomeRoutingModule,
    SharedUiModule
  ]
})
export class NewHomeModule { }
