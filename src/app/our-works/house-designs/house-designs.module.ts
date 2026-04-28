import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { HouseDesignDetailComponent } from './house-design-detail/house-design-detail.component';
import { HouseDesignsRoutingModule } from './house-designs-routing.module';
import { HouseDesignsComponent } from './house-designs.component';

@NgModule({
  declarations: [HouseDesignsComponent, HouseDesignDetailComponent],
  imports: [CommonModule, NgxPaginationModule, HouseDesignsRoutingModule],
})
export class HouseDesignsModule {}
