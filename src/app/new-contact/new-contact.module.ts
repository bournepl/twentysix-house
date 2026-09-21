import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NewContactRoutingModule } from './new-contact-routing.module';
import { NewContactComponent } from './new-contact.component';
import { SharedUiModule } from '../shared/shared-ui.module';

@NgModule({
  declarations: [
    NewContactComponent
  ],
  imports: [
    CommonModule,
    NewContactRoutingModule,
    SharedUiModule
  ]
})
export class NewContactModule { }
