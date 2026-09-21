import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NewServicesRoutingModule } from './new-services-routing.module';
import { NewServicesComponent } from './new-services.component';
import { SharedUiModule } from '../shared/shared-ui.module';

@NgModule({
  declarations: [
    NewServicesComponent
  ],
  imports: [
    CommonModule,
    NewServicesRoutingModule,
    SharedUiModule
  ]
})
export class NewServicesModule { }
