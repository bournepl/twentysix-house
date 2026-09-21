import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NewBlogListRoutingModule } from './new-blog-list-routing.module';
import { NewBlogListComponent } from './new-blog-list.component';
import { SharedUiModule } from '../shared/shared-ui.module';

@NgModule({
  declarations: [
    NewBlogListComponent
  ],
  imports: [
    CommonModule,
    NewBlogListRoutingModule,
    SharedUiModule
  ]
})
export class NewBlogListModule { }
