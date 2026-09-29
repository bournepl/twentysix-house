import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NewOurworksRoutingModule } from './new-ourworks-routing.module';
import { NewOurworksComponent } from './new-ourworks.component';
import { SharedUiModule } from '../shared/shared-ui.module';
import { CompletedHomeDetailComponent } from './completed-home-detail/completed-home-detail.component';
import { DesignProjectDetailComponent } from './design-project-detail/design-project-detail.component';

@NgModule({
  declarations: [NewOurworksComponent, CompletedHomeDetailComponent, DesignProjectDetailComponent],
  imports: [CommonModule, NewOurworksRoutingModule, SharedUiModule]
})
export class NewOurworksModule { }
