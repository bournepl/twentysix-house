import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedUiModule } from '../shared/shared-ui.module';
import { HouseCatalogRoutingModule } from './house-catalog-routing.module';
import { HouseCatalogComponent } from './house-catalog.component';
import { HouseCatalogDetailComponent } from './house-catalog-detail.component';

@NgModule({
  declarations: [HouseCatalogComponent, HouseCatalogDetailComponent],
  imports: [CommonModule, HouseCatalogRoutingModule, SharedUiModule]
})
export class HouseCatalogModule {}
