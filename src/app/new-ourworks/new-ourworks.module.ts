import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NewOurworksRoutingModule } from './new-ourworks-routing.module';
import { NewOurworksComponent } from './new-ourworks.component';
import { CompletedHomesListComponent } from './completed-homes-list/completed-homes-list.component';
import { DesignPortfolioListComponent } from './design-portfolio-list/design-portfolio-list.component';
import { SharedUiModule } from '../shared/shared-ui.module';
import { CompletedHomeDetailComponent } from './completed-home-detail/completed-home-detail.component';
import { DesignProjectDetailComponent } from './design-project-detail/design-project-detail.component';

@NgModule({
  declarations: [NewOurworksComponent, CompletedHomesListComponent, CompletedHomeDetailComponent, DesignPortfolioListComponent, DesignProjectDetailComponent],
  imports: [CommonModule, NewOurworksRoutingModule, SharedUiModule]
})
export class NewOurworksModule { }
