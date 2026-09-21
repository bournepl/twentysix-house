import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NewBlogDetailRoutingModule } from './new-blog-detail-routing.module';
import { NewBlogDetailComponent } from './new-blog-detail.component';
import { SharedUiModule } from '../shared/shared-ui.module';

@NgModule({
  declarations: [NewBlogDetailComponent],
  imports: [CommonModule, NewBlogDetailRoutingModule, SharedUiModule]
})
export class NewBlogDetailModule { }
