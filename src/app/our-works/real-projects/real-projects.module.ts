import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RealProjectsRoutingModule } from './real-projects-routing.module';
import { RealProjectsComponent } from './real-projects.component';
import { RealProjectDetailComponent } from './real-project-detail/real-project-detail.component';


@NgModule({
  declarations: [
    RealProjectsComponent,
    RealProjectDetailComponent
  ],
  imports: [
    CommonModule,
    RealProjectsRoutingModule
  ]
})
export class RealProjectsModule { }
